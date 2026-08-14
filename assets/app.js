(() => {
  // Load the V3 thesis/profile stylesheet. This keeps the original stylesheet intact
  // while enabling the newly added thesis section and local portrait styling.
  if (!document.querySelector('link[href="assets/thesis-v3.css"]')) {
    const extraStyles = document.createElement('link');
    extraStyles.rel = 'stylesheet';
    extraStyles.href = 'assets/thesis-v3.css';
    document.head.appendChild(extraStyles);
  }

  const root = document.documentElement;
  const themeToggle = document.getElementById('themeToggle');
  const menuToggle = document.getElementById('menuToggle');
  const mobileNav = document.getElementById('mobileNav');
  const toast = document.getElementById('toast');
  const copyBibtex = document.getElementById('copyBibtex');

  // Theme: respect saved preference; otherwise use system preference.
  const storedTheme = localStorage.getItem('syed-mahim-theme');
  const systemDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  root.dataset.theme = storedTheme || (systemDark ? 'dark' : 'light');

  themeToggle?.addEventListener('click', () => {
    const next = root.dataset.theme === 'dark' ? 'light' : 'dark';
    root.dataset.theme = next;
    localStorage.setItem('syed-mahim-theme', next);
  });

  // Mobile navigation.
  menuToggle?.addEventListener('click', () => {
    const open = mobileNav.classList.toggle('open');
    menuToggle.setAttribute('aria-expanded', String(open));
    menuToggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  });
  mobileNav?.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
    mobileNav.classList.remove('open');
    menuToggle?.setAttribute('aria-expanded', 'false');
  }));

  // Entrance animation.
  const items = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -20px 0px' });
    items.forEach((item, i) => {
      item.style.transitionDelay = `${Math.min((i % 4) * 55, 165)}ms`;
      observer.observe(item);
    });
  } else {
    items.forEach(item => item.classList.add('visible'));
  }

  // Slight parallax on the research constellation for pointer devices.
  const orbit = document.querySelector('.research-orbit');
  const constellation = document.getElementById('constellation');
  if (orbit && constellation && window.matchMedia('(pointer:fine)').matches && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    orbit.addEventListener('pointermove', (e) => {
      const r = orbit.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - .5;
      const y = (e.clientY - r.top) / r.height - .5;
      constellation.style.transform = `translate(${x * 8}px, ${y * 8}px)`;
    });
    orbit.addEventListener('pointerleave', () => constellation.style.transform = 'translate(0,0)');
    constellation.style.transition = 'transform 180ms ease-out';
  }

  // Copy publication citation.
  const bibtex = `@inproceedings{almahim2024airquality,
  author    = {Al Mahim, Syed Amin and Monir, M. Fahad and Chowdhury, A. H. and Amin, M. Ashraful},
  title     = {Towards A Low-Cost Air Quality Monitoring System in Mega-Cities: Design and Deployment},
  booktitle = {2024 IEEE 9th International Conference for Convergence in Technology (I2CT)},
  year      = {2024},
  doi       = {10.1109/I2CT61223.2024.10544206}
}`;

  copyBibtex?.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(bibtex);
      toast.textContent = 'BibTeX copied';
    } catch {
      toast.textContent = 'Could not access clipboard';
    }
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 1800);
  });
})();