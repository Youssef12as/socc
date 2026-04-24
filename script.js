/* Palm of Renewables - SDG 7 Script */
document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initMobileMenu();
  initScrollAnimations();
  initParticles();
  initSimulators();
  initCrisisCounters();
});

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

function initMobileMenu() {
  const btn = document.getElementById('mobile-menu-btn');
  const links = document.getElementById('nav-links');
  if (!btn || !links) return;
  btn.addEventListener('click', () => {
    btn.classList.toggle('active');
    links.classList.toggle('open');
  });
  links.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      btn.classList.remove('active');
      links.classList.remove('open');
    });
  });
}

function initScrollAnimations() {
  const elements = document.querySelectorAll('.animate-on-scroll');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
  elements.forEach(el => observer.observe(el));
}

function initParticles() {
  const container = document.getElementById('hero-particles');
  if (!container) return;
  for (let i = 0; i < 30; i++) {
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

  function updateWindParticles(speed) {
    if (!windParticles) return;
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

  function updateWaterDrops(flow) {
    if (!waterDrops) return;
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
    const wPower = Math.round(windVal * 5);
    const sPower = Math.round(solarVal * 3.5);
    const hPower = Math.round(hydroVal * 8);
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
    if (blades && windVal > 0) {
      windAngle += windVal * 0.08;
      blades.style.transform = 'rotate(' + windAngle + 'deg)';
    }
    if (hydroBlades && hydroVal > 0) {
      hydroAngle += hydroVal * 0.06;
      hydroBlades.style.transform = 'rotate(' + hydroAngle + 'deg)';
    }
    if (sunCircle) {
      sunCircle.setAttribute('opacity', 0.3 + (solarVal / 100) * 0.7);
      sunCircle.setAttribute('r', 20 + (solarVal / 100) * 12);
    }
    if (sunRays) sunRays.style.opacity = (solarVal / 100);
    if (solarPanel) solarPanel.setAttribute('opacity', 0.4 + (solarVal / 100) * 0.6);
    requestAnimationFrame(animate);
  }

  windSlider.addEventListener('input', () => { windVal = parseInt(windSlider.value); updateWindParticles(windVal); updateOutputs(); });
  solarSlider.addEventListener('input', () => { solarVal = parseInt(solarSlider.value); updateOutputs(); });
  hydroSlider.addEventListener('input', () => { hydroVal = parseInt(hydroSlider.value); updateWaterDrops(hydroVal); updateOutputs(); });
  animate();
}

function initCrisisCounters() {
  const allCounters = document.querySelectorAll('.crisis-number, .compare-value');
  const allBars = document.querySelectorAll('.crisis-bar-fill');
  let animated = new Set();

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !animated.has(entry.target)) {
        animated.add(entry.target);
        const el = entry.target;
        if (el.classList.contains('crisis-bar-fill')) {
          const w = el.dataset.width;
          setTimeout(() => { el.style.width = w + '%'; }, 200);
        } else {
          const target = parseFloat(el.dataset.target);
          const suffix = el.dataset.suffix || '';
          const decimals = parseInt(el.dataset.decimals || '0');
          const duration = 2000;
          const startTime = performance.now();
          function update(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 4);
            const current = eased * target;
            el.textContent = (decimals > 0 ? current.toFixed(decimals) : Math.round(current)) + suffix;
            if (progress < 1) requestAnimationFrame(update);
          }
          requestAnimationFrame(update);
        }
      }
    });
  }, { threshold: 0.3 });

  allCounters.forEach(el => observer.observe(el));
  allBars.forEach(el => observer.observe(el));
}