// WOMEN'S DAY 8/3 INTERACTIONS

document.addEventListener("DOMContentLoaded", () => {
  const WD_SECTION_IDS = [
    "wdHero",
    "giftSection",
    "scratchSection",
    "bloomSection",
    "typewriterSection",
    "cardSection",
  ];

  function getCurrentWdSectionIndex() {
    const refY = window.innerHeight * 0.15;
    const sections = WD_SECTION_IDS.map((id) => document.getElementById(id)).filter(Boolean);
    for (let i = sections.length - 1; i >= 0; i--) {
      const rect = sections[i].getBoundingClientRect();
      if (rect.top <= refY && rect.bottom > refY) return i;
    }
    if (sections.length && sections[0].getBoundingClientRect().top > refY) return 0;
    return Math.max(0, sections.length - 1);
  }

  function goToWdSection(direction) {
    const idx = getCurrentWdSectionIndex();
    const next =
      direction === "next"
        ? Math.min(idx + 1, WD_SECTION_IDS.length - 1)
        : Math.max(idx - 1, 0);
    const el = document.getElementById(WD_SECTION_IDS[next]);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  }

  // ===== EVENT MENU (vertical, toggle) =====
  const wdEventMenu = document.getElementById("wdEventMenu");
  const wdEventMenuToggle = document.getElementById("wdEventMenuToggle");
  if (wdEventMenu && wdEventMenuToggle) {
    wdEventMenuToggle.addEventListener("click", (e) => {
      e.stopPropagation();
      const open = wdEventMenu.classList.toggle("open");
      wdEventMenuToggle.setAttribute("aria-expanded", open);
      wdEventMenu.setAttribute("aria-hidden", !open);
    });
    document.addEventListener("click", (e) => {
      if (
        wdEventMenu.classList.contains("open") &&
        !wdEventMenu.contains(e.target) &&
        !wdEventMenuToggle.contains(e.target)
      ) {
        wdEventMenu.classList.remove("open");
        wdEventMenuToggle.setAttribute("aria-expanded", "false");
        wdEventMenu.setAttribute("aria-hidden", "true");
      }
    });
    wdEventMenu.addEventListener("click", () => {
      wdEventMenu.classList.remove("open");
      wdEventMenuToggle.setAttribute("aria-expanded", "false");
      wdEventMenu.setAttribute("aria-hidden", "true");
    });
  }

  // ===== FALLING PETALS CANVAS =====
  const petalsCanvas = document.getElementById("petalsCanvas");
  let petalsController = null;
  if (petalsCanvas) {
    const ctx = petalsCanvas.getContext("2d");
    const petals = [];
    const BASE_PETAL_COUNT = 40;
    let targetPetalCount = BASE_PETAL_COUNT;
    let beatEnergy = 0;

    function resize() {
      petalsCanvas.width = window.innerWidth;
      petalsCanvas.height = window.innerHeight;
    }

    function createPetal() {
      const shapes = ["🌸", "🌺", "🌷", "💮"];
      return {
        x: Math.random() * petalsCanvas.width,
        y: -20 - Math.random() * petalsCanvas.height,
        size: 18 + Math.random() * 10,
        speedY: 0.5 + Math.random() * 1.2,
        speedX: -0.4 + Math.random() * 0.8,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: -0.02 + Math.random() * 0.04,
        char: shapes[Math.floor(Math.random() * shapes.length)],
        wobble: Math.random() * Math.PI * 2,
        wobbleSpeed: 0.01 + Math.random() * 0.02,
        opacity: 0.4 + Math.random() * 0.4,
      };
    }

    function initPetals() {
      petals.length = 0;
      for (let i = 0; i < targetPetalCount; i++) {
        const p = createPetal();
        p.y = Math.random() * petalsCanvas.height;
        petals.push(p);
      }
    }

    function updatePetals() {
      while (petals.length < targetPetalCount) petals.push(createPetal());
      while (petals.length > targetPetalCount) petals.pop();
      petals.forEach((p) => {
        p.y += p.speedY * (1 + beatEnergy * 0.8);
        p.x += p.speedX + Math.sin(p.wobble) * 0.3;
        p.wobble += p.wobbleSpeed;
        p.rotation += p.rotationSpeed;
        if (p.y > petalsCanvas.height + 40) {
          Object.assign(p, createPetal());
          p.y = -40;
        }
      });
    }

    function drawPetals() {
      ctx.clearRect(0, 0, petalsCanvas.width, petalsCanvas.height);
      petals.forEach((p) => {
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);
        ctx.globalAlpha = p.opacity;
        ctx.font = `${p.size}px serif`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(p.char, 0, 0);
        ctx.restore();
      });
    }

    function loop() {
      updatePetals();
      drawPetals();
      requestAnimationFrame(loop);
    }

    resize();
    initPetals();
    window.addEventListener("resize", resize);
    loop();

    petalsController = {
      setEnergy(level) {
        beatEnergy = Math.max(0, Math.min(1, level || 0));
        targetPetalCount = BASE_PETAL_COUNT + Math.round(beatEnergy * 35);
      },
    };
  }

  // ===== SCROLL REVEAL FOR SECTIONS =====
  const wdSections = document.querySelectorAll(".wd-section");
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
        }
      });
    },
    { threshold: 0.2 },
  );
  wdSections.forEach((sec) => revealObserver.observe(sec));

  const wdEnterBtn = document.getElementById("wdEnterBtn");
  if (wdEnterBtn) {
    wdEnterBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      if (!wdMusicPlaying) {
        wdMusic.volume = 0.3;
        wdMusic
          .play()
          .then(() => {
            wdMusicPlaying = true;
            wdMusicToggle.classList.add("playing");
          })
          .catch(() => {});
      }
      const first = document.getElementById("giftSection");
      if (first) first.scrollIntoView({ behavior: "smooth" });
    });
  }

  // ===== NAV DOTS (8/3) =====
  const navDots = document.querySelectorAll("#wdNavDots .nav-dot");
  navDots.forEach((dot) => {
    dot.addEventListener("click", (e) => {
      e.stopPropagation();
      const targetId = dot.getAttribute("data-section");
      const target = document.getElementById(targetId);
      if (target) {
        navDots.forEach((d) => d.classList.remove("active"));
        dot.classList.add("active");
        target.scrollIntoView({ behavior: "smooth" });
      }
    });
  });

  const navObserver = new IntersectionObserver(
    () => {
      const idx = getCurrentWdSectionIndex();
      const activeId = WD_SECTION_IDS[idx];
      navDots.forEach((dot) => {
        dot.classList.toggle("active", dot.getAttribute("data-section") === activeId);
      });
    },
    { threshold: [0, 0.01, 0.1, 0.2], rootMargin: "0px 0px 0px 0px" },
  );
  WD_SECTION_IDS.forEach((id) => {
    const el = document.getElementById(id);
    if (el) navObserver.observe(el);
  });

  // Keyboard quick nav
  document.addEventListener("keydown", (e) => {
    if (e.key === "ArrowRight" || e.key === " " || e.key === "ArrowDown") {
      e.preventDefault();
      goToWdSection("next");
    } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
      e.preventDefault();
      goToWdSection("prev");
    }else if (e.key === "m" || e.key === "M") {
      if (!e.ctrlKey && !e.metaKey && !e.altKey) {
        e.preventDefault();
        wdMusicToggle.click();
      }
    }
  });

  // ===== TIPS (hide / reopen) =====
  const hints = document.getElementById("wdInteractionHints");
  const hintDismiss = document.getElementById("wdHintDismiss");
  const hintToggle = document.getElementById("wdHintToggle");
  if (hintDismiss && hints) {
    hintDismiss.addEventListener("click", () => {
      hints.classList.add("dismissed");
      if (hintToggle) hintToggle.classList.add("visible");
    });
  }
  if (hintToggle && hints) {
    hintToggle.addEventListener("click", (e) => {
      e.stopPropagation();
      hints.classList.remove("dismissed");
      hintToggle.classList.remove("visible");
    });
  }

  // ===== AUTO TOUR (SLIDE SHOW) =====
  const autoTourToggle = document.getElementById("wdAutoTourToggle");
  let autoTourActive = false;
  let autoTourTimer = null;
  const AUTO_TOUR_DELAY = 8500;

  function stopAutoTour() {
    autoTourActive = false;
    if (autoTourToggle) autoTourToggle.classList.remove("active");
    if (autoTourTimer) {
      clearTimeout(autoTourTimer);
      autoTourTimer = null;
    }
  }

  function scheduleNextAutoTourStep() {
    if (!autoTourActive) return;
    if (autoTourTimer) clearTimeout(autoTourTimer);
    autoTourTimer = setTimeout(() => {
      if (!autoTourActive) return;
      const idx = getCurrentWdSectionIndex();
      if (idx >= WD_SECTION_IDS.length - 1) {
        stopAutoTour();
        return;
      }
      goToWdSection("next");
      scheduleNextAutoTourStep();
    }, AUTO_TOUR_DELAY);
  }

  if (autoTourToggle) {
    autoTourToggle.addEventListener("click", (e) => {
      e.stopPropagation();
      if (autoTourActive) stopAutoTour();
      else {
        autoTourActive = true;
        autoTourToggle.classList.add("active");
        scheduleNextAutoTourStep();
      }
    });
  }

  ["wheel", "touchstart"].forEach((evt) => {
    window.addEventListener(
      evt,
      () => {
        if (autoTourActive) stopAutoTour();
      },
      { passive: true },
    );
  });

  // ===== MUSIC TOGGLE + VISUAL + PETALS BOOST =====
  const wdMusic = document.getElementById("wdMusic");
  const wdMusicToggle = document.getElementById("wdMusicToggle");
  let wdMusicPlaying = false;
  let audioCtx = null;
  let analyser = null;

  function initVisualizer() {
    if (!wdMusic || audioCtx) return;
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const src = audioCtx.createMediaElementSource(wdMusic);
    analyser = audioCtx.createAnalyser();
    analyser.fftSize = 256;
    src.connect(analyser);
    analyser.connect(audioCtx.destination);
  }

  function updateVisualizer() {
    if (!analyser || !wdMusicPlaying) {
      if (wdMusicToggle) wdMusicToggle.style.setProperty("--viz-intensity", "0");
      if (petalsController) petalsController.setEnergy(0);
      requestAnimationFrame(updateVisualizer);
      return;
    }
    const data = new Uint8Array(analyser.frequencyBinCount);
    analyser.getByteFrequencyData(data);
    const avg = data.reduce((a, b) => a + b, 0) / data.length;
    const intensity = Math.min(1, avg / 128);
    if (wdMusicToggle) wdMusicToggle.style.setProperty("--viz-intensity", String(intensity));
    if (petalsController) petalsController.setEnergy(intensity);
    requestAnimationFrame(updateVisualizer);
  }

  if (wdMusicToggle && wdMusic) {
    wdMusicToggle.style.setProperty("--viz-intensity", "0");
    wdMusicToggle.addEventListener("click", (e) => {
      e.stopPropagation();
      if (wdMusicPlaying) {
        wdMusic.pause();
        wdMusicToggle.classList.remove("playing");
        wdMusicPlaying = false;
      } else {
        wdMusic.volume = 0.3;
        wdMusic.play().catch(() => {});
        wdMusicToggle.classList.add("playing");
        wdMusicPlaying = true;
        initVisualizer();
        updateVisualizer();
      }
    });
  }

  // ===== VOICE (8/3) =====
  const SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;
  const voiceToggle = document.getElementById("wdVoiceToggle");
  const voiceStatus = document.getElementById("wdVoiceStatus");
  let voiceEnabled = false;
  let recognition = null;

  function showVoiceStatus(text) {
    if (!voiceStatus) return;
    voiceStatus.textContent = text;
    voiceStatus.classList.add("visible");
  }
  function hideVoiceStatus() {
    if (!voiceStatus) return;
    voiceStatus.classList.remove("visible");
  }

  if (SpeechRecognition) {
    recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = false;
    recognition.lang = "vi-VN";

    recognition.onend = () => {
      if (voiceEnabled) {
        try {
          recognition.start();
          showVoiceStatus("🎙️ Đang nghe... (8/3)");
        } catch (_) {}
      } else hideVoiceStatus();
    };

    recognition.onresult = (e) => {
      const last = e.results.length - 1;
      const raw = (e.results[last][0].transcript || "").trim();
      const text = raw.toLowerCase();
      if (!e.results[last].isFinal) return;

      let handled = false;
      if (/bật nhạc|mở nhạc|play/.test(text)) {
        handled = true;
        if (!wdMusicPlaying) wdMusicToggle?.click();
      } else if (/tắt nhạc|dừng nhạc|pause/.test(text)) {
        handled = true;
        if (wdMusicPlaying) wdMusicToggle?.click();
      } else if (/mở quà|quà/.test(text)) {
        handled = true;
        giftBox?.click();
      } else if (/hoa nở|nở hoa|nở/.test(text)) {
        handled = true;
        bloomBtn?.click();
      } else if (/mở thiệp|thiệp/.test(text)) {
        handled = true;
        wdCardFlip?.click();
      } else if (/cào thẻ|cào the|cao the|scratch/.test(text)) {
        handled = true;
        const scratchEl = document.getElementById("scratchSection");
        scratchEl?.scrollIntoView({ behavior: "smooth" });
        setTimeout(() => {
          if (typeof window.wdAutoScratch === "function") window.wdAutoScratch();
        }, 600);
      } else if (/tiếp|xuống|next/.test(text)) {
        handled = true;
        goToWdSection("next");
      } else if (/quay lại|lên|back/.test(text)) {
        handled = true;
        goToWdSection("prev");
      }

      if (raw && voiceEnabled) {
        showVoiceStatus(
          handled
            ? `✔ Nghe được: "${raw}"`
            : `🤔 Nghe được: "${raw}" nhưng chưa có lệnh này`,
        );
        setTimeout(() => {
          if (voiceEnabled) showVoiceStatus("🎙️ Đang nghe... (8/3)");
          else hideVoiceStatus();
        }, 2000);
      }
    };

    if (voiceToggle) {
      voiceToggle.addEventListener("click", (e) => {
        e.stopPropagation();
        if (!voiceEnabled) {
          const start = () => {
            try {
              recognition.start();
              voiceEnabled = true;
              voiceToggle.classList.add("active");
              showVoiceStatus("🎙️ Đang nghe... (8/3)");
            } catch (_) {}
          };
          if (navigator.mediaDevices?.getUserMedia && window.isSecureContext) {
            navigator.mediaDevices
              .getUserMedia({ audio: true })
              .then((stream) => {
                stream.getTracks().forEach((t) => t.stop());
                start();
              })
              .catch(() => start());
          } else start();
        } else {
          voiceEnabled = false;
          voiceToggle.classList.remove("active");
          try {
            recognition.stop();
          } catch (_) {}
          hideVoiceStatus();
        }
      });
    }
  } else {
    if (voiceToggle) voiceToggle.style.display = "none";
    if (voiceStatus) voiceStatus.style.display = "none";
  }

  // ===== GIFT BOX 3D + CONFETTI =====
  const giftBox = document.getElementById("wdGiftBox");
  const giftHint = document.getElementById("giftHint");

  function spawnFlowerConfetti(container) {
    if (!container) container = document.body;
    const rect = container.getBoundingClientRect();
    const emojis = ["🌸", "🌺", "🌷", "💮", "🌹"];
    for (let i = 0; i < 100; i++) {
      const span = document.createElement("span");
      span.textContent = emojis[Math.floor(Math.random() * emojis.length)];
      span.style.cssText = `
        position: fixed;
        left: ${rect.left + rect.width / 2}px;
        top: ${rect.top + rect.height / 2}px;
        font-size: ${18 + Math.random() * 10}px;
        pointer-events: none;
        z-index: 100;
        transform: translate(-50%, -50%);
      `;
      document.body.appendChild(span);
      const dx = (Math.random() - 0.5) * 260;
      const dy = 80 + Math.random() * 220;
      const rot = (Math.random() - 0.5) * 360;
      requestAnimationFrame(() => {
        span.style.transition =
          "transform 1.2s ease-out, opacity 1.2s ease-out";
        span.style.transform = `translate(${dx}px, ${dy}px) rotate(${rot}deg)`;
        span.style.opacity = "0";
      });
      setTimeout(() => span.remove(), 1400);
    }
  }

  if (giftBox) {
    giftBox.addEventListener("click", (e) => {
      e.stopPropagation();
      if (!giftBox.classList.contains("opened")) {
        giftBox.classList.add("opened");
        if (giftHint)
          giftHint.textContent = "Quà đã mở — cảm ơn em vì đã là món quà của anh 💖";
        spawnFlowerConfetti(giftBox);
      }
    });
  }

  // ===== SCRATCH CARD (random lời chúc kiểu xé túi mù) =====
  const SCRATCH_WISHES = [
    "Em là điều tuyệt vời nhất<br />mà cuộc đời đã tặng cho anh",
    "Mỗi ngày bên em là món quà<br />đẹp nhất với anh",
    "Anh mong được cùng em<br />đi qua mọi mùa 8/3",
    "8/3 vui vẻ — em luôn xinh<br />và hạnh phúc nhé 💕",
    "Cảm ơn em đã đến bên anh<br />và làm cuộc đời anh đầy màu",
    "Em là lý do anh cười mỗi ngày —<br />chúc em ngày của phụ nữ thật ý nghĩa",
    "Mãi yêu em, Ngân ơi 🌸<br />Happy 8/3!",
    "Chúc em một ngày 8/3 ấm áp —<br />anh luôn ở đây bên em",
    "Em là bông hoa đẹp nhất<br />trong vườn trái tim anh",
    "Ngày 8/3 gửi em trọn yêu thương —<br />em là điều đặc biệt nhất",
    "Cùng em mỗi ngày đều là ngày đẹp —<br />chúc em 8/3 hạnh phúc",
    "Trái tim anh chỉ dành cho em —<br />chúc mừng ngày của em! 💖",
    "Em là ánh sáng của anh —<br />8/3 vui vẻ, công chúa nhỏ",
    "Một ngày thật ý nghĩa dành cho em —<br />anh yêu em!",
    "Chúc em 8/3 tràn ngập niềm vui —<br />và luôn nhớ anh nhé",
  ];
  const scratchTextEl = document.getElementById("scratchText");
  if (scratchTextEl) {
    const wish = SCRATCH_WISHES[Math.floor(Math.random() * SCRATCH_WISHES.length)];
    scratchTextEl.innerHTML = wish;
  }

  const scratchCanvas = document.getElementById("scratchCanvas");
  const scratchCard = document.getElementById("scratchCard");
  if (scratchCanvas && scratchCard) {
    const ctx = scratchCanvas.getContext("2d");
    let hasScratched = false;

    function resizeScratch() {
      const rect = scratchCard.getBoundingClientRect();
      scratchCanvas.width = rect.width;
      scratchCanvas.height = rect.height;
      if (hasScratched) {
        ctx.globalCompositeOperation = "destination-out";
        return;
      }
      ctx.fillStyle = "#4b164c";
      ctx.fillRect(0, 0, scratchCanvas.width, scratchCanvas.height);
      ctx.fillStyle = "#f9a8d4";
      ctx.font = "bold 18px Quicksand, sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(
        "Cào nhẹ để xem lời chúc ✨",
        scratchCanvas.width / 2,
        scratchCanvas.height / 2,
      );
      ctx.globalCompositeOperation = "destination-out";
    }
    resizeScratch();
    window.addEventListener("resize", resizeScratch);

    let scratching = false;

    function scratch(e) {
      if (!scratching) return;
      const rect = scratchCanvas.getBoundingClientRect();
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;
      const x = clientX - rect.left;
      const y = clientY - rect.top;
      ctx.beginPath();
      ctx.arc(x, y, 24, 0, Math.PI * 2);
      ctx.fill();
      hasScratched = true;
    }

    scratchCanvas.addEventListener("mousedown", (e) => {
      scratching = true;
      scratch(e);
    });
    scratchCanvas.addEventListener("mousemove", scratch);
    window.addEventListener("mouseup", () => {
      scratching = false;
    });
    scratchCanvas.addEventListener(
      "touchstart",
      (e) => {
        scratching = true;
        scratch(e);
      },
      { passive: true },
    );
    scratchCanvas.addEventListener(
      "touchmove",
      (e) => {
        if (scratching && e.cancelable) e.preventDefault();
        scratch(e);
      },
      { passive: false },
    );

    function autoScratch() {
      hasScratched = true;
      const w = scratchCanvas.width;
      const h = scratchCanvas.height;
      const radius = 28;
      let count = 0;
      const total = 55;
      function step() {
        for (let n = 0; n < 4 && count < total; n++) {
          const x = radius + Math.random() * (w - radius * 2);
          const y = radius + Math.random() * (h - radius * 2);
          ctx.beginPath();
          ctx.arc(x, y, radius, 0, Math.PI * 2);
          ctx.fill();
          count++;
        }
        if (count < total) requestAnimationFrame(step);
      }
      requestAnimationFrame(step);
    }

    const scratchAutoBtn = document.getElementById("wdScratchAutoBtn");
    if (scratchAutoBtn) scratchAutoBtn.addEventListener("click", autoScratch);
    window.wdAutoScratch = autoScratch;
  }

  // ===== BLOOMING ROSE =====
  const bloomRose = document.getElementById("bloomRose");
  const bloomBtn = document.getElementById("bloomBtn");
  if (bloomRose && bloomBtn) {
    bloomBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      const bloomed = bloomRose.classList.toggle("bloomed");
      bloomBtn.classList.toggle("bloomed", bloomed);
      bloomBtn.textContent = bloomed ? "🌹 Hoa nở vì em" : "🌱 Nhấn để hoa nở";
    });
  }

  // ===== TYPEWRITER MESSAGE (chạy khi lướt tới section) =====
  const typewriterText = document.getElementById("typewriterText");
  const twCursor = document.getElementById("twCursor");
  const typewriterSection = document.getElementById("typewriterSection");
  if (typewriterText && twCursor && typewriterSection) {
    const message =
      "Nhân ngày 8/3, anh chỉ muốn nói rằng:\n" +
      "Cảm ơn em vì đã luôn dịu dàng, cố gắng và yêu thương anh.\n" +
      "Dù tương lai có ra sao, anh vẫn mong người anh nắm tay đi tiếp… là em.";
    let started = false;
    function typeNext() {
      if (i >= message.length) return;
      const ch = message[i];
      typewriterText.textContent += ch === "\n" ? "\n" : ch;
      i++;
      const delay = ch === "." || ch === "?" || ch === "!" ? 180 : 45;
      setTimeout(typeNext, delay);
    }
    let i = 0;
    const twObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !started) {
            started = true;
            twObserver.disconnect();
            typeNext();
          }
        });
      },
      { threshold: 0.3 },
    );
    twObserver.observe(typewriterSection);
  }

  // ===== GREETING CARD FLIP =====
  const wdCardFlip = document.getElementById("wdCardFlip");
  if (wdCardFlip) {
    wdCardFlip.addEventListener("click", (e) => {
      e.stopPropagation();
      wdCardFlip.classList.toggle("flipped");
    });
  }
});
