# Zero Trust-Based IAM Framework for O-RAN Near-RT RIC — Project Website

Multi-page React website for the EE4801 Final Year Project (2025/2026),
University of Ruhuna, Faculty of Engineering, Department of Electrical and
Information Engineering.

**Team:** Ashan Kasthuriarachchi · Pasindu Janith

Documentation repository:
<https://github.com/pasindu-janith/o-ran-sdl-security-documentation>

## Pages

| Route            | Content                                                       |
| ---------------- | ------------------------------------------------------------- |
| `#/`             | Project overview, animated data-flow hero, tech stack          |
| `#/framework-1`  | Localized PEP — Keycloak/JWT sidecars in the xApp pod          |
| `#/framework-2`  | Centralized PEP — the Zero Trust Fortress (PEP in DBaaS pod)   |
| `#/framework-3`  | DID/VC Zero Trust — decentralized identity on Hyperledger Indy |
| `#/architecture` | Full animated system-architecture diagram                      |
| `#/about`        | Team, university, module, links                                |

## Stack

React 18 · Vite 5 · React Router 6 (HashRouter, GitHub-Pages-safe) ·
Framer Motion 11 · inline SVG diagrams (no image assets).
All animations respect `prefers-reduced-motion`.

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
