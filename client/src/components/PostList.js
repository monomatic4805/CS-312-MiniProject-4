import React from 'react';
import { Link } from 'react-router-dom';

export default function PostList({ posts, currentUser, onDelete }) {
  return (
    <div className="container">
      <h2>Community Posts</h2>
      {posts.length === 0 ? (
        <p>No posts yet.</p>
      ) : (
        posts.map((post) => (
          <div key={post.id} className="card mb-3">
            <div className="card-body">
              <h5 className="card-title">{post.title}</h5>
              <p className="card-text">{post.content}</p>
              <p className="text-muted">
                By: {post.user?.username || 'Unknown'}
              </p>

              {currentUser && post.userId === currentUser.id && (
                <div>
                  <Link
                    to={`/posts/edit/${post.id}`}
                    className="btn btn-sm btn-outline-primary me-2"
                  >
                    Edit
                  </Link>
                  <button
                    className="btn btn-sm btn-outline-danger"
                    onClick={() => onDelete(post.id)}
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
          </div>
        ))
      )}
    </div>
  );
}