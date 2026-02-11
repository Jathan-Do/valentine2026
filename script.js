/* =====================================================
   VALENTINE + TẾT + BIRTHDAY - JAVASCRIPT
   Three.js 3D Heart, Photo Booth, Interactive Effects
   ===================================================== */

// ===== THREE.JS 3D HEART =====
function init3DHeart() {
  const canvas = document.getElementById("heart3dScene");
  if (!canvas || typeof THREE === "undefined") return;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
  camera.position.z = 4;

  const renderer = new THREE.WebGLRenderer({
    canvas,
    alpha: true,
    antialias: true,
  });
  renderer.setSize(canvas.clientWidth, canvas.clientHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  // Create heart shape
  const heartShape = new THREE.Shape();
  const x = 0,
    y = 0;

  // Flip the Y direction of the heart to fix the upside-down issue
  // This new path will make the heart point downward in world space (the usual heart orientation)
  heartShape.moveTo(x, y - 0.5);
  heartShape.bezierCurveTo(x, y - 0.5, x - 0.1, y, x - 0.5, y);
  heartShape.bezierCurveTo(x - 1.1, y, x - 1.1, y - 0.75, x - 1.1, y - 0.75);
  heartShape.bezierCurveTo(x - 1.1, y - 1.2, x - 0.7, y - 1.55, x, y - 1.9);
  heartShape.bezierCurveTo(
    x + 0.7,
    y - 1.55,
    x + 1.1,
    y - 1.2,
    x + 1.1,
    y - 0.75,
  );
  heartShape.bezierCurveTo(x + 1.1, y - 0.75, x + 1.1, y, x + 0.5, y);
  heartShape.bezierCurveTo(x + 0.1, y, x, y - 0.5, x, y - 0.5);

  const extrudeSettings = {
    depth: 0.4,
    bevelEnabled: true,
    bevelSegments: 8,
    steps: 2,
    bevelSize: 0.15,
    bevelThickness: 0.15,
  };

  const geometry = new THREE.ExtrudeGeometry(heartShape, extrudeSettings);
  geometry.center();

  // Material: glossy pink metallic
  const material = new THREE.MeshPhysicalMaterial({
    color: 0xe8456b,
    metalness: 0.3,
    roughness: 0.2,
    clearcoat: 1.0,
    clearcoatRoughness: 0.1,
    emissive: 0x5a1020,
    emissiveIntensity: 0.3,
  });

  const heart = new THREE.Mesh(geometry, material);
  heart.scale.set(1.1, 1.1, 1.1);
  scene.add(heart);

  // Lights
  const ambientLight = new THREE.AmbientLight(0xffb3c1, 0.6);
  scene.add(ambientLight);

  const directionalLight = new THREE.DirectionalLight(0xffffff, 1.0);
  directionalLight.position.set(2, 3, 4);
  scene.add(directionalLight);

  const pointLight1 = new THREE.PointLight(0xff6b8a, 1.2, 10);
  pointLight1.position.set(-2, 1, 3);
  scene.add(pointLight1);

  const pointLight2 = new THREE.PointLight(0xffd700, 0.8, 10);
  pointLight2.position.set(2, -1, 3);
  scene.add(pointLight2);

  // Particle system (floating sparkles)
  const particleCount = 60;
  const particleGeometry = new THREE.BufferGeometry();
  const positions = new Float32Array(particleCount * 3);
  const sizes = new Float32Array(particleCount);

  for (let i = 0; i < particleCount; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 6;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 6;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 4;
    sizes[i] = Math.random() * 3 + 1;
  }

  particleGeometry.setAttribute(
    "position",
    new THREE.BufferAttribute(positions, 3),
  );
  particleGeometry.setAttribute("size", new THREE.BufferAttribute(sizes, 1));

  const particleMaterial = new THREE.PointsMaterial({
    color: 0xff8fa3,
    size: 0.05,
    transparent: true,
    opacity: 0.6,
    blending: THREE.AdditiveBlending,
  });

  const particles = new THREE.Points(particleGeometry, particleMaterial);
  scene.add(particles);

  // Mouse tracking for parallax
  let mouseX = 0,
    mouseY = 0;
  document.addEventListener("mousemove", (e) => {
    mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
    mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
  });

  // Resize handler
  function onResize() {
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    renderer.setSize(w, h);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }
  window.addEventListener("resize", onResize);

  // Animate
  const clock = new THREE.Clock();
  function animate() {
    requestAnimationFrame(animate);
    const t = clock.getElapsedTime();

    // Heart rotation + mouse follow
    heart.rotation.y = t * 0.5 + mouseX * 0.5;
    heart.rotation.x = Math.sin(t * 0.3) * 0.1 - mouseY * 0.3;
    heart.rotation.z = Math.sin(t * 0.2) * 0.05;

    // Pulsing scale
    const pulse = 1 + Math.sin(t * 2) * 0.05;
    heart.scale.set(1.1 * pulse, 1.1 * pulse, 1.1 * pulse);

    // Animate particles
    const pos = particles.geometry.attributes.position.array;
    for (let i = 0; i < particleCount; i++) {
      pos[i * 3 + 1] += 0.003;
      if (pos[i * 3 + 1] > 3) pos[i * 3 + 1] = -3;
    }
    particles.geometry.attributes.position.needsUpdate = true;
    particles.rotation.y = t * 0.1;

    // Animate lights
    pointLight1.position.x = Math.sin(t * 0.7) * 3;
    pointLight1.position.y = Math.cos(t * 0.5) * 2;
    pointLight2.position.x = Math.cos(t * 0.8) * 3;
    pointLight2.position.y = Math.sin(t * 0.6) * 2;

    renderer.render(scene, camera);
  }
  animate();
}

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

// ===== PHOTO BOOTH SYSTEM (UPGRADED) =====
class PhotoBooth {
  constructor() {
    // DOM elements
    this.video = document.getElementById("cameraVideo");
    this.overlay = document.getElementById("cameraOverlay");
    this.placeholder = document.getElementById("cameraPlaceholder");
    this.startBtn = document.getElementById("startCameraBtn");
    this.captureBtn = document.getElementById("captureBtn");
    this.frameOptions = document.querySelectorAll(".frame-option");
    this.countdownOverlay = document.getElementById("countdownOverlay");
    this.countdownNumber = document.getElementById("countdownNumber");
    this.countdownLabel = document.getElementById("countdownLabel");
    this.countdownRing = document.getElementById("countdownRing");
    this.shotProgress = document.getElementById("shotProgress");
    this.shotProgressText = document.getElementById("shotProgressText");
    this.pbResult = document.getElementById("pbResult");
    this.stripPreviewArea = document.getElementById("stripPreviewArea");
    this.downloadStripBtn = document.getElementById("downloadStripBtn");
    this.retakeBtn = document.getElementById("retakeBtn");
    this.pbSettings = document.getElementById("pbSettings");
    this.stripPreviewCanvas = document.getElementById("stripPreviewCanvas");

    // State
    this.ctx = this.overlay ? this.overlay.getContext("2d") : null;
    this.stream = null;
    this.currentFrame = "hearts";
    this.animationId = null;
    this.isActive = false;
    this.isShooting = false;
    this.totalShots = 1;
    this.currentStripFrame = "pink";
    this.capturedPhotos = [];
    this.stripCanvas = null;

    // Ring circumference for countdown animation
    this.ringCircumference = 2 * Math.PI * 54; // r=54

    this.initEvents();
    this.renderStripPreview(); // Show initial preview
  }

  initEvents() {
    // Camera start/stop
    if (this.startBtn) {
      this.startBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        if (this.stream) {
          this.stopCamera();
        } else {
          this.startCamera();
        }
      });
    }

    // Capture button starts the auto-sequence
    if (this.captureBtn) {
      this.captureBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        if (!this.isShooting) this.startCaptureSequence();
      });
    }

    // Frame overlay selector
    this.frameOptions.forEach((opt) => {
      opt.addEventListener("click", (e) => {
        e.stopPropagation();
        this.frameOptions.forEach((o) => o.classList.remove("active"));
        opt.classList.add("active");
        this.currentFrame = opt.getAttribute("data-frame");
      });
    });

    // Mode selector (1/4/8 shots)
    document.querySelectorAll(".pb-mode-btn").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        document
          .querySelectorAll(".pb-mode-btn")
          .forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");
        this.totalShots = parseInt(btn.getAttribute("data-shots"));
        this.renderStripPreview(); // Update layout preview
      });
    });

    // Strip frame selector
    document.querySelectorAll(".pb-strip-frame").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        document
          .querySelectorAll(".pb-strip-frame")
          .forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");
        this.currentStripFrame = btn.getAttribute("data-strip");
        this.renderStripPreview(); // Update live preview
      });
    });

    // Download strip
    if (this.downloadStripBtn) {
      this.downloadStripBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        this.downloadStrip();
      });
    }

    // Retake
    if (this.retakeBtn) {
      this.retakeBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        this.retake();
      });
    }
  }

  async startCamera() {
    try {
      this.stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 640 },
          height: { ideal: 480 },
          facingMode: "user",
        },
        audio: false,
      });
      this.video.srcObject = this.stream;
      this.video.play();
      this.placeholder.classList.add("hidden");
      this.captureBtn.disabled = false;
      this.startBtn.textContent = "🚫 Tắt Camera";
      this.isActive = true;

      this.video.addEventListener(
        "loadedmetadata",
        () => {
          this.overlay.width = this.video.videoWidth;
          this.overlay.height = this.video.videoHeight;
          this.drawOverlay();
        },
        { once: true },
      );
    } catch (err) {
      console.error("Camera error:", err);
      alert(
        "Không thể mở camera. Hãy thử mở trang qua localhost hoặc HTTPS nhé!",
      );
    }
  }

  stopCamera() {
    if (this.stream) {
      this.stream.getTracks().forEach((track) => track.stop());
      this.stream = null;
    }
    this.video.srcObject = null;
    this.placeholder.classList.remove("hidden");
    this.captureBtn.disabled = true;
    this.startBtn.textContent = "ðŸ“· Má»Ÿ Camera";
    this.isActive = false;
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }
  }

  // ===== COUNTDOWN + AUTO CAPTURE SEQUENCE =====
  async startCaptureSequence() {
    if (!this.isActive || this.isShooting) return;
    this.isShooting = true;
    this.capturedPhotos = [];
    this.captureBtn.disabled = true;
    this.startBtn.disabled = true;
    this.pbResult.classList.remove("active");

    // Show shot progress for multi-shot
    if (this.totalShots > 1) {
      this.shotProgress.classList.add("active");
    }

    for (let i = 0; i < this.totalShots; i++) {
      if (this.totalShots > 1) {
        this.shotProgressText.textContent = `áº¢nh ${i + 1}/${this.totalShots}`;
      }
      await this.countdown(3);
      this.captureOnePhoto();
      // Brief pause between shots
      if (i < this.totalShots - 1) {
        await this.sleep(800);
      }
    }

    this.shotProgress.classList.remove("active");
    this.isShooting = false;
    this.captureBtn.disabled = false;
    this.startBtn.disabled = false;

    // Generate and show strip
    this.generateStrip();
  }

  countdown(seconds) {
    return new Promise((resolve) => {
      this.countdownOverlay.classList.add("active");
      let remaining = seconds;

      const tick = () => {
        this.countdownNumber.textContent = remaining;
        this.countdownLabel.textContent =
          remaining > 0 ? "Chuẩn bị!" : "💕";

        // Animate ring: stroke-dashoffset goes from 0 to full circumference
        const progress = (seconds - remaining) / seconds;
        this.countdownRing.style.strokeDashoffset =
          progress * this.ringCircumference;

        if (remaining <= 0) {
          // Flash!
          this.countdownOverlay.classList.remove("active");
          this.countdownRing.style.strokeDashoffset = 0;
          resolve();
          return;
        }

        remaining--;
        setTimeout(tick, 1000);
      };

      tick();
    });
  }

  captureOnePhoto() {
    if (!this.isActive) return;

    const canvas = document.createElement("canvas");
    const vw = this.video.videoWidth;
    const vh = this.video.videoHeight;
    canvas.width = vw;
    canvas.height = vh;
    const ctx = canvas.getContext("2d");

    // Mirror video
    ctx.save();
    ctx.translate(vw, 0);
    ctx.scale(-1, 1);
    ctx.drawImage(this.video, 0, 0, vw, vh);
    ctx.restore();

    // Draw overlay
    ctx.drawImage(this.overlay, 0, 0, vw, vh);

    this.capturedPhotos.push(canvas);

    // Flash effect
    const flash = document.createElement("div");
    flash.style.cssText = `
      position: fixed; top: 0; left: 0; width: 100%; height: 100%;
      background: white; z-index: 9999; pointer-events: none;
      animation: flashFade 0.4s ease-out forwards;
    `;
    document.body.appendChild(flash);
    setTimeout(() => flash.remove(), 400);
  }

  sleep(ms) {
    return new Promise((r) => setTimeout(r, ms));
  }

  // ===== STRIP GENERATION =====
  generateStrip() {
    const photos = this.capturedPhotos;
    if (photos.length === 0) return;

    const theme = this.getStripTheme(this.currentStripFrame);
    const padding = 20;
    const photoGap = 12;
    const photoWidth = 300;
    const photoHeight = 225; // 4:3 ratio
    const headerHeight = 50;
    const footerHeight = 45;
    const cornerRadius = 10;

    let cols, rows;
    if (photos.length === 1) {
      cols = 1;
      rows = 1;
    } else if (photos.length <= 4) {
      cols = 2;
      rows = 2;
    } else {
      cols = 2;
      rows = 4;
    }

    const stripWidth = padding * 2 + cols * photoWidth + (cols - 1) * photoGap;
    const stripHeight =
      headerHeight +
      padding +
      rows * photoHeight +
      (rows - 1) * photoGap +
      padding +
      footerHeight;

    const stripCanvas = document.createElement("canvas");
    stripCanvas.width = stripWidth;
    stripCanvas.height = stripHeight;
    const ctx = stripCanvas.getContext("2d");

    // Background
    const bgGrad = ctx.createLinearGradient(0, 0, stripWidth, stripHeight);
    theme.bgStops.forEach(([offset, color]) =>
      bgGrad.addColorStop(offset, color),
    );
    ctx.fillStyle = bgGrad;
    this.roundRect(ctx, 0, 0, stripWidth, stripHeight, 16);
    ctx.fill();

    // Border
    ctx.strokeStyle = theme.borderColor;
    ctx.lineWidth = 3;
    this.roundRect(ctx, 1.5, 1.5, stripWidth - 3, stripHeight - 3, 16);
    ctx.stroke();

    // Header text
    ctx.font = `bold 22px 'Dancing Script', cursive`;
    ctx.fillStyle = theme.textColor;
    ctx.textAlign = "center";
    ctx.fillText(theme.title, stripWidth / 2, headerHeight - 10);

    // Draw photos
    for (let i = 0; i < photos.length; i++) {
      const col = i % cols;
      const row = Math.floor(i / cols);
      const x = padding + col * (photoWidth + photoGap);
      const y = headerHeight + padding + row * (photoHeight + photoGap);

      // Photo shadow
      ctx.save();
      ctx.shadowColor = "rgba(0,0,0,0.2)";
      ctx.shadowBlur = 8;
      ctx.shadowOffsetY = 3;

      // Photo border
      ctx.fillStyle = theme.photoBorder;
      this.roundRect(
        ctx,
        x - 3,
        y - 3,
        photoWidth + 6,
        photoHeight + 6,
        cornerRadius + 2,
      );
      ctx.fill();
      ctx.restore();

      // Clip and draw photo
      ctx.save();
      this.roundRect(ctx, x, y, photoWidth, photoHeight, cornerRadius);
      ctx.clip();
      ctx.drawImage(photos[i], x, y, photoWidth, photoHeight);
      ctx.restore();
    }

    // Footer
    const footerY = stripHeight - footerHeight + 5;
    ctx.font = `16px 'Quicksand', sans-serif`;
    ctx.fillStyle = theme.subtextColor;
    ctx.textAlign = "center";
    const dateStr = new Date().toLocaleDateString("vi-VN");
    ctx.fillText(`${dateStr}  💕 Anh yêu em`, stripWidth / 2, footerY + 18);

    // Corner decorations
    ctx.font = "18px serif";
    ctx.fillText(theme.cornerEmoji, 25, 30);
    ctx.fillText(theme.cornerEmoji, stripWidth - 25, 30);
    ctx.fillText(theme.cornerEmoji, 25, stripHeight - 15);
    ctx.fillText(theme.cornerEmoji, stripWidth - 25, stripHeight - 15);

    this.stripCanvas = stripCanvas;

    // Show result
    this.stripPreviewArea.innerHTML = "";
    this.stripPreviewArea.appendChild(stripCanvas);
    this.pbResult.classList.add("active");
  }

  getStripTheme(name) {
    const themes = {
      pink: {
        bgStops: [
          [0, "#ffe0ec"],
          [0.5, "#ffb3c6"],
          [1, "#ffe0ec"],
        ],
        borderColor: "#e8456b",
        textColor: "#b0234b",
        subtextColor: "#c94070",
        photoBorder: "#fff",
        title: "Khoảng khắc của mình",
        cornerEmoji: "💕",
      },
      gold: {
        bgStops: [
          [0, "#fff8e1"],
          [0.5, "#ffe082"],
          [1, "#fff8e1"],
        ],
        borderColor: "#ffa000",
        textColor: "#bf6900",
        subtextColor: "#c98600",
        photoBorder: "#fff",
        title: "Đẹp đôi nhất thế giới",
        cornerEmoji: "🥰",
      },
      blue: {
        bgStops: [
          [0, "#e3f2fd"],
          [0.5, "#90caf9"],
          [1, "#e3f2fd"],
        ],
        borderColor: "#1976d2",
        textColor: "#0d47a1",
        subtextColor: "#1565c0",
        photoBorder: "#fff",
        title: "",
        cornerEmoji: "",
      },
      classic: {
        bgStops: [
          [0, "#fafafa"],
          [0.5, "#f0f0f0"],
          [1, "#fafafa"],
        ],
        borderColor: "#999",
        textColor: "#333",
        subtextColor: "#666",
        photoBorder: "#fff",
        title: "Lại một năm mới vui vẻ",
        cornerEmoji: "",
      },
    };
    return themes[name] || themes.pink;
  }

  roundRect(ctx, x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + r);
    ctx.lineTo(x + w, y + h - r);
    ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    ctx.lineTo(x + r, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - r);
    ctx.lineTo(x, y + r);
    ctx.quadraticCurveTo(x, y, x + r, y);
    ctx.closePath();
  }

  downloadStrip() {
    if (!this.stripCanvas) return;
    const link = document.createElement("a");
    link.download = `photobooth_${Date.now()}.png`;
    link.href = this.stripCanvas.toDataURL("image/png");
    link.click();
  }

  retake() {
    this.capturedPhotos = [];
    this.stripCanvas = null;
    this.pbResult.classList.remove("active");
    this.stripPreviewArea.innerHTML = "";
  }

  // ===== LIVE STRIP FRAME PREVIEW =====
  renderStripPreview() {
    const canvas = this.stripPreviewCanvas;
    const totalShots = this.totalShots;
    if (!canvas) return;

    const theme = this.getStripTheme(this.currentStripFrame);
    const padding = 12;
    const photoGap = 6;
    const photoWidth = 80;
    const photoHeight = 60;
    const headerHeight = 28;
    const footerHeight = 22;
    let cols, rows;
    if (totalShots === 1) {
      cols = 2;
      rows = 2;
    } else if (totalShots === 4) {
      cols = 2;
      rows = 2;
    } else {
      cols = 2;
      rows = 4;
    }

    const w = padding * 2 + cols * photoWidth + (cols - 1) * photoGap;
    const h =
      headerHeight +
      padding +
      rows * photoHeight +
      (rows - 1) * photoGap +
      padding +
      footerHeight;

    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext("2d");

    // Background gradient
    const bgGrad = ctx.createLinearGradient(0, 0, w, h);
    theme.bgStops.forEach(([offset, color]) =>
      bgGrad.addColorStop(offset, color),
    );
    ctx.fillStyle = bgGrad;
    this.roundRect(ctx, 0, 0, w, h, 10);
    ctx.fill();

    // Border
    ctx.strokeStyle = theme.borderColor;
    ctx.lineWidth = 2;
    this.roundRect(ctx, 1, 1, w - 2, h - 2, 10);
    ctx.stroke();

    // Header
    ctx.font = "bold 11px 'Dancing Script', cursive, sans-serif";
    ctx.fillStyle = theme.textColor;
    ctx.textAlign = "center";
    ctx.fillText(theme.title, w / 2, headerHeight - 6);

    // Draw placeholder photo slots
    for (let i = 0; i < totalShots; i++) {
      const col = i % cols;
      const row = Math.floor(i / cols);
      const x = padding + col * (photoWidth + photoGap);
      const y = headerHeight + padding + row * (photoHeight + photoGap);

      // Photo border
      ctx.fillStyle = theme.photoBorder;
      this.roundRect(ctx, x - 2, y - 2, photoWidth + 4, photoHeight + 4, 6);
      ctx.fill();

      // Placeholder gray with camera icon
      ctx.fillStyle = "#c0c0c0";
      this.roundRect(ctx, x, y, photoWidth, photoHeight, 5);
      ctx.fill();

      ctx.font = "18px serif";
      ctx.fillStyle = "#888";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText("📷", x + photoWidth / 2, y + photoHeight / 2);
    }

    // Footer
    ctx.font = "9px 'Quicksand', sans-serif";
    ctx.fillStyle = theme.subtextColor;
    ctx.textAlign = "center";
    ctx.textBaseline = "alphabetic";
    const dateStr = new Date().toLocaleDateString("vi-VN");
    ctx.fillText(`${dateStr}  💕 Anh yêu em`, w / 2, h - 6);

    // Corner decorations
    if (theme.cornerEmoji) {
      ctx.font = "10px serif";
      ctx.fillText(theme.cornerEmoji, 14, 14);
      ctx.fillText(theme.cornerEmoji, w - 14, 14);
      ctx.fillText(theme.cornerEmoji, 14, h - 4);
      ctx.fillText(theme.cornerEmoji, w - 14, h - 4);
    }
  }

  // ===== OVERLAY DRAWING (kept from original) =====
  drawOverlay() {
    if (!this.isActive || !this.ctx) return;
    const w = this.overlay.width;
    const h = this.overlay.height;
    this.ctx.clearRect(0, 0, w, h);

    const t = Date.now() * 0.001;

    switch (this.currentFrame) {
      case "hearts":
        this.drawHeartsFrame(w, h, t);
        break;
      case "flowers":
        this.drawFlowersFrame(w, h, t);
        break;
      case "stars":
        this.drawStarsFrame(w, h, t);
        break;
    }

    this.animationId = requestAnimationFrame(() => this.drawOverlay());
  }

  drawHeartsFrame(w, h, t) {
    const emojis = ["❤️", "💕", "💖", "💗"];
    const count = 12;
    this.ctx.font = "24px serif";
    this.ctx.textAlign = "center";
    this.ctx.textBaseline = "middle";

    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2 + t * 0.3;
      const r = Math.min(w, h) * 0.45;
      const x = w / 2 + Math.cos(angle) * r;
      const y = h / 2 + Math.sin(angle) * r;
      const emoji = emojis[i % emojis.length];
      const scale = 0.8 + Math.sin(t * 2 + i) * 0.2;

      this.ctx.save();
      this.ctx.translate(x, y);
      this.ctx.scale(scale, scale);
      this.ctx.rotate(Math.sin(t + i) * 0.3);
      this.ctx.fillText(emoji, 0, 0);
      this.ctx.restore();
    }

    this.ctx.font = "32px serif";
    const corners = [
      [30, 30],
      [w - 30, 30],
      [30, h - 30],
      [w - 30, h - 30],
    ];
    corners.forEach(([cx, cy], i) => {
      const s = 0.9 + Math.sin(t * 3 + i * 1.5) * 0.15;
      this.ctx.save();
      this.ctx.translate(cx, cy);
      this.ctx.scale(s, s);
      this.ctx.fillText("💖", 0, 0);
      this.ctx.restore();
    });
  }

  drawFlowersFrame(w, h, t) {
    const flowers = ["🌸", "🌺", "🌷", "🌻", "🌹"];
    this.ctx.font = "22px serif";
    this.ctx.textAlign = "center";
    this.ctx.textBaseline = "middle";

    for (let i = 0; i < 8; i++) {
      const x = (i + 0.5) * (w / 8);
      this.ctx.fillText(
        flowers[i % flowers.length],
        x,
        20 + Math.sin(t * 1.5 + i) * 5,
      );
    }
    for (let i = 0; i < 8; i++) {
      const x = (i + 0.5) * (w / 8);
      this.ctx.fillText(
        flowers[(i + 2) % flowers.length],
        x,
        h - 20 + Math.sin(t * 1.5 + i + 2) * 5,
      );
    }
    for (let i = 0; i < 5; i++) {
      const y = (i + 1) * (h / 6);
      this.ctx.fillText(
        flowers[i % flowers.length],
        20 + Math.sin(t * 1.2 + i) * 4,
        y,
      );
      this.ctx.fillText(
        flowers[(i + 1) % flowers.length],
        w - 20 + Math.sin(t * 1.2 + i + 1) * 4,
        y,
      );
    }
  }

  drawStarsFrame(w, h, t) {
    const stars = ["⭐", "✨", "🌟", "💫"];
    this.ctx.font = "20px serif";
    this.ctx.textAlign = "center";
    this.ctx.textBaseline = "middle";

    for (let i = 0; i < 16; i++) {
      const angle = (i / 16) * Math.PI * 2 + t * 0.2;
      const r = Math.min(w, h) * 0.42 + Math.sin(t * 1.5 + i * 0.8) * 15;
      const x = w / 2 + Math.cos(angle) * r;
      const y = h / 2 + Math.sin(angle) * r;

      this.ctx.save();
      this.ctx.globalAlpha = 0.5 + Math.sin(t * 3 + i) * 0.5;
      this.ctx.fillText(stars[i % stars.length], x, y);
      this.ctx.restore();
    }
  }
}

// Add dynamic styles
const dynamicStyle = document.createElement("style");
dynamicStyle.textContent = `
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
  @keyframes flashFade {
    0% { opacity: 0.8; }
    100% { opacity: 0; }
  }
`;
document.head.appendChild(dynamicStyle);

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
  // Initialize 3D Heart
  init3DHeart();

  // Initialize floating hearts
  const heartsCanvas = document.getElementById("heartsCanvas");
  const heartsSystem = new FloatingHeartsSystem(heartsCanvas);
  heartsSystem.start();

  // Initialize fireworks
  const fireworksCanvas = document.getElementById("fireworksCanvas");
  const fireworksSystem = new FireworksSystem(fireworksCanvas);

  // Initialize confetti
  const confettiSystem = new ConfettiSystem();

  // Initialize photo booth
  const photoBooth = new PhotoBooth();

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
              top: 50%;
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

  // ===== 3D TILT ON IMAGE CARDS =====
  document.querySelectorAll(".section-image-card").forEach((card) => {
    card.addEventListener("mousemove", (e) => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      card.style.transform = `perspective(600px) rotateY(${x * 10}deg) rotateX(${-y * 10}deg) scale(1.02)`;
    });

    card.addEventListener("mouseleave", () => {
      card.style.transform = "";
    });
  });

  console.log("💕 Made with love for Trần Kim Ngân 💕");
  console.log("Valentine 14/2 • Giao Thừa 16/2 • Sinh nhật 19/2");
  console.log("🎡 Three.js 3D Heart | 📸 Photo Booth | 🖼️ Images");
});
