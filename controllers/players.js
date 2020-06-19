const EXPRESS = require('express');
const ROUTER = EXPRESS.Router();
const BCRYPT = require('bcryptjs');
const LANGUAGE = require('../models/language');
const SQL_QUERIES = require('../models/SqlQueries');
const HELPER = require('../models/helper');

let queries = new SQL_QUERIES();

function getNavBar(language, userId, currentLanguage, adminId) {
    return {
        home: language.navBar.home,
        gameBoard: language.navBar.gameBoard,
        rules: language.navBar.rules,
        about: language.navBar.about,
        controlPanel: language.navBar.controlPanel,
        register: language.navBar.register,
        login: language.navBar.login,
        profile: language.navBar.profile,
        logout: language.navBar.logout,
        userId: userId,
        adminId: adminId,
        language: currentLanguage
    }
}

function getIndexPage(language) {
    return {
        welcomeMsg: language.index.welcomeMsg,
        loginBtn: language.index.loginBtn,
        registerBtn: language.index.registerBtn
    };
}

function getRegisterPage(language) {
    return {
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
    };
}

function getLoginPage(language) {
    return {
        welcomeMsg: language.login.welcomeMsg,
        nameLabel: language.login.nameLabel,
        namePlaceholder: language.login.namePlaceholder,
        passwordLabel: language.login.passwordLabel,
        passwordPlaceholder: language.login.passwordPlaceholder,
        loginBtn: language.login.loginBtn,
        isNotRegisteredQuestion: language.login.isNotRegisteredQuestion,
        registerLink: language.login.registerLink
    };
}

function getGameBoardPage(language, player, categories) {
    return {
        categories: categories,
        logoutBtn: language.gameBoard.logoutBtn,
        question: language.gameBoard.question,
        timer: language.gameBoard.timer,
        answer: language.gameBoard.answer,
        doublerBtn: language.gameBoard.doublerBtn,
        doublerBtnClicked: language.gameBoard.doublerBtnClicked,
        answerBtn: language.gameBoard.answerBtn,
        category: language.gameBoard.category,
        pointText: language.gameBoard.pointText,
        selectCategory: language.gameBoard.selectCategory,
        myId: player.id,
        myName: player.name,
        pointValue: player.point
    };
}

ROUTER.get('/', (req, res) => {
    HELPER.setLastPosition(req, "/");

    let language = LANGUAGE.getLanguage(HELPER.getLanguageFromSession(req));
    let navBar = getNavBar(language, req.session.userId, req.session.language, req.session.adminId);
    let index = getIndexPage(language);

    res.render('index', {
        navBar,
        index
    });
});

ROUTER.get('/setLanguageEn', (req, res) => {
    req.session.language = 'us';
    res.redirect(req.session.lastPosition);
});

ROUTER.get('/setLanguageHu', (req, res) => {
    req.session.language = 'hu';
    res.redirect(req.session.lastPosition);
});

ROUTER.get('/register', (req, res) => {
    HELPER.setLastPosition(req, "/register");

    let language = LANGUAGE.getLanguage(HELPER.getLanguageFromSession(req));
    let navBar = getNavBar(language, req.session.userId, req.session.language, req.session.adminId);
    let register = getRegisterPage(language);

    res.render('register', {
        navBar,
        register
    });
});

ROUTER.post('/register', (req, res) => {
    let language = LANGUAGE.getLanguage(req.session.language);
    let { name, password, confirmPassword } = req.body;
    let errors = HELPER.tryGetInputErrors(req.body, language.error);

    if (errors.length === 0) {
        let isNameAlreadyRegisteredResult = queries.getPlayerByNameAsync(name);

        isNameAlreadyRegisteredResult.then((playerId) => {
            if (playerId.length > 0) {
                errors.push(language.error.registered);
                renderRegister(req, res, errors, name, password, confirmPassword, language);
            } else {
                let newPlayer = queries.postPlayerAsync(name, BCRYPT.hashSync(password, BCRYPT.genSaltSync(10)));

                newPlayer.then(() => {
                    let navBar = getNavBar(language, req.session.userId, req.session.language, req.session.adminId);
                    let login = getLoginPage(language);

                    login.registerSuccess = language.login.registerSuccess;
                    res.render('login', {
                        navBar,
                        login
                    });
                }).catch((error) => {
                    console.log('newPlayer: ' + error);
                    errors.push(language.error.connection);
                    renderRegister(req, res, errors, name, password, confirmPassword, language);
                });
            }

        }).catch((error) => {
            console.log('isNameAlreadyRegisteredResult: ' + error);
            errors.push(language.error.connection);
            renderRegister(req, res, errors, name, password, confirmPassword, language);
        });

    } else {
        renderRegister(req, res, errors, name, password, confirmPassword, language);
    }
});

ROUTER.get('/login', (req, res) => {
    let language = LANGUAGE.getLanguage(HELPER.getLanguageFromSession(req));
    let navBar = getNavBar(language, req.session.userId, req.session.language, req.session.adminId);
    let login = getLoginPage(language);

    res.render('login', {
        navBar,
        login
    });
});

ROUTER.post('/login', (req, res) => {
    let language = LANGUAGE.getLanguage(req.session.language);
    let { name, password } = req.body;
    let playerLoginResult = queries.getPlayerByNameAsync(name);

    playerLoginResult.then((player) => {
        if (player.length === 1) {
            if (BCRYPT.compareSync(password, player[0].password)) {
                if (player[0].status === 0) {
                    req.session.userId = player[0].id;
                    req.session.username = name;
                    res.redirect(req.session.lastPosition);
                } else {
                    let navBar = getNavBar(language, req.session.userId, req.session.language, req.session.adminId);
                    let login = getLoginPage(language);

                    login.alreadyLoggedIn = language.login.alreadyLoggedIn;

                    res.render('login', {
                        navBar,
                        login
                    });
                }
            } else {
                let navBar = getNavBar(language, req.session.userId, req.session.language, req.session.adminId);
                let login = getLoginPage(language);
                login.badCredentials = language.login.badCredentials;

                res.render('login', {
                    navBar,
                    login
                });
            }
        } else {
            let navBar = getNavBar(language, req.session.userId, req.session.language, req.session.adminId);
            let login = getLoginPage(language);
            login.badCredentials = language.login.badCredentials;

            res.render('login', {
                navBar,
                login
            });
        }

    }).catch((error) => {
        console.log('playerLoginResult: ' + error);
        let navBar = getNavBar(language, req.session.userId, req.session.language, req.session.adminId);
        let login = getLoginPage(language);
        login.connectionError = language.error.connection;

        res.render('login', {
            navBar,
            login
        });
    });
});

ROUTER.get('/gameBoard', (req, res) => {
    HELPER.setLastPosition(req, "/gameBoard");

    let language = LANGUAGE.getLanguage(HELPER.getLanguageFromSession(req));

    if (req.session.userId) {
        signInPlayer(req, res, language);
    } else {
        res.redirect('/login');
    }
});

ROUTER.get('/logout', (req, res) => {
    let language = LANGUAGE.getLanguage(req.session.language);
    let putPlayerStatusResult = queries.putPlayerStatusByIdAsync(req.session.userId, 0);

    putPlayerStatusResult.then(() => {
        delete req.session.userId;
        delete req.session.username;
        res.redirect(req.session.lastPosition);
    }).catch((error) => {
        console.log('playerLoginResult: ' + error);
        let navBar = getNavBar(language, req.session.userId, req.session.language, req.session.adminId);
        let login = getLoginPage(language);
        login.connectionError = language.error.connection;

        res.render('login', {
            navBar,
            login
        });
    });
});

function renderRegister(req, res, errors, name, password, confirmPassword, language) {
    let navBar = getNavBar(language, req.session.userId, req.session.language, req.session.adminId);
    let register = getRegisterPage(language);

    res.render('register', {
        navBar,
        errors,
        name,
        password,
        confirmPassword,
        register
    });
}

function signInPlayer(req, res, language) {
    let userId = req.session.userId;
    let getPlayerStatusResult = queries.getPlayerByIdAsync(userId);

    getPlayerStatusResult.then((player) => {
        if (player[0].status === 0) {
            let putPlayerStatusResult = queries.putPlayerStatusByIdAsync(userId, 1);

            putPlayerStatusResult.then(() => {
                let categoryResult = queries.getAllCategoriesAsync();

                categoryResult.then((categories) => {
                    let categoryRoundLimitResult = queries.getCategoryRoundLimitAsync();

                    categoryRoundLimitResult.then((categoryLimit) => {
                        let sortedCategories = HELPER.getCategoryAvailabilities(categories, categoryLimit[0].round_limit);
                        let navBar = getNavBar(language, req.session.userId, req.session.language, req.session.adminId);
                        let gameBoard = getGameBoardPage(language, player[0], sortedCategories);

                        res.render('game-board', {
                            navBar,
                            gameBoard
                        });

                    }).catch((error) => {
                        console.log('categoryRoundLimitResult: ' + error);
                    });

                }).catch((error) => {
                    console.log('categoryResult: ' + error);
                });

            }).catch((error) => {
                console.log('putPlayerStatusResult : ' + error);
            });
        } else {
            let navBar = getNavBar(language, req.session.userId, req.session.language, req.session.adminId);
            let login = getLoginPage(language);
            login.alreadyLoggedIn = language.login.alreadyLoggedIn;

            res.render('login', {
                navBar,
                login
            });
        }
    }).catch((error) => {
        console.log('getPlayerStatusResult: ' + error);
    });
}

module.exports = ROUTER;