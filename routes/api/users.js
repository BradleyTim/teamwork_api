const express = require('express');
const router = express.Router();

const db = require('../../db/index');


router.get('/users', (req, res) => {
  db.getUsers(req, res);
});

router.get('/users/:userId', (req, res) => {
  db.getUser(req, res);
});

router.post('/create-users', (req, res) => {
  db.postUser(req, res);
});

module.exports = router;
