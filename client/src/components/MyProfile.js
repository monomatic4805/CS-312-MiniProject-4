import React from 'react';

export default function MyProfile({ user, posts }) {
  if (!user) {
    return <p>Please sign in to view your profile.</p>;
  }

  // Filter posts owned by current user
  const myPosts = posts.filter(post => post.userId === user.id);

  return (
    <div className="container" style={{ maxWidth: '700px' }}>
      <h2>My Profile</h2>

      <div className="profile-info mb-4">
        <h3>{user.name} (@{user.username})</h3>
        <p><strong>Age:</strong> {user.age || 'N/A'}</p>
        <p><strong>Occupation:</strong> {user.occupation || 'N/A'}</p>
        <p><strong>Current City:</strong> {user.city || 'N/A'}</p>
      </div>

      <h3>My Blog Posts</h3>
      {myPosts.length === 0 ? (
        <p>You haven't posted any blogs yet.</p>
      ) : (
        myPosts.map(post => (
          <div key={post.id} className="card mb-3">
            <div className="card-body">
              <h5>{post.title}</h5>
              <p>{post.content}</p>
            </div>
          </div>
        ))
      )}
    </div>
  );
}