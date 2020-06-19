class Services {
    getCategoryAvailabilities(categories, limit) {
        for (let i = 0; i < categories.length; i++) {
            categories[i].isAvailable = categories[i].question_index < limit;
        }
        return categories;
    }

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

    setLastPosition(req, position) {
        req.session.lastPosition = position;
    }

    getLanguageFromSession(req) {
        if (!req.session.language) {
            req.session.language = "hu";
        }
        return req.session.language;
    }
}

module.exports = Services;