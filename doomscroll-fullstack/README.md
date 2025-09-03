# Doomscroll (Change++ Coding Challenge)

**Author:** YOUR NAME HERE  
**Email:** YOUR VANDERBILT EMAIL HERE

A minimal, polished social app for doomscrolling: create posts, like posts, and leave comments.  
Monotone aesthetic, responsive, clean code. Full-stack: **React (Vite) + Express + SQLite**.

## Features
- Create posts (text, supports hashtags like `#vandy` visually)
- Like / Unlike posts (optimistic UI)
- Comment on posts (expand per-post)
- Sorted feed (newest first)
- Persistent storage via **SQLite** (file: `backend/db.sqlite`)
- Monotone, minimal UI; responsive; keyboard shortcut **L** to like focused post

## Tech Stack
**Frontend:** Vite + React 18, vanilla CSS (monotone theme)  
**Backend:** Node.js + Express + SQLite (via `better-sqlite3`)  
**Data:** SQLite tables: `posts`, `comments`

## How to Run (local)
```bash
# 0) From the project root:
npm install        # installs root dev deps (concurrently)

# 1) Start backend (port 4000) and frontend (5173) together
npm run dev
# or run them separately:
# npm run dev:backend
# npm run dev:frontend
```

Once running, open **http://localhost:5173**

### API Base URL
Frontend points to `http://localhost:4000` by default. You can override with:
- Create `frontend/.env` containing:  
  `VITE_API_URL=http://localhost:4000`

## Scripts
- `npm run dev` — runs both frontend and backend concurrently
- `npm run dev:backend` — backend only
- `npm run dev:frontend` — frontend only
- `npm run build` — builds frontend
- `npm run preview` — previews built frontend

## SQLite Database
A file-backed SQLite DB is created automatically at `backend/db.sqlite` with two tables:
- `posts (id TEXT PK, username TEXT, avatar TEXT, content TEXT, created_at TEXT, like_count INTEGER)`
- `comments (id TEXT PK, post_id TEXT, username TEXT, avatar TEXT, content TEXT, created_at TEXT)`

## Reflection (≤100 words)
_Replace with your reflection:_  
What I learned, issues I hit, what I’d improve next (e.g., auth, profiles, infinite scroll, image uploads, search by hashtag, notifications).

## Feedback on Challenge (optional)
_Replace with feedback:_  
What worked well, what could be clearer—timeline, workshops, office hours, etc.

---

## Endpoint Summary
- `GET  /api/health` → `{ status: "ok" }`
- `GET  /api/posts` → list posts (newest first)
- `POST /api/posts` → body: `{ content, username?, avatar? }`
- `POST /api/posts/:id/like` → body: `{ delta: 1 | -1 }`
- `GET  /api/comments?postId=...` → comments for a post
- `POST /api/comments` → body: `{ post_id, content, username?, avatar? }`

## Notes on Code Quality
- Clear separation of concerns (frontend vs backend)
- Small, focused React components (`Composer`, `Feed`, `PostCard`, `CommentList`)
- Intentional comments and consistent naming
- Monotone, accessible UI with responsive layout

Good luck! 📱🖤
