#!/usr/bin/env node
/**
 * tsc --lsp 用 Model Context Protocol (MCP) サーバー
 *
 * AI コーディングエージェント（Claude Desktop, Claude Code, Antigravity, Orca 等）が
 * TypeScript 7 ネイティブ言語サーバーの型情報・定義・参照・診断を
 * ツール呼び出し（Tool Calling）経由で低トークン・高精度に取得できる MCP サーバーです。
 *
 * 依存関係ゼロ（Node.js 標準ライブラリのみ）で動作します。
 */

import { spawn, execSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import readline from 'node:readline';

const projectRoot = process.env.TS_PROJECT_ROOT || process.cwd();

// tsc バイナリの検出
function getTscBinary() {
  const candidates = [
    path.join(projectRoot, 'node_modules', '.bin', 'tsc'),
    path.join(path.dirname(fileURLToPath(import.meta.url)), '../../node_modules', '.bin', 'tsc'),
    '/tmp/test-ts/node_modules/.bin/tsc',
    'tsc'
  ];
  for (const cand of candidates) {
    if (cand === 'tsc') {
      try {
        const ver = execSync('tsc --version', { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim();
        if (ver.includes('Version 7.') || ver.includes('7.0.') || ver.includes('7.1.')) return 'tsc';
      } catch {}
    } else if (existsSync(cand)) {
      return cand;
    }
  }
  return 'tsc';
}

let serverProcess = null;
let nextLspId = 0;
const lspPending = new Map();
let lspStdoutBuf = Buffer.alloc(0);

function startLspServer() {
  const tscBin = getTscBinary();
  serverProcess = spawn(tscBin, ['--lsp', '--stdio'], {
    cwd: projectRoot,
    stdio: ['pipe', 'pipe', 'pipe']
  });

  serverProcess.on('error', err => {
    console.error(`[MCP] Failed to spawn tsc process: ${err.message}`);
    for (const { reject } of lspPending.values()) reject(err);
    lspPending.clear();
  });

  serverProcess.stdout.on('data', chunk => {
    lspStdoutBuf = Buffer.concat([lspStdoutBuf, chunk]);
    while (true) {
      const headerEnd = lspStdoutBuf.indexOf('\r\n\r\n');
      if (headerEnd < 0) break;
      const header = lspStdoutBuf.subarray(0, headerEnd).toString('ascii');
      const match = /Content-Length: (\d+)/i.exec(header);
      if (!match) break;
      const len = parseInt(match[1], 10);
      if (lspStdoutBuf.length < headerEnd + 4 + len) break;
      const body = lspStdoutBuf.subarray(headerEnd + 4, headerEnd + 4 + len).toString('utf8');
      lspStdoutBuf = lspStdoutBuf.subarray(headerEnd + 4 + len);

      try {
        const msg = JSON.parse(body);
        if (msg.id !== undefined && msg.method) {
          if (msg.method === 'workspace/configuration') {
            const items = msg.params?.items || [];
            sendLsp({ jsonrpc: '2.0', id: msg.id, result: items.map(() => null) });
          } else {
            sendLsp({ jsonrpc: '2.0', id: msg.id, result: null });
          }
        } else if (msg.id !== undefined && lspPending.has(msg.id)) {
          const { resolve, reject } = lspPending.get(msg.id);
          lspPending.delete(msg.id);
          if (msg.error) reject(msg.error);
          else resolve(msg.result);
        }
      } catch (e) {
        // ignore parse errors
      }
    }
  });

  serverProcess.stderr.on('data', () => {});
}

function sendLsp(obj) {
  if (!serverProcess) startLspServer();
  const s = JSON.stringify(obj);
  serverProcess.stdin.write(`Content-Length: ${Buffer.byteLength(s, 'utf8')}\r\n\r\n${s}`);
}

function lspRequest(method, params) {
  return new Promise((resolve, reject) => {
    const id = ++nextLspId;
    lspPending.set(id, { resolve, reject });
    sendLsp({ jsonrpc: '2.0', id, method, ...(params !== undefined ? { params } : {}) });
  });
}

function lspNotify(method, params) {
  sendLsp({ jsonrpc: '2.0', method, ...(params !== undefined ? { params } : {}) });
}

let isInitialized = false;
async function ensureInitialized() {
  if (isInitialized) return;
  startLspServer();
  const rootUri = pathToFileURL(projectRoot).href;
  await lspRequest('initialize', {
    processId: process.pid,
    rootUri,
    capabilities: {
      textDocument: {
        diagnostic: {},
        hover: { contentFormat: ['markdown'] },
        documentSymbol: { hierarchicalDocumentSymbolSupport: true }
      }
    }
  });
  lspNotify('initialized', {});
  isInitialized = true;
}

async function openFile(filePath) {
  await ensureInitialized();
  const abs = path.isAbsolute(filePath) ? filePath : path.resolve(projectRoot, filePath);
  const uri = pathToFileURL(abs).href;
  if (existsSync(abs)) {
    const text = readFileSync(abs, 'utf8');
    lspNotify('textDocument/didOpen', {
      textDocument: {
        uri,
        languageId: abs.endsWith('x') ? 'typescriptreact' : 'typescript',
        version: 1,
        text
      }
    });
  }
  return { abs, uri };
}

// MCP Tools 定義
const TOOLS = [
  {
    name: 'ts_get_diagnostics',
    description: '指定した TypeScript ファイルの型エラーおよび警告を即座に取得します（数ミリ秒で完了）。',
    inputSchema: {
      type: 'object',
      properties: {
        file: { type: 'string', description: 'プロジェクトルートからの相対パスまたは絶対パス' }
      },
      required: ['file']
    }
  },
  {
    name: 'ts_hover_type',
    description: '指定したファイル・行・列の位置にある識別子の型シグネチャおよび JSDoc ドキュメントを取得します。',
    inputSchema: {
      type: 'object',
      properties: {
        file: { type: 'string', description: '対象ファイル' },
        line: { type: 'number', description: '1始まりの行番号' },
        character: { type: 'number', description: '1始まりの列番号' }
      },
      required: ['file', 'line', 'character']
    }
  },
  {
    name: 'ts_get_definition',
    description: '指定した位置の識別子の定義元（宣言箇所）のファイル名と行番号を取得します。',
    inputSchema: {
      type: 'object',
      properties: {
        file: { type: 'string', description: '対象ファイル' },
        line: { type: 'number', description: '1始まりの行番号' },
        character: { type: 'number', description: '1始まりの列番号' }
      },
      required: ['file', 'line', 'character']
    }
  },
  {
    name: 'ts_find_references',
    description: '指定したシンボルがワークスペース全体で参照されている箇所を一覧取得します。',
    inputSchema: {
      type: 'object',
      properties: {
        file: { type: 'string', description: '対象ファイル' },
        line: { type: 'number', description: '1始まりの行番号' },
        character: { type: 'number', description: '1始まりの列番号' }
      },
      required: ['file', 'line', 'character']
    }
  }
];

// MCP リクエストディスパッチャ
async function handleMcpRequest(req) {
  const { id, method, params } = req;

  if (method === 'initialize') {
    return {
      jsonrpc: '2.0',
      id,
      result: {
        protocolVersion: '2024-11-05',
        capabilities: { tools: {} },
        serverInfo: { name: 'ts-lsp-mcp', version: '1.0.0' }
      }
    };
  }

  if (method === 'notifications/initialized') {
    return null;
  }

  if (method === 'tools/list') {
    return { jsonrpc: '2.0', id, result: { tools: TOOLS } };
  }

  if (method === 'tools/call') {
    const { name, arguments: args } = params;
    try {
      if (name === 'ts_get_diagnostics') {
        const { uri, abs } = await openFile(args.file);
        const res = await lspRequest('textDocument/diagnostic', { textDocument: { uri } });
        const items = res?.items || [];
        const formatted = items.map(d => `L${d.range.start.line + 1}:${d.range.start.character + 1} [TS${d.code}] ${d.message}`).join('\n') || 'エラーや警告はありません。';
        return {
          jsonrpc: '2.0',
          id,
          result: { content: [{ type: 'text', text: formatted }] }
        };
      }

      if (name === 'ts_hover_type') {
        const { uri } = await openFile(args.file);
        const pos = { line: Math.max(0, (args.line || 1) - 1), character: Math.max(0, (args.character || 1) - 1) };
        const res = await lspRequest('textDocument/hover', { textDocument: { uri }, position: pos });
        const text = res?.contents?.value ?? (typeof res?.contents === 'string' ? res.contents : JSON.stringify(res?.contents || '(なし)'));
        return {
          jsonrpc: '2.0',
          id,
          result: { content: [{ type: 'text', text }] }
        };
      }

      if (name === 'ts_get_definition') {
        const { uri } = await openFile(args.file);
        const pos = { line: Math.max(0, (args.line || 1) - 1), character: Math.max(0, (args.character || 1) - 1) };
        const res = await lspRequest('textDocument/definition', { textDocument: { uri }, position: pos });
        const defs = Array.isArray(res) ? res : (res ? [res] : []);
        const formatted = defs.map(d => {
          const p = path.relative(projectRoot, fileURLToPath(d.uri));
          return `${p}:L${d.range.start.line + 1}:${d.range.start.character + 1}`;
        }).join('\n') || '定義が見つかりませんでした。';
        return {
          jsonrpc: '2.0',
          id,
          result: { content: [{ type: 'text', text: formatted }] }
        };
      }

      if (name === 'ts_find_references') {
        const { uri } = await openFile(args.file);
        const pos = { line: Math.max(0, (args.line || 1) - 1), character: Math.max(0, (args.character || 1) - 1) };
        const res = await lspRequest('textDocument/references', { textDocument: { uri }, position: pos, context: { includeDeclaration: true } });
        const refs = res || [];
        const formatted = refs.map(r => {
          const p = path.relative(projectRoot, fileURLToPath(r.uri));
          return `${p}:L${r.range.start.line + 1}:${r.range.start.character + 1}`;
        }).join('\n') || '参照が見つかりませんでした。';
        return {
          jsonrpc: '2.0',
          id,
          result: { content: [{ type: 'text', text: formatted }] }
        };
      }

      return {
        jsonrpc: '2.0',
        id,
        error: { code: -32601, message: `不明なツールです: ${name}` }
      };
    } catch (err) {
      return {
        jsonrpc: '2.0',
        id,
        isError: true,
        result: { content: [{ type: 'text', text: `エラー: ${err.message}` }] }
      };
    }
  }

  return {
    jsonrpc: '2.0',
    id,
    error: { code: -32601, message: `サポートされていないメソッド: ${method}` }
  };
}

// stdio リーダー (JSON Lines)
const rl = readline.createInterface({ input: process.stdin, output: process.stdout, terminal: false });

rl.on('line', async line => {
  if (!line.trim()) return;
  try {
    const req = JSON.parse(line);
    const res = await handleMcpRequest(req);
    if (res) {
      process.stdout.write(JSON.stringify(res) + '\n');
    }
  } catch (err) {
    process.stdout.write(JSON.stringify({
      jsonrpc: '2.0',
      error: { code: -32700, message: 'Parse error' }
    }) + '\n');
  }
});

process.on('SIGINT', () => {
  if (serverProcess) {
    lspRequest('shutdown').catch(() => {}).finally(() => {
      lspNotify('exit');
      process.exit(0);
    });
  } else {
    process.exit(0);
  }
});
