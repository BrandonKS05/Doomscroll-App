import { useState } from "react";
import { createPost } from "../api";

export default function Composer(){
  const [text,setText] = useState("");
  const [loading,setLoading] = useState(false);
  const [error,setError] = useState("");

  const submit = async () => {
    const t = text.trim();
    if(!t) return;
    try{
      setLoading(true); setError("");
      const post = await createPost(t);
      window.dispatchEvent(new CustomEvent("post-created", { detail: post }));
      setText("");
    }catch(e){
      setError(e.message || "Failed to post");
    }finally{
      setLoading(false);
    }
  };

  return (
    <div className="card">
      <textarea
        className="textarea"
        rows={3}
        placeholder="What’s on your mind? Use #hashtags"
        value={text}
        onChange={(e)=>setText(e.target.value)}
        disabled={loading}
      />
      {error && <div className="meta" style={{color:"#b00020"}}>{error}</div>}
      <div style={{height:8}}/>
      <div className="actions">
        <button className="btn btn--primary" onClick={submit} disabled={loading}>
          {loading ? "Posting..." : "Post"}
        </button>
      </div>
    </div>
  );
}
