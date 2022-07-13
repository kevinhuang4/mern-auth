const Validator = require("validator");
const isEmpty = require("is-empty");

const validateRegisterInput = (data) => {
    const errors = {};

    // convert all empty fields to emtpy strings for the validator
    data.name = !isEmpty(data.name) ? data.name : "";
    data.email = !isEmpty(data.email) ? data.email : "";
    data.password = !isEmpty(data.password) ? data.password : "";
    data.password2 = !isEmpty(data.password2) ? data.password2 : "";

    // name check
    if (Validator.isEmpty(data.name)) {
        errors.name = "Name is required";
    } else if (!Validator.isLength(data.name, { min: 3, max: 12 })) {
        errors.name = "Length must be between 3 characters and 12 characters (inclusive)"
    }

    // email check
    if (Validator.isEmpty(data.email)) {
        errors.email = "Email is required";
    } else if (!Validator.isEmail(data.email)) {
        errors.email = "Email is invalid"
    }

    // password check
    if (Validator.isEmpty(data.password)) {
        errors.password = "Password is required";
    } else if (!Validator.isLength(data.password, { min: 6, max: 20 })) {
        errors.password = "Length must be between 6 characters and 20 characters (inclusive)";
    }

    if (Validator.isEmpty(data.password2)) {
        errors.password2 = "Confirm your password";
    } else if (!Validator.equals(data.password, data.password2)) {
        errors.password2 = "Passwords mnust match";
    }

    return {
        // errors: errors,
        errors,
        isValid: isEmpty(errors)
    };
};

module.exports = validateRegisterInput;