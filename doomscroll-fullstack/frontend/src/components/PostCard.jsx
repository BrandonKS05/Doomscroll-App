import { Heart, MessageCircle } from "lucide-react";

function linkHashtags(text){
  const parts = text.split(/(#[A-Za-z0-9_]+)/g);
  return parts.map((p,i)=> p.startsWith("#")
    ? <a key={i} className="hashtag" href={`/?tag=${p.slice(1)}`} onClick={e=>e.preventDefault()}>{p}</a>
    : <span key={i}>{p}</span>
  );
}

export default function PostCard({ post, focused, liked, onLike, onToggleComments }){
  return (
    <article id={post.id} className="card post" tabIndex={0} aria-label={`Post by ${post.username}`}>
      <div className="row">
        <img className="avatar" src={post.avatar} alt={`${post.username} avatar`} />
        <div>
          <div style={{fontSize:14,fontWeight:600}}>{post.username}</div>
          <div className="meta">{new Date(post.created_at).toLocaleString()}</div>
        </div>
      </div>

      <div className="content">{linkHashtags(post.content)}</div>

      <div style={{marginTop:14, display:"flex", gap:16}}>
        <button className="iconbtn" onClick={onLike} aria-pressed={liked} title="Like (L)">
          <Heart size={18} style={{ fill: liked ? "currentColor":"none" }}/>
          <span>{post.like_count}</span>
        </button>
        <button className="iconbtn" onClick={onToggleComments} title="Comments">
          <MessageCircle size={18}/>
          <span>Comments</span>
        </button>
      </div>
    </article>
  );
}
