const express = require('express');
const session = require('express-session');
const pool = require('./db');
const path = require('path');

const app = express();
const PORT = 3000;

// Middleware to parse form data
app.use(express.urlencoded({ extended: false }));

// Session middleware
app.use(session({
  secret: 'your-secret-key',
  resave: false,
  saveUninitialized: false,
}));

// Set EJS as the view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Serve static files (for styles.css)
app.use(express.static(path.join(__dirname, 'public')));

// Middleware to make user info available in templates
app.use((req, res, next) => {
  res.locals.userId = req.session.userId || null;
  res.locals.userName = req.session.userName || null;
  next();
});

// Require login middleware
function requireLogin(req, res, next) {
  if (!req.session.userId) {
    return res.redirect('/signin');
  }
  next();
}

// Routes

// Landing route redirects to signin
app.get('/', (req, res) => {
  res.redirect('/signin');
});

// Signup page
app.get('/signup', (req, res) => {
  res.render('signup');
});

// Signup form submit
app.post('/signup', async (req, res) => {
  const { user_id, password, name } = req.body;
  try {
    const existingUser = await pool.query('SELECT user_id FROM users WHERE user_id = $1', [user_id]);
    if (existingUser.rows.length > 0) {
      return res.send('User ID already taken, please choose another.');
    }
    await pool.query(
      'INSERT INTO users (user_id, password, name) VALUES ($1, $2, $3)',
      [user_id, password, name]
    );
    res.redirect('/signin');
  } catch (err) {
    console.error('Signup error:', err);
    res.status(500).send('Server error during sign up');
  }
});

// Signin page
app.get('/signin', (req, res) => {
  res.render('signin');
});

// Signin form submit
app.post('/signin', async (req, res) => {
  const { user_id, password } = req.body;
  try {
    const userResult = await pool.query(
      'SELECT * FROM users WHERE user_id = $1 AND password = $2',
      [user_id, password]
    );
    if (userResult.rows.length === 0) {
      return res.send('Incorrect user ID or password.');
    }
    // Save session info
    req.session.userId = userResult.rows[0].user_id;
    req.session.userName = userResult.rows[0].name;
    res.redirect('/blogs');
  } catch (err) {
    console.error('Signin error:', err);
    res.status(500).send('Server error during sign in');
  }
});

// Logout
app.get('/logout', (req, res) => {
  req.session.destroy(() => {
    res.redirect('/signin');
  });
});

// Blog feed (list all posts)
app.get('/blogs', requireLogin, async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM blogs ORDER BY date_created DESC');
    res.render('blog', { blogs: result.rows });
  } catch (err) {
    console.error(err);
    res.send('Error loading blogs');
  }
});

// Create post form
app.get('/blogs/create', requireLogin, (req, res) => {
  res.render('create');
});

// Create post submit
app.post('/blogs/create', requireLogin, async (req, res) => {
  const { title, body } = req.body;
  try {
    await pool.query(
      'INSERT INTO blogs (creator_name, creator_user_id, title, body, date_created) VALUES ($1, $2, $3, $4, NOW())',
      [req.session.userName, req.session.userId, title, body]
    );
    res.redirect('/blogs');
  } catch (err) {
    console.error(err);
    res.send('Error creating blog post');
  }
});

// Edit post form
app.get('/blogs/edit/:id', requireLogin, async (req, res) => {
  const blogId = req.params.id;
  try {
    const result = await pool.query('SELECT * FROM blogs WHERE blog_id = $1', [blogId]);
    if (result.rows.length === 0) return res.redirect('/blogs');
    const blog = result.rows[0];
    if (blog.creator_user_id !== req.session.userId) {
      return res.send('Unauthorized to edit this post');
    }
    res.render('edit', { blog });
  } catch (err) {
    console.error(err);
    res.send('Error loading blog post');
  }
});

// Edit post submit
app.post('/blogs/edit/:id', requireLogin, async (req, res) => {
  const blogId = req.params.id;
  const { title, body } = req.body;
  try {
    // Confirm ownership
    const check = await pool.query('SELECT * FROM blogs WHERE blog_id = $1', [blogId]);
    if (check.rows.length === 0) return res.redirect('/blogs');
    if (check.rows[0].creator_user_id !== req.session.userId) {
      return res.send('Unauthorized to edit this post');
    }
    await pool.query('UPDATE blogs SET title = $1, body = $2 WHERE blog_id = $3', [title, body, blogId]);
    res.redirect('/blogs');
  } catch (err) {
    console.error(err);
    res.send('Error updating blog post');
  }
});

// Delete post
app.post('/blogs/delete/:id', requireLogin, async (req, res) => {
  const blogId = req.params.id;
  try {
    const check = await pool.query('SELECT * FROM blogs WHERE blog_id = $1', [blogId]);
    if (check.rows.length === 0) return res.redirect('/blogs');
    if (check.rows[0].creator_user_id !== req.session.userId) {
      return res.send('Unauthorized to delete this post');
    }
    await pool.query('DELETE FROM blogs WHERE blog_id = $1', [blogId]);
    res.redirect('/blogs');
  } catch (err) {
    console.error(err);
    res.send('Error deleting blog post');
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
