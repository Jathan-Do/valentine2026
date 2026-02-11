/* =====================================================
   VALENTINE + TẾT + BIRTHDAY - JAVASCRIPT
   Interactive 3D Effects, Particles, Fireworks
   ===================================================== */

// ===== FLOATING HEARTS PARTICLE SYSTEM =====
class FloatingHeartsSystem {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    this.hearts = [];
    this.maxHearts = 35;
    this.resize();
    window.addEventListener("resize", () => this.resize());
  }

  resize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  createHeart() {
    const heartChars = ["❤", "💕", "💖", "💗", "♥", "💘", "🩷"];
    return {
      x: Math.random() * this.canvas.width,
      y: this.canvas.height + 30,
      size: Math.random() * 16 + 10,
      speedY: Math.random() * 1.5 + 0.5,
      speedX: (Math.random() - 0.5) * 0.8,
      rotation: Math.random() * 360,
      rotationSpeed: (Math.random() - 0.5) * 2,
      opacity: Math.random() * 0.4 + 0.15,
      char: heartChars[Math.floor(Math.random() * heartChars.length)],
      wobble: Math.random() * Math.PI * 2,
      wobbleSpeed: Math.random() * 0.02 + 0.01,
    };
  }

  update() {
    while (this.hearts.length < this.maxHearts) {
      const heart = this.createHeart();
      heart.y = Math.random() * this.canvas.height;
      this.hearts.push(heart);
    }

    this.hearts.forEach((h, i) => {
      h.y -= h.speedY;
      h.wobble += h.wobbleSpeed;
      h.x += h.speedX + Math.sin(h.wobble) * 0.5;
      h.rotation += h.rotationSpeed;

      if (h.y < -40) {
        this.hearts[i] = this.createHeart();
      }
    });
  }

  draw() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.hearts.forEach((h) => {
      this.ctx.save();
      this.ctx.translate(h.x, h.y);
      this.ctx.rotate((h.rotation * Math.PI) / 180);
      this.ctx.globalAlpha = h.opacity;
      this.ctx.font = `${h.size}px serif`;
      this.ctx.textAlign = "center";
      this.ctx.textBaseline = "middle";
      this.ctx.fillText(h.char, 0, 0);
      this.ctx.restore();
    });
  }

  animate() {
    this.update();
    this.draw();
    requestAnimationFrame(() => this.animate());
  }

  start() {
    this.animate();
  }
}

// ===== FIREWORKS SYSTEM =====
class FireworksSystem {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    this.fireworks = [];
    this.particles = [];
    this.running = false;
    this.resize();
    window.addEventListener("resize", () => this.resize());
  }

  resize() {
    this.canvas.width = this.canvas.parentElement.clientWidth;
    this.canvas.height = this.canvas.parentElement.clientHeight;
  }

  launch() {
    const x = Math.random() * this.canvas.width * 0.6 + this.canvas.width * 0.2;
    const targetY = Math.random() * this.canvas.height * 0.4 + 50;

    this.fireworks.push({
      x,
      y: this.canvas.height,
      targetY,
      speed: 4 + Math.random() * 3,
      trail: [],
      alive: true,
    });
  }

  explode(x, y) {
    const colors = [
      "#ff6b8a",
      "#ff8fa3",
      "#ffd700",
      "#ff69b4",
      "#ff1493",
      "#ff4500",
      "#ffb6c1",
      "#ff85a2",
      "#ffa07a",
      "#ff6347",
      "#ee82ee",
      "#dda0dd",
    ];
    const count = 60 + Math.floor(Math.random() * 40);

    for (let i = 0; i < count; i++) {
      const angle = ((Math.PI * 2) / count) * i + (Math.random() - 0.5) * 0.5;
      const speed = 2 + Math.random() * 4;
      const color = colors[Math.floor(Math.random() * colors.length)];

      this.particles.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        color,
        size: Math.random() * 3 + 1.5,
        life: 1,
        decay: Math.random() * 0.015 + 0.01,
        gravity: 0.04,
      });
    }

    // Heart-shaped burst
    if (Math.random() > 0.4) {
      const heartColor = colors[Math.floor(Math.random() * colors.length)];
      for (let t = 0; t < Math.PI * 2; t += 0.15) {
        const hx = 16 * Math.pow(Math.sin(t), 3);
        const hy = -(
          13 * Math.cos(t) -
          5 * Math.cos(2 * t) -
          2 * Math.cos(3 * t) -
          Math.cos(4 * t)
        );
        this.particles.push({
          x,
          y,
          vx: hx * 0.2 + (Math.random() - 0.5) * 0.3,
          vy: hy * 0.2 + (Math.random() - 0.5) * 0.3,
          color: heartColor,
          size: 2.5,
          life: 1,
          decay: 0.008,
          gravity: 0.02,
        });
      }
    }
  }

  update() {
    for (let i = this.fireworks.length - 1; i >= 0; i--) {
      const fw = this.fireworks[i];
      fw.trail.push({ x: fw.x, y: fw.y });
      if (fw.trail.length > 8) fw.trail.shift();
      fw.y -= fw.speed;
      if (fw.y <= fw.targetY) {
        this.explode(fw.x, fw.y);
        this.fireworks.splice(i, 1);
      }
    }

    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.vy += p.gravity;
      p.vx *= 0.99;
      p.life -= p.decay;
      if (p.life <= 0) this.particles.splice(i, 1);
    }
  }

  draw() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this.fireworks.forEach((fw) => {
      fw.trail.forEach((t, i) => {
        const alpha = i / fw.trail.length;
        this.ctx.beginPath();
        this.ctx.arc(t.x, t.y, 2, 0, Math.PI * 2);
        this.ctx.fillStyle = `rgba(255, 200, 150, ${alpha * 0.6})`;
        this.ctx.fill();
      });
      this.ctx.beginPath();
      this.ctx.arc(fw.x, fw.y, 3, 0, Math.PI * 2);
      this.ctx.fillStyle = "#ffd700";
      this.ctx.shadowColor = "#ffd700";
      this.ctx.shadowBlur = 10;
      this.ctx.fill();
      this.ctx.shadowBlur = 0;
    });

    this.particles.forEach((p) => {
      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, p.size * p.life, 0, Math.PI * 2);
      this.ctx.fillStyle = p.color;
      this.ctx.globalAlpha = p.life;
      this.ctx.shadowColor = p.color;
      this.ctx.shadowBlur = 8;
      this.ctx.fill();
      this.ctx.globalAlpha = 1;
      this.ctx.shadowBlur = 0;
    });
  }

  animate() {
    if (!this.running) return;
    this.update();
    this.draw();
    requestAnimationFrame(() => this.animate());
  }

  startShow(duration = 8000) {
    this.running = true;
    this.animate();

    let count = 0;
    const maxLaunches = 25;
    const interval = setInterval(() => {
      if (count >= maxLaunches) {
        clearInterval(interval);
        setTimeout(() => {
          this.running = false;
        }, 3000);
        return;
      }
      this.launch();
      if (Math.random() > 0.5) this.launch();
      count++;
    }, duration / maxLaunches);
  }
}

// ===== CONFETTI SYSTEM (for birthday) =====
class ConfettiSystem {
  constructor() {
    this.confetti = [];
    this.container = null;
  }

  burst(container) {
    this.container = container;
    const colors = [
      "#ff6b8a",
      "#ffd700",
      "#ff69b4",
      "#eb2f96",
      "#722ed1",
      "#13c2c2",
      "#52c41a",
      "#ff85a2",
    ];
    const shapes = ["●", "■", "★", "♦", "▲"];

    for (let i = 0; i < 60; i++) {
      const el = document.createElement("div");
      const color = colors[Math.floor(Math.random() * colors.length)];
      const shape = shapes[Math.floor(Math.random() * shapes.length)];
      const size = Math.random() * 10 + 6;
      const x = Math.random() * 100;
      const delay = Math.random() * 0.5;
      const duration = Math.random() * 2 + 2;

      el.textContent = shape;
      el.style.cssText = `
                position: absolute;
                left: ${x}%;
                top: -10px;
                font-size: ${size}px;
                color: ${color};
                pointer-events: none;
                z-index: 999;
                animation: confettiFall ${duration}s ease-in ${delay}s forwards;
                opacity: 0;
            `;
      container.appendChild(el);
      setTimeout(() => el.remove(), (duration + delay) * 1000 + 500);
    }
  }
}

// Add confetti animation
const confettiStyle = document.createElement("style");
confettiStyle.textContent = `
    @keyframes confettiFall {
        0% { opacity: 1; transform: translateY(0) rotate(0deg); }
        100% { opacity: 0; transform: translateY(400px) rotate(720deg); }
    }
    @keyframes rippleExpand {
        to { width: 100px; height: 100px; opacity: 0; }
    }
    @keyframes miniHeartFloat {
        0% { opacity: 1; transform: translate(-50%, 0) scale(1); }
        100% { opacity: 0; transform: translate(-50%, -80px) scale(0.3) rotate(20deg); }
    }
`;
document.head.appendChild(confettiStyle);

// ===== CLICK RIPPLE EFFECT =====
function createRipple(e) {
  const ripple = document.createElement("div");
  ripple.style.cssText = `
        position: fixed;
        left: ${e.clientX}px;
        top: ${e.clientY}px;
        width: 0; height: 0;
        border-radius: 50%;
        background: radial-gradient(circle, rgba(255,107,138,0.3), transparent);
        transform: translate(-50%, -50%);
        pointer-events: none;
        z-index: 9999;
        animation: rippleExpand 0.6s ease-out forwards;
    `;
  document.body.appendChild(ripple);
  setTimeout(() => ripple.remove(), 600);
}

// Click hearts
function spawnClickHearts(e) {
  const hearts = ["❤", "💕", "💖", "💗", "♥"];
  for (let i = 0; i < 3; i++) {
    const heart = document.createElement("div");
    heart.textContent = hearts[Math.floor(Math.random() * hearts.length)];
    heart.style.cssText = `
            position: fixed;
            left: ${e.clientX + (Math.random() - 0.5) * 30}px;
            top: ${e.clientY}px;
            font-size: ${14 + Math.random() * 12}px;
            pointer-events: none;
            z-index: 9999;
            animation: miniHeartFloat ${0.8 + Math.random() * 0.5}s ease-out forwards;
            animation-delay: ${i * 0.1}s;
        `;
    document.body.appendChild(heart);
    setTimeout(() => heart.remove(), 1500);
  }
}

document.addEventListener("click", (e) => {
  createRipple(e);
  spawnClickHearts(e);
});

// ===== CURSOR TRAIL =====
let mouseTrail = [];
const trailLength = 12;

document.addEventListener("mousemove", (e) => {
  mouseTrail.push({ x: e.clientX, y: e.clientY, time: Date.now() });
  if (mouseTrail.length > trailLength) mouseTrail.shift();
});

function drawTrail() {
  const now = Date.now();
  mouseTrail.forEach((point, i) => {
    const age = now - point.time;
    if (age > 300) return;

    const existing = document.getElementById(`trail-${i}`);
    if (existing) existing.remove();

    const dot = document.createElement("div");
    dot.id = `trail-${i}`;
    const progress = i / mouseTrail.length;
    dot.style.cssText = `
            position: fixed;
            left: ${point.x}px;
            top: ${point.y}px;
            width: ${4 + progress * 4}px;
            height: ${4 + progress * 4}px;
            background: rgba(255, 107, 138, ${progress * 0.4});
            border-radius: 50%;
            pointer-events: none;
            z-index: 9998;
            transform: translate(-50%, -50%);
            box-shadow: 0 0 ${progress * 8}px rgba(232, 69, 107, ${progress * 0.3});
        `;
    document.body.appendChild(dot);
    setTimeout(() => dot.remove(), 100);
  });
  requestAnimationFrame(drawTrail);
}
drawTrail();

// ===== MAIN APPLICATION =====
document.addEventListener("DOMContentLoaded", () => {
  // Initialize floating hearts
  const heartsCanvas = document.getElementById("heartsCanvas");
  const heartsSystem = new FloatingHeartsSystem(heartsCanvas);
  heartsSystem.start();

  // Initialize fireworks
  const fireworksCanvas = document.getElementById("fireworksCanvas");
  const fireworksSystem = new FireworksSystem(fireworksCanvas);

  // Initialize confetti
  const confettiSystem = new ConfettiSystem();

  // ===== MUSIC TOGGLE =====
  const musicToggle = document.getElementById("musicToggle");
  const bgMusic = document.getElementById("bgMusic");
  let musicPlaying = false;

  musicToggle.addEventListener("click", (e) => {
    e.stopPropagation();
    if (musicPlaying) {
      bgMusic.pause();
      musicToggle.classList.remove("playing");
    } else {
      bgMusic.volume = 0.3;
      bgMusic.play().catch(() => {});
      musicToggle.classList.add("playing");
    }
    musicPlaying = !musicPlaying;
  });

  // ===== ENTER BUTTON =====
  const enterBtn = document.getElementById("enterBtn");
  const scrollIndicator = document.querySelector(".scroll-indicator");

  enterBtn.addEventListener("click", (e) => {
    e.stopPropagation();

    if (!musicPlaying) {
      bgMusic.volume = 0.3;
      bgMusic
        .play()
        .then(() => {
          musicPlaying = true;
          musicToggle.classList.add("playing");
        })
        .catch(() => {});
    }

    scrollIndicator.classList.remove("hidden");

    setTimeout(() => {
      document
        .getElementById("valentine")
        .scrollIntoView({ behavior: "smooth" });
    }, 300);
  });

  // ===== 3D CARD FLIP =====
  const card3d = document.getElementById("card3d");
  let cardFlipped = false;

  card3d.addEventListener("click", (e) => {
    e.stopPropagation();
    cardFlipped = !cardFlipped;
    // Clear inline transform so the CSS class .flipped can take effect
    card3d.style.transform = "";
    card3d.classList.toggle("flipped", cardFlipped);
  });

  // 3D tilt effect on card
  const cardWrapper = document.querySelector(".card-3d-wrapper");
  if (cardWrapper) {
    cardWrapper.addEventListener("mousemove", (e) => {
      if (cardFlipped) return;
      const rect = cardWrapper.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      card3d.style.transform = `rotateY(${x * 15}deg) rotateX(${-y * 15}deg)`;
    });

    cardWrapper.addEventListener("mouseleave", () => {
      if (!cardFlipped) {
        card3d.style.transform = "";
      }
    });
  }

  // ===== LOVE LETTER (FIXED) =====
  const letterOuter = document.getElementById("letterOuter");
  let letterOpened = false;

  if (letterOuter) {
    letterOuter.addEventListener("click", (e) => {
      e.stopPropagation();
      letterOpened = !letterOpened;
      letterOuter.classList.toggle("opened", letterOpened);
    });
  }

  // ===== LÌ XÌ =====
  const lixiEnvelope = document.getElementById("lixiEnvelope");
  let lixiOpened = false;

  if (lixiEnvelope) {
    lixiEnvelope.addEventListener("click", (e) => {
      e.stopPropagation();
      if (!lixiOpened) {
        lixiOpened = true;
        lixiEnvelope.classList.add("opened");

        // Spawn gold coins / lucky emojis
        const tetSection = document.querySelector(".tet-section");
        if (tetSection) {
          for (let i = 0; i < 8; i++) {
            const coin = document.createElement("div");
            const emojis = ["🧧", "💰", "🪙", "✨", "🎊"];
            coin.textContent =
              emojis[Math.floor(Math.random() * emojis.length)];
            coin.style.cssText = `
                            position: absolute;
                            left: ${40 + Math.random() * 20}%;
                            top: 60%;
                            font-size: ${18 + Math.random() * 14}px;
                            pointer-events: none;
                            z-index: 999;
                            animation: miniHeartFloat ${1 + Math.random() * 0.5}s ease-out forwards;
                            animation-delay: ${i * 0.1}s;
                        `;
            tetSection.appendChild(coin);
            setTimeout(() => coin.remove(), 2000);
          }
        }
      }
    });
  }

  // ===== BIRTHDAY - BLOW CANDLES =====
  const blowBtn = document.getElementById("blowBtn");
  let candlesBlown = false;

  if (blowBtn) {
    blowBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      if (candlesBlown) return;
      candlesBlown = true;

      // Blow out flames one by one
      const flames = document.querySelectorAll(".flame");
      flames.forEach((flame, idx) => {
        setTimeout(() => {
          flame.classList.add("blown");
        }, idx * 300);
      });

      // Update button
      setTimeout(
        () => {
          blowBtn.textContent = "🎉 Chúc mừng sinh nhật Ngân! 🎉";
          blowBtn.classList.add("blown");
        },
        flames.length * 300 + 200,
      );

      // Launch confetti
      setTimeout(
        () => {
          const bdSection = document.querySelector(".birthday-section");
          if (bdSection) confettiSystem.burst(bdSection);
        },
        flames.length * 300 + 500,
      );

      // Reset after 6 seconds
      setTimeout(() => {
        candlesBlown = false;
        flames.forEach((flame) => flame.classList.remove("blown"));
        blowBtn.textContent = "🌬️ Thổi nến nào!";
        blowBtn.classList.remove("blown");
      }, 7000);
    });
  }

  // ===== STAR WISHES =====
  const starItems = document.querySelectorAll(".star-item");
  const wishDisplay = document.getElementById("wishDisplay");
  const wishText = document.getElementById("wishText");

  function typeWriter(element, text, speed = 40) {
    element.textContent = "";
    let i = 0;
    function type() {
      if (i < text.length) {
        element.textContent += text[i];
        i++;
        setTimeout(type, speed);
      }
    }
    type();
  }

  starItems.forEach((star) => {
    star.addEventListener("click", (e) => {
      e.stopPropagation();

      starItems.forEach((s) => s.classList.remove("active"));
      star.classList.add("active");

      const wish = star.getAttribute("data-wish");
      wishDisplay.classList.add("active");
      typeWriter(wishText, wish, 40);

      setTimeout(() => star.classList.remove("active"), 800);
    });
  });

  // ===== FIREWORKS BUTTON =====
  const fireworkBtn = document.getElementById("fireworkBtn");
  let fireworkCooldown = false;

  if (fireworkBtn) {
    fireworkBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      if (fireworkCooldown) return;
      fireworkCooldown = true;
      fireworkBtn.textContent = "🎇 Đang bắn pháo hoa... 🎇";
      fireworkBtn.style.pointerEvents = "none";

      fireworksSystem.resize();
      fireworksSystem.startShow(8000);

      setTimeout(() => {
        fireworkCooldown = false;
        fireworkBtn.textContent = "🎆 Bắn pháo hoa tình yêu 🎆";
        fireworkBtn.style.pointerEvents = "auto";
      }, 12000);
    });
  }

  // ===== SCROLL ANIMATIONS =====
  const observerOptions = {
    threshold: 0.2,
    rootMargin: "0px 0px -50px 0px",
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        if (entry.target.classList.contains("timeline-item")) {
          entry.target.classList.add("visible");
        }
        if (entry.target.classList.contains("section")) {
          entry.target.classList.add("active");
        }
      }
    });
  }, observerOptions);

  document
    .querySelectorAll(".timeline-item")
    .forEach((item) => observer.observe(item));
  document
    .querySelectorAll(".section")
    .forEach((section) => observer.observe(section));

  // ===== NAV DOTS =====
  const navDots = document.querySelectorAll(".nav-dot");
  const sections = document.querySelectorAll(".section");

  navDots.forEach((dot) => {
    dot.addEventListener("click", (e) => {
      e.stopPropagation();
      const targetId = dot.getAttribute("data-section");
      const target = document.getElementById(targetId);
      if (target) target.scrollIntoView({ behavior: "smooth" });
    });
  });

  const sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.id;
          navDots.forEach((dot) => {
            dot.classList.toggle(
              "active",
              dot.getAttribute("data-section") === id,
            );
          });
        }
      });
    },
    { threshold: 0.5 },
  );

  sections.forEach((section) => sectionObserver.observe(section));

  // ===== PARALLAX ON MOUSE MOVE =====
  document.addEventListener("mousemove", (e) => {
    const x = (e.clientX / window.innerWidth - 0.5) * 2;
    const y = (e.clientY / window.innerHeight - 0.5) * 2;

    document.querySelectorAll(".section-header").forEach((header) => {
      header.style.transform = `translate(${x * 5}px, ${y * 5}px)`;
    });
  });

  console.log("💕 Made with love for Trần Kim Ngân 💕");
  console.log("Valentine 14/2 • Giao Thừa 16/2 • Sinh nhật 19/2");
});
