const express = require('express');

const router = express.Router();

// GET /api/v1
// description returns the API home
// @access PUBLIC
router.get('/', (req, res) => {
  res.status(200).json({ msg: 'API IS LIVE' });
});

module.exports = router;
