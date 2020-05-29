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
        let controlPanel = getControlPanelPage(language);
        res.render('control-panel', {
            controlPanel
        });
    } else {
        let adminLogin = getAdminLoginPage(language);
        res.render('admin-login', {
            adminLogin
        });
    }
});

ROUTER.post('/adminLogin', (req, res) => {
    let language = LANGUAGE.getLanguage(req.session.language);
    let { name, password } = req.body;
    let adminLoginResult = SQL_QUERIES.getAdminPasswordByName(name);

    adminLoginResult.then((admin) => {
        if (admin.length === 1) {
            if (password === admin[0].password) {
                req.session.adminId = 1;
                req.session.adminName = name;
            }

            res.redirect('/admin');
        } else {
            let login = getLoginPage(language);
            login.badCredentials = language.login.badCredentials;

            res.render('login', {
                login
            });
        }

    }).catch((error) => {
        console.log('playerLoginResult: ' + error);
        let login = getLoginPage(language);
        login.connectionError = language.error.connection;

        res.render('login', {
            login
        });
    });
});

module.exports = ROUTER;