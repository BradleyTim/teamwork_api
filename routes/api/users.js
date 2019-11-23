const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');

const db = require('../../db/index');
const createUserValidation = require('../../validation/create-user');
const signInUserValidation = require('../../validation/signin');


router.get('/users', passport.authenticate('jwt', { session: false }), (req, res) => {
  db.getUsers(req, res);
});

router.get('/users/:userId', passport.authenticate('jwt', { session: false }), (req, res) => {
  db.getUser(req, res);
});

router.post('/auth/create-user', passport.authenticate('jwt', { session: false }), (req, res) => {
		const { errors, isValid } = createUserValidation(req.body);
		
		if (!isValid) {
			res.status(400).json(errors);
		}

		db.createUser(req, res);
});

router.post('/auth/signin', (req, res) => {
	
	try {
		const { errors, isValid } = signInUserValidation(req.body);

		if (!isValid) {
			res.status(400).json(errors);
		}

		db.signin(req, res);
	} catch (error) {
		throw error;
	}
});

module.exports = router;
