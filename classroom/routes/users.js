// routes/users.js
const express = require('express');
const router = express.Router();

// Example route
router.get('/', (req, res) => {
  res.send('Users route working!');
});

module.exports = router;