# Project improvements

This change addresses the assessment feedback while preserving the MERN backend and existing channel/comment workflows.

| Feedback | Implementation |
| --- | --- |
| Weak passwords | Matching browser/server rules require 8+ characters, uppercase, lowercase, number and special character; no whitespace; maximum 72 UTF-8 bytes for bcrypt. Existing accounts can still sign in. |
| Videos do not play | A dedicated player resolves YouTube watch/share/shorts/live/embed links to an allowlisted iframe, and direct MP4/WebM/Ogg/M4V links to a native player. Unavailable media has retry and original-link actions. |
| Watch menu does not open | Navigation lives in the shared layout. Watch, channel, studio and mobile pages use a drawer with backdrop, Escape handling, focus trap and focus restoration. |
| Redux Toolkit | Redux slices own authentication and menu state; RTK Query caches feed requests and invalidates them after publishing or deleting videos. Page-local forms stay local. |
| Lazy loading and routing | createBrowserRouter configures routes; React.lazy and Suspense split page bundles. Images load lazily. Route failures have a recovery page. |
| Data handling | Abortable requests prevent stale watch/channel responses; mutation controls prevent repeat submissions; reactions preserve populated channel data; auth restoration and expiry are centralized; errors are shown. |
| UI and responsiveness | Consistent spacing, rounded thumbnails, feed headings, skeletons, improved auth and studio cards, accessible focus states, reduced-motion support and responsive layouts. Nonfunctional placeholder menu actions were removed. |

## Run

Use Node 22. From the repository root:

`npm run install:all`

Configure `server/.env` and `client/.env` using their existing examples, then run:

`npm run dev`

Checks:

- `npm run lint --prefix client`
- `npm run lint --prefix server`
- `npm test --prefix client`
- `npm test --prefix server`
- `npm run build --prefix client`
- `cd client`
- `npx playwright install chromium`
- `npm run test:e2e`

GitHub Actions runs these checks on pull requests and main using npm ci and the committed lockfiles. Browser tests mock the API and generate a real WebM fixture. They cover client behavior independently of a live database.

## Video publishing

The existing project publishes video **URLs and metadata**, not binary file uploads. In Studio, enter a publicly accessible direct media URL or a YouTube video URL, use Preview video, then Add video.

- Direct media must use HTTP(S) and a supported file extension; signed query parameters are retained.
- YouTube privacy, availability and embedding restrictions still apply. An external watch link is provided.
- Expired, private, hotlink-blocked, extensionless streaming endpoints, Google Drive page links and unsupported codecs require the creator to supply a supported public source.
- Existing database records are not rewritten or replaced with unrelated demo videos.
- Production media should use HTTPS when the frontend uses HTTPS.
- Duration is optional; new videos do not receive a fabricated duration.

## Deployment and verification

Keep the existing client/server root directories and environment configuration. Redeploy both services after merging. No MongoDB reset or reseed is needed.

After deployment, sign in, create a video in Studio with a source you control, open it from its card, play and seek, then test the menu, comments and reactions. Repeat at phone width. Live MongoDB persistence and third-party media availability require this deployment check.

Implementation references: [Redux Toolkit store](https://redux-toolkit.js.org/api/configureStore), [React Router](https://reactrouter.com/), [YouTube embedded players](https://developers.google.com/youtube/player_parameters).
