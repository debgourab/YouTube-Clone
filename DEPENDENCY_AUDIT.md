# Dependency Audit

Registry checks were performed with `npm view <package> version` on 2026-09-07. `npm outdated` returned no outdated packages for the root, client, or server package scopes after installation.

## Root

| Package | Previous Version | Final Version | Latest Stable Version | Status | Notes |
| --- | --- | --- | --- | --- | --- |
| concurrently | ^9.1.2 | 10.0.5 | 10.0.5 | Current | Used by the root `npm run dev` script. |

## Client Dependencies

| Package | Previous Version | Final Version | Latest Stable Version | Status | Notes |
| --- | --- | --- | --- | --- | --- |
| axios | ^1.7.9 | 1.20.0 | 1.20.0 | Current | API client and JWT request interceptor. |
| lucide-react | ^0.468.0 | 1.42.0 | 1.42.0 | Current | YouTube-style UI icons. |
| react | ^19.0.0 | 19.2.8 | 19.2.8 | Current | Frontend UI. |
| react-dom | ^19.0.0 | 19.2.8 | 19.2.8 | Current | React DOM rendering. |
| react-router-dom | ^7.1.1 | 7.18.3 | 7.18.3 | Current | Client routing. |

## Client Dev Dependencies

| Package | Previous Version | Final Version | Latest Stable Version | Status | Notes |
| --- | --- | --- | --- | --- | --- |
| @eslint/js | Not installed | 10.0.1 | 10.0.1 | Current | Added for linting. |
| @vitejs/plugin-react | ^4.3.4 | 6.1.1 | 6.1.1 | Current | Moved to devDependencies. |
| eslint | Not installed | 10.10.0 | 10.10.0 | Current | Added `npm run lint`. |
| eslint-plugin-react-hooks | Not installed | 7.1.1 | 7.1.1 | Current | React hooks linting. |
| eslint-plugin-react-refresh | Not installed | 0.5.6 | 0.5.6 | Current | React refresh linting available; noisy export rule disabled for context files. |
| globals | Not installed | 17.12.0 | 17.12.0 | Current | Browser globals for ESLint flat config. |
| vite | ^6.0.7 | 8.2.2 | 8.2.2 | Current | Vite frontend build tool. |

## Server Dependencies

| Package | Previous Version | Final Version | Latest Stable Version | Status | Notes |
| --- | --- | --- | --- | --- | --- |
| bcryptjs | ^2.4.3 | 3.0.3 | 3.0.3 | Current | Password hashing. |
| cors | ^2.8.5 | 2.8.6 | 2.8.6 | Current | CORS configuration. |
| dotenv | ^16.4.7 | 17.4.2 | 17.4.2 | Current | Environment variables. |
| express | ^4.21.2 | 5.2.1 | 5.2.1 | Current | API server; route code verified after major upgrade. |
| jsonwebtoken | ^9.0.2 | 9.0.3 | 9.0.3 | Current | JWT signing and verification. |
| mongoose | ^8.9.5 | 9.9.5 | 9.9.5 | Current | MongoDB models and queries; `returnDocument: "after"` used for Mongoose 9. |

## Server Dev Dependencies

| Package | Previous Version | Final Version | Latest Stable Version | Status | Notes |
| --- | --- | --- | --- | --- | --- |
| @eslint/js | Not installed | 10.0.1 | 10.0.1 | Current | Added for server linting. |
| eslint | Not installed | 10.10.0 | 10.10.0 | Current | Added `npm run lint`. |
| globals | Not installed | 17.12.0 | 17.12.0 | Current | Node globals for ESLint flat config. |
| nodemon | ^3.1.9 | 3.1.14 | 3.1.14 | Current | Backend development restart tool. |

## Verification

```text
npm install          -> 0 vulnerabilities
client npm install   -> 0 vulnerabilities
server npm install   -> 0 vulnerabilities
npm outdated         -> clean
client npm outdated  -> clean
server npm outdated  -> clean
npm run lint         -> pass
npm run build        -> pass
```
