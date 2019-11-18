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
 //    try {
 //    	let errors = [];
	//     let queryValues = Object.values(req.body);

	//     if(queryValues.length !== 7) {
	//     	errors.push({ msg: 'Please fill in all fields' });
	//     }

	//     if(req.body.password.length < 6) {
	// 		errors.push({ msg: 'password should be at least 6 characters' })
	// 	}

	// 	let queryText = "SELECT * FROM users WHERE firstName=$1 AND lastName=$2";
	// 	let queryValues = [req.body.firstname, req.body.lastname];

	// 	let result = await db.query(queryText, queryValues);

	// 	if(result.rows[0]) {
	// 		errors.push({ msg: 'Employee is already registered' });
	// 		res.status(400).json({
	// 		    status: "error",
	// 		    error: "Employee already exist",
	// 		});
	// 	} else {
	// 		try {
	// 			let queryValues = Object.values(req.body);
	// 			const queryText ="INSERT INTO users(firstName, lastName, password, gender, jobRole, department, address) VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING id";
	// 		    console.log(queryValues);
	// 		    await db.query("BEGIN");
	// 		    const result = await db.query(queryText, queryValues);
	// 		    await db.query("COMMIT");
	// 		    res.status(201).json({
	// 		      status: "success",
	// 		      employee: result
	// 		    });
	// 	  	} catch (error) {
	// 		    await db.query("ROLLBACK");
	// 		    throw error;
	// 	  	}
	// 	}
	// } catch(error) {
	// 	throw error;
	// }
});

module.exports = router;
