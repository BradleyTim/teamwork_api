const express = require('express');
const router = express.Router();

const db = require('../../db/index');

router.get('/feed', (req, res) => {
	db.getFeed(req, res);
});

module.exports = router;
