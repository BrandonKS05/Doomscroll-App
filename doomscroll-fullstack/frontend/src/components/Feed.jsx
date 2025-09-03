import { useEffect, useMemo, useState } from "react";
import { getPosts, likePost } from "../api";
import PostCard from "./PostCard.jsx";
import CommentList from "./CommentList.jsx";

export default function Feed(){
  const [posts,setPosts] = useState([]);
  const [expanded,setExpanded] = useState({}); // postId => boolean
  const [liked,setLiked] = useState({});       // local like memory (no auth)

  useEffect(()=>{
    (async ()=>{
      const list = await getPosts();
      setPosts(list);
    })();
  },[]);

  // Keyboard: L to like the first visible/expanded post
  useEffect(()=>{
    const onKey = (e)=>{
      if(e.key.toLowerCase() !== "l") return;
      if(posts.length === 0) return;
      const id = posts[0].id;
      toggleLike(id);
    };
    window.addEventListener("keydown", onKey);
    return ()=> window.removeEventListener("keydown", onKey);
  }, [posts]);

  // When a new post is created (Composer dispatches), prepend
  useEffect(()=>{
    const handler = (e)=>{
      setPosts((arr)=> [e.detail, ...arr]);
    };
    window.addEventListener("post-created", handler);
    return ()=> window.removeEventListener("post-created", handler);
  },[]);

  const toggleLike = async (id) => {
    const currentlyLiked = !!liked[id];
    // optimistic UI
    setLiked((m)=> ({...m, [id]: !currentlyLiked}));
    setPosts((arr)=> arr.map(p=> p.id===id ? {...p, like_count: Math.max(0, p.like_count + (currentlyLiked?-1:1))} : p));
    try{
      await likePost(id, currentlyLiked ? -1 : 1);
    }catch{
      // revert on failure
      setLiked((m)=> ({...m, [id]: currentlyLiked}));
      setPosts((arr)=> arr.map(p=> p.id===id ? {...p, like_count: Math.max(0, p.like_count + (currentlyLiked?1:-1))} : p));
    }
  };

  const toggleComments = (id)=> setExpanded((m)=> ({...m, [id]: !m[id]}));

  if(posts.length === 0) return <div className="card">No posts yet.</div>;

  return (
    <>
      {posts.map(p => (
        <div key={p.id}>
          <PostCard
            post={p}
            liked={!!liked[p.id]}
            onLike={()=>toggleLike(p.id)}
            onToggleComments={()=>toggleComments(p.id)}
          />
          {expanded[p.id] && <CommentList postId={p.id}/>}
        </div>
      ))}
    </>
  );
}
