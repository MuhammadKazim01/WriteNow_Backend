var express = require('express');
var multer = require('multer');
var path = require('path');
var router = express.Router();
const connection = require('../database/sql');

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/images/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

var upload = multer({ storage });

// Create a blog posts
router.post('/saveblog', upload.single('coverimage'), function (req, res, next) {
  const { title, content } = req.body;
  const image = req.file ? req.file.filename : null;

  if (!title || !content || !image) {
    return res.status(400).send('Title, content, and cover image are required.');
  }

  const query = 'INSERT into blog (title, content, image) VALUES (?, ?, ?)';
  const values = [title, content, image];

  connection.query(query, values, function (err, results) {
    if (err) {
      console.error('Error saving blog post:', err);
      return res.status(500).send('Failed to save blog post.');
    }
    res.status(200).send('Blog post saved successfully.');
  });
});

// Read all blog posts
router.get('/blogs', function (req, res, next) {
  const query = 'SELECT * FROM blog';

  connection.query(query, function (err, results) {
    if (err) {
      console.error('Error fetching blogs:', err);
      return res.status(500).send('Failed to fetch blogs.');
    }

    res.status(200).json(results);
  });
});

// Read a specific blog post by ID
router.get('/blog/:id', function (req, res, next) {
  const blogId = req.params.id;
  const query = 'SELECT * FROM blog WHERE id = ?';

  connection.query(query, [blogId], function (err, results) {
    if (err) {
      console.error('Error fetching blog:', err);
      return res.status(500).send('Failed to fetch blog.');
    }

    if (results.length === 0) {
      return res.status(404).send('Blog not found.');
    }

    res.status(200).json(results[0]);
  });
});

// Update a blog post
router.put('/updateblog/:id', upload.single('coverimage'), function (req, res, next) {
  const blogId = req.params.id;
  const { title, content } = req.body;
  const image = req.file ? req.file.filename : null;

  const query = `
    UPDATE blog 
    SET title = ?, content = ?, image = ? 
    WHERE id = ?
  `;

  connection.query(query, [title, content, image, blogId], function (err, results) {
    if (err) {
      console.error('Error updating blog post:', err);
      return res.status(500).send('Failed to update blog post.');
    }

    if (results.affectedRows === 0) {
      return res.status(404).send('Blog not found.');
    }

    res.status(200).send('Blog post updated successfully.');
  });
});

// Delete a blog post
router.delete('/deleteblog/:id', function (req, res, next) {
  const blogId = req.params.id;
  const query = 'DELETE FROM blog WHERE id = ?';

  connection.query(query, [blogId], function (err, results) {
    if (err) {
      console.error('Error deleting blog post:', err);
      return res.status(500).send('Failed to delete blog post.');
    }

    if (results.affectedRows === 0) {
      return res.status(404).send('Blog not found.');
    }

    res.status(200).send('Blog post deleted successfully.');
  });
});

module.exports = router;