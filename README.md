# @elevvo/react-ui

A reusable **component library & design system** built with React, styled with
Tailwind CSS v4 design tokens, documented in Storybook, and covered by Jest unit
tests.

| | |
| --- | --- |
| Components | `Button`, `Input`, `Modal`, `Card` |
| Documentation | Storybook 10 (autodocs + MDX foundation pages) |
| Unit tests | Jest + React Testing Library + user-event |
| Accessibility | `@storybook/addon-a11y` (axe-core) on every story |
| Build | Vite library mode → `dist/index.mjs`, `dist/index.cjs`, `dist/styles.css` |

## Install

```bash
npm install @elevvo/react-ui
```

`react` and `react-dom` (≥18) are peer dependencies.

> The package is published under a **restricted scope** (`publishConfig.access:
> restricted`), so it can only be installed from a private registry you are
> authenticated against.

## Usage

```jsx
import { Button, Input, Modal, Card } from '@elevvo/react-ui';
import '@elevvo/react-ui/styles.css';

export function Newsletter() {
  return (
    <Card>
      <Card.Header>Stay in the loop</Card.Header>
      <Card.Body>
        <Input label="Email" type="email" hint="We never share it." required />
      </Card.Body>
      <Card.Footer>
        <Button variant="primary">Subscribe</Button>
      </Card.Footer>
    </Card>
  );
}
```

Import `styles.css` once at your app root — it contains the compiled Tailwind
utilities **and** the design tokens as CSS custom properties
(`--color-brand-600`, `--radius-card`, …).

## Components

### Button

```jsx
<Button variant="primary" size="md" loading={saving} onClick={save}>
  Save changes
</Button>
```

| Prop | Type | Default | Notes |
| --- | --- | --- | --- |
| `variant` | `primary \| secondary \| ghost \| danger` | `primary` | Visual emphasis |
| `size` | `sm \| md \| lg` | `md` | Height/padding |
| `disabled` | `boolean` | `false` | Native `disabled` attribute |
| `loading` | `boolean` | `false` | `aria-busy="true"`, spinner, clicks swallowed |
| `fullWidth` | `boolean` | `false` | Stretch to container |
| `type` | `button \| submit \| reset` | `button` | Never submits forms by accident |
| `startIcon` / `endIcon` | `ReactNode` | — | Decorative icons around the label (hidden from AT) |
| `onClick` | `function` | — | Not called while `disabled`/`loading` |

### Input

```jsx
<Input label="Email" type="email" error="Enter a valid email" required />
```

Label is bound with `htmlFor`; hints/errors are linked with `aria-describedby`;
errors set `aria-invalid`. `prefix`/`suffix` render static text inside the
field (e.g. `$`, `@company.com`) — keep them decorative and put the unit in the
label. Supports controlled (`value`/`onChange`) and uncontrolled
(`defaultValue`) usage plus every native input prop.

### Modal

```jsx
<Modal open={isOpen} onClose={() => setOpen(false)} title="Delete project"
       footer={<Button variant="danger">Delete</Button>}>
  <p>This cannot be undone.</p>
</Modal>
```

Renders in a portal with `role="dialog"` + `aria-modal` + `aria-labelledby`.
Focus moves in on open, is trapped while open (Tab/Shift+Tab cycle), and
returns to the trigger on close. `Escape` and overlay click close it (both
configurable). Background scrolling is locked while open, and the dialog eases
in with a fade/rise animation that is disabled under `prefers-reduced-motion`.
`initialFocusRef` picks the element that receives focus first.

### Card

```jsx
<Card variant="elevated">
  <Card.Header>Title</Card.Header>
  <Card.Media>…</Card.Media>
  <Card.Body>Content</Card.Body>
  <Card.Footer>Meta</Card.Footer>
</Card>
```

`variant`: `elevated | outlined | filled`. `interactive` renders the whole card
as a `<button>` (keyboard operable) — don't nest other controls inside it.

## Design tokens

Tokens are declared in `src/styles/index.css` as Tailwind v4 `@theme`
variables, so they exist both as CSS custom properties and as utilities:

```css
@theme {
  --color-brand-600: #4f46e5; /* → bg-brand-600, text-brand-600 */
  --radius-card: 0.75rem;     /* → rounded-card */
  --shadow-card: …;           /* → shadow-card */
}
```

Override them after importing the package CSS to rebrand:

```css
@import '@elevvo/react-ui/styles.css';
@theme {
  --color-brand-600: #0f766e;
}
```

See **Foundations → Design Tokens** in Storybook for the full palette.

## Scripts

```bash
npm test               # Jest unit tests (47 tests)
npm run test:watch     # watch mode
npm run test:coverage  # coverage report (coverage/)
npm run storybook      # docs & component workshop on http://localhost:6006
npm run build-storybook# static docs site (storybook-static/)
npm run build          # library bundle: ESM + CJS + CSS → dist/
npm run pack:check     # list files that would be published
npm run release:dry    # simulate `npm publish` (no registry write)
```

## Testing strategy

**Unit tests (Jest + React Testing Library)** — `src/components/**/*.test.jsx`

- Button: click/keyboard activation, disabled & loading suppression, ref
  forwarding, variant classes
- Input: label association, typing → `onChange`, hint/error wiring
  (`aria-describedby`, `aria-invalid`), required/disabled
- Modal: open/close (Escape, overlay, close button), focus trap and focus
  restore, scroll lock, portal rendering, accessible name
- Card: compound regions, interactive variant (mouse + keyboard), variants

**Accessibility (Storybook a11y addon)** — `@storybook/addon-a11y` runs
axe-core against every story (WCAG 2.0/2.1 A + AA + best-practice rules).
Open the *Accessibility* panel while browsing stories, or use the toolbar
toggle to simulate vision impairments. A11y options are configured in
`.storybook/preview.js`.

## Publishing (private package)

The publish flow is simulated locally — no registry is contacted:

```bash
npm run build          # produce dist/
npm run pack:check     # npm pack --dry-run → shows the tarball contents
npm run release:dry    # npm publish --dry-run → validates the publish step
```

To publish for real, point npm at your private registry (npmjs org, Artifactory,
Verdaccio, GitHub Packages, …) and run `npm publish` — the package is marked
`access: restricted`, so it will not be visible publicly:

```bash
npm config set //<registry-host>/:_authToken=<token>
npm publish
```

Consumers then install it with the same registry configuration:

```bash
npm install @elevvo/react-ui --registry=<registry-host>
```

## Project structure

```
├─ .storybook/            # Storybook config (docs + a11y addons)
├─ src/
│  ├─ index.js            # public entry point
│  ├─ styles/index.css    # Tailwind v4 @theme design tokens
│  ├─ utils/              # cx, focus trap helpers
│  ├─ components/         # Button, Input, Modal, Card (+ stories & tests)
│  └─ docs/               # MDX: Introduction, Design Tokens
├─ dist/                  # build output (published)
├─ vite.config.js         # library build (ESM + CJS)
├─ jest.config.cjs        # unit test setup
└─ babel.config.cjs
```

## Troubleshooting

On machines without the Microsoft VC++ runtime, native bindings used by
Storybook (`oxc-resolver`) fail to load with `ERR_DLOPEN_FAILED`. Fix: install
the [VC++ Redistributable](https://learn.microsoft.com/en-us/cpp/windows/latest-supported-vc-redist),
or place `vcruntime140.dll` + `vcruntime140_1.dll` (x64) where the loader can
find them (this repo keeps copies in the project root; they are git-ignored).
