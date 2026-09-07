# API Testing Guide

Base URL:

```text
http://localhost:5000/api
```

Protected requests require:

```text
Authorization: Bearer <JWT_TOKEN>
```

## 1. Register

`POST /auth/register`

```json
{
  "username": "capstoneUser",
  "email": "capstone.user@example.com",
  "password": "password123"
}
```

Expected: `201 Created`

Invalid registration examples:

- Short username: `400`
- Invalid email: `400`
- Short password: `400`
- Duplicate email or username: `409`

## 2. Login

`POST /auth/login`

```json
{
  "identifier": "capstone.user@example.com",
  "password": "password123"
}
```

Expected: `200 OK`

Copy the returned `token` for protected requests.

Invalid credentials:

```json
{
  "identifier": "capstone.user@example.com",
  "password": "wrongpass"
}
```

Expected: `401 Unauthorized`

## 3. Current User

`GET /auth/me`

Headers:

```text
Authorization: Bearer <JWT_TOKEN>
```

Expected: `200 OK`

Without token: `401 Unauthorized`

## 4. List, Search, And Filter Videos

`GET /videos`

Expected: `200 OK`

Search by title:

```text
GET /videos?search=React
```

Filter by category:

```text
GET /videos?category=React
```

Search and filter together:

```text
GET /videos?search=React&category=React
```

## 5. Create Channel

`POST /channels`

Headers:

```text
Authorization: Bearer <JWT_TOKEN>
```

```json
{
  "channelName": "Capstone Code",
  "handle": "capstonecode",
  "description": "A channel for MERN project demos and coding tutorials.",
  "channelBanner": "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1400&q=80",
  "avatar": "/avatars/channel.svg"
}
```

Expected: `201 Created`

## 6. Get My Channels

`GET /channels/mine`

Headers:

```text
Authorization: Bearer <JWT_TOKEN>
```

Expected: `200 OK`

## 7. View Channel

`GET /channels/:id`

Expected: `200 OK`

Invalid ID or missing channel: `404 Not Found`

## 8. Edit Channel

`PUT /channels/:id`

Headers:

```text
Authorization: Bearer <JWT_TOKEN>
```

```json
{
  "channelName": "Capstone Code Updated",
  "description": "Updated channel description for the capstone submission."
}
```

Expected: `200 OK`

Non-owner token: `403 Forbidden`

## 9. Create Video

`POST /videos`

Headers:

```text
Authorization: Bearer <JWT_TOKEN>
```

```json
{
  "title": "React Capstone Walkthrough",
  "description": "A complete walkthrough of the React and MERN capstone YouTube clone.",
  "thumbnailUrl": "https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&w=900&q=80",
  "videoUrl": "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4",
  "category": "React",
  "duration": "10:42",
  "channelId": "<CHANNEL_ID>"
}
```

Expected: `201 Created`

Missing fields or invalid URLs: `400 Bad Request`

Wrong channel owner: `403 Forbidden`

## 10. Edit Video

`PUT /videos/:id`

Headers:

```text
Authorization: Bearer <JWT_TOKEN>
```

```json
{
  "title": "Updated React Capstone Walkthrough",
  "description": "Updated description for the video edit API test.",
  "thumbnailUrl": "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=900&q=80",
  "videoUrl": "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4",
  "category": "Web Development",
  "duration": "12:00"
}
```

Expected: `200 OK`

Non-owner token: `403 Forbidden`

## 11. Delete Video

`DELETE /videos/:id`

Headers:

```text
Authorization: Bearer <JWT_TOKEN>
```

Expected: `200 OK`

Non-owner token: `403 Forbidden`

## 12. Watch Video

`GET /videos/:id`

Expected: `200 OK`

Response includes:

- `video`
- `comments`
- `related`

Invalid ID or missing video: `404 Not Found`

## 13. Like And Dislike

`PUT /videos/:id/like`

Headers:

```text
Authorization: Bearer <JWT_TOKEN>
```

Expected: `200 OK`

Calling the same endpoint again removes the like and prevents duplicate inflation.

`PUT /videos/:id/dislike`

Expected: `200 OK`

Switching from like to dislike removes the previous like.

## 14. Create Comment

`POST /videos/:videoId/comments`

Headers:

```text
Authorization: Bearer <JWT_TOKEN>
```

```json
{
  "text": "This is a helpful video."
}
```

Expected: `201 Created`

Blank text: `400 Bad Request`

## 15. Read Comments

`GET /videos/:videoId/comments`

Expected: `200 OK`

## 16. Edit Comment

`PUT /comments/:id`

Headers:

```text
Authorization: Bearer <JWT_TOKEN>
```

```json
{
  "text": "This edited comment should persist in MongoDB."
}
```

Expected: `200 OK`

Non-owner token: `403 Forbidden`

## 17. Delete Comment

`DELETE /comments/:id`

Headers:

```text
Authorization: Bearer <JWT_TOKEN>
```

Expected: `200 OK`

Non-owner token: `403 Forbidden`

## 18. Frontend Manual Test Checklist

- Register, then confirm the login form appears
- Login and confirm the header shows your username/avatar
- Refresh and confirm the user remains signed in
- Logout and confirm Sign In appears
- Search by title
- Use every filter chip
- Create a channel from `/studio`
- Create a video and confirm it appears on `/`, `/channel/:id`, search results, and its category filter
- Edit and delete your own video
- Open a video and play it
- Like, unlike, dislike, and refresh
- Add, edit, and delete a comment
- Test another account cannot edit/delete your video or comment
- Resize to 1440px, 1024px, 768px, 480px, and 375px
