const Validator = require('validator');
const isEmpty = require('./is-empty');
 
module.exports = (data) => {
	const errors = {};

	data.firstname = !isEmpty(data.firstname) ? data.firstname : '';
	data.lastname = !isEmpty(data.lastname) ? data.lastname : '';
	data.password = !isEmpty(data.password) ? data.password : '';
	data.gender = !isEmpty(data.gender) ? data.gender : '';
	data.jobrole = !isEmpty(data.jobrole) ? data.jobrole : '';
	data.department = !isEmpty(data.department) ? data.department : '';
	data.address = !isEmpty(data.address) ? data.address : '';
	data.email = !isEmpty(data.email) ? data.email : '';

	if(!Validator.isLength(data.firstname, {min: 2, max: 30})) {
		errors.firstname = 'first name must be between 2 and 20 characters';
	}

	if(Validator.isEmpty(data.firstname)) {
		errors.firstname = 'firstname is required';
	}

	if(!Validator.isLength(data.lastname, {min: 2, max: 30})) {
		errors.lastname = 'last name must be between 2 and 20 characters';
	}

	if(Validator.isEmpty(data.lastname)) {
		errors.lastname = 'lastname is required';
	}

	if(!Validator.isLength(data.password, {min: 6, max: 20})) {
		errors.password = 'password must be between at least 6 characters';
	}

	if(Validator.isEmpty(data.password)) {
		errors.password = 'password is required';
	}

	// if(Validator.isEmpty(data.password2)) {
	// 	errors.password2 = 'confirm password is required';
	// }

	// if(!Validator.equals(data.password, data.password2)) {
	// 	errors.password2 = 'passwords must match';
	// }

	if(Validator.isEmpty(data.gender)) {
		errors.gender = 'gender is required';	
	}

	if(Validator.isEmpty(data.jobrole)) {
		errors.jobrole = 'jobrole is required';
	}

	if(Validator.isEmpty(data.department)) {
		errors.department = 'department is required';
	}

	if(Validator.isEmpty(data.address)) {
		errors.address = 'address is required';
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