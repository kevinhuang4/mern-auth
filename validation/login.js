const Validator = require("validator");
const isEmpty = require("is-empty");

const validateLoginInput = (data) => {
    const errors = {};

    data.email = !isEmpty(data.email) ? data.email : "";
    data.passwrod = !isEmpty(data.password) ? data.password : "";

    if (Validator.isEmpty(data.email)) {
        errors.email = "Email is required";
    } else if (!Validator.isEmail(data.email)) {
        errors.email = "Email is invalid";
    }

    if (Validator.isEmpty(data.password)) {
        errors.password = "Password is required";
    } else if (!Validator.isLength(data.password, { min: 6, max: 20 })) {
        errors.password = "Length must be between 6 characters and 20 characters (inclusive)";
    }

    return {
        errors,
        isValid: isEmpty(errors)
    };
};

module.exports = validateLoginInput;