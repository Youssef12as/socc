/* ============================================
   AI GRID BALANCER — Game Engine
   + 3D Energy Core (Three.js)
   + Neural Network Particle Background (Canvas)
   Green Theme
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
  initNeuralNetwork();
  initEnergyCore();
  initGridBalancer();
  initCharts();
  initSimulators();
});

/* ============================================
   1. NEURAL NETWORK PARTICLE BACKGROUND
   ============================================ */
function initNeuralNetwork() {
  const canvas = document.getElementById('neural-network-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let width, height, particles = [];
  let mouse = { x: -9999, y: -9999, active: false };

  const C = {
    count: 120, maxSpeed: 0.4, radius: 2,
    connDist: 150, mouseDist: 200,
    lineOp: 0.1, mouseOp: 0.25,
    pColor: { r: 16, g: 185, b: 129 },    // green-500
    lColor: { r: 6, g: 78, b: 59 },       // green-900
    mColor: { r: 52, g: 211, b: 153 },    // green-400
  };

  function resize() {
    const p = canvas.parentElement;
    width = canvas.width = p.clientWidth;
    height = canvas.height = p.clientHeight;
    const desired = Math.floor((width * height) / 12000);
    C.count = Math.min(Math.max(desired, 40), 180);
    if (Math.abs(particles.length - C.count) > 20) createParticles();
  }

  function createParticles() {
    particles = [];
    for (let i = 0; i < C.count; i++) {
      particles.push({
        x: Math.random() * width, y: Math.random() * height,
        vx: (Math.random() - 0.5) * C.maxSpeed * 2,
        vy: (Math.random() - 0.5) * C.maxSpeed * 2,
        r: Math.random() * C.radius + 1,
        a: Math.random() * 0.5 + 0.3,
      });
    }
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);
    // Update
    for (const p of particles) {
      p.x += p.vx; p.y += p.vy;
      if (p.x < -10) p.x = width + 10;
      if (p.x > width + 10) p.x = -10;
      if (p.y < -10) p.y = height + 10;
      if (p.y > height + 10) p.y = -10;
    }
    // Connections
    const { r, g, b } = C.lColor;
    const md2 = C.connDist * C.connDist;
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x, dy = particles[i].y - particles[j].y;
        const d2 = dx * dx + dy * dy;
        if (d2 < md2) {
          const op = (1 - Math.sqrt(d2) / C.connDist) * C.lineOp;
          ctx.beginPath(); ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(${r},${g},${b},${op})`; ctx.lineWidth = 0.8; ctx.stroke();
        }
      }
    }
    // Mouse connections
    if (mouse.active) {
      const { r: mr, g: mg, b: mb } = C.mColor;
      const mmd2 = C.mouseDist * C.mouseDist;
      for (const p of particles) {
        const dx = p.x - mouse.x, dy = p.y - mouse.y;
        const d2 = dx * dx + dy * dy;
        if (d2 < mmd2) {
          const dist = Math.sqrt(d2);
          const op = (1 - dist / C.mouseDist) * C.mouseOp;
          ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(mouse.x, mouse.y);
          ctx.strokeStyle = `rgba(${mr},${mg},${mb},${op})`; ctx.lineWidth = 1.2; ctx.stroke();
          ctx.beginPath(); ctx.arc(p.x, p.y, p.r + (1 - dist / C.mouseDist) * 4, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${mr},${mg},${mb},${op * 0.4})`; ctx.fill();
        }
      }
      ctx.beginPath(); ctx.arc(mouse.x, mouse.y, 5, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${mr},${mg},${mb},0.5)`; ctx.fill();
      ctx.beginPath(); ctx.arc(mouse.x, mouse.y, 20, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${mr},${mg},${mb},0.04)`; ctx.fill();
    }
    // Particles
    const { r: pr, g: pg, b: pb } = C.pColor;
    for (const p of particles) {
      ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${pr},${pg},${pb},${p.a})`; ctx.fill();
      ctx.beginPath(); ctx.arc(p.x, p.y, p.r * 3, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${pr},${pg},${pb},${p.a * 0.08})`; ctx.fill();
    }
    requestAnimationFrame(animate);
  }

  canvas.addEventListener('mousemove', e => {
    const r = canvas.getBoundingClientRect();
    mouse.x = e.clientX - r.left; mouse.y = e.clientY - r.top; mouse.active = true;
  });
  canvas.addEventListener('mouseleave', () => { mouse.active = false; });
  canvas.addEventListener('touchmove', e => {
    const r = canvas.getBoundingClientRect(); const t = e.touches[0];
    mouse.x = t.clientX - r.left; mouse.y = t.clientY - r.top; mouse.active = true;
  }, { passive: true });
  canvas.addEventListener('touchend', () => { mouse.active = false; });
  window.addEventListener('resize', resize);

  resize(); createParticles(); animate();
}

/* ============================================
   2. 3D ENERGY CORE (Three.js) — Green Theme
   ============================================ */
function initEnergyCore() {
  if (typeof THREE === 'undefined') return;
  const container = document.getElementById('energy-core-canvas');
  if (!container) return;
  const section = container.closest('.section-energy-core');
  if (!section) return;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 1000);
  camera.position.z = 6;
  const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
  renderer.setSize(container.clientWidth, container.clientHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setClearColor(0x000000, 0);
  container.appendChild(renderer.domElement);

  // Dark glass sphere
  const sphere = new THREE.Mesh(
    new THREE.SphereGeometry(1.0, 64, 64),
    new THREE.MeshBasicMaterial({ color: 0x064e3b, transparent: true, opacity: 0.3 })
  );
  scene.add(sphere);

  // Inner glow
  const glass = new THREE.Mesh(
    new THREE.SphereGeometry(0.85, 32, 32),
    new THREE.MeshBasicMaterial({ color: 0x10b981, transparent: true, opacity: 0.12 })
  );
  scene.add(glass);

  // Core dot
  const coreMat = new THREE.MeshBasicMaterial({ color: 0x00ff88, transparent: true, opacity: 0.9 });
  const core = new THREE.Mesh(new THREE.SphereGeometry(0.15, 16, 16), coreMat);
  scene.add(core);

  // Rings — all green tones
  const rings = [];
  const ringData = [
    { radius: 1.6, tube: 0.025, color: 0x10b981, opacity: 0.5, rx: Math.PI / 2.2, ry: 0, speed: 0.006 },
    { radius: 1.9, tube: 0.02, color: 0x34d399, opacity: 0.35, rx: Math.PI / 1.6, ry: Math.PI / 5, speed: -0.004 },
    { radius: 2.3, tube: 0.012, color: 0x6ee7b7, opacity: 0.2, rx: Math.PI / 3, ry: 0, speed: 0.003 },
    { radius: 1.3, tube: 0.018, color: 0x059669, opacity: 0.3, rx: Math.PI / 2.8, ry: -Math.PI / 3, speed: -0.005 },
  ];
  ringData.forEach(d => {
    const mat = new THREE.MeshBasicMaterial({ color: d.color, transparent: true, opacity: d.opacity });
    const mesh = new THREE.Mesh(new THREE.TorusGeometry(d.radius, d.tube, 16, 120), mat);
    mesh.rotation.x = d.rx; mesh.rotation.y = d.ry;
    scene.add(mesh);
    rings.push({ mesh, mat, speed: d.speed, baseRx: d.rx, baseOp: d.opacity });
  });

  // Wireframe
  const ico = new THREE.Mesh(
    new THREE.IcosahedronGeometry(1.05, 1),
    new THREE.MeshBasicMaterial({ color: 0x10b981, wireframe: true, transparent: true, opacity: 0.07 })
  );
  scene.add(ico);

  // Particles
  const pCount = 300, pos = new Float32Array(pCount * 3);
  for (let i = 0; i < pCount; i++) {
    const th = Math.random() * Math.PI * 2, ph = Math.acos(2 * Math.random() - 1);
    const r = 1.4 + Math.random() * 1.8;
    pos[i * 3] = r * Math.sin(ph) * Math.cos(th);
    pos[i * 3 + 1] = r * Math.sin(ph) * Math.sin(th);
    pos[i * 3 + 2] = r * Math.cos(ph);
  }
  const pGeo = new THREE.BufferGeometry();
  pGeo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  const pCloud = new THREE.Points(pGeo, new THREE.PointsMaterial({
    color: 0x34d399, size: 0.025, transparent: true, opacity: 0.5, sizeAttenuation: true,
  }));
  scene.add(pCloud);

  let mouseX = 0, mouseY = 0, tRx = 0, tRy = 0;
  section.addEventListener('mousemove', e => {
    const rect = section.getBoundingClientRect();
    mouseX = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
    mouseY = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
  });

  function animate() {
    requestAnimationFrame(animate);
    const t = Date.now() * 0.001;
    tRx += (mouseY * 0.3 - tRx) * 0.04;
    tRy += (mouseX * 0.3 - tRy) * 0.04;
    const s = 1 + Math.sin(t * 1.5) * 0.03;
    sphere.scale.set(s, s, s);
    const cs = 0.8 + Math.sin(t * 3) * 0.3;
    core.scale.set(cs, cs, cs); coreMat.opacity = 0.6 + Math.sin(t * 3) * 0.35;
    rings.forEach((r, i) => {
      r.mesh.rotation.z += r.speed;
      r.mesh.rotation.x = r.baseRx + tRx * (0.5 - i * 0.05);
      r.mat.opacity = r.baseOp + Math.sin(t * 2 + i) * 0.12;
    });
    ico.rotation.x += 0.002; ico.rotation.y += 0.003;
    pCloud.rotation.y += 0.0008; pCloud.rotation.x += 0.0003;
    camera.position.x += (mouseX * 0.6 - camera.position.x) * 0.025;
    camera.position.y += (-mouseY * 0.4 - camera.position.y) * 0.025;
    camera.lookAt(scene.position);
    renderer.render(scene, camera);
  }
  animate();

  window.addEventListener('resize', () => {
    const w = container.clientWidth, h = container.clientHeight;
    if (!w || !h) return;
    camera.aspect = w / h; camera.updateProjectionMatrix(); renderer.setSize(w, h);
  });
}

/* ============================================
   3. AI GRID BALANCER — GAME ENGINE
   ============================================ */
function initGridBalancer() {
  const section = document.getElementById('grid-game');
  if (!section) return;

  const TOTAL = 10000, TOL = 50, INTERVAL = 3000;
  const cities = {
    cairo: { name: 'Cairo', baseDemand: 3800, demand: 3800, allocation: 0, min: 2800, max: 4800 },
    alex: { name: 'Alexandria', baseDemand: 3200, demand: 3200, allocation: 0, min: 2200, max: 4200 },
    aswan: { name: 'Aswan', baseDemand: 2500, demand: 2500, allocation: 0, min: 1500, max: 3500 },
  };
  let score = 0, highScore = parseInt(localStorage.getItem('gridBalancerHighScore') || '0', 10);
  let isRunning = false, gameLoop = null, demandLoop = null, lastTick = 0, streakMs = 0;

  const sliders = {}, displays = {};
  Object.keys(cities).forEach(id => {
    sliders[id] = document.getElementById(`slider-${id}`);
    displays[id] = {
      demand: document.getElementById(`demand-${id}`),
      alloc: document.getElementById(`alloc-${id}`),
      diff: document.getElementById(`diff-${id}`),
      card: document.getElementById(`city-card-${id}`),
    };
  });
  const scoreEl = document.getElementById('game-score');
  const hiEl = document.getElementById('game-highscore');
  const remEl = document.getElementById('game-remaining-value');
  const remBar = document.getElementById('game-remaining-bar');
  const statusEl = document.getElementById('game-status');
  const btnStart = document.getElementById('btn-start-game');
  const btnReset = document.getElementById('btn-reset-game');

  Object.keys(cities).forEach(id => {
    const s = sliders[id]; if (!s) return;
    s.max = TOTAL; s.value = 0;
    s.addEventListener('input', () => { cities[id].allocation = parseInt(s.value, 10); updateUI(); });
  });

  function fluctuate() {
    Object.keys(cities).forEach(id => {
      const c = cities[id];
      c.demand = Math.round(Math.max(c.min, Math.min(c.max, c.demand + (Math.random() - 0.5) * 400)));
    });
    updateUI();
  }

  function getState() {
    let tot = 0, balanced = true, over = false, under = false;
    Object.keys(cities).forEach(id => {
      const c = cities[id]; tot += c.allocation;
      const d = c.allocation - c.demand;
      if (d > TOL) over = true; else if (d < -TOL) under = true;
      if (Math.abs(d) > TOL) balanced = false;
    });
    return { tot, balanced, over, under };
  }

  function updateUI() {
    const { tot, balanced, over, under } = getState();
    const rem = TOTAL - tot;

    Object.keys(cities).forEach(id => {
      const c = cities[id], d = displays[id]; if (!d.demand) return;
      d.demand.textContent = c.demand.toLocaleString();
      d.alloc.textContent = c.allocation.toLocaleString();
      const diff = c.allocation - c.demand;
      if (Math.abs(diff) <= TOL) {
        d.diff.textContent = '✓ BALANCED'; d.diff.className = 'city-diff diff-balanced';
        d.card.className = 'city-card state-balanced';
      } else if (diff > 0) {
        d.diff.textContent = `⚠ OVERLOAD +${diff.toLocaleString()} MW`;
        d.diff.className = 'city-diff diff-over'; d.card.className = 'city-card state-overload';
      } else {
        d.diff.textContent = `⬇ DEFICIT ${diff.toLocaleString()} MW`;
        d.diff.className = 'city-diff diff-under'; d.card.className = 'city-card state-blackout';
      }
    });

    if (remEl) { remEl.textContent = rem.toLocaleString() + ' MW'; remEl.classList.toggle('negative', rem < 0); }
    if (remBar) {
      remBar.style.width = Math.max(0, Math.min(100, (tot / TOTAL) * 100)) + '%';
      remBar.classList.toggle('overloaded', tot > TOTAL);
    }
    if (statusEl) {
      const gameSection = section.closest('.section-grid-game') || section;
      if (balanced && rem >= 0) {
        statusEl.textContent = '⚡ GRID PERFECTLY BALANCED — SCORE CLIMBING';
        statusEl.className = 'game-status-banner status-balanced';
        gameSection.className = 'section-grid-game';
      } else if (over || rem < 0) {
        statusEl.textContent = '🔥 GRID OVERLOAD — REDUCE ALLOCATION';
        statusEl.className = 'game-status-banner status-overload';
        gameSection.className = 'section-grid-game game-overload';
      } else if (under) {
        statusEl.textContent = '🌑 BLACKOUT DETECTED — INCREASE POWER';
        statusEl.className = 'game-status-banner status-blackout';
        gameSection.className = 'section-grid-game game-blackout';
      } else {
        statusEl.textContent = "⚙ ADJUSTING — MATCH EACH CITY'S DEMAND";
        statusEl.className = 'game-status-banner status-idle';
        gameSection.className = 'section-grid-game';
      }
    }
    if (scoreEl) {
      const newText = score.toLocaleString();
      if (scoreEl.textContent !== newText) {
        scoreEl.textContent = newText;
        scoreEl.style.transform = 'scale(1.3)';
        setTimeout(() => { scoreEl.style.transform = 'scale(1)'; }, 200);
      }
    }
    if (hiEl) hiEl.textContent = highScore.toLocaleString();
  }

  // Confetti burst effect
  function spawnConfetti() {
    const container = document.getElementById('grid-game');
    if (!container) return;
    const emojis = ['✨','🎉','⚡','💚','🌟','🎊'];
    for (let i = 0; i < 12; i++) {
      const span = document.createElement('span');
      span.textContent = emojis[Math.floor(Math.random() * emojis.length)];
      span.style.cssText = `position:absolute;top:${10+Math.random()*30}%;left:${10+Math.random()*80}%;font-size:${16+Math.random()*18}px;pointer-events:none;z-index:99;animation:confettiFall ${1+Math.random()*1.5}s ease-out forwards;`;
      container.appendChild(span);
      setTimeout(() => span.remove(), 2500);
    }
  }
  let wasBalanced = false;

  function gameTick(ts) {
    if (!isRunning) return;
    if (!lastTick) lastTick = ts;
    const dt = ts - lastTick; lastTick = ts;
    const { balanced, over, tot } = getState();
    if (balanced && TOTAL - tot >= 0) {
      streakMs += dt;
      score += Math.round((dt / 1000) * 10 * (Math.floor(streakMs / 5000) + 1));
      if (!wasBalanced) { wasBalanced = true; spawnConfetti(); }
    } else {
      streakMs = 0;
      wasBalanced = false;
      if (over || tot > TOTAL) score = Math.max(0, score - Math.round((dt / 1000) * 5));
    }
    if (score > highScore) { highScore = score; localStorage.setItem('gridBalancerHighScore', String(highScore)); }
    updateUI();
    if (typeof updateCharts === 'function') updateCharts(cities, score);
    gameLoop = requestAnimationFrame(gameTick);
  }

  function start() {
    if (isRunning) return;
    isRunning = true; score = 0; lastTick = 0; streakMs = 0;
    fluctuate();
    demandLoop = setInterval(fluctuate, INTERVAL);
    gameLoop = requestAnimationFrame(gameTick);
    if (btnStart) { btnStart.textContent = '⚡ RUNNING...'; btnStart.disabled = true; btnStart.style.opacity = '0.5'; }
    updateUI();
  }

  function reset() {
    isRunning = false;
    if (gameLoop) cancelAnimationFrame(gameLoop);
    if (demandLoop) clearInterval(demandLoop);
    score = 0; lastTick = 0; streakMs = 0;
    Object.keys(cities).forEach(id => {
      cities[id].demand = cities[id].baseDemand; cities[id].allocation = 0;
      if (sliders[id]) sliders[id].value = 0;
    });
    const gameSection = section.closest('.section-grid-game') || section;
    gameSection.className = 'section-grid-game';
    if (btnStart) { btnStart.textContent = '⚡ Start Game'; btnStart.disabled = false; btnStart.style.opacity = '1'; }
    if (statusEl) { statusEl.textContent = '⚙ PRESS START TO BEGIN'; statusEl.className = 'game-status-banner status-idle'; }
    updateUI();
  }

  if (btnStart) btnStart.addEventListener('click', start);
  if (btnReset) btnReset.addEventListener('click', reset);
  updateUI();
}

/* ============================================
   4. LIVE CHARTS (Chart.js)
   ============================================ */
let donutChart, barChart, lineChart;
let scoreHistory = [];
let scoreTimeLabels = [];
let chartTickCount = 0;

function initCharts() {
  if (typeof Chart === 'undefined') return;

  const sharedFont = { family: 'Nunito', weight: '600' };
  Chart.defaults.font.family = 'Nunito';
  Chart.defaults.font.weight = '600';
  Chart.defaults.color = '#6b8a6b';

  // Donut
  const donutCtx = document.getElementById('chart-donut');
  if (donutCtx) {
    donutChart = new Chart(donutCtx, {
      type: 'doughnut',
      data: {
        labels: ['Cairo 🏛️', 'Alexandria 🌊', 'Aswan ☀️'],
        datasets: [{
          data: [0, 0, 0],
          backgroundColor: ['#10b981', '#34d399', '#6ee7b7'],
          borderColor: '#fff',
          borderWidth: 3,
          hoverBorderWidth: 4,
          borderRadius: 6,
        }]
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        cutout: '65%',
        plugins: {
          legend: { position: 'bottom', labels: { padding: 16, font: { size: 12, ...sharedFont }, usePointStyle: true, pointStyleWidth: 10 } },
        },
        animation: { animateRotate: true, duration: 800, easing: 'easeOutBounce' }
      }
    });
  }

  // Bar
  const barCtx = document.getElementById('chart-bar');
  if (barCtx) {
    barChart = new Chart(barCtx, {
      type: 'bar',
      data: {
        labels: ['Cairo', 'Alexandria', 'Aswan'],
        datasets: [
          { label: 'Your Supply', data: [0, 0, 0], backgroundColor: 'rgba(16,185,129,0.7)', borderRadius: 8, borderSkipped: false },
          { label: 'Demand', data: [3800, 3200, 2500], backgroundColor: 'rgba(139,92,246,0.5)', borderRadius: 8, borderSkipped: false },
        ]
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        scales: {
          y: { beginAtZero: true, max: 6000, grid: { color: 'rgba(16,185,129,0.06)' }, ticks: { font: { size: 10 } } },
          x: { grid: { display: false }, ticks: { font: { size: 11, ...sharedFont } } }
        },
        plugins: {
          legend: { position: 'top', labels: { padding: 12, font: { size: 11, ...sharedFont }, usePointStyle: true } },
        },
        animation: { duration: 600, easing: 'easeOutQuart' }
      }
    });
  }

  // Line
  const lineCtx = document.getElementById('chart-line');
  if (lineCtx) {
    lineChart = new Chart(lineCtx, {
      type: 'line',
      data: {
        labels: [],
        datasets: [{
          label: 'Score',
          data: [],
          borderColor: '#10b981',
          backgroundColor: 'rgba(16,185,129,0.1)',
          fill: true,
          tension: 0.4,
          borderWidth: 3,
          pointRadius: 0,
          pointHoverRadius: 6,
          pointHoverBackgroundColor: '#10b981',
        }]
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        scales: {
          y: { beginAtZero: true, grid: { color: 'rgba(16,185,129,0.06)' }, ticks: { font: { size: 10 } } },
          x: { grid: { display: false }, ticks: { font: { size: 9 }, maxTicksLimit: 10 } }
        },
        plugins: {
          legend: { display: false },
        },
        animation: { duration: 300 }
      }
    });
  }
}

function updateCharts(cities, score) {
  chartTickCount++;
  if (chartTickCount % 10 !== 0) return; // update every 10 frames

  if (donutChart) {
    const allocs = [cities.cairo.allocation, cities.alex.allocation, cities.aswan.allocation];
    const total = allocs.reduce((a, b) => a + b, 0);
    donutChart.data.datasets[0].data = total > 0 ? allocs : [1, 1, 1];
    donutChart.update('none');
  }

  if (barChart) {
    barChart.data.datasets[0].data = [cities.cairo.allocation, cities.alex.allocation, cities.aswan.allocation];
    barChart.data.datasets[1].data = [cities.cairo.demand, cities.alex.demand, cities.aswan.demand];
    barChart.update('none');
  }

  if (lineChart) {
    const now = new Date();
    scoreTimeLabels.push(now.toLocaleTimeString([], { minute: '2-digit', second: '2-digit' }));
    scoreHistory.push(score);
    if (scoreHistory.length > 50) { scoreHistory.shift(); scoreTimeLabels.shift(); }
    lineChart.data.labels = scoreTimeLabels;
    lineChart.data.datasets[0].data = scoreHistory;
    lineChart.update('none');
  }
}

/* ============================================
   5. RENEWABLE ENERGY SIMULATORS
   ============================================ */
function initSimulators() {
  const windSlider = document.getElementById('wind-speed');
  const solarSlider = document.getElementById('solar-intensity');
  const hydroSlider = document.getElementById('hydro-flow');
  const windOut = document.getElementById('wind-output');
  const solarOut = document.getElementById('solar-output');
  const hydroOut = document.getElementById('hydro-output');
  const totalOut = document.getElementById('sim-total-output');
  const blades = document.getElementById('turbine-blades');
  const hydroBlades = document.getElementById('hydro-blades');
  const sunCircle = document.getElementById('sun-circle');
  const sunRays = document.getElementById('sun-rays');
  const solarPanel = document.getElementById('solar-panel-rect');
  const windParticles = document.getElementById('wind-particles');
  const waterDrops = document.getElementById('water-drops');

  if (!windSlider || !solarSlider || !hydroSlider) return;

  let windVal = 0, solarVal = 0, hydroVal = 0;
  let windAngle = 0, hydroAngle = 0;
  let animId = null;

  // Wind particles
  function updateWindParticles(speed) {
    if (!windParticles) return;
    const existing = windParticles.children.length;
    const needed = Math.floor(speed / 10);
    while (windParticles.children.length > needed) windParticles.removeChild(windParticles.lastChild);
    while (windParticles.children.length < needed) {
      const p = document.createElement('div');
      p.className = 'wind-particle';
      p.style.top = (15 + Math.random() * 70) + '%';
      p.style.left = '-20px';
      p.style.animationDuration = (0.8 + Math.random() * 1.2) + 's';
      p.style.animationDelay = (Math.random() * 1.5) + 's';
      p.style.opacity = (0.2 + Math.random() * 0.4);
      windParticles.appendChild(p);
    }
  }

  // Water drops SVG
  function updateWaterDrops(flow) {
    if (!waterDrops) return;
    const existing = waterDrops.children.length;
    const needed = Math.floor(flow / 15);
    while (waterDrops.children.length > needed) waterDrops.removeChild(waterDrops.lastChild);
    while (waterDrops.children.length < needed) {
      const c = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      c.setAttribute('cx', 80 + Math.random() * 40);
      c.setAttribute('cy', 70 + Math.random() * 20);
      c.setAttribute('r', 2 + Math.random() * 2);
      c.setAttribute('class', 'water-drop');
      c.style.animationDuration = (0.6 + Math.random() * 0.8) + 's';
      c.style.animationDelay = (Math.random() * 1) + 's';
      waterDrops.appendChild(c);
    }
  }

  function updateOutputs() {
    const wPower = Math.round(windVal * 5); // max 500 kW
    const sPower = Math.round(solarVal * 3.5); // max 350 kW
    const hPower = Math.round(hydroVal * 8); // max 800 kW
    const total = wPower + sPower + hPower;

    if (windOut) windOut.textContent = wPower.toLocaleString();
    if (solarOut) solarOut.textContent = sPower.toLocaleString();
    if (hydroOut) hydroOut.textContent = hPower.toLocaleString();
    if (totalOut) {
      totalOut.textContent = total.toLocaleString() + ' kW';
      totalOut.style.transform = 'scale(1.1)';
      setTimeout(() => { totalOut.style.transform = 'scale(1)'; }, 200);
    }
  }

  function animate() {
    // Wind turbine rotation
    if (blades && windVal > 0) {
      windAngle += windVal * 0.08;
      blades.style.transform = 'rotate(' + windAngle + 'deg)';
    }
    // Hydro turbine rotation
    if (hydroBlades && hydroVal > 0) {
      hydroAngle += hydroVal * 0.06;
      hydroBlades.style.transform = 'rotate(' + hydroAngle + 'deg)';
    }
    // Solar glow
    if (sunCircle) {
      const glow = 0.3 + (solarVal / 100) * 0.7;
      const rad = 20 + (solarVal / 100) * 12;
      sunCircle.setAttribute('opacity', glow);
      sunCircle.setAttribute('r', rad);
    }
    if (sunRays) {
      sunRays.style.opacity = (solarVal / 100);
    }
    if (solarPanel) {
      const brightness = 0.4 + (solarVal / 100) * 0.6;
      solarPanel.setAttribute('opacity', brightness);
    }
    animId = requestAnimationFrame(animate);
  }

  windSlider.addEventListener('input', () => {
    windVal = parseInt(windSlider.value);
    updateWindParticles(windVal);
    updateOutputs();
  });
  solarSlider.addEventListener('input', () => {
    solarVal = parseInt(solarSlider.value);
    updateOutputs();
  });
  hydroSlider.addEventListener('input', () => {
    hydroVal = parseInt(hydroSlider.value);
    updateWaterDrops(hydroVal);
    updateOutputs();
  });

  animate();
}
