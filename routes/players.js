const EXPRESS = require('express');
const ROUTER = EXPRESS.Router();
const LANGUAGE = require('./../js/language');

let language = LANGUAGE.getLanguage('hu');

ROUTER.get('/', (req, res) => {
    res.render('index', {
        welcomeMsg: language.indexWelcomeMsg,
        loginBtn: language.indexLoginBtn,
        registerBtn: language.indexRegisterBtn
    });
});

module.exports = ROUTER;