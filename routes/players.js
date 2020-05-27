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
        namePlaceHolder: language.register.namePlaceHolder,
        passwordLabel: language.register.passwordLabel,
        passwordPlaceHolder: language.register.passwordPlaceHolder,
        confirmPasswordLabel: language.register.confirmPasswordLabel,
        confirmPasswordPlaceHolder: language.register.confirmPasswordPlaceHolder,
        registerBtn: language.register.registerBtn,
        isRegisteredQuestion: language.register.isRegisteredQuestion,
        loginLink: language.register.loginLink
    });
});

module.exports = ROUTER;