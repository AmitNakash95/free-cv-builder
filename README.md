# Free CV Builder

A free, open-source CV/resume builder that runs entirely in your browser. No sign-up, no server, no build step — your data never leaves your device.

## Features

- **5 templates** — Modern Sidebar, Minimal, Timeline, ATS Compact, and Creative. Switch anytime without losing your content.
- **Sidebar position** — move the sidebar left or right on the two-column templates.
- **Color matching** — 8 curated accent palettes plus a custom color picker; every template adapts to your chosen accent.
- **Dark / light mode** for comfortable editing (export always prints in light mode for ink- and ATS-friendliness).
- **Click-to-edit** every field directly on the page — no forms, no modals.
- **Flexible skills display** — show each skill as a progress bar, years of experience, or a compact tag, per section.
- **Quick-set contact icons** — pick Email, Phone, LinkedIn, GitHub, and more from a list; the matching icon is applied automatically.
- **Custom sections** — add Projects, Certifications, Links, or any custom section alongside the built-ins.
- **Drag-and-drop** section reordering.
- **Profile photo** upload, with a one-click toggle to leave it off the CV entirely.
- **Reliable autosave** to your browser's local storage — every entry persists correctly across reloads.
- **Backup / portability** — export your CV as a JSON file and import it back later or on another device.
- **Export to PDF or DOCX**, plus a built-in checklist of CV-writing and ATS tips.

## Quick Use

1. **Open the app**: visit the live version [here](https://amitnakash95.github.io/free-cv-builder/).
2. **Edit your CV**: click any text on the page to edit it in place.
3. **Customize**: open the floating panel (bottom-right) to switch templates, flip the sidebar side, pick a color, toggle dark mode, add sections, or upload/hide a photo.
4. **Export**: use "Download as PDF" or "Download as DOCX" in the panel, or `Ctrl+P` / `Cmd+P` and save as PDF.
5. Your content saves automatically in this browser. Use "Export JSON" in the panel to back it up or move it to another device.
6. Not sure what to write? Open **"Tips for a great CV"** in the panel for a short checklist on staying to one page and getting past ATS screening.

## For Developers

```bash
git clone https://github.com/AGitmit/free-cv-builder.git
```

Open `index.html` directly in a browser, or serve the folder with any static file server — there's no build step or dependencies.

```
index.html
css/
  base.css        — design tokens, layout skeleton, toolbar, print & responsive rules
  templates.css    — the 5 template skins, scoped by [data-template]
js/
  sample-data.js  — default/demo content
  app.js          — state, rendering, event wiring, storage, import/export
```

The whole app is data-driven: `js/app.js` keeps a single state object (your CV content + chosen template/color/mode) and renders the DOM from it, saving to `localStorage` on every change. Because content and presentation are separate, switching templates, colors, or themes never touches your data.

Static files only — deploy anywhere that serves HTML (GitHub Pages, Cloudflare Pages/Workers, Netlify, or just open `index.html` locally). The one exception is DOCX export, which loads the [`docx`](https://www.npmjs.com/package/docx) library from a CDN on demand — everything else, including PDF export, works fully offline.

## License

This template is open-source and free to use. You can modify and share it without restrictions. For more details, refer to the [LICENSE](LICENSE) file in the repository.

## Credit

Built and maintained by [Amit Nakash](https://nakash.tech) as a free tool for the community.
