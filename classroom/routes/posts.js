const express = require('express');
const router = express.Router();

// Sample route for posts
router.get('/', (req, res) => {
  res.send('Posts route working!');
});

// Add more routes below as needed
// e.g., router.post('/new', (req, res) => { ... });

module.exports = router;