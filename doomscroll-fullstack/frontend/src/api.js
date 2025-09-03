const BASE = import.meta.env.VITE_API_URL || "http://localhost:4000";

export async function getPosts(){
  const res = await fetch(`${BASE}/api/posts`);
  if(!res.ok) throw new Error("failed to load posts");
  return res.json();
}
export async function createPost(content){
  const res = await fetch(`${BASE}/api/posts`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ content })
  });
  if(!res.ok) throw new Error("failed to create post");
  return res.json();
}
export async function likePost(id, delta){
  const res = await fetch(`${BASE}/api/posts/${id}/like`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ delta })
  });
  if(!res.ok) throw new Error("failed to like");
  return res.json();
}
export async function getComments(postId){
  const res = await fetch(`${BASE}/api/comments?postId=${encodeURIComponent(postId)}`);
  if(!res.ok) throw new Error("failed to load comments");
  return res.json();
}
export async function addComment(post_id, content){
  const res = await fetch(`${BASE}/api/comments`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ post_id, content })
  });
  if(!res.ok) throw new Error("failed to add comment");
  return res.json();
}
