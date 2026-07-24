# Hellotext Integration Playground — User Manual

> **Audience:** QA testers, customers, and developers integrating the Hellotext JavaScript SDK.
> **SDK package:** [`@hellotext/hellotext`](https://www.npmjs.com/package/@hellotext/hellotext) (public npm)

---

## Table of Contents

1. [Overview](#1-overview)
2. [Prerequisites](#2-prerequisites)
3. [Installation & Setup](#3-installation--setup)
4. [Getting Started — The Setup Screen](#4-getting-started--the-setup-screen)
5. [Dashboard Overview](#5-dashboard-overview)
6. [Session Panel](#6-session-panel)
7. [UTM Capture Panel](#7-utm-capture-panel)
8. [Tracking Events Panel](#8-tracking-events-panel)
9. [Forms Panel](#9-forms-panel)
10. [Webchat Panel](#10-webchat-panel)
11. [Event Log](#11-event-log)
12. [Resetting & Switching Business](#12-resetting--switching-business)
13. [Running Tests](#13-running-tests)
14. [Production Build](#14-production-build)
15. [Troubleshooting](#15-troubleshooting)
16. [Architecture Reference](#16-architecture-reference)

---

## 1. Overview

The **Hellotext Integration Playground** is a standalone React application that lets you test and verify the public [Hellotext JavaScript SDK](https://github.com/hellotext/hellotext.js) without modifying source code or accessing the main Hellotext codebase.

### What you can do

| Feature | Description |
|---------|-------------|
| **Session management** | Observe how the SDK creates and persists session tokens |
| **UTM capture** | Verify automatic UTM parameter extraction from URLs |
| **Event tracking** | Fire preset and custom tracking events and inspect responses |
| **Forms** | Mount Hellotext forms by ID and observe lifecycle events |
| **Webchat** | Initialize webchat and monitor real-time message events |
| **Event log** | Inspect every SDK event and API response in a shared log panel |

### What this app does NOT do

- It does **not** expose any private Hellotext internals.
- It does **not** hardcode any real Business ID — all configuration happens at runtime.
- It uses **only** the public `@hellotext/hellotext` npm package and its documented API.

---

## 2. Prerequisites

| Requirement | Minimum Version |
|-------------|----------------|
| **Node.js** | 16+ (LTS recommended) |
| **Yarn** | 4.x (bundled via Corepack) or `npm` as an alternative |
| **Browser** | Any modern browser (Chrome, Firefox, Safari, Edge) |

You also need a **Hellotext Business ID** (public). You can find it in:

> **Hellotext Dashboard → Settings → Business → Business ID**

Optionally, you may also need:
- A **Webchat ID** — if you want to override the dashboard webchat configuration.
- A **Form ID** — to test a specific Hellotext form.

---

## 3. Installation & Setup

### Step 1 — Clone the repository

```bash
git clone <repository-url>
cd hellotext-react-test
```

### Step 2 — Install dependencies

```bash
yarn install
```

> **Using npm?** Run `npm install` instead. Both package managers work.

### Step 3 — Start the development server

```bash
yarn start
```

The app opens automatically at **http://localhost:3000**.

### Step 4 — Verify it works

You should see the **Setup Screen** with the Hellotext logo, a Business ID input field, and an "Initialize SDK" button.

---

## 4. Getting Started — The Setup Screen

When you first open the app, you'll see the **Setup Screen**. This is where you configure the SDK before using the playground.

### Fields

| Field | Required | Description |
|-------|----------|-------------|
| **Business ID** | ✅ Yes | Your public Hellotext Business ID. The "Initialize SDK" button stays disabled until you enter one. |
| **Webchat ID** | ❌ No | Optional. Override the webchat configuration set in your Hellotext dashboard. Leave empty to use dashboard defaults. |

### How to initialize

1. **Enter your Business ID** in the first input field.
2. *(Optional)* Enter a **Webchat ID** in the second field.
3. Click **Initialize SDK**.

### What happens behind the scenes

When you click "Initialize SDK", the app calls:

```js
Hellotext.initialize(businessId, config)
```

Where `config` includes `{ webchat: { id: webchatId } }` only if you provided a Webchat ID.

### Local storage persistence

- Your Business ID is saved to `localStorage` under the key `ht_business_id`.
- Your Webchat ID (if provided) is saved under `ht_webchat_id`.
- On subsequent visits, the fields are pre-filled with your last values.
- Use the **Reset** button (in the dashboard) to clear stored values.

### Error handling

If initialization fails (e.g., invalid Business ID, network error), an error entry appears in the Event Log with the error message. The app does **not** navigate to the dashboard on failure.

---

## 5. Dashboard Overview

After successful initialization, you're taken to the **Dashboard**. It has three main areas:

```
┌──────────────────────────────────────────────────┬──────────────┐
│  Header (Logo + Business ID badge + Reset btn)   │              │
├──────────────────────────────────────────────────┤              │
│  Tab Navigation                                  │              │
│  [Session] [UTM] [Tracking] [Forms] [Webchat]    │  Event Log   │
├──────────────────────────────────────────────────┤   Panel      │
│                                                  │              │
│  Active Panel Content                            │              │
│  (changes based on selected tab)                 │              │
│                                                  │              │
│                                                  │              │
└──────────────────────────────────────────────────┴──────────────┘
```

### Header

- **Hellotext logo** — the brand logomark.
- **Business ID badge** — shows the ID you initialized with (displayed as a pill/badge).
- **Reset button** — clears local storage and reloads the app back to the Setup Screen.

### Tabs

Click any tab to switch between the five feature panels. The active tab is underlined.

### Event Log

A persistent panel on the right side of the screen (or bottom on mobile). It's shared across all tabs — events from any panel appear here.

---

## 6. Session Panel

**Tab:** `Session`

### Purpose

Verify that the SDK correctly creates, stores, and exposes a session token.

### What you see

| Section | Description |
|---------|-------------|
| **Current Session** | Displays the value of `Hellotext.session`. If no session has been assigned yet, shows a waiting message. |
| **How it works** | Reference showing the SDK API calls used. |

### How to test

1. Click the **Session** tab (selected by default after initialization).
2. The **Current Session** field should display a session token (a UUID-like string).
3. Check the **Event Log** — you should see a `session-set` event logged with status `info`.

### Expected behavior

- The SDK assigns a session token automatically on initialization.
- The token is stored in cookies and reused across page reloads.
- The `session-set` event fires when the session is created or loaded from cookies.

### What to check (QA)

- [ ] Session token appears after initialization.
- [ ] `session-set` event is logged.
- [ ] Reloading the page preserves the same session token (cookie persistence).
- [ ] The token format looks like a valid UUID.

---

## 7. UTM Capture Panel

**Tab:** `UTM`

### Purpose

Verify that the SDK automatically captures UTM parameters from the browser URL and fires the `utm-set` event.

### What you see

| Section | Description |
|---------|-------------|
| **Test URL** | A pre-built URL with sample UTM parameters you can click to test. |
| **Open with UTM params** | Button that navigates to the test URL, re-initializing the app with UTM parameters. |
| **Captured UTM Data** | A table showing each captured UTM parameter and its value. Empty state shown if no UTM data. |

### How to test

#### Option A — Use the built-in test link

1. Navigate to the **UTM** tab.
2. Click the **"Open with UTM params"** button.
3. The page reloads with URL parameters:
   ```
   http://localhost:3000/?utm_source=test&utm_medium=playground&utm_campaign=demo&utm_term=sdk&utm_content=v1
   ```
4. Re-enter your Business ID and initialize again (or it auto-fills from local storage).
5. Go to the **UTM** tab — you should see the captured data in the table.

#### Option B — Manually add UTM params

1. Manually edit the browser URL to add any combination of UTM parameters:
   ```
   http://localhost:3000/?utm_source=google&utm_medium=cpc&utm_campaign=spring_sale
   ```
2. Press Enter to reload.
3. Initialize the SDK and check the UTM tab.

### Supported UTM parameters

| Parameter | Example |
|-----------|---------|
| `utm_source` | `google`, `newsletter`, `test` |
| `utm_medium` | `cpc`, `email`, `playground` |
| `utm_campaign` | `spring_sale`, `demo` |
| `utm_term` | `sdk`, `hellotext` |
| `utm_content` | `v1`, `banner_ad` |

### What to check (QA)

- [ ] `utm-set` event fires and appears in the Event Log.
- [ ] The UTM table displays all captured parameters correctly.
- [ ] Missing UTM parameters are not shown (only present ones appear).
- [ ] Without UTM params in the URL, the empty state message displays.

---

## 8. Tracking Events Panel

**Tab:** `Tracking`

### Purpose

Test the `Hellotext.track(eventName, params)` API by firing preset and custom tracking events.

### What you see

| Section | Description |
|---------|-------------|
| **Preset Events** | Three buttons for common events with pre-filled payloads. |
| **Custom Event** | Input fields to enter any event name and JSON parameters. |

### Preset events

| Button | Event Name | Sample Payload |
|--------|-----------|----------------|
| `product.viewed` | `product.viewed` | `{ product_id: "prod_demo_001", name: "Demo Product", price: 29.99 }` |
| `cart.added` | `cart.added` | `{ product_id: "prod_demo_001", quantity: 1, price: 29.99 }` |
| `checkout.started` | `checkout.started` | `{ total: 29.99, currency: "USD", items_count: 1 }` |

### How to test preset events

1. Navigate to the **Tracking** tab.
2. Click any preset event button (e.g., **`product.viewed`**).
3. The button shows "Sending…" while the request is in flight.
4. Check the **Event Log** for two entries:
   - An `info` entry showing the event was fired (with the payload).
   - A `success` or `error` entry showing the API response.

### How to test custom events

1. In the **Custom Event** section, enter an **Event Name** (e.g., `page.viewed`).
2. Enter **Parameters** as valid JSON (e.g., `{"page": "/pricing", "referrer": "google"}`).
3. Click **Fire Custom Event**.
4. Check the Event Log for the result.

### Error scenarios

| Scenario | Expected Behavior |
|----------|-------------------|
| Invalid JSON in params | An `error` entry appears in the log: "Invalid JSON in params field" |
| Empty event name | The "Fire Custom Event" button is disabled |
| Network error | An `error` entry appears with the error message |
| Invalid event name | The API may return an error — check the log payload |

### What to check (QA)

- [ ] Each preset button fires the correct event and shows success/error.
- [ ] Custom events with valid JSON work correctly.
- [ ] Invalid JSON is caught and reported in the log (not a crash).
- [ ] The button disables while a request is in flight ("Sending…" state).
- [ ] Multiple events can be fired in sequence without issues.

---

## 9. Forms Panel

**Tab:** `Forms`

### Purpose

Verify that the SDK correctly discovers and mounts Hellotext forms using the `data-hello-form` attribute.

### What you see

| Section | Description |
|---------|-------------|
| **Mount a Form** | Input for a Form ID and a Mount/Unmount button. |
| **Form mount area** | A dashed-border container where the form will render. |
| **Events** | Reference showing the SDK events related to forms. |

### How to test

1. Navigate to the **Forms** tab.
2. Enter a valid **Form ID** from your Hellotext dashboard.
   > Find this in: **Hellotext Dashboard → Forms → select a form → Form ID**
3. Click **Mount Form**.
4. The mount area changes from a dashed placeholder to a solid border.
5. The SDK discovers the `<div data-hello-form="...">` element and mounts the form inside it.

### What happens behind the scenes

When you click "Mount Form", the app renders:

```html
<div data-hello-form="YOUR_FORM_ID"></div>
```

The SDK's internal `MutationObserver` detects this element and fetches + renders the form.

### Form lifecycle events

| Event | When it fires |
|-------|--------------|
| `forms:collected` | The SDK discovers form placeholder(s) on the page |
| `form:completed` | A user fills out the form and completes OTP verification |

Both events appear in the shared Event Log.

### How to unmount

Click the **Unmount** button (red) to remove the form from the DOM. An `form:unmount` info entry is logged.

### What to check (QA)

- [ ] Entering a valid Form ID and clicking "Mount Form" renders the form.
- [ ] The `forms:collected` event fires and appears in the log.
- [ ] Filling out the form and completing OTP triggers `form:completed`.
- [ ] The form renders with correct Hellotext styling (imported via `@hellotext/hellotext/styles/index.css`).
- [ ] Unmounting removes the form from the page cleanly.
- [ ] Mounting a different form after unmounting works correctly.
- [ ] An invalid Form ID shows appropriate SDK behavior (empty mount area or error).

---

## 10. Webchat Panel

**Tab:** `Webchat`

### Purpose

Verify that the Hellotext webchat widget initializes and emits events correctly.

### What you see

| Section | Description |
|---------|-------------|
| **Status** | Description of whether webchat should appear and where to look. |
| **Monitored Events** | List of all webchat events being listened to. |
| **Configuration** | Shows the exact `Hellotext.initialize()` call that was used, including webchat config. |

### How webchat initialization works

Webchat is configured **at initialization time** (on the Setup Screen), not from this panel. There are two modes:

| Mode | How to use |
|------|-----------|
| **Dashboard defaults** | Leave the Webchat ID field empty on the Setup Screen. The SDK uses whatever webchat settings are configured in your Hellotext dashboard. |
| **Explicit override** | Enter a specific Webchat ID on the Setup Screen. The SDK initializes webchat with `{ webchat: { id: "YOUR_ID" } }`. |

### Where the webchat widget appears

If webchat is properly configured for your business, a **chat bubble** appears in the **bottom-right corner** of the page. This is the standard Hellotext webchat widget.

### How to test

1. **Before initializing**, decide whether to enter a Webchat ID on the Setup Screen.
2. Initialize the SDK.
3. Navigate to the **Webchat** tab.
4. Look for the chat bubble in the bottom-right corner of the page.
5. Click the bubble to open the webchat.
6. Send a message.
7. Check the **Event Log** for webchat events.

### Monitored events

| Event | When it fires |
|-------|--------------|
| `webchat:mounted` | The webchat widget has been loaded and rendered on the page |
| `webchat:opened` | The user opens the webchat window |
| `webchat:closed` | The user closes the webchat window |
| `webchat:message:sent` | The user sends a message through webchat |
| `webchat:message:received` | A response message is received in webchat |

### What to check (QA)

- [ ] Webchat bubble appears when configured for the business.
- [ ] `webchat:mounted` event fires and appears in the log.
- [ ] Opening the chat triggers `webchat:opened`.
- [ ] Closing the chat triggers `webchat:closed`.
- [ ] Sending a message triggers `webchat:message:sent`.
- [ ] Receiving a reply triggers `webchat:message:received`.
- [ ] With no webchat configured, no bubble appears (and no errors in the console).
- [ ] Providing a Webchat ID override on the Setup Screen works correctly.

---

## 11. Event Log

The **Event Log** is the shared observation panel on the right side of the dashboard. It captures every SDK event and user action across all tabs.

### Log entry anatomy

Each entry in the log contains:

```
┌──────────────────────────────────────────────────┐
│ [STATUS]  event.name               HH:MM:SS.mmm  │
│ {                                                 │
│   "payload": "details here"                       │
│ }                                                 │
└──────────────────────────────────────────────────┘
```

| Field | Description |
|-------|-------------|
| **Status badge** | Color-coded: `success` (green), `error` (red), `info` (blue) |
| **Event name** | The SDK event name or action performed (e.g., `session-set`, `track: product.viewed`) |
| **Timestamp** | Precise time down to milliseconds (HH:MM:SS.mmm format, 24-hour) |
| **Payload** | The event data, API response, or error message (formatted as JSON) |

### Controls

| Action | How |
|--------|-----|
| **Clear all entries** | Click the **Clear** button in the log header |
| **Scroll** | The log auto-scrolls to the newest entry. You can scroll up to review older entries. |
| **Entry count** | Shown next to "Event Log" as `(N)` |

### Events you'll see

| Source | Events |
|--------|--------|
| **Initialization** | `Hellotext.initialize` (success or error) |
| **Session** | `session-set` |
| **UTM** | `utm-set` |
| **Tracking** | `track: <event_name>` (info + success/error) |
| **Forms** | `form:mount`, `form:unmount`, `forms:collected`, `form:completed` |
| **Webchat** | `webchat:mounted`, `webchat:opened`, `webchat:closed`, `webchat:message:sent`, `webchat:message:received` |

---

## 12. Resetting & Switching Business

### How to reset

1. Click the **Reset** button in the top-right corner of the dashboard header.
2. This clears:
   - `ht_business_id` from localStorage
   - `ht_webchat_id` from localStorage
3. The page reloads and returns to the Setup Screen.

### Switching to a different Business ID

1. Click **Reset**.
2. Enter the new Business ID on the Setup Screen.
3. Click **Initialize SDK**.

> **Note:** Resetting performs a full page reload. This clears the SDK state, session cookies for the previous business, and all log entries.

---

## 13. Running Tests

The project includes automated tests that verify the core playground behavior.

### Run the test suite

```bash
yarn test --watchAll=false
```

### What the tests cover

| Test | What it verifies |
|------|-----------------|
| Setup screen renders | Business ID input and Initialize button are present |
| Button disabled state | Initialize button is disabled when Business ID is empty |
| localStorage persistence | Business ID is saved after initialization |
| SDK initialization call | `Hellotext.initialize()` is called with correct arguments |
| Dashboard renders | Tab navigation and all tabs appear after init |
| Business ID display | The entered ID appears in the dashboard header |
| Event log | The log panel is visible and shows the initialization entry |
| Tab switching | Clicking tabs shows the correct panel content |

### Watch mode (development)

```bash
yarn test
```

This starts Jest in watch mode — tests re-run automatically when files change.

---

## 14. Production Build

### Create a production build

```bash
yarn build
```

Output goes to the `build/` directory. This is a static bundle that can be deployed to any static hosting service.

### Serve the production build locally

```bash
npx serve -s build
```

---

## 15. Troubleshooting

### The Setup Screen won't initialize

| Symptom | Possible Cause | Solution |
|---------|---------------|----------|
| Button stays disabled | Empty Business ID field | Enter a valid Business ID |
| Error in Event Log after clicking Initialize | Invalid Business ID or network issue | Check the ID, verify network connectivity, check browser console |
| Nothing happens after clicking Initialize | JavaScript error | Open browser DevTools (F12) → Console for error details |

### Session not appearing

| Symptom | Possible Cause | Solution |
|---------|---------------|----------|
| "No session yet" message persists | SDK is still initializing | Wait a moment — the SDK makes an async network request |
| Session token never appears | Invalid Business ID | Reset and use a valid Business ID |
| Session changes on every reload | Cookies blocked | Check browser cookie settings, ensure localhost cookies are allowed |

### UTM parameters not captured

| Symptom | Possible Cause | Solution |
|---------|---------------|----------|
| UTM table is empty | No UTM params in URL | Add `?utm_source=test` to the URL and reload |
| UTM params in URL but not captured | SDK initialized before URL was parsed | Reload the page with UTM params already in the URL, then initialize |

### Tracking events fail

| Symptom | Possible Cause | Solution |
|---------|---------------|----------|
| Error status in log | Invalid Business ID or event name | Verify your Business ID is correct |
| "Invalid JSON in params field" | Malformed JSON in custom params | Ensure valid JSON syntax (use double quotes, no trailing commas) |
| Network error | API connectivity issue | Check network tab in DevTools |

### Forms not rendering

| Symptom | Possible Cause | Solution |
|---------|---------------|----------|
| Mount area stays empty | Invalid Form ID | Verify the Form ID in your Hellotext dashboard |
| Form appears unstyled | SDK styles not loaded | Verify `@hellotext/hellotext/styles/index.css` is imported in `index.js` |
| `forms:collected` doesn't fire | SDK hasn't discovered the DOM element yet | The SDK uses MutationObserver — give it a moment after mounting |

### Webchat not appearing

| Symptom | Possible Cause | Solution |
|---------|---------------|----------|
| No chat bubble | Webchat not configured for your business | Enable webchat in your Hellotext dashboard |
| Bubble appears but events don't log | Events fire before switching to Webchat tab | Check the Event Log — events are shared across tabs |
| Webchat override not working | Webchat ID entered incorrectly | Reset, verify the ID, and re-initialize |

---

## 16. Architecture Reference

### Tech Stack

| Technology | Purpose |
|-----------|---------|
| **React 18** | UI framework (Create React App) |
| **@hellotext/hellotext** `^2.4.0` | Public Hellotext JavaScript SDK |
| **Vanilla CSS** | Styling with CSS custom properties |
| **Jest + React Testing Library** | Automated testing |

### Project Structure

```
hellotext-react-test/
├── public/
│   └── index.html            # HTML template with Google Fonts
├── src/
│   ├── index.js               # Entry point, imports SDK stylesheet
│   ├── index.css              # Design tokens (colors, spacing, fonts)
│   ├── App.js                 # Root component, state management
│   ├── App.css                # Layout and component styles
│   ├── App.test.js            # Automated tests
│   ├── setupTests.js          # Jest configuration
│   └── components/
│       ├── HellotextLogo.js   # SVG logo component
│       ├── SetupScreen.js     # Business ID entry form
│       ├── Dashboard.js       # Tab navigation + layout
│       ├── SessionPanel.js    # Session display + events
│       ├── UtmPanel.js        # UTM capture display
│       ├── TrackingPanel.js   # Event tracking controls
│       ├── FormsPanel.js      # Form mounting controls
│       ├── WebchatPanel.js    # Webchat event monitoring
│       └── EventLog.js        # Shared log panel
├── docs/
│   └── USER_MANUAL.md         # This document
├── package.json
└── README.md                  # Quick-start guide
```

### Data Flow

```
User Input (Business ID)
        │
        ▼
  SetupScreen.js
        │
        ▼
  App.js ─── Hellotext.initialize(businessId, config)
        │
        ▼
  Dashboard.js (tab navigation)
        │
        ├── SessionPanel ──── Hellotext.on('session-set')
        ├── UtmPanel ──────── Hellotext.on('utm-set')
        ├── TrackingPanel ──── Hellotext.track(event, params)
        ├── FormsPanel ────── <div data-hello-form="...">
        └── WebchatPanel ──── Hellotext.on('webchat:*')
                │
                ▼
          EventLog.js (shared log, receives addLog() from all panels)
```

### Key SDK APIs Used

| API | Used in | Purpose |
|-----|---------|---------|
| `Hellotext.initialize(id, config)` | App.js | Initialize the SDK with a Business ID |
| `Hellotext.session` | SessionPanel.js | Read the current session token |
| `Hellotext.track(event, params)` | TrackingPanel.js | Fire tracking events |
| `Hellotext.on(event, callback)` | All panels | Subscribe to SDK events |
| `Hellotext.removeEventListener(event, cb)` | All panels | Unsubscribe on component unmount |

---

*Last updated: June 2026*
