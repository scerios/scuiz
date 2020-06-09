const EXPRESS = require('express');
const ROUTER = EXPRESS.Router();
const BCRYPT = require('bcryptjs');
const LANGUAGE = require('./../js/language');
const SQL_QUERIES = require('../js/SqlQueries');
const HELPER = require('./../js/helper');

let queries = new SQL_QUERIES();

function getIndexPage(language) {
    return {
        welcomeMsg: language.index.welcomeMsg,
        loginBtn: language.index.loginBtn,
        registerBtn: language.index.registerBtn,
        languageSelect: language.index.languageSelect,
        english: language.index.english,
        hungarian: language.index.hungarian
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

function getGameBoardPage(language, player) {
    return {
        logoutBtn: language.gameBoard.logoutBtn,
        question: language.gameBoard.question,
        timer: language.gameBoard.timer,
        answer: language.gameBoard.answer,
        doublerBtn: language.gameBoard.doublerBtn,
        doublerBtnClicked: language.gameBoard.doublerBtnClicked,
        answerBtn: language.gameBoard.answerBtn,
        category: language.gameBoard.category,
        pointText: language.gameBoard.pointText,
        myId: player.id,
        myName: player.name,
        pointValue: player.point
    };
}

ROUTER.get('/', (req, res) => {
    let language = LANGUAGE.getLanguage(req.session.language);

    if (req.session.userId !== undefined) {
        signInPlayer(req.session.userId, res, language);
    } else {
        let index = getIndexPage(language);
        res.render('index', {
            index
        });
    }
});

ROUTER.get('/setLanguageEn', (req, res) => {
    req.session.language = 'en';
    res.redirect('/');
});

ROUTER.get('/setLanguageHu', (req, res) => {
    req.session.language = 'hu';
    res.redirect('/');
});

ROUTER.get('/register', (req, res) => {
    let language = LANGUAGE.getLanguage(req.session.language);
    let register = getRegisterPage(language);

    res.render('register', {
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
                renderRegister(res, errors, name, password, confirmPassword, language);
            } else {
                let newPlayer = queries.postPlayerAsync(name, BCRYPT.hashSync(password, BCRYPT.genSaltSync(10)));

                newPlayer.then(() => {
                    let login = getLoginPage(language);
                    login.registerSuccess = language.login.registerSuccess;
                    res.render('login', {
                        login
                    });
                }).catch((error) => {
                    console.log('newPlayer: ' + error);
                    errors.push(language.error.connection);
                    renderRegister(res, errors, name, password, confirmPassword, language);
                });
            }

        }).catch((error) => {
            console.log('isNameAlreadyRegisteredResult: ' + error);
            errors.push(language.error.connection);
            renderRegister(res, errors, name, password, confirmPassword, language);
        });

    } else {
        renderRegister(res, errors, name, password, confirmPassword, language);
    }
});

ROUTER.get('/login', (req, res) => {
    let language = LANGUAGE.getLanguage(req.session.language);
    let login = getLoginPage(language);

    res.render('login', {
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
                    res.redirect('/gameBoard');
                } else {
                    let login = getLoginPage(language);
                    login.alreadyLoggedIn = language.login.alreadyLoggedIn;

                    res.render('login', {
                        login
                    });
                }
            } else {
                let login = getLoginPage(language);
                login.badCredentials = language.login.badCredentials;

                res.render('login', {
                    login
                });
            }
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

ROUTER.get('/gameBoard', (req, res) => {
    let language = LANGUAGE.getLanguage(req.session.language);

    if (req.session.userId) {
        signInPlayer(req.session.userId, res, language);
    } else {
        res.redirect('/');
    }
});

ROUTER.get('/logout', (req, res) => {
    let language = LANGUAGE.getLanguage(req.session.language);
    let putPlayerStatusResult = queries.putPlayerStatusByIdAsync(req.session.userId, 0);

    putPlayerStatusResult.then(() => {
        delete req.session.userId;
        delete req.session.username;
        res.redirect('/');
    }).catch((error) => {
        console.log('playerLoginResult: ' + error);
        let login = getLoginPage(language);
        login.connectionError = language.error.connection;

        res.render('login', {
            login
        });
    });
});

function renderRegister(res, errors, name, password, confirmPassword, language) {
    let register = getRegisterPage(language);

    res.render('register', {
        errors,
        name,
        password,
        confirmPassword,
        register
    });
}

function signInPlayer(userId, res, language) {
    let getPlayerStatusResult = queries.getPlayerByIdAsync(userId);

    getPlayerStatusResult.then((player) => {
        if (player[0].status === 0) {
            let putPlayerStatusResult = queries.putPlayerStatusByIdAsync(userId, 1);

            putPlayerStatusResult.then(() => {
                let gameBoard = getGameBoardPage(language, player[0]);
                res.render('game-board', {
                    gameBoard
                });
            }).catch((error) => {
                console.log('putPlayerStatusResult : ' + error);
            });
        } else {
            let login = getLoginPage(language);
            login.alreadyLoggedIn = language.login.alreadyLoggedIn;

            res.render('login', {
                login
            });
        }
    }).catch((error) => {
        console.log('getPlayerStatusResult: ' + error);
    });
}

module.exports = ROUTER;