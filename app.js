// Konfigurasi
const CONFIG = {
  PASSWORD: '0711', // ganti sesuai tanggal lahir
  NAME: 'Suchy Rahmadhani', // nama untuk greeting
  CLUE: 'Ulang tahun ayangg "Tanggal dan Bulan" 💖',
};

// Helpers
const $ = (sel, root = document) => root.querySelector(sel);
const params = new URLSearchParams(location.search);

// THEME handling
const THEMES = ['default', 'lilac', 'peach', 'mint'];

function setTheme(theme) {
  const t = THEMES.includes(theme) ? theme : 'default';

  // Set data-theme untuk root element
  if (t === 'default') {
    document.documentElement.removeAttribute('data-theme');
  } else {
    document.documentElement.setAttribute('data-theme', t);
  }

  // Simpan tema di localStorage
  localStorage.setItem('theme', t);

  // Update tampilan tombol (chip)
  document.querySelectorAll('.chip').forEach((ch) => {
    const isActive = ch.dataset.theme === t;
    ch.setAttribute('aria-current', String(isActive));
    ch.classList.toggle('active', isActive);
  });
}

function initThemeFromParamOrStorage() {
  const fromUrl = params.get('theme');
  const saved = localStorage.getItem('theme');
  const theme = fromUrl || saved || 'default';
  setTheme(theme);
}

// MUSIC handling (autoplay needs user interaction on iOS/Chrome)
function bindMusicControls() {
  const audio = $('#bg-audio');
  const btn = $('#music-btn');
  if (!audio || !btn) return;

  btn.addEventListener('click', () => {
    if (audio.paused) {
      audio.muted = false;
      audio.play().catch(() => {});
      btn.textContent = '🔊 Music On';
    } else {
      audio.pause();
      btn.textContent = '🔈 Music Off';
    }
  });

  // Try start muted, switch on after first tap anywhere
  audio.muted = true;
  audio.play().catch(() => {});
  window.addEventListener(
    'pointerdown',
    () => {
      if (audio.paused) {
        audio.muted = false;
        audio.play().catch(() => {});
        btn.textContent = '🔊 Music On';
      }
    },
    { once: true }
  );
}

// Modal helpers
function openModal(title, msg) {
  const backdrop = $('#modal-backdrop');
  const modal = $('#modal');
  $('#modal-title').textContent = title;
  $('#modal-msg').textContent = msg;
  backdrop.classList.add('show');
  modal.classList.add('show');
}
function closeModal() {
  $('#modal-backdrop').classList.remove('show');
  $('#modal').classList.remove('show');
}

// ========== THEME MENU (tombol titik tiga) ==========
function bindThemeMenu() {
  const toggle = document.getElementById('theme-toggle');
  const popup = document.getElementById('theme-popup');
  if (!toggle || !popup) return;

  toggle.addEventListener('click', (e) => {
    e.stopPropagation();
    popup.classList.toggle('show');
  });

  document.addEventListener('click', (e) => {
    if (!popup.contains(e.target) && e.target !== toggle) {
      popup.classList.remove('show');
    }
  });

  popup.querySelectorAll('.chip').forEach((ch) => {
    ch.addEventListener('click', () => {
      setTheme(ch.dataset.theme);
      popup.classList.remove('show');
    });
  });
}

// Pages
export function initPasswordPage() {
  initThemeFromParamOrStorage();
  bindThemeMenu(); // 🩷 tambahkan pemanggilan menu tema

  const form = $('#password-form');
  const input = $('#password-input');

  // Theme chips (bisa tetap dipakai di popup)
  document.querySelectorAll('.chip').forEach((ch) => {
    ch.addEventListener('click', () => setTheme(ch.dataset.theme));
  });

  input.addEventListener('input', () => {
    input.value = input.value.replace(/\D/g, '').slice(0, 8);
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const val = (input.value || '').trim();
    if (val === CONFIG.PASSWORD) {
      // Ganti halaman lewat iframe parent, bukan reload seluruh dokumen
      parent.loadPage('welcome.html');
    } else {
      openModal('Password salah', 'Coba lagi yaa sayangkuu 🫶');
    }
  });

  $('#modal-close').addEventListener('click', closeModal);
  $('#modal-backdrop').addEventListener('click', (e) => {
    if (e.target.id === 'modal-backdrop') closeModal();
  });

  bindMusicControls();
}

export function initCluePage() {
  initThemeFromParamOrStorage();
  bindThemeMenu(); // 🩷 tambahkan pemanggilan menu tema

  $('#clue-text').innerHTML = `<span style="color:#fff; text-shadow:0 0 8px rgba(255,255,255,0.3);">${CONFIG.CLUE}</span>`;

  // Theme chips
  document.querySelectorAll('.chip').forEach((ch) => {
    ch.addEventListener('click', () => setTheme(ch.dataset.theme));
  });

  bindMusicControls();
}

export function initWelcomePage() {
  initThemeFromParamOrStorage();
  bindThemeMenu(); // 🩷 tambahkan pemanggilan menu tema

  $('#welcome-name').textContent = CONFIG.NAME;

  // Theme chips
  document.querySelectorAll('.chip').forEach((ch) => {
    ch.addEventListener('click', () => setTheme(ch.dataset.theme));
  });

  // ❤️ Love animation
  const canvas = document.getElementById('confetti');
  const ctx = canvas.getContext('2d');

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  window.addEventListener('resize', resizeCanvas);
  resizeCanvas();

  // Buat hati
  const hearts = Array.from({ length: 100 }, () => ({
    x: Math.random() * canvas.width,
    y: Math.random() * -canvas.height,
    size: 8 + Math.random() * 20,
    speed: 0.8 + Math.random() * 2.5,
    rotation: Math.random() * Math.PI * 2,
    color: `hsl(${Math.random() * 20 + 340}, 90%, ${
      60 + Math.random() * 15
    }%)`,
  }));

  function drawHeart(x, y, size, rotation, color) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(rotation);
    ctx.scale(size / 20, size / 20);
    ctx.beginPath();
    ctx.moveTo(0, 3);
    ctx.bezierCurveTo(3, 0, 3, -3, 0, -3);
    ctx.bezierCurveTo(-3, -3, -3, 0, 0, 3);
    ctx.fillStyle = color;
    ctx.fill();
    ctx.restore();
  }

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (const h of hearts) {
      h.y += h.speed;
      h.x += Math.sin(h.y / 20) * 0.5;
      h.rotation += 0.03 + Math.random() * 0.02;

      if (h.y > canvas.height + 20) {
        h.y = -10 - Math.random() * 100;
        h.x = Math.random() * canvas.width;
      }

      drawHeart(h.x, h.y, h.size, h.rotation, h.color);
    }
    requestAnimationFrame(animate);
  }

  animate();

  bindMusicControls();
}
