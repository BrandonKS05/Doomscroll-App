// Express + SQLite backend (file-backed).
// Clean, commented, and easy to extend.

const express = require("express");
const cors = require("cors");
const path = require("path");
const { randomUUID } = require("crypto");
const Database = require("better-sqlite3");

const PORT = process.env.PORT || 4000;
const app = express();

// Allow local dev frontend
app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.json());

// ---- SQLite setup ----
const DB_FILE = path.join(__dirname, "db.sqlite");
const db = new Database(DB_FILE);

// Create tables if missing
db.exec(`
PRAGMA journal_mode = WAL;
CREATE TABLE IF NOT EXISTS posts (
  id TEXT PRIMARY KEY,
  username TEXT NOT NULL,
  avatar TEXT NOT NULL,
  content TEXT NOT NULL,
  created_at TEXT NOT NULL,
  like_count INTEGER NOT NULL DEFAULT 0
);
CREATE TABLE IF NOT EXISTS comments (
  id TEXT PRIMARY KEY,
  post_id TEXT NOT NULL,
  username TEXT NOT NULL,
  avatar TEXT NOT NULL,
  content TEXT NOT NULL,
  created_at TEXT NOT NULL,
  FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE
);
`);

// Seed minimal data if empty
const count = db.prepare("SELECT COUNT(*) AS c FROM posts").get().c;
if (count === 0) {
  const insert = db.prepare(`INSERT INTO posts (id, username, avatar, content, created_at, like_count)
    VALUES (@id, @username, @avatar, @content, @created_at, @like_count)`);
  insert.run({
    id: randomUUID(),
    username: "Helen Wu",
    avatar: "https://placehold.co/80x80",
    content: "I need more apps to doomscroll! #changepp",
    created_at: new Date(Date.now() - 2 * 3600 * 1000).toISOString(),
    like_count: 2
  });
  insert.run({
    id: randomUUID(),
    username: "Brandon Lee",
    avatar: "https://placehold.co/80x80",
    content: "Monotone UI > everything.",
    created_at: new Date(Date.now() - 3 * 3600 * 1000).toISOString(),
    like_count: 1
  });
}

// ---- Routes ----
app.get("/api/health", (_req, res) => res.json({ status: "ok" }));

// List posts (newest first)
app.get("/api/posts", (_req, res) => {
  const rows = db.prepare("SELECT * FROM posts ORDER BY datetime(created_at) DESC").all();
  res.json(rows);
});

// Create a post
app.post("/api/posts", (req, res) => {
  const { content, username = "You", avatar = "https://placehold.co/80x80" } = req.body || {};
  const trimmed = String(content || "").trim();
  if (!trimmed) return res.status(400).json({ error: "content required" });

  const post = {
    id: randomUUID(),
    username,
    avatar,
    content: trimmed,
    created_at: new Date().toISOString(),
    like_count: 0
  };
  db.prepare(`INSERT INTO posts (id, username, avatar, content, created_at, like_count)
              VALUES (@id, @username, @avatar, @content, @created_at, @like_count)`)
    .run(post);
  res.status(201).json(post);
});

// Like/unlike a post (delta = +1 or -1)
app.post("/api/posts/:id/like", (req, res) => {
  const { id } = req.params;
  const { delta } = req.body || {};
  if (![1, -1].includes(delta)) {
    return res.status(400).json({ error: "delta must be 1 or -1" });
  }
  const row = db.prepare("SELECT like_count FROM posts WHERE id = ?").get(id);
  if (!row) return res.status(404).json({ error: "post not found" });

  const next = Math.max(0, row.like_count + delta);
  db.prepare("UPDATE posts SET like_count = ? WHERE id = ?").run(next, id);
  res.json({ like_count: next });
});

// Get comments for a post
app.get("/api/comments", (req, res) => {
  const { postId } = req.query;
  if (!postId) return res.status(400).json({ error: "postId required" });
  const rows = db.prepare("SELECT * FROM comments WHERE post_id = ? ORDER BY datetime(created_at) ASC").all(postId);
  res.json(rows);
});

// Add a comment
app.post("/api/comments", (req, res) => {
  const { post_id, content, username = "You", avatar = "https://placehold.co/80x80" } = req.body || {};
  const trimmed = String(content || "").trim();
  if (!post_id || !trimmed) return res.status(400).json({ error: "post_id and content required" });

  // Ensure post exists
  const p = db.prepare("SELECT id FROM posts WHERE id = ?").get(post_id);
  if (!p) return res.status(404).json({ error: "post not found" });

  const comment = {
    id: randomUUID(),
    post_id,
    username,
    avatar,
    content: trimmed,
    created_at: new Date().toISOString()
  };
  db.prepare(`INSERT INTO comments (id, post_id, username, avatar, content, created_at)
              VALUES (@id, @post_id, @username, @avatar, @content, @created_at)`)
    .run(comment);
  res.status(201).json(comment);
});

app.listen(PORT, () => {
  console.log(`API listening on http://localhost:${PORT}`);
});
