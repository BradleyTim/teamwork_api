const express = require('express');
const router = express.Router();

const db = require('../../db/users');


router.get('/users', (req, res) => {
  db.getEmployees(req, res);
});

router.post('/create-users', (req, res) => {
  db.postUsers(req, res);
});

router.get('/users/:userId', (req, res) => {
  db.getUser(req, res);
});

module.exports = router;
