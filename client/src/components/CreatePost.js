import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function CreatePost({ onCreate, currentUser }) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!title || !content) {
      alert('Please fill in all fields.');
      return;
    }

    const newPost = {
      id: Date.now(),
      title,
      content,
      userId: currentUser.id,
      user: {
        username: currentUser.username,
        name: currentUser.name,
      },
    };

    onCreate(newPost);
    navigate('/posts');
  };

  return (
    <div className="container" style={{ maxWidth: '700px' }}>
      <h2>Create New Post</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label>Title:</label>
          <input
            className="form-control"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label>Content:</label>
          <textarea
            className="form-control"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
          />
        </div>
        <button className="btn btn-primary" type="submit">
          Post
        </button>
      </form>
    </div>
  );
}