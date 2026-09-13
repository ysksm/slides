/**
 * tsc --lsp プレゼンテーション操作スクリプト
 */

(() => {
  const deck = document.getElementById('deck');
  const slides = [...document.querySelectorAll('.slide')];
  const total = slides.length;
  const notesPanel = document.getElementById('notes-panel');
  const notesContent = document.getElementById('notes-content');
  const slideCounter = document.getElementById('slide-counter');

  // スライド属性の初期化
  slides.forEach((s, i) => {
    s.dataset.index = i + 1;
    s.dataset.total = total;
    s.tabIndex = -1;
  });

  // URL ハッシュからの初期位置決定 (#1 ~ #N)
  let currentIndex = Math.min(
    Math.max(parseInt(location.hash.replace('#', ''), 10) || 1, 1),
    total
  ) - 1;

  function showSlide(index) {
    currentIndex = Math.min(Math.max(index, 0), total - 1);
    slides.forEach((s, j) => {
      s.classList.toggle('active', j === currentIndex);
    });

    // URL ハッシュの更新
    history.replaceState(null, '', '#' + (currentIndex + 1));

    // カウンターの更新
    if (slideCounter) {
      slideCounter.textContent = `${currentIndex + 1} / ${total}`;
    }

    // 発表者ノートの更新
    if (notesContent) {
      const activeSlide = slides[currentIndex];
      const note = activeSlide.querySelector('.notes');
      notesContent.innerHTML = note ? note.innerHTML : '<p class="xs t-muted">このスライドに発表者ノートはありません。</p>';
    }
  }

  function fitStage() {
    if (document.body.classList.contains('overview')) return;
    const pad = 32;
    const availableW = window.innerWidth - pad;
    const availableH = window.innerHeight - pad;
    const scale = Math.min(availableW / 1280, availableH / 720);
    // transform-origin は左上。ビューポート中央に絶対配置しているので、
    // 縮小後サイズの半分だけ戻して中央に置く。
    deck.style.transform = `translate(${-640 * scale}px, ${-360 * scale}px) scale(${scale})`;
  }

  function toggleOverview() {
    const isOverview = document.body.classList.toggle('overview');
    if (!isOverview) {
      fitStage();
      showSlide(currentIndex);
    } else {
      deck.style.transform = '';
      const active = slides[currentIndex];
      if (active) {
        active.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  }

  function toggleNotes() {
    if (notesPanel) {
      notesPanel.classList.toggle('open');
    }
  }

  function toggleFullscreen() {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen?.().catch(() => {});
    } else {
      document.exitFullscreen?.().catch(() => {});
    }
  }

  // キーボードイベント
  window.addEventListener('keydown', e => {
    if (e.metaKey || e.ctrlKey || e.altKey) return;
    const isOverview = document.body.classList.contains('overview');

    switch (e.key) {
      case 'ArrowRight':
      case 'PageDown':
      case ' ':
      case 'Enter':
        if (!isOverview) {
          showSlide(currentIndex + 1);
          e.preventDefault();
        }
        break;

      case 'ArrowLeft':
      case 'PageUp':
      case 'Backspace':
        if (!isOverview) {
          showSlide(currentIndex - 1);
          e.preventDefault();
        }
        break;

      case 'Home':
        if (!isOverview) {
          showSlide(0);
          e.preventDefault();
        }
        break;

      case 'End':
        if (!isOverview) {
          showSlide(total - 1);
          e.preventDefault();
        }
        break;

      case 'o':
      case 'O':
        toggleOverview();
        e.preventDefault();
        break;

      case 'n':
      case 'N':
        toggleNotes();
        e.preventDefault();
        break;

      case 'f':
      case 'F':
        toggleFullscreen();
        e.preventDefault();
        break;

      case 'p':
      case 'P':
        window.print();
        e.preventDefault();
        break;

      case 'Escape':
        if (isOverview) {
          toggleOverview();
          e.preventDefault();
        } else if (notesPanel?.classList.contains('open')) {
          toggleNotes();
          e.preventDefault();
        }
        break;
    }
  });

  // クリック操作
  deck.addEventListener('click', e => {
    if (e.target.closest('a') || e.target.closest('button')) return;

    if (document.body.classList.contains('overview')) {
      const clickedSlide = e.target.closest('.slide');
      if (clickedSlide) {
        document.body.classList.remove('overview');
        showSlide(slides.indexOf(clickedSlide));
        fitStage();
      }
      return;
    }

    // 画面の左右タップで進む・戻る
    if (e.clientX > window.innerWidth * 0.75) {
      showSlide(currentIndex + 1);
    } else if (e.clientX < window.innerWidth * 0.25) {
      showSlide(currentIndex - 1);
    }
  });

  // ボタンイベント紐付け
  document.getElementById('btn-prev')?.addEventListener('click', () => showSlide(currentIndex - 1));
  document.getElementById('btn-next')?.addEventListener('click', () => showSlide(currentIndex + 1));
  document.getElementById('btn-overview')?.addEventListener('click', toggleOverview);
  document.getElementById('btn-notes')?.addEventListener('click', toggleNotes);
  document.getElementById('btn-fullscreen')?.addEventListener('click', toggleFullscreen);

  // タッチスワイプ
  let touchStartX = null;
  window.addEventListener('touchstart', e => {
    touchStartX = e.touches[0].clientX;
  }, { passive: true });

  window.addEventListener('touchend', e => {
    if (touchStartX === null) return;
    const dx = e.changedTouches[0].clientX - touchStartX;
    if (Math.abs(dx) > 60) {
      if (dx < 0) showSlide(currentIndex + 1);
      else showSlide(currentIndex - 1);
    }
    touchStartX = null;
  }, { passive: true });

  // リサイズとハッシュ変更の監視
  window.addEventListener('resize', fitStage);
  window.addEventListener('hashchange', () => {
    const target = parseInt(location.hash.replace('#', ''), 10) - 1;
    if (!isNaN(target) && target !== currentIndex) {
      showSlide(target);
    }
  });

  // 初期化実行
  showSlide(currentIndex);
  fitStage();
})();
