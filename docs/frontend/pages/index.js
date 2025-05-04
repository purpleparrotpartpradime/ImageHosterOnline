import React, { useState, useEffect } from 'react';
import Link from 'next/link';

export default function Home() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    fetch('/api/posts').then(res => res.json()).then(setPosts);
  }, []);

  const copyId = (id) => {
    navigator.clipboard.writeText(`${window.location.origin}/post/${id}`);
    alert('Link copied!');
  };

  return (
    <div>
      <header>
        <h1>ImageHoster.Land</h1>
        <input placeholder="Search..." />
        <Link href="/post"><button>Post</button></Link>
      </header>
      <main>
        {posts.map(post => (
          <div key={post._id} style={{border:'1px solid #ccc', margin:'10px', padding:'10px'}}>
            <button onClick={() => copyId(post._id)} style={{float:'right'}}>Copy ID</button>
            <h2>{post.title}</h2>
            <p>{post.body}</p>
            {post.type === 'image' && <img src={`/uploads/${post.file}`} alt="" style={{maxWidth:'100%'}} />}
            {post.type === 'video' && <video controls src={`/uploads/${post.file}`} style={{maxWidth:'100%'}} />}
          </div>
        ))}
      </main>
    </div>
  );
}
