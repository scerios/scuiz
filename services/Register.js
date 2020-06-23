class Register {

    tryGetInputErrors(inputs, errorMessages) {
        let { name, password, confirmPassword} = inputs;
        let errors = [];

        if (!name || !password || !confirmPassword) {
            errors.push(errorMessages.required);
        }

        if (name.length < 3) {
            errors.push(errorMessages.tooShortName);
        }

        if (password.length < 6) {
            errors.push(errorMessages.tooShortPassword);
        }

        if (password !== confirmPassword) {
            errors.push(errorMessages.different);
        }

        return errors;
    }
}

module.exports = Register;