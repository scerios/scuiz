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

ROUTER.get('/login', (req, res) => {
    res.render('login', {
        welcomeMsg: language.login.welcomeMsg,
        nameLabel: language.login.nameLabel,
        namePlaceholder: language.login.namePlaceholder,
        passwordLabel: language.login.passwordLabel,
        passwordPlaceholder: language.login.passwordPlaceholder,
        loginBtn: language.login.loginBtn,
        isNotRegisteredQuestion: language.login.isNotRegisteredQuestion,
        registerLink: language.login.registerLink
    });
});

module.exports = ROUTER;