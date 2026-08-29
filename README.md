# A Zero Trust-Based Security Framework for Open RAN Intelligent Controllers

Demonstration website for the EE4801 Final Year Project (2025/2026), Department of
Electrical and Information Engineering, Faculty of Engineering, University of
Ruhuna, Sri Lanka.

**Team:** Ashan Kasthuriarachchi · Pasindu Hathurusinghe · Asitha Kodithuwakku · Shehana Hewage

**Supervisor:** Dr. Chatura Seneviratne
**Co-supervisors:** Prof. Dr. An Braeken and Pramitha Fernando (Vrije Universiteit Brussel, Belgium)

Step-by-step implementation documentation:
<https://github.com/pasindu-janith/o-ran-sdl-security-documentation>

## Pages

| Route               | Content                                                              |
| ------------------- | -------------------------------------------------------------------- |
| `#/`                | Overview, the problem, headline findings, technology stack            |
| `#/testbed`         | The four-layer testbed: Open5GS · srsRAN · OSC Near-RT RIC · security |
| `#/framework-1`     | Decentralized PEP — Envoy + WebAssembly filter in every xApp pod      |
| `#/framework-2`     | Centralized PEP — one fortified gateway in front of the database      |
| `#/framework-3`     | DID/VC — verifiable credentials with an external presentation verifier |
| `#/security-testing`| MITRE CALDERA adversary emulation, findings and hardening             |
| `#/results`         | Latency, tail latency, scalability and a 13-row framework comparison  |
| `#/team`            | Contributors, supervisors and project details                         |

## Accuracy notes

All architectures, attack results and performance figures are taken from the
project's final report. In particular:

- **Framework 1 (D-PEP)** has **no Auth Agent**. The xApp pod holds two containers
  (the xApp and an Envoy sidecar running a WASM filter); a second Envoy terminates
  mTLS in front of Redis. The policy engine is central.
- **Framework 2 (C-PEP)** puts the policy engine *inside* the database pod, beside
  Redis, together with an Envoy gateway and a protocol translator. The xApp side
  carries only a lightweight Egress Ambassador.
- **Framework 3** adds an **external VP Verifier** in `ricplt`; the Auth Agent never
  verifies its own presentations.
- Calico provides Layer 3/4 micro-segmentation in all three frameworks.

The site contains no code snippets by design — it is written for a general
audience.

## Stack

React 18 · Vite 5 · React Router 6 (HashRouter, GitHub-Pages-safe) · Framer Motion 11.
All diagrams and technology logos are inline SVG — there are no image assets.
Light theme throughout; every animation respects `prefers-reduced-motion`.

Diagram boxes size themselves from their own text via the helpers in
`src/components/diagrams/svgKit.jsx`, so labels cannot be clipped when content changes.

## Develop

```bash
npm install
npm run dev
```

## Deploy to GitHub Pages

```bash
npm run deploy
```

Then set the repository's **Settings → Pages** source to the `gh-pages` branch.
`vite.config.js` uses `base: './'`, so the site works at any repository path.
