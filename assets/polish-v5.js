(() => {
  const root = document.documentElement;
  const header = document.querySelector('.site-header');
  const themeToggle = document.getElementById('themeToggle');
  const desktopLinks = [...document.querySelectorAll('.desktop-nav a[href^="#"]')];
  const mobileLinks = [...document.querySelectorAll('.mobile-nav a[href^="#"]')];
  const navLinks = [...desktopLinks, ...mobileLinks];
  const sections = [...document.querySelectorAll('main section[id]')];

  const updateThemeLabel = () => {
    if (!themeToggle) return;
    const isDark = root.dataset.theme === 'dark';
    const label = isDark ? 'Switch to light mode' : 'Switch to dark mode';
    themeToggle.dataset.themeLabel = label;
    themeToggle.setAttribute('aria-label', label);
    themeToggle.title = label;
  };

  updateThemeLabel();
  themeToggle?.addEventListener('click', () => requestAnimationFrame(updateThemeLabel));

  const updateScrollUI = () => {
    const y = window.scrollY || document.documentElement.scrollTop;
    header?.classList.toggle('is-scrolled', y > 10);

    const max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
    const progress = Math.min(1, Math.max(0, y / max));
    header?.style.setProperty('--page-progress', progress.toFixed(4));
  };

  updateScrollUI();
  window.addEventListener('scroll', updateScrollUI, { passive: true });
  window.addEventListener('resize', updateScrollUI, { passive: true });

  if ('IntersectionObserver' in window && sections.length) {
    const activeObserver = new IntersectionObserver((entries) => {
      const visible = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

      if (!visible?.target?.id) return;
      const targetHash = `#${visible.target.id}`;

      navLinks.forEach((link) => {
        const active = link.getAttribute('href') === targetHash;
        link.classList.toggle('active', active);
        if (active) link.setAttribute('aria-current', 'location');
        else link.removeAttribute('aria-current');
      });
    }, {
      rootMargin: '-28% 0px -58% 0px',
      threshold: [0, .12, .3, .55]
    });

    sections.forEach((section) => activeObserver.observe(section));
  }

  // Small academic-site convention: add a quiet copyright line without cluttering the HTML.
  const footerIdentity = document.querySelector('.site-footer .footer-grid > div:first-child');
  if (footerIdentity && !footerIdentity.querySelector('.footer-copyright')) {
    const copyright = document.createElement('small');
    copyright.className = 'footer-copyright';
    copyright.textContent = `© ${new Date().getFullYear()} Syed Amin Al Mahim`;
    footerIdentity.appendChild(copyright);
  }

  // Make external research links explicit for assistive technology.
  document.querySelectorAll('a[target="_blank"]').forEach((link) => {
    if (!link.getAttribute('aria-label')) {
      const text = link.textContent.trim();
      if (text) link.setAttribute('aria-label', `${text} (opens in a new tab)`);
    }
  });
})();