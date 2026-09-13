#!/usr/bin/env node
// tsc --lsp を起動し、AI エージェントが必要とする代表的なリクエストを送る最小 LSP クライアント。
//   使い方: node lsp-probe.mjs <project-root> <file.ts> [line] [character]
//   前提:   <project-root> に typescript@7 がインストール済み (node_modules/.bin/tsc)、または PATH 上に tsc 7.x
import { spawn } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const [rootArg = '.', fileArg, lineArg = '0', charArg = '0'] = process.argv.slice(2);
if (!fileArg) { console.error('usage: node lsp-probe.mjs <project-root> <file.ts> [line] [character]'); process.exit(2); }
const root = path.resolve(rootArg);
const file = path.resolve(root, fileArg);
const localTsc = path.join(root, 'node_modules', '.bin', 'tsc');
const tsc = existsSync(localTsc) ? localTsc : 'tsc';
const pos = { line: +lineArg, character: +charArg };

const t0 = Date.now();
const server = spawn(tsc, ['--lsp', '--stdio'], { cwd: root, stdio: ['pipe', 'pipe', 'inherit'] });
let buf = Buffer.alloc(0);
let nextId = 0;
const pending = new Map();
const log = (...a) => console.log(`[${String(Date.now() - t0).padStart(5)}ms]`, ...a);

server.stdout.on('data', chunk => {
  buf = Buffer.concat([buf, chunk]);
  for (;;) {
    const headerEnd = buf.indexOf('\r\n\r\n');
    if (headerEnd < 0) return;
    const len = +/Content-Length: (\d+)/i.exec(buf.subarray(0, headerEnd).toString())[1];
    if (buf.length < headerEnd + 4 + len) return;
    const msg = JSON.parse(buf.subarray(headerEnd + 4, headerEnd + 4 + len).toString());
    buf = buf.subarray(headerEnd + 4 + len);
    if (msg.id !== undefined && pending.has(msg.id)) { pending.get(msg.id)(msg); pending.delete(msg.id); }
    else if (msg.id !== undefined && msg.method) {
      // サーバー → クライアントのリクエスト。設定は「無し」、capability 登録は成功として返す。
      const result = msg.method === 'workspace/configuration' ? msg.params.items.map(() => null) : null;
      send({ jsonrpc: '2.0', id: msg.id, result });
    } else if (msg.method === 'textDocument/publishDiagnostics') {
      log('push publishDiagnostics', path.relative(root, new URL(msg.params.uri).pathname), msg.params.diagnostics.length, 'items');
    }
  }
});
function send(obj) { const s = JSON.stringify(obj); server.stdin.write(`Content-Length: ${Buffer.byteLength(s)}\r\n\r\n${s}`); }
function notify(method, params) { send({ jsonrpc: '2.0', method, params }); }
function request(method, params) {
  return new Promise(resolve => { const id = ++nextId; pending.set(id, resolve); send({ jsonrpc: '2.0', id, method, ...(params === undefined ? {} : { params }) }); });
}
const short = v => JSON.stringify(v).slice(0, 220);
const rel = uri => path.relative(root, new URL(uri).pathname);

const init = await request('initialize', {
  processId: process.pid,
  rootUri: pathToFileURL(root).href,
  workspaceFolders: [{ uri: pathToFileURL(root).href, name: path.basename(root) }],
  initializationOptions: { disablePushDiagnostics: true },
  capabilities: {
    textDocument: { hover: { contentFormat: ['markdown'] }, diagnostic: {}, documentSymbol: { hierarchicalDocumentSymbolSupport: true } },
    workspace: { configuration: true, didChangeWatchedFiles: { dynamicRegistration: true } },
  },
});
log('initialize', init.result?.serverInfo ?? init.error);
notify('initialized', {});

const uri = pathToFileURL(file).href;
const text = readFileSync(file, 'utf8');
notify('textDocument/didOpen', { textDocument: { uri, languageId: file.endsWith('x') ? 'typescriptreact' : 'typescript', version: 1, text } });

const diag = await request('textDocument/diagnostic', { textDocument: { uri } });
log('diagnostic', (diag.result?.items ?? []).length, 'items');
for (const d of diag.result?.items ?? []) console.log(`        L${d.range.start.line + 1}:${d.range.start.character + 1} TS${d.code} ${d.message}`);

const symbols = await request('textDocument/documentSymbol', { textDocument: { uri } });
log('documentSymbol', (symbols.result ?? []).length, 'top-level:', (symbols.result ?? []).slice(0, 8).map(s => s.name).join(', '));

const hover = await request('textDocument/hover', { textDocument: { uri }, position: pos });
log('hover', short(hover.result?.contents?.value ?? hover.result));

const def = await request('textDocument/definition', { textDocument: { uri }, position: pos });
log('definition', (def.result ?? []).map(l => `${rel(l.uri)}:${l.range.start.line + 1}`).join(', ') || '(none)');

const refs = await request('textDocument/references', { textDocument: { uri }, position: pos, context: { includeDeclaration: false } });
log('references', (refs.result ?? []).length, 'locations in', new Set((refs.result ?? []).map(l => l.uri)).size, 'files');

const prep = await request('textDocument/prepareCallHierarchy', { textDocument: { uri }, position: pos });
if (prep.result?.length) {
  const incoming = await request('callHierarchy/incomingCalls', { item: prep.result[0] });
  log('incomingCalls', prep.result[0].name, '←', (incoming.result ?? []).map(c => `${c.from.name.includes('/') ? '(module scope)' : c.from.name} @ ${rel(c.from.uri)}:${c.from.range.start.line + 1}`).join(', ') || '(none)');
}

await request('shutdown');   // params は付けない (null を送ると InvalidParams)
notify('exit');
server.on('exit', code => process.exit(code ?? 0));
setTimeout(() => process.exit(0), 500);
