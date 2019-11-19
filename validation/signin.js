const Validator = require('validator');
const isEmpty = require('./is-empty');
 
module.exports = (data) => {
	const errors = {};

	data.password = !isEmpty(data.password) ? data.password : '';
	data.email = !isEmpty(data.email) ? data.email : '';

	if(!Validator.isLength(data.password, {min: 6, max: 20})) {
		errors.password = 'password must be between at least 6 characters';
	}

	if(Validator.isEmpty(data.password)) {
		errors.password = 'password is required';
	}

	if(!Validator.isEmail(data.email)) {
		errors.email = 'email is invalid';
	}

	if(Validator.isEmpty(data.email)) {
		errors.email = 'email is required';
	}

	return {
		errors,
		isValid: isEmpty(errors),
	}
}