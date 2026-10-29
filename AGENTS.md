# AGENTS.md

Guidance for AI coding agents (and humans) working in this repo.

## What this is

**realmath** is the input website for RealMath AR. Users build up to 5 graph components (functions, points, vectors, vector fields, space curves) in MathLive math fields, then press **VISUALIZE IT!**. That opens a modal with a QR code and a link to the AR viewer, with the components encoded in the URL.

Related repos:
- **`ND-DAC-DOME/realmathAR`** is the AR viewer (8th Wall + three.js) that this site links to. Its `AGENTS.md` documents the viewer side of the URL contract.
- **`RamenStudios/realmath`** is the upstream; this repo is a GitHub fork of it. Upstream is itself a fork of `randal-sean-harrison/realmath`, the original 2024 site.
- **`ND-DAC-DOME/realmath-deprecated`** is an older, unforked copy that diverged from upstream. Its ND web theme work (alli-linhart, Aug 2026) has been ported here. Its in-app AR viewer was intentionally not ported, because realmathAR is the viewer. Don't merge from it: it's built on the pre-refactor component structure.

## Commands

```bash
npm ci
npm run dev       # vite dev server at http://localhost:5173/realmath/
npm run build     # -> dist/
npm run preview
npm run lint      # currently broken: eslint.config.js uses `extends`, which flat config doesn't support
```

- There are no tests.
- Deployment: `.github/workflows/static.yml` deploys to GitHub Pages on every push to `main`. The site is served at `https://nd-dac-dome.github.io/realmath/`, which is why `REPO_NAME` in `vite.config.js` is `/realmath/`.

## Architecture

```
index.html -> src/index.jsx   checkMobile() -> userframe 'mobile' | 'desktop', passed everywhere (mostly unused)
  └─ App.jsx                  top-level useReducer; renders RamenModal, Header, About, Selector, Tabs, BottomButtons, Footer
       ├─ Selector/           dropdown + DEFINE (dispatch 'DEF') + ADD! (dispatch 'ADD')
       ├─ Tabs/Tabs.jsx        component tabs + the active input card
       │    └─ TabUIContainer (tabuihook.jsx) -> TabTracker per type -> Tab (tabclasses.jsx)
       │         └─ Tab.display() -> Modular/Math/InputLayoutGetter -> MathField (<math-field>)
       ├─ Buttons.jsx          Visualize it (showURL), Help (dispatch 'MOD' HELP), Reset (reload), Report a bug (mailto)
       └─ Modals/RamenModal    one react-bootstrap Modal: QR (type 0), definition (1), help (2), or a raw message
```

### State and signaling

App's reducer takes the actions `MOD`, `DEF`, `VIS`, `ADD`, `DEL` and `QR`. Children don't receive callbacks for these events. Instead they watch counters in an effect:
- `actionCalls` drives Tabs (add, delete, QR).
- `modalCalls` drives RamenModal.

So to trigger something, dispatch the action that bumps the right counter.

Tab data lives in mutable class instances (`TabUIContainer` and friends) held in a `useRef`, not in React state. `Tab.update` reads the MathLive values straight from the DOM by fixed ids (`leftMathField`, `xMathField`, `vxMathField`, …). Only one card is mounted at a time, so the ids don't collide.

### Three different type-number schemes (watch out)

| | Func | Pt | Vec | VFld | SCrv |
|---|---|---|---|---|---|
| `GraphKeys` index (App, Selector, definitions) | 0 | 1 | 2 | 3 | 4 |
| `Tab.type` / `InputLayoutGetter` (`InputCards.alias`) | 1 | 2 | 3 | 4 | 5 |
| Short name (`GraphAlts`, tracker keys, payload) | `Func` | `Pt` | `Vec` | `VFld` | `SCrv` |

### URL payload (contract with realmathAR)

`TabUIContainer.stringify_tabs()` produces JSON nested by type:
```json
{"Func": {"Func 1": {"left": "x^2", "right": "z"}}, "Pt": {"Pt 1": {"x": "1", "y": "0", "z": "0"}}}
```
`Vec` props are `{vec: {x,y,z}, init: {x,y,z}}`. The values are raw LaTeX from MathLive, with real backslashes. `RamenModal` (QR case) compresses the JSON with `lz-string`'s `compressToEncodedURIComponent` and appends it to `BASE_URL`. That `BASE_URL` is the one that matters; the copy in `App.jsx` is unused.

Validation (`Tab.check_valid`) is shallow. It rejects empty fields, `=`, and the string `null`, and it requires a function to contain x, y or z. Real LaTeX validation happens in the viewer.

## Known issues / gotchas

- `BASE_URL` still points at the old 8th Wall-hosted viewer (`ndlearning.8thwall.app/ar-math-viewer/`), not `realmathAR`.
- `src/common/utilities/*` (`HelpMessage`, `customPropDiv`, `modal`, `qrModal`) is dead code; nothing imports it.
- The "Report a bug" button and the footer's "Report a Problem" link both mail a former student intern (`arodri37@nd.edu`).
- MathLive can't load its math fonts (`/realmath/assets/fonts` 404s), so it falls back to system fonts. MathLive's `fonts/` directory isn't copied into the build.
- Help content: the general help says 3 components (the limit is `TAB_LIMIT = 5`). The Vector, Vector Field and Space Curve help entries are placeholders, and the Point help's "valid" example isn't a constant.
- `ErrorBoundary.componentDidCatch` rethrows.
- Some JSX uses `class=` instead of `className=` (about 13 places), and several `.map()`s render lists without `key`s. Both cause React warnings.
- `compute-engine` is imported from a CDN URL (`https://esm.run/...`) in `Buttons.jsx` and `MathField.jsx`, not from npm.
- `babel-plugin-react-compiler` is installed but not configured.

## Styling (ND Web Theme)

`stylesheets/main.css` implements the Notre Dame Web Theme (NDT): brand tokens in `:root`, with Libre Franklin loaded from Google Fonts in `index.html`. It also bridges Bootstrap's CSS variables (`--bs-primary`, …) to ND colors. Its sections:
- `site-header`, `skip-links`
- `rm-app`, `rm-main`, `rm-panel`, `rm-selector-row`
- `rm-tabs`, `rm-tab`, `rm-tab-panel`
- `rm-actions`, `rm-btn-label`, `rm-link-btn`, `btn-danger-subtle`
- `rm-qr-layout`
- `site-footer`
- themed Bootstrap buttons and modals

Use these classes and tokens instead of ad-hoc colors. `src/index.jsx` imports Bootstrap's CSS before `main.css`, so the theme overrides Bootstrap. Older utility classes (`light-grey`, `italic`, `bold`, …) still exist for leftover markup.

## Style

React function components with plain JS (JSX). Indentation is mixed (tabs and 4 spaces): match the file you're editing. Comments use `/* ... */` banner blocks. Bootstrap 5 utility classes plus `stylesheets/main.css` handle styling, and `react-bootstrap` is used for the modal.
