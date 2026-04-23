/* ============================================
   SDG 7 Landing Page — Script
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initMobileMenu();
  initScrollAnimations();
  initCounters();
  initParticles();
  initThreeScene();
  initDashboard();
});

/* ---- Navbar scroll behaviour ---- */
function initNavbar() {
  const navbar = document.getElementById('navbar');
  let ticking = false;

  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        navbar.classList.toggle('scrolled', window.scrollY > 60);
        ticking = false;
      });
      ticking = true;
    }
  });
}

/* ---- Mobile menu ---- */
function initMobileMenu() {
  const btn = document.getElementById('mobile-menu-btn');
  const links = document.querySelector('.nav-links');

  btn.addEventListener('click', () => {
    btn.classList.toggle('active');
    links.classList.toggle('open');
  });

  // Close menu when a link is clicked
  links.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      btn.classList.remove('active');
      links.classList.remove('open');
    });
  });
}

/* ---- Intersection Observer scroll animations ---- */
function initScrollAnimations() {
  const elements = document.querySelectorAll('.animate-on-scroll');

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          // Don't unobserve so we keep the class, but we can unobserve for perf
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
  );

  elements.forEach(el => observer.observe(el));
}

/* ---- Animated number counters ---- */
function initCounters() {
  const statValues = document.querySelectorAll('.stat-value');
  const progressCircles = document.querySelectorAll('.stat-progress');
  let hasAnimated = false;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !hasAnimated) {
          hasAnimated = true;
          animateCounters(statValues);
          animateProgressRings(progressCircles);
          observer.disconnect();
        }
      });
    },
    { threshold: 0.3 }
  );

  const statsSection = document.getElementById('stats');
  if (statsSection) observer.observe(statsSection);
}

function animateCounters(elements) {
  elements.forEach(el => {
    const target = parseInt(el.dataset.target, 10);
    const suffix = el.dataset.suffix || '';
    const duration = 2000;
    const startTime = performance.now();

    function update(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Ease-out expo
      const eased = 1 - Math.pow(1 - progress, 4);
      const current = Math.round(eased * target);

      el.textContent = current + suffix;

      if (progress < 1) {
        requestAnimationFrame(update);
      }
    }

    requestAnimationFrame(update);
  });
}

function animateProgressRings(circles) {
  const circumference = 2 * Math.PI * 54; // r=54

  circles.forEach(circle => {
    const progress = parseInt(circle.dataset.progress, 10);
    const offset = circumference - (progress / 100) * circumference;

    // Trigger reflow for transition
    circle.style.strokeDashoffset = circumference;
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        circle.style.strokeDashoffset = offset;
      });
    });
  });
}

/* ---- Floating particles in hero ---- */
function initParticles() {
  const container = document.getElementById('hero-particles');
  if (!container) return;

  const count = 35;

  for (let i = 0; i < count; i++) {
    const p = document.createElement('div');
    p.classList.add('particle');

    const size = Math.random() * 4 + 2;
    p.style.width = size + 'px';
    p.style.height = size + 'px';
    p.style.left = Math.random() * 100 + '%';
    p.style.animationDuration = (Math.random() * 10 + 8) + 's';
    p.style.animationDelay = (Math.random() * 10) + 's';

    container.appendChild(p);
  }
}

/* ---- Three.js 3D Scene ---- */
function initThreeScene() {
  if (typeof THREE === 'undefined') {
    console.warn('Three.js not loaded — skipping 3D scene.');
    return;
  }

  const container = document.getElementById('three-canvas-container');
  if (!container) return;

  // Scene setup
  const scene = new THREE.Scene();

  const camera = new THREE.PerspectiveCamera(
    50,
    container.clientWidth / container.clientHeight,
    0.1,
    1000
  );
  camera.position.z = 5;

  const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
  renderer.setSize(container.clientWidth, container.clientHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setClearColor(0x000000, 0);
  container.appendChild(renderer.domElement);

  // —— Glowing energy core ——

  // Main icosahedron (wireframe)
  const icoGeo = new THREE.IcosahedronGeometry(1.4, 1);
  const icoMat = new THREE.MeshBasicMaterial({
    color: 0x10b981,
    wireframe: true,
    transparent: true,
    opacity: 0.4,
  });
  const icosahedron = new THREE.Mesh(icoGeo, icoMat);
  scene.add(icosahedron);

  // Inner glowing sphere
  const sphereGeo = new THREE.SphereGeometry(0.65, 32, 32);
  const sphereMat = new THREE.MeshBasicMaterial({
    color: 0x22c55e,
    transparent: true,
    opacity: 0.15,
  });
  const innerSphere = new THREE.Mesh(sphereGeo, sphereMat);
  scene.add(innerSphere);

  // Outer ring (torus)
  const torusGeo = new THREE.TorusGeometry(2.0, 0.025, 16, 100);
  const torusMat = new THREE.MeshBasicMaterial({
    color: 0x34d399,
    transparent: true,
    opacity: 0.25,
  });
  const torus = new THREE.Mesh(torusGeo, torusMat);
  torus.rotation.x = Math.PI / 2.5;
  scene.add(torus);

  // Second ring
  const torus2Geo = new THREE.TorusGeometry(2.4, 0.015, 16, 100);
  const torus2Mat = new THREE.MeshBasicMaterial({
    color: 0x6ee7b7,
    transparent: true,
    opacity: 0.15,
  });
  const torus2 = new THREE.Mesh(torus2Geo, torus2Mat);
  torus2.rotation.x = Math.PI / 1.8;
  torus2.rotation.y = Math.PI / 4;
  scene.add(torus2);

  // Particle field (small dots orbiting)
  const particlesCount = 200;
  const positions = new Float32Array(particlesCount * 3);

  for (let i = 0; i < particlesCount; i++) {
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    const r = 1.8 + Math.random() * 1.5;

    positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
    positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
    positions[i * 3 + 2] = r * Math.cos(phi);
  }

  const particleGeo = new THREE.BufferGeometry();
  particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));

  const particleMat = new THREE.PointsMaterial({
    color: 0x34d399,
    size: 0.03,
    transparent: true,
    opacity: 0.6,
    sizeAttenuation: true,
  });

  const particles = new THREE.Points(particleGeo, particleMat);
  scene.add(particles);

  // Mouse interaction
  let mouseX = 0;
  let mouseY = 0;

  document.addEventListener('mousemove', (e) => {
    mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
    mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
  });

  // Animation loop
  function animate() {
    requestAnimationFrame(animate);

    const time = Date.now() * 0.001;

    // Rotate main shape
    icosahedron.rotation.x += 0.003;
    icosahedron.rotation.y += 0.005;

    // Pulse inner sphere
    const scale = 1 + Math.sin(time * 2) * 0.1;
    innerSphere.scale.set(scale, scale, scale);
    innerSphere.material.opacity = 0.12 + Math.sin(time * 3) * 0.06;

    // Rotate rings
    torus.rotation.z += 0.004;
    torus2.rotation.z -= 0.003;

    // Rotate particles
    particles.rotation.y += 0.001;
    particles.rotation.x += 0.0005;

    // Mouse parallax on camera
    camera.position.x += (mouseX * 0.5 - camera.position.x) * 0.02;
    camera.position.y += (-mouseY * 0.3 - camera.position.y) * 0.02;
    camera.lookAt(scene.position);

    renderer.render(scene, camera);
  }

  animate();

  // Responsive resize
  window.addEventListener('resize', () => {
    const w = container.clientWidth;
    const h = container.clientHeight;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
  });
}

/* ============================================
   SMART GRID AI DASHBOARD
   ============================================ */
function initDashboard() {
  const slider = document.getElementById('time-slider');
  if (!slider) return;

  /* ---------- Egyptian Governorate Energy Data ---------- */
  // Returns { demand, supply } in MW for each governorate at a given hour (0-23)
  function getGovernorateData(hour) {
    const h = hour;

    // Cairo: Capital/Industrial — high demand 14-17 and 19-23
    const cairoDemand = 1200 + 600 * Math.sin((h - 3) * Math.PI / 12)
      + (h >= 14 && h <= 17 ? 800 : 0)
      + (h >= 19 && h <= 23 ? 900 : 0)
      + (h >= 0 && h <= 5 ? -400 : 0);
    const cairoSupply = 2000 + 200 * Math.sin((h - 6) * Math.PI / 12);

    // Alexandria: Moderate demand, peaks in afternoon
    const alexDemand = 800 + 400 * Math.sin((h - 2) * Math.PI / 12)
      + (h >= 13 && h <= 17 ? 500 : 0);
    const alexSupply = 1200 + 150 * Math.sin((h - 6) * Math.PI / 12);

    // Aswan: Hydro/Solar hub — constant high production, always surplus
    const aswanDemand = 300 + 100 * Math.sin((h - 4) * Math.PI / 12);
    const aswanSupply = 3200 + 800 * Math.max(0, Math.sin((h - 6) * Math.PI / 12));

    // Red Sea: Tourism — high demand late night 21-03, lower during day
    const redseaDemand = 400
      + (h >= 21 || h <= 3 ? 700 : 0)
      + (h >= 10 && h <= 16 ? -150 : 0)
      + 200 * Math.sin((h + 3) * Math.PI / 12);
    const redseaSupply = 600 + 200 * Math.max(0, Math.sin((h - 6) * Math.PI / 12));

    return {
      cairo:  { demand: Math.max(200, Math.round(cairoDemand)),  supply: Math.round(cairoSupply) },
      alex:   { demand: Math.max(150, Math.round(alexDemand)),   supply: Math.round(alexSupply) },
      aswan:  { demand: Math.max(100, Math.round(aswanDemand)),  supply: Math.round(aswanSupply) },
      redsea: { demand: Math.max(100, Math.round(redseaDemand)), supply: Math.round(redseaSupply) }
    };
  }

  /* ---------- Chart.js Setup ---------- */
  let demandSupplyChart = null;

  function initChart() {
    const ctx = document.getElementById('demand-supply-chart');
    if (!ctx || typeof Chart === 'undefined') return;

    demandSupplyChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['Cairo', 'Alexandria', 'Aswan', 'Red Sea'],
        datasets: [
          {
            label: 'Demand (MW)',
            data: [0, 0, 0, 0],
            backgroundColor: [
              'rgba(249, 115, 22, 0.75)',
              'rgba(249, 115, 22, 0.65)',
              'rgba(249, 115, 22, 0.55)',
              'rgba(249, 115, 22, 0.65)'
            ],
            borderColor: [
              'rgba(249, 115, 22, 1)',
              'rgba(249, 115, 22, 0.9)',
              'rgba(249, 115, 22, 0.8)',
              'rgba(249, 115, 22, 0.9)'
            ],
            borderWidth: 2,
            borderRadius: 8,
            borderSkipped: false
          },
          {
            label: 'Supply (MW)',
            data: [0, 0, 0, 0],
            backgroundColor: [
              'rgba(16, 185, 129, 0.75)',
              'rgba(16, 185, 129, 0.65)',
              'rgba(16, 185, 129, 0.55)',
              'rgba(16, 185, 129, 0.65)'
            ],
            borderColor: [
              'rgba(0, 255, 136, 1)',
              'rgba(0, 255, 136, 0.9)',
              'rgba(0, 255, 136, 0.8)',
              'rgba(0, 255, 136, 0.9)'
            ],
            borderWidth: 2,
            borderRadius: 8,
            borderSkipped: false
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        animation: {
          duration: 400,
          easing: 'easeOutQuart'
        },
        interaction: {
          intersect: false,
          mode: 'index'
        },
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: 'rgba(6, 78, 59, 0.9)',
            titleFont: { family: "'Space Grotesk', sans-serif", weight: 700 },
            bodyFont: { family: "'Inter', sans-serif" },
            cornerRadius: 12,
            padding: 12,
            callbacks: {
              label: function(context) {
                return context.dataset.label + ': ' + context.parsed.y.toLocaleString() + ' MW';
              }
            }
          }
        },
        scales: {
          x: {
            grid: { display: false },
            ticks: {
              font: { family: "'Space Grotesk', sans-serif", weight: 600, size: 12 },
              color: '#6b8a6b'
            },
            border: { display: false }
          },
          y: {
            beginAtZero: true,
            grid: { color: 'rgba(16, 185, 129, 0.08)', lineWidth: 1 },
            ticks: {
              font: { family: "'Inter', sans-serif", size: 11 },
              color: '#6b8a6b',
              callback: function(value) { return value.toLocaleString() + ' MW'; }
            },
            border: { display: false }
          }
        }
      }
    });
  }

  function updateChart(data) {
    if (!demandSupplyChart) return;
    demandSupplyChart.data.datasets[0].data = [data.cairo.demand, data.alex.demand, data.aswan.demand, data.redsea.demand];
    demandSupplyChart.data.datasets[1].data = [data.cairo.supply, data.alex.supply, data.aswan.supply, data.redsea.supply];
    demandSupplyChart.update('none'); // skip animation for slider smoothness, use 'active' for smooth
  }

  /* ---------- Node / Visualizer State ---------- */
  function getState(gov) {
    const net = gov.supply - gov.demand;
    if (net > 300) return 'surplus';
    if (net < -200) return 'deficit';
    return 'balanced';
  }

  function updateNodes(data) {
    const govs = ['cairo', 'alex', 'aswan', 'redsea'];
    const stateLabels = { surplus: 'Surplus', deficit: 'Deficit', balanced: 'Balanced' };

    govs.forEach(id => {
      const node = document.getElementById('node-' + id);
      const tag = document.getElementById('tag-' + id);
      const power = document.getElementById('power-' + id);
      if (!node || !tag || !power) return;

      const govData = data[id];
      const state = getState(govData);

      node.className = 'gov-node state-' + state;
      tag.className = 'node-tag ' + state;
      tag.textContent = stateLabels[state];
      power.textContent = govData.demand.toLocaleString() + ' MW';
    });
  }

  /* ---------- SVG Flow Lines & Animated Particles ---------- */
  // Node center positions in SVG viewBox (800x400)
  const nodePositions = {
    cairo:  { x: 260, y: 110 },
    alex:   { x: 520, y: 80 },
    aswan:  { x: 210, y: 330 },
    redsea: { x: 600, y: 320 },
    ai:     { x: 400, y: 200 }
  };

  let flowAnimationId = null;
  let flowParticles = [];

  function buildFlowLines(data) {
    const linesGroup = document.getElementById('connection-lines');
    const particlesGroup = document.getElementById('flow-particles');
    if (!linesGroup || !particlesGroup) return;

    linesGroup.innerHTML = '';
    particlesGroup.innerHTML = '';
    flowParticles = [];

    const govs = ['cairo', 'alex', 'aswan', 'redsea'];
    const surplusGovs = govs.filter(g => getState(data[g]) === 'surplus');
    const deficitGovs = govs.filter(g => getState(data[g]) === 'deficit');

    let routeCount = 0;

    // Always draw base connection lines (dim)
    govs.forEach(g => {
      const from = nodePositions[g];
      const to = nodePositions.ai;
      const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      line.setAttribute('x1', from.x);
      line.setAttribute('y1', from.y);
      line.setAttribute('x2', to.x);
      line.setAttribute('y2', to.y);
      line.setAttribute('stroke', 'rgba(16, 185, 129, 0.08)');
      line.setAttribute('stroke-width', '1.5');
      line.setAttribute('stroke-dasharray', '6 4');
      linesGroup.appendChild(line);
    });

    // Draw active energy transfer routes: surplus → AI → deficit
    surplusGovs.forEach(src => {
      deficitGovs.forEach(dst => {
        routeCount++;

        // Line from surplus to AI hub
        const line1 = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        line1.setAttribute('x1', nodePositions[src].x);
        line1.setAttribute('y1', nodePositions[src].y);
        line1.setAttribute('x2', nodePositions.ai.x);
        line1.setAttribute('y2', nodePositions.ai.y);
        line1.setAttribute('stroke', '#00ff88');
        line1.setAttribute('stroke-width', '2.5');
        line1.setAttribute('stroke-opacity', '0.6');
        line1.setAttribute('stroke-dasharray', '8 4');
        line1.style.animation = 'dash-flow 0.8s linear infinite';
        line1.setAttribute('filter', 'url(#glow-filter)');
        linesGroup.appendChild(line1);

        // Line from AI hub to deficit
        const line2 = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        line2.setAttribute('x1', nodePositions.ai.x);
        line2.setAttribute('y1', nodePositions.ai.y);
        line2.setAttribute('x2', nodePositions[dst].x);
        line2.setAttribute('y2', nodePositions[dst].y);
        line2.setAttribute('stroke', '#f97316');
        line2.setAttribute('stroke-width', '2.5');
        line2.setAttribute('stroke-opacity', '0.6');
        line2.setAttribute('stroke-dasharray', '8 4');
        line2.style.animation = 'dash-flow 0.8s linear infinite';
        line2.setAttribute('filter', 'url(#glow-filter)');
        linesGroup.appendChild(line2);

        // Animated particles: surplus → AI
        for (let i = 0; i < 3; i++) {
          flowParticles.push({
            from: nodePositions[src],
            to: nodePositions.ai,
            color: '#00ff88',
            t: i * 0.33,
            speed: 0.008 + Math.random() * 0.004
          });
        }

        // Animated particles: AI → deficit
        for (let i = 0; i < 3; i++) {
          flowParticles.push({
            from: nodePositions.ai,
            to: nodePositions[dst],
            color: '#f97316',
            t: i * 0.33,
            speed: 0.008 + Math.random() * 0.004
          });
        }
      });
    });

    // Update AI status text
    const aiText = document.querySelector('.ai-text');
    const aiDot = document.querySelector('.ai-dot');
    if (aiText && aiDot) {
      if (routeCount > 0) {
        aiText.textContent = 'AI Smart Routing Active';
        aiDot.style.background = '#00ff88';
        aiDot.style.boxShadow = '0 0 8px #00ff88';
      } else {
        aiText.textContent = 'Grid Balanced — Standby';
        aiDot.style.background = '#34d399';
        aiDot.style.boxShadow = '0 0 8px #34d399';
      }
    }

    return routeCount;
  }

  function animateParticles() {
    const particlesGroup = document.getElementById('flow-particles');
    if (!particlesGroup) return;

    particlesGroup.innerHTML = '';

    flowParticles.forEach(p => {
      p.t += p.speed;
      if (p.t > 1) p.t -= 1;

      const x = p.from.x + (p.to.x - p.from.x) * p.t;
      const y = p.from.y + (p.to.y - p.from.y) * p.t;

      const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      circle.setAttribute('cx', x);
      circle.setAttribute('cy', y);
      circle.setAttribute('r', '4');
      circle.setAttribute('fill', p.color);
      circle.setAttribute('filter', 'url(#glow-filter)');
      circle.setAttribute('opacity', String(0.5 + 0.5 * Math.sin(p.t * Math.PI)));
      particlesGroup.appendChild(circle);
    });

    flowAnimationId = requestAnimationFrame(animateParticles);
  }

  /* ---------- Metrics Update ---------- */
  function updateMetrics(data, routeCount) {
    const totalDemand = data.cairo.demand + data.alex.demand + data.aswan.demand + data.redsea.demand;
    const totalSupply = data.cairo.supply + data.alex.supply + data.aswan.supply + data.redsea.supply;
    const efficiency = Math.min(99.9, 95 + (totalSupply / totalDemand) * 3).toFixed(1);
    const savings = (totalSupply * 0.00032).toFixed(1);

    const effEl = document.getElementById('val-efficiency');
    const routeEl = document.getElementById('val-routing');
    const savingsEl = document.getElementById('val-savings');

    if (effEl) effEl.textContent = efficiency + '%';
    if (routeEl) routeEl.textContent = routeCount;
    if (savingsEl) savingsEl.textContent = '$' + savings + 'M';

    // Update efficiency status
    const effCard = document.getElementById('metric-efficiency');
    if (effCard) {
      const status = effCard.querySelector('.metric-status');
      if (status) {
        if (parseFloat(efficiency) >= 98) {
          status.textContent = 'Optimal';
          status.className = 'metric-status metric-status-ok';
        } else if (parseFloat(efficiency) >= 95) {
          status.textContent = 'Good';
          status.className = 'metric-status metric-status-ai';
        } else {
          status.textContent = 'Warning';
          status.className = 'metric-status metric-status-warn';
        }
      }
    }
  }

  /* ---------- Time Display ---------- */
  function updateTimeDisplay(minutes) {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    const h12 = hours % 12 === 0 ? 12 : hours % 12;
    const period = hours < 12 ? 'AM' : 'PM';
    const timeStr = String(h12).padStart(2, '0') + ':' + String(mins).padStart(2, '0');

    const valEl = document.getElementById('time-value');
    const periodEl = document.getElementById('time-period');
    if (valEl) valEl.textContent = timeStr;
    if (periodEl) periodEl.textContent = period;
  }

  /* ---------- Master Update ---------- */
  function updateDashboard(minutes) {
    const hour = minutes / 60; // fractional hour for smooth interpolation
    const data = getGovernorateData(hour);

    updateTimeDisplay(minutes);
    updateNodes(data);
    const routeCount = buildFlowLines(data);
    updateChart(data);
    updateMetrics(data, routeCount);
  }

  /* ---------- Initialize ---------- */
  initChart();

  // Set initial state
  updateDashboard(720); // noon

  // Start particle animation loop
  animateParticles();

  // Slider event
  slider.addEventListener('input', (e) => {
    updateDashboard(parseInt(e.target.value, 10));
  });

  // Auto-play animation (optional — advances time slowly)
  let autoPlay = false;
  let autoInterval = null;

  function startAutoPlay() {
    autoPlay = true;
    autoInterval = setInterval(() => {
      let val = parseInt(slider.value, 10) + 1;
      if (val > 1439) val = 0;
      slider.value = val;
      updateDashboard(val);
    }, 100);
  }

  function stopAutoPlay() {
    autoPlay = false;
    if (autoInterval) clearInterval(autoInterval);
  }

  // Stop autoplay when user interacts with slider
  slider.addEventListener('mousedown', stopAutoPlay);
  slider.addEventListener('touchstart', stopAutoPlay);

  // Start autoplay when dashboard scrolls into view
  const dashboardSection = document.getElementById('dashboard');
  if (dashboardSection) {
    const autoObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !autoPlay) {
          startAutoPlay();
        } else if (!entry.isIntersecting && autoPlay) {
          stopAutoPlay();
        }
      });
    }, { threshold: 0.3 });
    autoObserver.observe(dashboardSection);
  }
}
