const EXPRESS = require('express');
const ROUTER = EXPRESS.Router();
const LANGUAGE = require('../models/language');
const SQL_QUERIES = require('../models/SqlQueries');
const SERVICES = require('../models/Services');

let queries = new SQL_QUERIES();
let helper = new SERVICES();

function getNavBar(language, adminId, currentLanguage) {
    return {
        home: language.navBar.home,
        gameBoard: language.navBar.gameBoard,
        controlPanel: language.navBar.controlPanel,
        rules: language.navBar.rules,
        about: language.navBar.about,
        register: language.navBar.register,
        login: language.navBar.login,
        profile: language.navBar.profile,
        logout: language.navBar.logout,
        adminId: adminId,
        language: currentLanguage
    }
}

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
        emptyTable: language.controlPanel.emptyTable,
        playersTableHead: {
            name: language.controlPanel.playersTableHead.name,
            points: language.controlPanel.playersTableHead.points,
            authorizeBtn: language.controlPanel.playersTableHead.authorizeBtn
        },
        evaluationTableTitle: language.controlPanel.evaluationTableTitle,
        evaluationTableHead: {
            name: language.controlPanel.evaluationTableHead.name,
            timeLeft: language.controlPanel.evaluationTableHead.timeLeft,
            answer: language.controlPanel.evaluationTableHead.answer,
            evaluate: language.controlPanel.evaluationTableHead.evaluate,
            point: language.controlPanel.evaluationTableHead.point
        },
        authorizeBtn: language.controlPanel.authorizeBtn,
        timer: language.controlPanel.timer,
        timerLegend: language.controlPanel.timerLegend,
        pointValue: language.controlPanel.pointValue,
        pointValueLegend: language.controlPanel.pointValueLegend,
        showEvaluationModalBtn: language.controlPanel.showEvaluationModalBtn,
        collectAnswersBtn: language.controlPanel.collectAnswersBtn,
        evaluateBtn: language.controlPanel.evaluateBtn,
        logoutEveryoneBtn: language.controlPanel.logoutEveryoneBtn,
        categories: categories,
        players: players
    };
}

ROUTER.get('/admin', (req, res) => {
    helper.setLastPosition(req, "/admin");
    let language = LANGUAGE.getLanguage(helper.getLanguageFromSession(req));

    if (req.session.adminId) {
        renderControlPanel(req, res, language);
    } else {
        let adminLogin = getAdminLoginPage(language);
        let navBar = getNavBar(language, req.session.adminId, req.session.language);

        res.render('admin-login', {
            navBar,
            adminLogin
        });
    }
});

ROUTER.post('/adminLogin', (req, res) => {
    let { name, password } = req.body;
    let adminLoginResult = queries.getAdminPasswordByNameAsync(name);

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
    helper.setLastPosition(req, "/controlPanel");
    let language = LANGUAGE.getLanguage(helper.getLanguageFromSession(req));

    if (req.session.adminId) {
        renderControlPanel(req, res, language);
    } else {
        let adminLogin = getAdminLoginPage(language);
        let navBar = getNavBar(language, req.session.adminId, req.session.language);

        res.render('admin-login', {
            navBar,
            adminLogin
        });
    }
});

function renderControlPanel(req, res, language) {
    let categoryResult = queries.getAllCategoriesAsync();

    categoryResult.then((categories) => {
        let categoryRoundLimitResult = queries.getCategoryRoundLimitAsync();

        categoryRoundLimitResult.then(async (categoryLimit) => {
            let sortedCategories = helper.getCategoryAvailabilities(categories, categoryLimit[0].round_limit);
            sortedCategories = await matchNextQuestionToCategories(sortedCategories);
            let playersResult = queries.getAllLoggedInPlayersAsync();

            playersResult.then((players) => {
                let controlPanel = getControlPanelPage(language, sortedCategories, players);
                let navBar = getNavBar(language, req.session.adminId, req.session.language);

                res.render('control-panel', {
                    navBar,
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

async function matchNextQuestionToCategories(categories) {
    for (let i = 0; i < categories.length; i++) {
        let question = await queries.getNextQuestionByCategoryIdAndQuestionIndexAsync(categories[i].id, categories[i].question_index);
        categories[i].question = question[0].question;
    }
    return categories;
}

module.exports = ROUTER;