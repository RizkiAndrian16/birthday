// music.js — versi final dengan izin play, fade, dan status tersimpan
export function initMusicIframe() {
  const audio = document.getElementById("bg-audio");
  const btn = document.getElementById("music-btn");

  if (!audio || !btn) {
    console.error("⚠️ Tidak menemukan elemen audio atau tombol musik!");
    return;
  }

  // Set status awal
  audio.volume = 0;
  let musicOn = localStorage.getItem("musicOn") === "true";
  updateButton(btn, musicOn);

  // ✅ Aktifkan musik jika sebelumnya ON (setelah interaksi pertama)
  window.addEventListener(
    "pointerdown",
    () => {
      if (musicOn) {
        fadeIn(audio);
      }
    },
    { once: true }
  );

  // ✅ Klik tombol ON/OFF
  btn.addEventListener("click", () => {
    if (audio.paused) {
      fadeIn(audio);
      localStorage.setItem("musicOn", "true");
      updateButton(btn, true);
    } else {
      fadeOut(audio);
      localStorage.setItem("musicOn", "false");
      updateButton(btn, false);
    }
  });

  // 🔁 Ulang dari awal jika habis
  audio.addEventListener("ended", () => {
    audio.currentTime = 0;
    audio.play().catch((err) => console.warn("Replay blocked:", err));
  });

  // 🌐 Ganti halaman di iframe tanpa mematikan musik
  window.loadPage = (page) => {
    const frame = document.getElementById("content-frame");
    if (frame) frame.src = page;
  };

  // ✅ Tes awal: coba autoplay diam-diam (akan gagal di browser, tapi aman)
  audio.play().catch(() => {
    console.log("Autoplay diblok, tunggu interaksi pengguna 👆");
  });
}

// --- UI helper ---
function updateButton(btn, isOn) {
  btn.textContent = isOn ? "🔊" : "🔈";
}

// --- Fade In / Fade Out ---
function fadeIn(audio) {
  audio.play().catch(() => {});
  let v = audio.volume;
  clearInterval(audio.__fade);
  audio.__fade = setInterval(() => {
    if (v < 1) {
      v = Math.min(1, v + 0.05);
      audio.volume = v;
    } else clearInterval(audio.__fade);
  }, 80);
}

function fadeOut(audio) {
  let v = audio.volume;
  clearInterval(audio.__fade);
  audio.__fade = setInterval(() => {
    if (v > 0.05) {
      v = Math.max(0, v - 0.05);
      audio.volume = v;
    } else {
      clearInterval(audio.__fade);
      audio.pause();
    }
  }, 80);
}
