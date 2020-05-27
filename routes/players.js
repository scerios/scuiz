const EXPRESS = require('express');
const ROUTER = EXPRESS.Router();
const LANGUAGE = require('./../js/language');

let language = LANGUAGE.getLanguage('hu');

ROUTER.get('/', (req, res) => {
    res.render('index', {
        welcomeMsg: language.index.welcomeMsg,
        loginBtn: language.index.loginBtn,
        registerBtn: language.index.registerBtn
    });
});

ROUTER.get('/register', (req, res) => {
    res.render('register', {
        welcomeMsg: language.register.welcomeMsg,
        nameLabel: language.register.nameLabel,
        namePlaceholder: language.register.namePlaceholder,
        passwordLabel: language.register.passwordLabel,
        passwordPlaceholder: language.register.passwordPlaceholder,
        confirmPasswordLabel: language.register.confirmPasswordLabel,
        confirmPasswordPlaceholder: language.register.confirmPasswordPlaceholder,
        registerBtn: language.register.registerBtn,
        isRegisteredQuestion: language.register.isRegisteredQuestion,
        loginLink: language.register.loginLink
    });
});

module.exports = ROUTER;