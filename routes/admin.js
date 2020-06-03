const EXPRESS = require('express');
const ROUTER = EXPRESS.Router();
const LANGUAGE = require('./../js/language');
const SQL_QUERIES = require('./../js/sqlQueries');
const HELPER = require('./../js/helper');

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

function getControlPanelPage(language, categories, players) {
    return {
        tableHead: {
            name: language.controlPanel.tableHead.name,
            points: language.controlPanel.tableHead.points,
            currentAnswer: language.controlPanel.tableHead.currentAnswer,
            authorizeBtn: language.controlPanel.tableHead.authorizeBtn
        },
        authorizeBtn: language.controlPanel.authorizeBtn,
        timer: language.controlPanel.timer,
        timerLegend: language.controlPanel.timerLegend,
        categories: categories,
        players: players
    };
}

ROUTER.get('/admin', (req, res) => {
    let language = LANGUAGE.getLanguage(req.session.language);

    if (req.session.adminId !== undefined) {
        renderControlPanel(res, language);
    } else {
        let adminLogin = getAdminLoginPage(language);
        res.render('admin-login', {
            adminLogin
        });
    }
});

ROUTER.post('/adminLogin', (req, res) => {
    let { name, password } = req.body;
    let adminLoginResult = SQL_QUERIES.getAdminPasswordByName(name);

    adminLoginResult.then((admin) => {
        if (admin.length === 1) {
            if (password === admin[0].password) {
                req.session.adminId = 1;
                req.session.adminName = name;
                res.redirect('/controlPanel');
            } else  {
                res.redirect('/admin');
            }
        } else {
            res.redirect('/admin');
        }

    }).catch((error) => {
        console.log('playerLoginResult: ' + error);

        res.redirect('/admin');
    });
});

ROUTER.get('/controlPanel', (req, res) => {
    let language = LANGUAGE.getLanguage(req.session.language);

    if (req.session.adminId !== undefined) {
        renderControlPanel(res, language);
    } else {
        let adminLogin = getAdminLoginPage(language);
        res.render('admin-login', {
            adminLogin
        });
    }
});

function renderControlPanel(res, language) {
    let categoryResult = SQL_QUERIES.getAllCategories();

    categoryResult.then((categories) => {
        let categoryRoundLimitResult = SQL_QUERIES.getCategoryRoundLimit();

        categoryRoundLimitResult.then((categoryLimit) => {
            let sortedCategories = HELPER.getCategoryAvailabilities(categories, categoryLimit[0].round_limit);
            let playersResult = SQL_QUERIES.getAllLoggedInPlayers();

            playersResult.then((players) => {
                let controlPanel = getControlPanelPage(language, sortedCategories, players);
                res.render('control-panel', {
                    controlPanel
                });

            }).catch((error) => {
                console.log('questionsResult: ' + error);
            });

        }).catch((error) => {
            console.log('categoryRoundLimitResult: ' + error);
        });

    }).catch((error) => {
        console.log('categoryResult: ' + error);
    });
}

module.exports = ROUTER;