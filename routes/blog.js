// routes/blog.js
const express = require('express');
const router = express.Router();
const pool = require('../db');

// Middleware to ensure user is logged in
function requireLogin(req, res, next) {
  if (!req.session.userId) {
    return res.redirect('/signin');
  }
  next();
}

// Show blog feed
router.get('/', requireLogin, async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM blogs ORDER BY date_created DESC');
    res.render('blog', {
      blogs: result.rows,
      userId: req.session.userId,
      userName: req.session.userName
    });
  } catch (err) {
    console.error('Error loading blog feed:', err);
    res.send('Error loading blog feed');
  }
});

// Show create post form
router.get('/create', requireLogin, (req, res) => {
  res.render('create');
});

// Submit new post
router.post('/create', requireLogin, async (req, res) => {
  const { title, body } = req.body;
  try {
    await pool.query(
      'INSERT INTO blogs (creator_name, creator_user_id, title, body, date_created) VALUES ($1, $2, $3, $4, NOW())',
      [req.session.userName, req.session.userId, title, body]
    );
    res.redirect('/blogs');
  } catch (err) {
    console.error('Error creating blog post:', err);
    res.send('Error creating blog post');
  }
});

// Show edit form
router.get('/edit/:id', requireLogin, async (req, res) => {
  const blogId = req.params.id;
  try {
    const result = await pool.query('SELECT * FROM blogs WHERE blog_id = $1', [blogId]);
    const blog = result.rows[0];

    if (!blog || blog.creator_user_id !== req.session.userId) {
      return res.send('Unauthorized or post not found');
    }

    res.render('edit', { blog });
  } catch (err) {
    console.error('Error loading blog for editing:', err);
    res.send('Error loading blog');
  }
});

// Submit edited post
router.post('/edit/:id', requireLogin, async (req, res) => {
  const blogId = req.params.id;
  const { title, body } = req.body;
  try {
    await pool.query(
      'UPDATE blogs SET title = $1, body = $2 WHERE blog_id = $3 AND creator_user_id = $4',
      [title, body, blogId, req.session.userId]
    );
    res.redirect('/blogs');
  } catch (err) {
    console.error('Error updating blog post:', err);
    res.send('Error updating blog post');
  }
});

// Delete post
router.post('/delete/:id', requireLogin, async (req, res) => {
  const blogId = req.params.id;
  try {
    await pool.query(
      'DELETE FROM blogs WHERE blog_id = $1 AND creator_user_id = $2',
      [blogId, req.session.userId]
    );
    res.redirect('/blogs');
  } catch (err) {
    console.error('Error deleting blog post:', err);
    res.send('Error deleting blog post');
  }
});

module.exports = router;
