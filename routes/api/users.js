const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');

const db = require('../../db/index');


// router.get('/users', (req, res) => {
//   db.getUsers(req, res);
// });

// router.get('/users/:userId', (req, res) => {
//   db.getUser(req, res);
// });

router.post('/create-user', (req, res) => {
	db.createUser(req, res);
});

router.post('/signin', (req, res) => {
	db.signin(req, res);
});

module.exports = router;
