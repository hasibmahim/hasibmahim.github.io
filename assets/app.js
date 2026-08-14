(() => {
  'use strict';

  /* ----------------------------------------------------------
     Layered styles
  ---------------------------------------------------------- */
  [
    ['assets/thesis-v3.css', 'thesis-v3-stylesheet'],
    ['assets/design-v4.css', 'design-v4-stylesheet'],
    ['assets/polish-v5.css', 'polish-v5-stylesheet'],
    ['assets/polish-v6.css', 'polish-v6-stylesheet']
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
  const reduceMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

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
     DTW rehabilitation paper — research-figure treatment
  ---------------------------------------------------------- */
  const dtwHeading = [...document.querySelectorAll('.project-card h3')]
    .find((heading) => {
      const text = heading.textContent.trim();
      return text === 'Physical Disability Rehabilitation Evaluation using DTW' ||
             text === 'Performance Evaluation for Physical Disability Rehabilitation Process Using DTW';
    });
  const dtwCard = dtwHeading?.closest('.project-card');

  if (dtwHeading) {
    dtwHeading.textContent = 'Performance Evaluation for Physical Disability Rehabilitation Process Using DTW';
  }

  if (dtwCard) {
    dtwCard.querySelector('.dtw-paper-visual')?.remove();

    const description = dtwHeading?.parentElement?.querySelector('p');
    if (description) {
      description.textContent = 'Used Kinect V2 motion sensing and multidimensional Dynamic Time Warping to compare patient exercise sequences with physiotherapist reference movements, producing similarity scores for rehabilitation performance assessment.';
    }

    const tags = dtwHeading?.parentElement?.querySelector('.tag-row');
    if (tags) {
      tags.innerHTML = '<span>Dynamic Time Warping</span><span>Kinect V2</span><span>3D joint data</span><span>Rehabilitation</span>';
    }

    if (!dtwCard.querySelector('.dtw-paper-artifact')) {
      const artifact = document.createElement('div');
      artifact.className = 'dtw-paper-artifact';
      artifact.innerHTML = `
        <div class="dtw-joint-figure" aria-label="Stylized Kinect body-joint map inspired by the rehabilitation study">
          <svg viewBox="0 0 520 260" role="img" aria-label="Human body with Kinect-style tracked joints and numbered callouts">
            <text x="14" y="20" class="dtw-figure-label">KINECT V2 · BODY JOINT MAP</text>

            <!-- soft body silhouette -->
            <circle cx="262" cy="45" r="24" class="dtw-body-fill"/>
            <path d="M245 67 Q262 57 279 67 L292 130 Q296 157 287 190 L281 237 L263 237 L257 157 L252 237 L234 237 L230 188 Q221 157 232 129 Z" class="dtw-body-fill"/>
            <path d="M235 82 L201 113 L192 168" class="dtw-body-line"/>
            <path d="M287 82 L322 112 L331 168" class="dtw-body-line"/>

            <!-- tracked skeleton -->
            <path class="dtw-skeleton" d="M262 44 L262 68 L262 87 L262 111 L262 139 L240 139 L233 169 L238 221"/>
            <path class="dtw-skeleton" d="M262 139 L284 139 L291 169 L286 221"/>
            <path class="dtw-skeleton" d="M262 87 L229 91 L209 112 L202 153 L196 177"/>
            <path class="dtw-skeleton" d="M262 87 L295 91 L315 112 L323 153 L330 177"/>
            <path class="dtw-skeleton" d="M196 177 L188 186 L194 193 L201 184"/>
            <path class="dtw-skeleton" d="M330 177 L338 186 L332 193 L325 184"/>

            <!-- joints -->
            <g>
              <circle cx="262" cy="44" r="5.2" class="dtw-joint"/>
              <circle cx="262" cy="68" r="4.2" class="dtw-joint"/>
              <circle cx="262" cy="87" r="4.2" class="dtw-joint"/>
              <circle cx="262" cy="111" r="4.2" class="dtw-joint"/>
              <circle cx="262" cy="139" r="4.5" class="dtw-joint"/>
              <circle cx="229" cy="91" r="4.2" class="dtw-joint"/>
              <circle cx="209" cy="112" r="4.2" class="dtw-joint"/>
              <circle cx="202" cy="153" r="4.2" class="dtw-joint"/>
              <circle cx="196" cy="177" r="4.2" class="dtw-joint"/>
              <circle cx="295" cy="91" r="4.2" class="dtw-joint"/>
              <circle cx="315" cy="112" r="4.2" class="dtw-joint"/>
              <circle cx="323" cy="153" r="4.2" class="dtw-joint"/>
              <circle cx="330" cy="177" r="4.2" class="dtw-joint"/>
              <circle cx="240" cy="139" r="4.2" class="dtw-joint"/>
              <circle cx="233" cy="169" r="4.2" class="dtw-joint"/>
              <circle cx="238" cy="221" r="4.2" class="dtw-joint"/>
              <circle cx="284" cy="139" r="4.2" class="dtw-joint"/>
              <circle cx="291" cy="169" r="4.2" class="dtw-joint"/>
              <circle cx="286" cy="221" r="4.2" class="dtw-joint"/>
              <circle cx="188" cy="186" r="3.7" class="dtw-joint"/>
              <circle cx="194" cy="193" r="3.7" class="dtw-joint"/>
              <circle cx="201" cy="184" r="3.7" class="dtw-joint"/>
              <circle cx="338" cy="186" r="3.7" class="dtw-joint"/>
              <circle cx="332" cy="193" r="3.7" class="dtw-joint"/>
              <circle cx="325" cy="184" r="3.7" class="dtw-joint"/>
            </g>

            <!-- left callouts -->
            <path class="dtw-callout" d="M246 44 L214 28 L126 28"/><text x="109" y="32" class="dtw-number">3</text>
            <path class="dtw-callout" d="M253 68 L218 59 L112 59"/><text x="91" y="63" class="dtw-number">20</text>
            <path class="dtw-callout" d="M229 91 L191 91 L119 91"/><text x="102" y="95" class="dtw-number">8</text>
            <path class="dtw-callout" d="M202 153 L164 153 L86 153"/><text x="69" y="157" class="dtw-number">9</text>
            <path class="dtw-callout" d="M196 177 L158 177 L91 177"/><text x="66" y="181" class="dtw-number">10</text>
            <path class="dtw-callout" d="M188 186 L145 199 L67 199"/><text x="45" y="203" class="dtw-number">11</text>
            <path class="dtw-callout" d="M233 169 L183 222 L106 222"/><text x="86" y="226" class="dtw-number">17</text>

            <!-- right callouts -->
            <path class="dtw-callout" d="M271 68 L305 69 L396 69"/><text x="407" y="73" class="dtw-number">2</text>
            <path class="dtw-callout" d="M295 91 L337 91 L423 91"/><text x="434" y="95" class="dtw-number">4</text>
            <path class="dtw-callout" d="M315 112 L353 122 L435 122"/><text x="446" y="126" class="dtw-number">5</text>
            <path class="dtw-callout" d="M323 153 L365 153 L440 153"/><text x="451" y="157" class="dtw-number">6</text>
            <path class="dtw-callout" d="M338 186 L378 186 L455 186"/><text x="466" y="190" class="dtw-number">7</text>
            <path class="dtw-callout" d="M291 169 L340 216 L420 216"/><text x="431" y="220" class="dtw-number">13</text>
            <path class="dtw-callout" d="M286 221 L338 239 L405 239"/><text x="416" y="243" class="dtw-number">14</text>
          </svg>
        </div>
        <div class="dtw-artifact-copy">
          <span class="dtw-artifact-eyebrow">Research paper · Rehabilitation analytics</span>
          <h4>From tracked joints to a clinically useful similarity score.</h4>
          <p>Kinect V2 records body-joint trajectories as time series. Multidimensional DTW then aligns a patient's motion with the physiotherapist's reference even when the same exercise is performed at a different speed.</p>
          <div class="dtw-flow" aria-label="DTW research workflow">
            <span>25 joints</span><b>→</b><span>trajectory</span><b>→</b><span>DTW alignment</span><b>→</b><span>similarity score</span>
          </div>
          <a class="dtw-paper-link" href="https://drive.google.com/file/d/1rttfWGXSKGSkScGVgmhZBaLeX-CJCNPP/view?usp=sharing" target="_blank" rel="noopener">Read the paper ↗</a>
        </div>
      `;
      dtwCard.appendChild(artifact);
    }
  }

  /* ----------------------------------------------------------
     Entrance animations
  ---------------------------------------------------------- */
  const revealItems = document.querySelectorAll('.reveal');

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
     Back to top — force actual page-top behavior
  ---------------------------------------------------------- */
  document.querySelectorAll('a[href="#top"]').forEach((link) => {
    link.addEventListener('click', (event) => {
      event.preventDefault();
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: reduceMotion ? 'auto' : 'smooth'
      });
      if (history.replaceState) {
        history.replaceState(null, '', `${location.pathname}${location.search}`);
      }
    });
  });

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
     Footer cleanup + external-link accessibility
  ---------------------------------------------------------- */
  document.querySelector('.site-footer .footer-note')?.remove();

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