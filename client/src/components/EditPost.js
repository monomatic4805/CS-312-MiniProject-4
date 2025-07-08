import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

export default function EditPost({ posts, onUpdate }) {
  const { postId } = useParams();
  const navigate = useNavigate();

  const postToEdit = posts.find((p) => p.id === Number(postId));
  const [title, setTitle] = useState(postToEdit ? postToEdit.title : '');
  const [content, setContent] = useState(postToEdit ? postToEdit.content : '');

  useEffect(() => {
    if (!postToEdit) {
      // If post not found, redirect back to posts list
      navigate('/posts');
    }
  }, [postToEdit, navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title || !content) return alert("Please fill in all fields.");

    const updatedPost = {
      ...postToEdit,
      title,
      content,
    };

    onUpdate(updatedPost);
    navigate('/posts'); // Redirect back to posts list after update
  };

  return (
    <div className="container" style={{ maxWidth: '700px' }}>
      <h2>Edit Post</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Title:</label>
          <input
            className="form-control"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Content:</label>
          <textarea
            className="form-control"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
          />
        </div>

        <button type="submit" className="btn btn-primary">Update</button>
      </form>
    </div>
  );
}