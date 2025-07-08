import React, { useState, useEffect } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from 'react-router-dom';

import NavBar from './components/NavBar';
import Signup from './components/Signup';
import Signin from './components/Signin';
import PostList from './components/PostList';
import CreatePost from './components/CreatePost';
import EditPost from './components/EditPost';
import MyProfile from './components/MyProfile';

function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loadingUser, setLoadingUser] = useState(true);

  const location = useLocation();

  // Load user and posts from localStorage
  useEffect(() => {
    const savedUser = localStorage.getItem('currentUser');
    const savedPosts = localStorage.getItem('posts');

    if (savedUser) {
      setCurrentUser(JSON.parse(savedUser));
    }

    if (savedPosts) {
      const parsedPosts = JSON.parse(savedPosts);
      const fixedPosts = parsedPosts.map((p) =>
        p.user ? p : { ...p, user: savedUser ? JSON.parse(savedUser) : null }
      );
      setPosts(fixedPosts);
    }

    setLoadingUser(false);
  }, []);

  // Save current user to localStorage
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('currentUser', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('currentUser');
    }
  }, [currentUser]);

  // Save posts to localStorage
  useEffect(() => {
    localStorage.setItem('posts', JSON.stringify(posts));
  }, [posts]);

  // Handlers
  const handleCreatePost = (newPost) => setPosts([newPost, ...posts]);
  const handleUpdatePost = (updatedPost) =>
    setPosts(posts.map((p) => (p.id === updatedPost.id ? updatedPost : p)));
  const handleDeletePost = (id) =>
    setPosts(posts.filter((p) => p.id !== id));

  const onUserChange = (user) => setCurrentUser(user);
  const handleLogout = () => setCurrentUser(null);

  const hideNavPaths = ['/signin', '/signup'];

  const RequireAuth = ({ children }) => {
    if (loadingUser) return <div>Loading...</div>;
    if (!currentUser) return <Navigate to="/signin" replace />;
    return children;
  };

  if (loadingUser) return <div>Loading application...</div>;

  return (
    <>
      {currentUser && !hideNavPaths.includes(location.pathname) && (
        <NavBar currentUser={currentUser} onLogout={handleLogout} />
      )}

      <Routes>
        <Route path="/signup" element={<Signup onUserChange={onUserChange} />} />
        <Route path="/signin" element={<Signin onUserChange={onUserChange} />} />

        <Route
          path="/posts"
          element={
            <RequireAuth>
              <PostList
                posts={posts}
                currentUser={currentUser}
                onDelete={handleDeletePost}
              />
            </RequireAuth>
          }
        />
        <Route
          path="/posts/new"
          element={
            <RequireAuth>
              <CreatePost onCreate={handleCreatePost} currentUser={currentUser} />
            </RequireAuth>
          }
        />
        <Route
          path="/posts/edit/:postId"
          element={
            <RequireAuth>
              <EditPost posts={posts} onUpdate={handleUpdatePost} />
            </RequireAuth>
          }
        />
        <Route
          path="/profile"
          element={
            <RequireAuth>
              <MyProfile user={currentUser} posts={posts} />
            </RequireAuth>
          }
        />
        <Route path="*" element={<Navigate to={currentUser ? '/posts' : '/signin'} />} />
      </Routes>
    </>
  );
}

function AppWrapper() {
  const location = useLocation();
  return <App location={location} />;
}

export default function Root() {
  return (
    <Router>
      <AppWrapper />
    </Router>
  );
}