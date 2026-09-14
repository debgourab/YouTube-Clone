# YouTube Clone — MERN Video Platform

A full-stack video application for discovering videos, managing creator channels, and joining conversations through comments and reactions. Built with React, Redux Toolkit, Node.js, Express, and MongoDB.

**Author:** Deb Gourab Biswas  
**Repository:** [debgourab/YouTube-Clone](https://github.com/debgourab/YouTube-Clone)

## Features

- Search videos by title and filter by category.
- Watch public direct-media links and embedded YouTube videos, with playback errors and retry controls.
- Create and manage channels, publish video metadata, and edit or delete your own videos.
- Register and sign in with JWT authentication and bcrypt password hashing.
- Like/dislike videos and create, edit, or delete your own comments.
- Navigate through a responsive sidebar and an accessible mobile/watch-page drawer.
- Load pages and images lazily, with loading skeletons and route error recovery.

## Tech stack

| Area | Technologies |
| --- | --- |
| Frontend | React, Vite, React Router, CSS, Lucide React |
| State and requests | Redux Toolkit, React Redux, RTK Query, Axios |
| Backend | Node.js, Express, JWT, bcryptjs |
| Database | MongoDB, Mongoose |
| Quality | ESLint, Node.js test runner, Playwright, GitHub Actions |
| Deployment | Render backend, Netlify frontend |

## Architecture

The React client calls the Express REST API. Mongoose models store users, channels, video metadata, and comments in MongoDB. Protected API routes validate JWTs and check ownership before allowing changes.

Redux slices manage authentication and navigation state. RTK Query caches the video feed and invalidates it after publishing or deleting videos. Forms keep their state locally. Routing uses `createBrowserRouter`, `React.lazy`, and `Suspense`.

| Path | Purpose |
| --- | --- |
| [client/src/pages/](client/src/pages/) | Home, authentication, watch, channel, and studio pages |
| [client/src/components/](client/src/components/) | Shared navigation, video cards, player, and filters |
| [client/src/store/](client/src/store/) | Redux slices, store configuration, and RTK Query |
| [client/src/context/](client/src/context/) | Compatibility hook for Redux authentication |
| [client/src/utils/](client/src/utils/) | Media, password, formatting, and session helpers |
| [client/src/router.jsx](client/src/router.jsx) | Routes and protected-page handling |
| [client/src/styles.css](client/src/styles.css) | Responsive layouts and component styles |
| [client/tests/](client/tests/) | Client utility tests |
| [client/e2e/](client/e2e/) | Desktop and mobile browser tests |
| [server/src/models/](server/src/models/) | User, Channel, Video, and Comment schemas |
| [server/src/routes/](server/src/routes/) | Authentication, channels, videos, and comments API |
| [server/src/middleware/](server/src/middleware/) | Authentication middleware |
| [server/src/data/seed.js](server/src/data/seed.js) | Optional development demo data |
| [server/tests/](server/tests/) | Validation and API tests |
| [.github/workflows/quality.yml](.github/workflows/quality.yml) | Automated quality checks |
| [render.yaml](render.yaml) / [netlify.toml](netlify.toml) | Hosting configuration |

## Run locally

### 1. Clone and install

Use Node.js 22 and a local MongoDB instance or MongoDB Atlas database.

```bash
git clone https://github.com/debgourab/YouTube-Clone.git
cd YouTube-Clone
npm ci
npm ci --prefix client
npm ci --prefix server
```

### 2. Configure the environment

Copy [server/.env.example](server/.env.example) to `server/.env`, and [client/.env.example](client/.env.example) to `client/.env`.

Server configuration:

```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/youtube_clone_capstone
JWT_SECRET=replace_with_a_long_random_secret
CLIENT_URL=http://127.0.0.1:5173
```

Client configuration:

```env
VITE_API_URL=http://localhost:5000/api
```

For Atlas, replace `MONGODB_URI` with your connection string and configure database-user and network access. Keep credentials in environment variables; do not commit `.env` files.

### 3. Start the application

From the repository root:

```bash
npm run dev
```

- Frontend: [http://127.0.0.1:5173](http://127.0.0.1:5173)
- API base URL: [http://localhost:5000/api](http://localhost:5000/api)
- API status: [http://localhost:5000/](http://localhost:5000/)

To start services separately, use `npm run server` and `npm run client` in separate terminals.

### Optional development data

Run `npm run seed` against a development database to add sample channels and videos. The script skips seeding when videos already exist.

Local demo accounts are `deb@example.com` and `maya@example.com`, both with password `password123`. These are seeded demonstration accounts; new registrations require the stronger rules below. Use your own accounts for a public deployment. The seed script's `--reset` option deletes existing data and is not required for updates or redeployment.

## Application routes

| Route | Page |
| --- | --- |
| `/` | Video feed, search, and category filters |
| `/auth` | Registration and sign-in |
| `/watch/:id` | Player, reactions, comments, and related videos |
| `/channel/:id` | Public channel page |
| `/studio` | Protected channel and video management |

## Video publishing

Sign in, open Creator Studio, create or select a channel, and enter the video's title, description, thumbnail URL, category, and video URL. Use **Preview video**, then **Add video**.

The application stores video URLs and metadata; it does not upload or transcode binary video files.

Supported sources include public MP4, WebM, Ogg/OGV, and M4V URLs, plus YouTube watch, share, shorts, live, and embed links. Use HTTPS media on an HTTPS deployment. Private or expired URLs, embedding restrictions, blocked hosts, and unsupported codecs can prevent playback. Drive page links and extensionless streaming endpoints are not supported.

## Authentication and API

New passwords require at least eight characters, uppercase and lowercase letters, a number, and a special character. Whitespace is disallowed, and the maximum is 72 UTF-8 bytes.

Use `Content-Type: application/json` for JSON requests. Protected endpoints also require:

```text
Authorization: Bearer <JWT_TOKEN>
```

| Method | Endpoint (relative to /api) | Purpose |
| --- | --- | --- |
| POST | `/auth/register` | Create an account |
| POST | `/auth/login` | Sign in and receive a token |
| GET | `/auth/me` | Read the signed-in user |
| GET | `/videos?search=React&category=React` | List, search, and filter videos |
| GET | `/videos/:id` | Get video, comments, and related videos |
| POST | `/videos` | Publish video metadata |
| PUT / DELETE | `/videos/:id` | Edit or delete an owned video |
| PUT | `/videos/:id/like`, `/videos/:id/dislike` | Toggle reactions |
| POST | `/channels` | Create a channel |
| GET | `/channels/mine` | List your channels |
| GET | `/channels/user/:userId` | List a user's channels |
| GET / PUT | `/channels/:id` | Read a channel or update an owned channel |
| GET / POST | `/videos/:videoId/comments` | Read or create comments |
| PUT / DELETE | `/comments/:id` | Update or delete an owned comment |

### Quick Postman / Thunder Client check

Register with `POST /api/auth/register`:

```json
{
  "username": "demoCreator",
  "email": "creator@example.com",
  "password": "CreatorPass1!"
}
```

Expect `201 Created`. Then call `POST /api/auth/login`:

```json
{
  "identifier": "creator@example.com",
  "password": "CreatorPass1!"
}
```

Expect `200 OK`. Copy the returned token into the Bearer authorization header and call `GET /api/auth/me`. Invalid registration input returns `400`, invalid credentials return `401`, and duplicate accounts return `409`.

For a complete manual flow, create a channel in Studio, publish a supported video link, play it, test reactions and comments, then edit and delete your own content. Use another account to check ownership restrictions and repeat at mobile width.

## Tests and production build

Run from the repository root:

```bash
npm run lint
npm test --prefix client
npm test --prefix server
npm run build
```

For browser tests:

```bash
cd client
npx playwright install chromium
npm run test:e2e
```

GitHub Actions runs clean dependency installs, linting, validation tests, the production build, and desktop/mobile Playwright tests. Browser tests mock API responses and generate a real WebM fixture to verify playback; live database persistence and third-party media availability require separate deployment checks.

The frontend build is written to `client/dist/`.

## Deployment

The repository includes configuration for a Render backend and Netlify frontend.

| Setting | Render | Netlify |
| --- | --- | --- |
| Branch | `main` | `main` |
| Root/base directory | `server` | `client` |
| Build command | `npm install` | `npm run build` |
| Start command | `npm start` | — |
| Publish directory | — | `dist` |

Set these environment variables:

- **Render:** `MONGODB_URI`, `JWT_SECRET`, and `CLIENT_URL` set to the exact frontend origin.
- **Netlify:** `VITE_API_URL` set to your backend URL followed by `/api`.

After merging updates into `main`, deploy the latest commit on both services. Changes to `VITE_API_URL` require a frontend rebuild. No database reset or reseed is needed.

If requests fail, check the API base URL, the exact CORS origin, and MongoDB connectivity. If a video fails, use the player's original-link action to check whether its source remains publicly accessible.

## Author

**Deb Gourab Biswas**

- [GitHub profile](https://github.com/debgourab)
- [Project repository](https://github.com/debgourab/YouTube-Clone)

This is an independent learning and portfolio project inspired by YouTube, with no affiliation to YouTube or Google.
