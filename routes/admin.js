const EXPRESS = require('express');
const ROUTER = EXPRESS.Router();
const LANGUAGE = require('./../js/language');
const SQL_QUERIES = require('./../js/sqlQueries');

function getAdminLoginPage(language) {
    return {
        welcomeMsg: language.adminLogin.welcomeMsg,
        nameLabel: language.adminLogin.nameLabel,
        namePlaceholder: language.adminLogin.namePlaceholder,
        passwordLabel: language.adminLogin.passwordLabel,
        passwordPlaceholder: language.adminLogin.passwordPlaceholder,
        loginBtn: language.adminLogin.loginBtn,
    };
}

function getControlPanelPage(language) {
    return {
        welcomeMsg: language.adminLogin.welcomeMsg,
        nameLabel: language.adminLogin.nameLabel,
        namePlaceholder: language.adminLogin.namePlaceholder,
        passwordLabel: language.adminLogin.passwordLabel,
        passwordPlaceholder: language.adminLogin.passwordPlaceholder,
        loginBtn: language.adminLogin.loginBtn,
    };
}

ROUTER.get('/admin', (req, res) => {
    let language = LANGUAGE.getLanguage(req.session.language);

    if (req.session.adminId !== undefined) {
        let gameBoard = getControlPanelPage(language);
        res.render('control-panel', {
            gameBoard
        });
    } else {
        let adminLogin = getAdminLoginPage(language);
        res.render('admin-login', {
            adminLogin
        });
    }
});

module.exports = ROUTER;