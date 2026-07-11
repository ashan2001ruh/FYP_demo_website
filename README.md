# Zero Trust Security Framework for O-RAN Shared Data Layer (SDL) — Demonstration Website

Multi-page React demonstration website for the EE4801 Final Year Project
(2025/2026), University of Ruhuna, Faculty of Engineering, Department of
Electrical and Information Engineering.

**Team:** Ashan Kasthuriarachchi · Pasindu Hathurusinghe · Asitha Kodithuwakku · Shehana Hewage

Documentation repository:
<https://github.com/pasindu-janith/o-ran-sdl-security-documentation>

## Pages

| Route            | Content                                                        |
| ---------------- | -------------------------------------------------------------- |
| `#/`             | Overview, animated SDL pipeline, technology stack               |
| `#/architecture` | Complete testbed: Open5GS core · srsRAN · OSC Near-RT RIC       |
| `#/framework-1`  | Localized PEP — Keycloak/JWT enforcement in every xApp pod      |
| `#/framework-2`  | Centralized PEP — single enforcement surface at the DBaaS       |
| `#/framework-3`  | DID/VC Zero Trust — verifiable credentials on Hyperledger Indy  |
| `#/comparison`   | Neutral side-by-side comparison across seven criteria           |
| `#/team`         | The four contributors and project details                       |

## Stack

React 18 · Vite 5 · React Router 6 (HashRouter, GitHub-Pages-safe) ·
Framer Motion 11 · inline SVG diagrams and technology logos (no image assets).
Light theme; all animations respect `prefers-reduced-motion`.

## Develop

```bash
npm install
npm run dev
```

## Deploy to GitHub Pages

```bash
npm run deploy   # builds and pushes dist/ to the gh-pages branch
```

Then set the repository's **Settings → Pages** source to the `gh-pages` branch.
`vite.config.js` uses `base: './'`, so the site works at any repo path.
