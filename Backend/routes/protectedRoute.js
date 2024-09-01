const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

// Example protected route
router.get('/', auth, (req, res) => {
  try {
    // req.user is available due to auth middleware
    res.json(req.user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
