# YouTube Clone MERN Capstone

## Project Description

A submission-ready MERN YouTube Clone built with MongoDB, Express, React, Node.js, Vite, React Router, Axios, JWT authentication, and Mongoose. The application keeps the original client/server structure while completing the capstone requirements for a YouTube-style homepage, video player, authentication, channel management, video CRUD, comments CRUD, likes/dislikes, search, filters, seed data, and documentation.

## Features

- YouTube-style sticky header with hamburger menu, brand mark, search, voice icon, and auth area
- Toggleable sidebar with Home, Shorts, Subscriptions, You/Library, and Explore sections
- Responsive homepage with horizontally scrollable filters and dynamic video cards
- Case-insensitive title search that works together with category filtering
- JWT registration/login with username, email, password validation, hashed passwords, persistent auth, and logout
- Channel creation and channel settings for signed-in users
- Channel page with banner, avatar, handle, description, subscriber count, and video grid
- Authenticated video create, read, update, and delete from the channel studio
- Watch page with playable video, metadata, channel chip, description, comments, and related videos
- Authenticated like/dislike toggles that prevent duplicate count inflation
- Full comment CRUD with owner-only edit/delete authorization
- MongoDB seed script with realistic channels, videos, categories, thumbnails, and playable video URLs
- Professional docs for setup, testing, dependencies, and assignment compliance

## Assignment Requirements Covered

- React frontend uses Vite, not Create React App
- Backend uses ES Modules with `import` and `export`
- MongoDB is accessed through Mongoose models for `User`, `Channel`, `Video`, and `Comment`
- Authentication uses JWT and bcrypt password hashing
- Search filters videos by title
- At least six category filters are available; this project includes nine plus `All`
- Channel creation is protected behind sign-in
- Video CRUD is restricted to the owning channel/user
- Comments support create, read, update, and delete with owner checks
- Like/dislike actions are functional and persisted
- Responsive layouts support desktop, tablet, and mobile

## Technologies Used

- Frontend: React 19, Vite 8, React Router 7, Axios, Lucide React, CSS
- Backend: Node.js, Express 5, MongoDB, Mongoose 9, JWT, bcryptjs, CORS, dotenv
- Tooling: ESLint 10, npm scripts, concurrently, nodemon

## Project Structure

```text
project-root/
|-- client/
|   |-- public/avatars/
|   |-- src/
|   |   |-- components/
|   |   |-- context/
|   |   |-- pages/
|   |   |-- utils/
|   |   |-- api.js
|   |   |-- App.jsx
|   |   |-- main.jsx
|   |   `-- styles.css
|   |-- .env.example
|   |-- eslint.config.js
|   |-- package.json
|   `-- vite.config.js
|-- server/
|   |-- src/
|   |   |-- data/
|   |   |-- middleware/
|   |   |-- models/
|   |   |-- routes/
|   |   |-- utils/
|   |   |-- app.js
|   |   |-- db.js
|   |   `-- server.js
|   |-- .env.example
|   |-- eslint.config.js
|   `-- package.json
|-- ASSIGNMENT_CHECKLIST.md
|-- DEPENDENCY_AUDIT.md
|-- TESTING.md
|-- README.md
`-- package.json
```

## Prerequisites

- Node.js `20.19.0` or newer
- npm `11` or newer recommended
- MongoDB running locally or a MongoDB Atlas connection string
- VS Code or another code editor

## Environment Variables

Create `server/.env` from `server/.env.example`:

```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/youtube_clone_capstone
JWT_SECRET=replace_this_with_a_long_random_secret
CLIENT_URL=http://127.0.0.1:5173
```

Optional client override in `client/.env`:

```env
VITE_API_URL=http://localhost:5000/api
```

Do not commit real secrets.

## Installation

From the project root:

```bash
npm run install:all
```

## MongoDB Setup

Start MongoDB locally with MongoDB Compass, Windows Services, or your normal `mongod` setup. The default local URI is:

```text
mongodb://127.0.0.1:27017/youtube_clone_capstone
```

For MongoDB Atlas, put the Atlas URI in `server/.env` as `MONGODB_URI`.

## Backend Setup

```bash
cd server
npm install
npm start
```

Development mode with automatic restart:

```bash
cd server
npm run dev
```

## Frontend Setup

```bash
cd client
npm install
npm run dev
```

Frontend URL:

```text
http://127.0.0.1:5173
```

## Seed Database

From the root:

```bash
npm run seed
```

Seed login accounts:

```text
deb@example.com / password123
maya@example.com / password123
```

## Running Development Environment

From the root after creating `server/.env`:

```bash
npm run dev
```

This starts:

- Backend API: `http://localhost:5000`
- Frontend app: `http://127.0.0.1:5173`

## API Base URL

```text
http://localhost:5000/api
```

## API Endpoints

### Authentication

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`

### Videos

- `GET /api/videos`
- `GET /api/videos?search=React&category=React`
- `GET /api/videos/:id`
- `POST /api/videos`
- `PUT /api/videos/:id`
- `DELETE /api/videos/:id`
- `PUT /api/videos/:id/like`
- `PUT /api/videos/:id/dislike`
- `GET /api/videos/:videoId/comments`
- `POST /api/videos/:videoId/comments`

### Channels

- `POST /api/channels`
- `GET /api/channels/mine`
- `GET /api/channels/user/:userId`
- `GET /api/channels/:id`
- `PUT /api/channels/:id`

### Comments

- `GET /api/comments/video/:videoId`
- `POST /api/comments/video/:videoId`
- `PUT /api/comments/:id`
- `DELETE /api/comments/:id`

## Authentication Flow

1. Register with username, email, and password.
2. After successful registration, the frontend switches to the login form.
3. Login with email or username and password.
4. The backend returns a JWT and public user object.
5. The frontend stores the JWT, verifies it with `/api/auth/me` on refresh, and clears invalid sessions.
6. Protected backend routes require:

```text
Authorization: Bearer <JWT_TOKEN>
```

## Testing Instructions

Run these commands from the root:

```bash
npm run lint
npm run build
```

Run the backend and frontend:

```bash
npm run dev
```

Then test:

- Register and login
- Search videos by title
- Try each category filter
- Create a channel from `Your channel`
- Add, edit, and delete a video
- Open a video page
- Like and dislike while signed in
- Add, edit, and delete your own comment
- Confirm another user cannot edit/delete your content
- Resize the browser to desktop, tablet, and mobile widths

## Thunder Client/Postman Testing

Use `TESTING.md` for an endpoint-by-endpoint sequence with request bodies, expected status codes, and authorization notes.

## Production Build

```bash
npm run build
```

The frontend production output is created in `client/dist/`.

## Screens / Pages

- `/` - YouTube-style homepage
- `/auth` - Login/register page
- `/watch/:id` - Video player page
- `/channel/:id` - Public channel page
- `/studio` - Protected channel/video management page

## GitHub Submission Notes

- Do not submit `node_modules/`
- Do not submit `.env`
- Keep `package-lock.json`, `client/package-lock.json`, and `server/package-lock.json`
- Include `README.md`, `TESTING.md`, `DEPENDENCY_AUDIT.md`, and `ASSIGNMENT_CHECKLIST.md`

## Deployment

Use [DEPLOYMENT.md](DEPLOYMENT.md) for the Render backend and Netlify frontend deployment steps.

## Author

Deb Gourab Biswas

## GitHub Repo : [https://github.com/debgourab/YouTube-Clone.git]
