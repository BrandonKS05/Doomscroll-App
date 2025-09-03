import { useEffect, useState } from "react";
import { addComment, getComments } from "../api";

export default function CommentList({ postId }){
  const [items,setItems] = useState([]);
  const [text,setText] = useState("");
  const [loading,setLoading] = useState(true);

  useEffect(()=>{
    let cancelled = false;
    (async ()=>{
      try{
        const list = await getComments(postId);
        if(!cancelled) setItems(list);
      } finally {
        if(!cancelled) setLoading(false);
      }
    })();
    return ()=>{ cancelled = true; };
  }, [postId]);

  const submit = async () => {
    const t = text.trim();
    if(!t) return;
    const c = await addComment(postId, t);
    setItems((arr)=> [...arr, c]);
    setText("");
  };

  if(loading) return <div className="meta">Loading comments…</div>;
  return (
    <div className="card" style={{marginTop:12}}>
      {items.length === 0 && <div className="meta">Be the first to comment.</div>}
      {items.map(c => (
        <div key={c.id} style={{marginBottom:12}}>
          <div className="row">
            <img className="avatar" src={c.avatar} alt="avatar"/>
            <div>
              <div style={{fontSize:13,fontWeight:600}}>{c.username}</div>
              <div className="meta">{new Date(c.created_at).toLocaleString()}</div>
            </div>
          </div>
          <div className="content">{c.content}</div>
        </div>
      ))}
      <div style={{display:"flex", gap:8, marginTop:8}}>
        <input
          className="input"
          placeholder="Add a comment…"
          value={text}
          onChange={(e)=>setText(e.target.value)}
          onKeyDown={(e)=>{ if(e.key === "Enter") submit(); }}
        />
        <button className="btn btn--primary" onClick={submit}>Send</button>
      </div>
    </div>
  );
}
