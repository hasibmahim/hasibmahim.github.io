(() => {
  'use strict';

  /* ----------------------------------------------------------
     Layered styles
  ---------------------------------------------------------- */
  [
    ['assets/thesis-v3.css', 'thesis-v3-stylesheet'],
    ['assets/design-v4.css', 'design-v4-stylesheet'],
    ['assets/polish-v5.css', 'polish-v5-stylesheet']
  ].forEach(([href, id]) => {
    if (!document.getElementById(id)) {
      const link = document.createElement('link');
      link.id = id;
      link.rel = 'stylesheet';
      link.href = href;
      document.head.appendChild(link);
    }
  });

  const root = document.documentElement;
  const header = document.querySelector('.site-header');
  const themeToggle = document.getElementById('themeToggle');
  const menuToggle = document.getElementById('menuToggle');
  const mobileNav = document.getElementById('mobileNav');
  const toast = document.getElementById('toast');
  const copyBibtex = document.getElementById('copyBibtex');

  /* ----------------------------------------------------------
     Theme
  ---------------------------------------------------------- */
  const storedTheme = localStorage.getItem('syed-mahim-theme');
  const systemDark = window.matchMedia?.('(prefers-color-scheme: dark)').matches;
  root.dataset.theme = storedTheme || (systemDark ? 'dark' : 'light');

  const updateThemeLabel = () => {
    if (!themeToggle) return;
    const isDark = root.dataset.theme === 'dark';
    const label = isDark ? 'Switch to light mode' : 'Switch to dark mode';
    themeToggle.dataset.themeLabel = label;
    themeToggle.setAttribute('aria-label', label);
    themeToggle.title = label;
  };

  updateThemeLabel();

  themeToggle?.addEventListener('click', () => {
    const next = root.dataset.theme === 'dark' ? 'light' : 'dark';
    root.dataset.theme = next;
    localStorage.setItem('syed-mahim-theme', next);
    updateThemeLabel();
  });

  /* ----------------------------------------------------------
     Mobile navigation
  ---------------------------------------------------------- */
  menuToggle?.addEventListener('click', () => {
    const open = mobileNav?.classList.toggle('open') ?? false;
    menuToggle.setAttribute('aria-expanded', String(open));
    menuToggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  });

  mobileNav?.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      mobileNav.classList.remove('open');
      menuToggle?.setAttribute('aria-expanded', 'false');
      menuToggle?.setAttribute('aria-label', 'Open menu');
    });
  });

  /* ----------------------------------------------------------
     Thesis metadata links
  ---------------------------------------------------------- */
  if (!document.getElementById('thesis-meta-link-styles')) {
    const style = document.createElement('style');
    style.id = 'thesis-meta-link-styles';
    style.textContent = `
      .thesis-meta a { color: inherit; text-decoration: none; }
      .thesis-meta a strong { transition: color .18s ease; }
      .thesis-meta a:hover strong,
      .thesis-meta a:focus-visible strong { color: var(--accent); }
      .thesis-meta a strong::after { content: ' ↗'; color: var(--accent); font-size: .78em; }
    `;
    document.head.appendChild(style);
  }

  const thesisLinks = {
    Institution: 'https://www.oulu.fi/fi',
    Dataset: 'https://gitlab.com/felix134/connected-recipe-data-set'
  };

  document.querySelectorAll('.thesis-meta > div').forEach((card) => {
    const label = card.querySelector('span')?.textContent.trim();
    const strong = card.querySelector('strong');
    if (!label || !strong || strong.dataset.linksApplied === 'true') return;

    if (thesisLinks[label]) {
      const link = document.createElement('a');
      link.href = thesisLinks[label];
      link.target = '_blank';
      link.rel = 'noopener';
      strong.replaceWith(link);
      link.appendChild(strong);
      strong.dataset.linksApplied = 'true';
      return;
    }

    if (label === 'Supervisors') {
      strong.textContent = '';
      [
        ['Prof. Mourad Oussalah', 'https://www.researchgate.net/profile/Mourad-Oussalah-2'],
        ['Dr. Mehrdad Rostami', 'https://www.researchgate.net/profile/Mehrdad-Rostami-4']
      ].forEach(([name, href], index) => {
        const link = document.createElement('a');
        link.href = href;
        link.target = '_blank';
        link.rel = 'noopener';
        const nameStrong = document.createElement('strong');
        nameStrong.textContent = name;
        link.appendChild(nameStrong);
        strong.appendChild(link);
        if (index === 0) strong.appendChild(document.createTextNode(' · '));
      });
      strong.style.display = 'block';
      strong.dataset.linksApplied = 'true';
    }
  });

  /* ----------------------------------------------------------
     SSL-DF research outline
  ---------------------------------------------------------- */
  if (!document.getElementById('ssl-df-project-styles')) {
    const style = document.createElement('style');
    style.id = 'ssl-df-project-styles';
    style.textContent = `
      .ssl-df-outline { margin: 28px 0 0; padding-top: 24px; border-top: 1px solid var(--line); }
      .ssl-df-outline-frame { position: relative; width: 100%; height: clamp(500px, 62vw, 760px); overflow: hidden; border: 1px solid var(--line); border-radius: 18px; background: #fff; box-shadow: 0 14px 34px rgba(9,24,48,.07); }
      .ssl-df-outline-frame iframe { display: block; width: 100%; height: 100%; border: 0; background: #fff; }
      .ssl-df-outline-caption { display: grid; grid-template-columns: minmax(0,1fr) auto; gap: 24px; align-items: end; padding: 15px 2px 0; }
      .ssl-df-outline-label { display: block; margin-bottom: 5px; color: var(--accent); font-size: 9px; font-weight: 830; letter-spacing: .13em; text-transform: uppercase; }
      .ssl-df-outline-caption strong { display: block; color: var(--ink); font-size: 13px; letter-spacing: -.01em; }
      .ssl-df-outline-caption p { max-width: 760px; margin: 5px 0 0; color: var(--muted); font-size: 11px; line-height: 1.55; }
      .ssl-df-outline-caption a { white-space: nowrap; color: var(--accent); font-size: 11px; font-weight: 760; }
      .ssl-df-outline-caption a:hover, .ssl-df-outline-caption a:focus-visible { text-decoration: underline; text-underline-offset: 3px; }
      @media (max-width: 780px) { .ssl-df-outline-frame { height: 520px; border-radius: 14px; } .ssl-df-outline-caption { grid-template-columns: 1fr; gap: 10px; align-items: start; } }
      @media (max-width: 520px) { .ssl-df-outline-frame { height: 430px; } }
    `;
    document.head.appendChild(style);
  }

  const deepfakeHeading = [...document.querySelectorAll('.project-card h3')]
    .find((heading) => heading.textContent.trim() === 'DeepFake Detection with Self-Supervised Learning');
  const deepfakeCard = deepfakeHeading?.closest('.project-card');

  if (deepfakeCard && !deepfakeCard.querySelector('.ssl-df-outline')) {
    const description = deepfakeHeading.parentElement?.querySelector('p');
    if (description) {
      description.textContent = 'Worked on video deepfake detection using self-supervised representation learning, with an emphasis on generalization and robustness. The research outline explores inconsistencies between left- and right-eye dynamics as a signal for deepfake detection.';
    }

    const tags = deepfakeHeading.parentElement?.querySelector('.tag-row');
    if (tags) {
      tags.innerHTML = '<span>PyTorch</span><span>Self-supervised learning</span><span>Deepfake</span><span>Eye dynamics</span>';
    }

    const figure = document.createElement('figure');
    figure.className = 'ssl-df-outline';
    figure.innerHTML = `
      <div class="ssl-df-outline-frame">
        <iframe
          title="SSL-DF paper outline diagram"
          src="https://embed.figma.com/design/DWyvlF80SF91Uu5i8SEqZ8/SSL-DF?node-id=308-2&embed-host=share"
          loading="lazy"
          allowfullscreen>
        </iframe>
      </div>
      <figcaption class="ssl-df-outline-caption">
        <div>
          <span class="ssl-df-outline-label">Research outline · 2023</span>
          <strong>Self-supervised deepfake detection from left/right-eye dynamics</strong>
          <p>The outline proposes two stages: pretraining on real videos so paired eye sequences learn related representations, followed by fine-tuning on real and deepfake datasets for detection.</p>
        </div>
        <a href="https://www.figma.com/design/DWyvlF80SF91Uu5i8SEqZ8/SSL-DF?node-id=308-2" target="_blank" rel="noopener">Open full diagram in Figma ↗</a>
      </figcaption>
    `;
    deepfakeCard.appendChild(figure);
  }

  /* ----------------------------------------------------------
     DTW rehabilitation paper visual
  ---------------------------------------------------------- */
  const dtwHeading = [...document.querySelectorAll('.project-card h3')]
    .find((heading) => heading.textContent.trim() === 'Physical Disability Rehabilitation Evaluation using DTW' || heading.textContent.trim() === 'Performance Evaluation for Physical Disability Rehabilitation Process Using DTW');
  const dtwCard = dtwHeading?.closest('.project-card');

  if (dtwHeading) {
    dtwHeading.textContent = 'Performance Evaluation for Physical Disability Rehabilitation Process Using DTW';
  }

  if (dtwCard && !dtwCard.querySelector('.dtw-paper-visual')) {
    const description = dtwHeading.parentElement?.querySelector('p');
    if (description) {
      description.textContent = 'Used Kinect V2 motion sensing and multidimensional Dynamic Time Warping to compare patient exercise sequences with physiotherapist reference movements, producing similarity scores that can support rehabilitation feedback and performance assessment.';
    }

    const tags = dtwHeading.parentElement?.querySelector('.tag-row');
    if (tags) {
      tags.innerHTML = '<span>Dynamic Time Warping</span><span>Kinect V2</span><span>3D joint data</span><span>Rehabilitation</span>';
    }

    const visual = document.createElement('div');
    visual.className = 'dtw-paper-visual';
    visual.innerHTML = `
      <div class="dtw-visual-copy">
        <span class="dtw-visual-label">Research paper · Rehabilitation analytics</span>
        <strong>Motion becomes a time series — DTW aligns the performance with the reference.</strong>
        <p>The study uses Kinect V2 joint trajectories to compare exercises that may be performed at different speeds, which is exactly where temporal alignment matters.</p>
        <a class="dtw-paper-link" href="https://drive.google.com/file/d/1rttfWGXSKGSkScGVgmhZBaLeX-CJCNPP/view?usp=sharing" target="_blank" rel="noopener">Read the paper ↗</a>
      </div>
      <svg class="dtw-motion-mark" viewBox="0 0 520 280" role="img" aria-label="Stylized rehabilitation motion and dynamic time warping visual">
        <g opacity=".55">
          <path class="dtw-grid" d="M12 54H508M12 108H508M12 162H508M12 216H508" />
          <path class="dtw-grid" d="M82 18V260M166 18V260M250 18V260M334 18V260M418 18V260" />
        </g>
        <g transform="translate(57 28)">
          <circle class="dtw-person" cx="67" cy="27" r="19" />
          <path class="dtw-person" d="M67 48V112M67 69L27 100M67 70L108 47M67 112L40 178M67 112L88 179" />
          <circle cx="67" cy="69" r="5" fill="#2563eb"/>
          <circle cx="27" cy="100" r="5" fill="#2563eb"/>
          <circle cx="108" cy="47" r="5" fill="#0f9f98"/>
          <circle cx="40" cy="178" r="5" fill="#2563eb"/>
          <circle cx="88" cy="179" r="5" fill="#0f9f98"/>
        </g>
        <g transform="translate(216 42)">
          <path class="dtw-wave-c" d="M0 120C35 75 54 167 91 112S153 70 190 122S242 164 284 102"/>
          <path class="dtw-wave-a" d="M0 104C34 54 57 151 92 92S153 52 190 106S243 148 284 83"/>
          <path class="dtw-wave-b" d="M0 140C31 101 57 179 94 127S154 90 191 140S243 179 284 121"/>
          <path d="M19 157C61 174 100 172 142 154S229 125 267 139" fill="none" stroke="currentColor" stroke-width="1.4" stroke-dasharray="4 7" opacity=".34"/>
          <text x="2" y="202" fill="currentColor" opacity=".5" font-size="11" font-family="Segoe UI, sans-serif">reference</text>
          <text x="217" y="202" fill="currentColor" opacity=".5" font-size="11" font-family="Segoe UI, sans-serif">aligned motion</text>
        </g>
      </svg>
    `;
    dtwCard.appendChild(visual);
  }

  /* ----------------------------------------------------------
     Entrance animations
  ---------------------------------------------------------- */
  const revealItems = document.querySelectorAll('.reveal');
  const reduceMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

  if ('IntersectionObserver' in window && !reduceMotion) {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -20px 0px' });

    revealItems.forEach((item, index) => {
      item.style.transitionDelay = `${Math.min((index % 4) * 55, 165)}ms`;
      revealObserver.observe(item);
    });
  } else {
    revealItems.forEach((item) => item.classList.add('visible'));
  }

  /* ----------------------------------------------------------
     Constellation parallax
  ---------------------------------------------------------- */
  const orbit = document.querySelector('.research-orbit');
  const constellation = document.getElementById('constellation');
  const finePointer = window.matchMedia?.('(pointer:fine)').matches;

  if (orbit && constellation && finePointer && !reduceMotion) {
    orbit.addEventListener('pointermove', (event) => {
      const rect = orbit.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - .5;
      const y = (event.clientY - rect.top) / rect.height - .5;
      constellation.style.transform = `translate(${x * 7}px, ${y * 7}px)`;
    });
    orbit.addEventListener('pointerleave', () => {
      constellation.style.transform = 'translate(0,0)';
    });
    constellation.style.transition = 'transform 180ms ease-out';
  }

  /* ----------------------------------------------------------
     Header state, progress, active section
  ---------------------------------------------------------- */
  const navLinks = [...document.querySelectorAll('.desktop-nav a[href^="#"], .mobile-nav a[href^="#"]')];
  const sections = [...document.querySelectorAll('main section[id]')];

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
      const hash = `#${visible.target.id}`;

      navLinks.forEach((link) => {
        const active = link.getAttribute('href') === hash;
        link.classList.toggle('active', active);
        if (active) link.setAttribute('aria-current', 'location');
        else link.removeAttribute('aria-current');
      });
    }, {
      rootMargin: '-27% 0px -58% 0px',
      threshold: [0, .12, .3, .55]
    });

    sections.forEach((section) => activeObserver.observe(section));
  }

  /* ----------------------------------------------------------
     Publication citation
  ---------------------------------------------------------- */
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
      if (toast) toast.textContent = 'BibTeX copied';
    } catch {
      if (toast) toast.textContent = 'Could not access clipboard';
    }
    toast?.classList.add('show');
    setTimeout(() => toast?.classList.remove('show'), 1800);
  });

  /* ----------------------------------------------------------
     Footer + external-link accessibility
  ---------------------------------------------------------- */
  const footerIdentity = document.querySelector('.site-footer .footer-grid > div:first-child');
  if (footerIdentity && !footerIdentity.querySelector('.footer-copyright')) {
    const copyright = document.createElement('small');
    copyright.className = 'footer-copyright';
    copyright.textContent = `© ${new Date().getFullYear()} Syed Amin Al Mahim`;
    footerIdentity.appendChild(copyright);
  }

  document.querySelectorAll('a[target="_blank"]').forEach((link) => {
    if (!link.getAttribute('aria-label')) {
      const text = link.textContent.trim();
      if (text) link.setAttribute('aria-label', `${text} (opens in a new tab)`);
    }
  });
})();