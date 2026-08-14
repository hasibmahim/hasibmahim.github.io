# Syed Amin Al Mahim — Academic Website

A lightweight, responsive personal academic website designed for research visibility, PhD applications, publications, projects, and collaboration.

## Why this design

- **English-first**: the best default for an international academic audience, supervisors, research groups, and PhD committees.
- **Research identity before generic skills**: the homepage leads with trustworthy ML, sensing, multimodal perception, rehabilitation, and research software.
- **Academic, not “startup portfolio”**: publication, research trajectory, teaching/research history, and CV are prominent.
- **Privacy-conscious**: the public site does **not** expose date of birth, home address, or phone number.
- **Fast and portable**: plain HTML/CSS/JavaScript, no framework, no build step.
- **Accessible**: semantic markup, keyboard navigation, reduced-motion support, responsive layouts, and high-contrast dark/light modes.

## Files

- `index.html` — the complete website
- `assets/styles.css` — visual system and responsive layout
- `assets/app.js` — theme toggle, mobile navigation, reveal effects, BibTeX copy
- `assets/favicon.svg` — site icon
- `assets/Syed_Amin_Al_Mahim_CV.pdf` — downloadable current CV
- `.github/workflows/pages.yml` — automatic GitHub Pages deployment
- `.nojekyll` — disables Jekyll processing
- `404.html` — fallback page

## Recommended hosting: GitHub Pages

Your GitHub username is `hasibmahim`, so the cleanest free academic URL is:

`https://hasibmahim.github.io/`

### Deploy

1. On GitHub, create a **public repository** named exactly:
   `hasibmahim.github.io`
2. Upload the **contents** of this folder to the repository root.
3. Commit to the `main` branch.
4. Open **Settings → Pages**.
5. Under **Build and deployment**, choose **GitHub Actions**.
6. The included workflow will deploy the site automatically.
7. After the workflow finishes, visit:
   `https://hasibmahim.github.io/`

Every future push to `main` redeploys the site automatically.

## Optional custom domain

Later, you can connect a personal domain such as:

- `syedmahim.com`
- `syedmahim.dev`
- `syedmahim.ai`
- `syedaminmahim.com`

For an academic identity, a simple `.com`, `.dev`, or university-linked page is usually more timeless than an overly trendy domain.

## What to update next

The strongest future additions would be:

1. A professional headshot.
2. A dedicated page for your MSc thesis / current research.
3. Google Scholar and ORCID links once available.
4. Preprints, posters, datasets, and code artifacts.
5. Short research notes or blog posts (2–4 per year is enough).
6. A one-page research statement for PhD applications.

## Local preview

You can double-click `index.html`, or run:

```bash
python -m http.server 8000
```

Then open `http://localhost:8000`.
