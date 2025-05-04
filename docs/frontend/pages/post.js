import React, { useState } from 'react';
export default function Post() {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [file, setFile] = useState(null);

  const submit = async () => {
    const form = new FormData();
    form.append('title', title);
    form.append('body', body);
    form.append('file', file);
    await fetch('/api/posts', { method: 'POST', body: form });
    window.location.href = '/';
  };

  return (
    <div>
      <h1>Create Post</h1>
      <input placeholder="Title" onChange={e => setTitle(e.target.value)} /><br/>
      <textarea placeholder="Body" onChange={e => setBody(e.target.value)} /><br/>
      <input type="file" onChange={e => setFile(e.target.files[0])} /><br/>
      <button onClick={submit}>Submit</button>
    </div>
  );
}
