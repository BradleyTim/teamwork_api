const express = require('express');

const router = express.Router();

router.get('/', (req, res) => {
  res.status(200).json({ msg: 'API IS LIVE' });
});

module.exports = router;
