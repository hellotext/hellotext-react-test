# Hellotext Integration Playground

A React application for quickly verifying the public [Hellotext JavaScript SDK](https://github.com/hellotext/hellotext.js) (`@hellotext/hellotext` npm package). Designed for customers and internal QA to test tracking events, forms, webchat, UTM capture, and session management — **without editing source code**.

## Prerequisites

- **Node.js** 16+ (LTS recommended)
- **Yarn** (the project uses Yarn 4 via Corepack, but `npm` works too)

## Getting Started

### 1. Install dependencies

```bash
yarn install
```

### 2. Start the dev server

```bash
yarn start
```

Opens [http://localhost:3000](http://localhost:3000) in your browser.

### 3. Enter a Business ID

The first screen asks for your **public Hellotext Business ID** (found in your Hellotext dashboard → Settings → Business). Enter it and click **Initialize SDK**. The ID is saved in localStorage for convenience — use the **Reset** button to change it.

Optionally enter a **Webchat ID** to override dashboard-managed webchat settings.

---

## Features

### Session
Displays the current `Hellotext.session` token and listens for the `session-set` event.

### UTM Capture
Shows how the SDK captures UTM parameters from the URL. Click the provided test link to reload with sample UTM params (`utm_source`, `utm_medium`, `utm_campaign`, etc.) and observe the `utm-set` event.

**Test URL example:**
```
http://localhost:3000/?utm_source=test&utm_medium=playground&utm_campaign=demo
```

### Tracking Events
Fire preset events (`product.viewed`, `cart.added`, `checkout.started`) or enter a custom event name + JSON params. Each call shows success/failure in the Event Log.

### Forms
Enter a **Form ID** and click **Mount Form** to render a `<div data-hello-form="...">` element. The SDK discovers it and mounts the form. Listens for `forms:collected` and `form:completed` events.

### Webchat
If webchat is configured for your business, the widget appears automatically. The panel listens for:
- `webchat:mounted`
- `webchat:opened` / `webchat:closed`
- `webchat:message:sent` / `webchat:message:received`

All events appear in the shared **Event Log**.

---

## Event Log

A persistent log panel shared across all tabs. Each entry includes:
- Event/action name
- Timestamp (down to milliseconds)
- Status badge (`success` / `error` / `info`)
- Payload or error details

Click **Clear** to reset the log.

---

## Testing

### Run tests

```bash
yarn test --watchAll=false
```

Tests mock the `@hellotext/hellotext` SDK and verify:
- Setup screen renders correctly
- Initialize button behavior
- localStorage persistence
- Dashboard rendering after init
- Tab switching
- Event log visibility

### Production build

```bash
yarn build
```

Outputs to `build/`. Can be served with any static file server.

---

## Tech Stack

- **React 18** (Create React App)
- **@hellotext/hellotext** `^2.4.0` (public npm package)
- **Vanilla CSS** with CSS custom properties
- No additional UI frameworks or state management libraries

## Notes

- No real Business ID is hardcoded in the source. All configuration happens at runtime.
- The SDK stylesheet (`@hellotext/hellotext/styles/index.css`) is imported so forms and webchat render with expected styles.
- Only the public SDK API is used — no private Hellotext application internals.
