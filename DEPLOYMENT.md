# Deployment Guide

This MERN project should be deployed as two services:

- Backend API on Render
- Frontend Vite React app on Netlify

## 1. Prepare MongoDB Atlas

1. Create a MongoDB Atlas cluster.
2. Create a database user.
3. Allow network access for Render. For a simple capstone deployment, you can allow `0.0.0.0/0`.
4. Copy your connection string.

Example:

```text
mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/youtube_clone_capstone
```

Do not commit the real URI. When pasting the URI into Render, paste it as plain text with no quotes, no leading/trailing spaces, and no Markdown escape backslashes. For example, use `_` and `@`, not `\_` or `\@`.

## 2. Deploy Backend On Render

Render settings:

```text
Service type: Web Service
Repository: https://github.com/debgourab/YouTube-Clone.git
Branch: main
Root Directory: server
Runtime: Node
Build Command: npm install
Start Command: npm start
```

Environment variables:

```text
MONGODB_URI=<your MongoDB Atlas URI>
JWT_SECRET=<long random secret>
CLIENT_URL=<your Netlify site URL after frontend deployment>
```

Recommended Atlas URI shape:

```text
mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/youtube_clone_capstone?retryWrites=true&w=majority&appName=Cluster0
```

After Render deploys, your API URL will look like:

```text
https://youtube-clone-api.onrender.com
```

Check the API health endpoint:

```text
https://youtube-clone-api.onrender.com/
```

## 3. Deploy Frontend On Netlify

Netlify settings:

```text
Repository: https://github.com/debgourab/YouTube-Clone.git
Branch: main
Base directory: client
Build command: npm run build
Publish directory: dist
```

Environment variable:

```text
VITE_API_URL=https://your-render-backend-url.onrender.com/api
```

After adding or changing `VITE_API_URL`, redeploy the Netlify site because Vite bakes this value into the production build.

## 4. Update Render CORS

After Netlify gives you a frontend URL, go back to Render and set:

```text
CLIENT_URL=https://your-netlify-site.netlify.app
```

Then redeploy the Render backend.

## 5. Seed Production Database

Use Render Shell if your plan exposes it, or run locally against the Atlas URI:

```bash
cd server
set MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/youtube_clone_capstone
set JWT_SECRET=temporary_seed_secret
npm install
npm run seed
```

PowerShell alternative:

```powershell
cd server
$env:MONGODB_URI="mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/youtube_clone_capstone"
$env:JWT_SECRET="temporary_seed_secret"
npm install
npm run seed
```

## 6. Final URLs

Use these in your submission:

```text
Frontend: https://your-netlify-site.netlify.app
Backend API: https://your-render-backend-url.onrender.com
GitHub: https://github.com/debgourab/YouTube-Clone.git
```

## 7. Troubleshooting

- If login/register fails in production, check `VITE_API_URL` on Netlify and redeploy.
- If browser shows a CORS error, set Render `CLIENT_URL` to the exact Netlify URL.
- If Render build fails, confirm root directory is `server`.
- If Netlify build fails, confirm base directory is `client` and publish directory is `dist`.
- If video routes work locally but not production, confirm MongoDB Atlas IP access and database user credentials.
