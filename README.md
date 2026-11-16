# Fastcare

## Mobile-first interface — 16 November 2026

The primary layout now targets phones, including landscape, through 900px. It includes compact inventory rows, 44–50px touch targets, readable single-column forms, bottom sheets, a compact mode picker, mobile protection and maintenance filters, and booking controls fixed above the bottom navigation. Voice/video demo sessions share the viewport-height chat layout and keep their controls on screen. All existing services and saved demo records remain available.

Validation: 138 layouts across 320, 390, 430, 768, 844 and 1600px have no page overflow or runtime errors. The 40 service checks, 34 usability checks, 29 chat checks and 26 mobile-first checks passed. Results and screenshots are in `output/playwright/mobile-first-*` and `output/playwright/mobile-first/`. Keyboard checks use reduced browser viewport sizes; physical mobile devices were not tested.

## Simpler interface — 16 November 2026

Chat now has a viewport-height conversation with a fixed composer, automatic latest-message scrolling, optional suggested questions, and a Details bottom sheet for the summary, appliance links, booking, and ending the demo chat. It tracks the visual viewport to accommodate reduced space when an on-screen keyboard opens. Chat checks passed at 320px/390px and desktop widths, including a simulated shorter keyboard-sized viewport. Physical mobile keyboard behavior was not tested.

The updated interface keeps all existing demo features and adds a task-focused Home, an appointment list at `/bookings`, mobile quick navigation, grouped inventory filters, clickable protection status filters, and section shortcuts on appliance and recovery records. Recovery inspection is now near the top of the case. Extra photos and activity are available on demand. The current Docker build serves this interface at http://127.0.0.1:8080/.

The original 40 service-flow checks and 34 additional usability checks passed. Desktop/mobile route screenshots and layout results are in `output/playwright/simple/` and `output/playwright/simple-layout-result.json`; narrow mobile/tablet checks are in `output/playwright/simple-ux-flow-result.json`. Checks use browser viewports, rather than physical mobile devices.

## Latest local care-service upgrade

See [UPGRADE_NOTES.md](UPGRADE_NOTES.md) for the new routes, demo walkthrough, capture URLs, screenshots, verification and scope checklist. On 15 November 2026, the latest upgrade was built into `dist/` and deployed to the existing Docker setup at the user's request. Docker preview: http://127.0.0.1:8080/. Current sharing link: https://challenge-topics-traditions-cubic.trycloudflare.com/. A separate local preview build remains in `output/fastcare-preview/`.

```powershell
npm.cmd run dev
# Or build and preview the current upgrade separately:
npm.cmd run build -- --outDir output/fastcare-preview
npm.cmd run preview -- --outDir output/fastcare-preview
```

Development: http://127.0.0.1:5173/ · Production preview: http://127.0.0.1:4173/

## Share from this computer with Docker and Cloudflare

Running the default build below updates the shared Docker site. Keep Docker Desktop running while others test.

Start Docker Desktop, then run these commands from the project folder:

```powershell
npm.cmd run build
docker compose up -d
docker compose logs --tail 100 tunnel
```

The tunnel log prints an HTTPS address ending in `trycloudflare.com`. Share that address with testers. The local Docker preview is http://127.0.0.1:8080/. Nginx serves the built `dist/` files and supports refreshing each app route.

Keep this computer awake, connected to the internet, and Docker Desktop running while people test. The Quick Tunnel address is temporary and can change when the tunnel is recreated. Run `docker compose logs --tail 100 tunnel` to find the current address again.

To stop sharing:

```powershell
docker compose stop
```

After changing the website, run `npm.cmd run build` to update the files served by the web container. The Compose project is `fastcare-demo`, with separate `web` and `tunnel` services.

## Brand assets

The custom Fastcare mark is a forward-leaning **F** in a rounded monochrome frame. The lockup uses locally bundled Inter Bold, converted to vector outlines so exported SVGs do not need a font installed.

- [Primary logo — SVG](public/brand/fastcare-logo.svg) / [transparent PNG, 1288 × 448](public/brand/fastcare-logo.png)
- [White logo for dark backgrounds — SVG](public/brand/fastcare-logo-reversed.svg) / [transparent PNG](public/brand/fastcare-logo-reversed.png)
- [App icon — SVG](public/brand/fastcare-icon.svg) / [transparent PNG, 512 × 512](public/brand/fastcare-icon.png)
- [Brand kit ZIP](Fastcare-brand-kit.zip)
- [Updated pitch screenshots ZIP](Fastcare-pitch-screenshots.zip)

The application logo, favicon, page metadata, sample documents, source package name and screenshots use Fastcare. Existing locally saved demo records are migrated automatically to the new storage key.

An interactive frontend prototype for the GEN354 investor pitch. English UI, monochrome design, locally bundled Inter, six appliances, and connected care / flood recovery flows. Opens directly on the dashboard; no login.

## Run locally

Requires Node.js 20.19+ or 22.12+ (verified with Node 26).

```powershell
npm.cmd install
npm.cmd run dev
```

Open **http://127.0.0.1:5173/**. On macOS/Linux, use `npm` instead of `npm.cmd`.

```powershell
npm.cmd run build
npm.cmd run preview
```

Production preview runs at http://127.0.0.1:4173/. Vite supports direct route loads and refresh. If hosting the build elsewhere later, configure an SPA fallback to `index.html`.

## Pitch screenshots

PNG images are in [`screenshots/`](screenshots/), at **1600 × 900**. They are original browser captures with no image editing. Longer pages scroll normally. The same layout is used with and without capture mode.

| Screen | Direct capture URL | PNG |
| --- | --- | --- |
| Normal dashboard | http://127.0.0.1:5173/overview?mode=normal&capture=1 | [01-dashboard-normal.png](screenshots/01-dashboard-normal.png) |
| Flood dashboard | http://127.0.0.1:5173/overview?mode=flood&capture=1 | [02-dashboard-flood.png](screenshots/02-dashboard-flood.png) |
| Appliance record | http://127.0.0.1:5173/appliances/washer?mode=normal&capture=1 | [03-appliance-details.png](screenshots/03-appliance-details.png) |
| Flood preparation | http://127.0.0.1:5173/preparation?mode=flood&capture=1 | [04-flood-preparation.png](screenshots/04-flood-preparation.png) |
| Technician booking | http://127.0.0.1:5173/bookings/new?mode=normal&capture=1 | [05-technician-booking.png](screenshots/05-technician-booking.png) |
| Recovery case | http://127.0.0.1:5173/recovery/RC-2026-001?mode=flood&capture=1 | [06-recovery-case.png](screenshots/06-recovery-case.png) |

`mode=normal` / `mode=flood` applies immediately and remains selected when navigating. `capture=1` hides presenter controls and toasts, disables motion and caret blinking, and preserves prototype labeling. Fonts are local; the root has `data-fonts-ready="true"` once they are ready.

For a manual capture, open a link above, set the browser viewport to 1600 × 900, wait for fonts, and capture the viewport. Remove `capture=1` or use Settings to leave capture mode.

## All routes

- `/` → `/overview`
- `/overview` — dashboard, Normal / Flood switch
- `/appliances` — inventory, search, room and care filters; Add appliance modal
- `/appliances/:id` — details, editing, documents, history; initial IDs: `washer`, `fridge`, `tv`, `ac`, `microwave`, `pump`
- `/preparation` — persistent grouped checklist and progress
- `/bookings/new` — four-step booking; optional `appliance`, `service`, and `case` query parameters
- `/bookings/:id` — appointment, timeline, reschedule, cancellation, simulated consultation; initial ID: `BK-2026-001`
- `/recovery` — recovery case list
- `/recovery/new` — damage record with local photo preview and safe-access confirmation
- `/recovery/:id` — linked appliance, inspection appointment, document pack; initial ID: `RC-2026-001`
- `/documents` — search, filters, sample records, preview and actual local `.txt` downloads

## Demo/reset

Use **Reset demo** at the bottom right and confirm, or **Settings → Reset demo data**. This restores all initial records and the checklist. In capture mode, use Settings or remove `capture=1` first.

Reference date: **15 November 2026**, intentionally fixed for consistent pitch screenshots. Dashboard counts derive from the shared data. Warranty status is calculated against this date. All fees use THB.

Text records and checklist changes are saved under `fastcare-demo-v1` in localStorage. New selected image previews use temporary object URLs in memory, are never uploaded or stored in localStorage, and disappear on page refresh or Reset demo. Reset also releases their object URLs. Avoid sensitive information in this demonstration.

## Source map

- `src/data.ts` — types, initial linked records, technicians, tasks, reference date
- `src/store.tsx` — local persistence, reset, toasts
- `src/components.tsx` — shared UI, accessible native dialogs, appliance illustrations, forms and document previews
- `src/pages.tsx` — application pages and flows
- `src/App.tsx` — routes, navigation, mode, capture controls
- `src/styles.css` — design tokens, desktop and mobile layouts, motion preferences

## Verification

`npm.cmd run build` passes TypeScript and the production Vite build. Browser checks cover 1600 × 900, 1440 × 900, and 390 px layouts. The complete interaction check covers 24 assertions, including required fields, modal keyboard behavior, persistence, search/filters, edit, checklist, all booking steps, linked recovery status, reschedule/cancel, simulated chat, damage photo preview, safe-access validation, document preview/download, mode preservation, all six appliance routes, reset and mobile navigation. No JavaScript errors or external app requests were observed in that flow.

Optional browser verification scripts use Playwright CLI, without adding a test framework to the app:

```powershell
npx.cmd --yes --package @playwright/cli playwright-cli open http://127.0.0.1:5173/
npx.cmd --yes --package @playwright/cli playwright-cli run-code --filename=output/playwright/capture.cjs
npx.cmd --yes --package @playwright/cli playwright-cli run-code --filename=output/playwright/smoke.cjs
```

Both scripts restore initial demo data. The capture script creates the six pitch PNGs and extra mobile QA captures in `output/playwright/`. The smoke script changes sample data to verify interactions, then resets it. Vite ignores test artifacts to avoid Windows file-lock issues while testing downloads.

## Deliberate limits

Frontend-only: no backend, authentication, external API, real bookings, payments, messages, image analysis, live flood alerts, insurer integration, or deployment. Teams, availability, fees, records and conversations are illustrative. Sample incident photos are clearly labeled placeholders; locally selected photos can be previewed. Added documents create sample records, not verified uploads or actual inspection results. Downloads are marked sample text files. Recovery stages do not imply professional inspection has taken place. Document preparation does not submit or approve an insurance claim.

