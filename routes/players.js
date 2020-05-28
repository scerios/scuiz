const EXPRESS = require('express');
const ROUTER = EXPRESS.Router();
const BCRYPT = require('bcryptjs');
const LANGUAGE = require('./../js/language');
const SQL_QUERIES = require('./../js/sqlQueries');
const HELPER = require('./../js/helper');

let tryGetPreferredLang = (req, res) => {
    if (req.session.language) {
        return req.session.language;
    } else {
        return 'hu';
    }
};

let language = LANGUAGE.getLanguage(tryGetPreferredLang);

let index = {
    welcomeMsg: language.index.welcomeMsg,
    loginBtn: language.index.loginBtn,
    registerBtn: language.index.registerBtn,
    languageSelect: language.index.languageSelect,
    english: language.index.english,
    hungarian: language.index.hungarian
};

let register = {
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

let login = {
    welcomeMsg: language.login.welcomeMsg,
    nameLabel: language.login.nameLabel,
    namePlaceholder: language.login.namePlaceholder,
    passwordLabel: language.login.passwordLabel,
    passwordPlaceholder: language.login.passwordPlaceholder,
    loginBtn: language.login.loginBtn,
    isNotRegisteredQuestion: language.login.isNotRegisteredQuestion,
    registerLink: language.login.registerLink
};

let gameBoard = {
    logoutBtn: language.gameBoard.logoutBtn
}

ROUTER.get('/', (req, res) => {
    if (req.session.userId) {
        res.render('game-board', {
            gameBoard
        });
    } else {
        res.render('index', {
            index
        });
    }
});

ROUTER.get('/register', (req, res) => {
    res.render('register', {
        register
    });
});

ROUTER.get('/login', (req, res) => {
    res.render('login', {
        login
    });
});

ROUTER.get('/gameBoard', (req, res) => {
    if (req.session.userId) {
        res.render('game-board', {
            gameBoard
        });
    } else {
        res.redirect('/');
    }
});

ROUTER.post('/register', (req, res) => {
    let { name, password, confirmPassword } = req.body;
    let errors = HELPER.tryGetInputErrors(req.body, language.error);

    if (errors.length === 0) {
        let isNameAlreadyRegistered = SQL_QUERIES.getPlayerByName(name);

        isNameAlreadyRegistered.then((playerId) => {
            if (playerId.length > 0) {
                errors.push(language.error.registered);
                renderRegister(res, errors, name, password, confirmPassword);
            } else {
                let newPlayer = SQL_QUERIES.postPlayer(name, BCRYPT.hashSync(password, BCRYPT.genSaltSync(10)));

                newPlayer.then(() => {
                    login.registerSuccess = language.login.registerSuccess;
                    res.render('login', {
                        login
                    });
                }).catch((error) => {
                    console.log('newPlayer: ' + error);
                    errors.push(language.error.connection);
                    renderRegister(res, errors, name, password, confirmPassword);
                });
            }

        }).catch((error) => {
            console.log('isNameAlreadyRegistered: ' + error);
            errors.push(language.error.connection);
            renderRegister(res, errors, name, password, confirmPassword);
        });
    } else {
        renderRegister(res, errors, name, password, confirmPassword);
    }
});

ROUTER.post('/login', (req, res) => {
    let { name, password } = req.body;

    let playerLoginResult = SQL_QUERIES.getPlayerByName(name);

    playerLoginResult.then((player) => {
        if (player.length === 1) {
            if (BCRYPT.compareSync(password, player[0].password)) {
                if (player[0].is_logged_in === 0) {
                    req.session.userId = player[0].id;
                    req.session.username = name;
                    res.redirect('/gameBoard');
                } else {
                    login.alreadyLoggedIn = language.login.alreadyLoggedIn;
                    res.render('login', {
                        login
                    });
                }
            } else {
                login.badCredentials = language.login.badCredentials;
                res.render('login', {
                    login
                });
            }
        } else {
            login.badCredentials = language.login.badCredentials;
            res.render('login', {
                login
            });
        }

    }).catch((error) => {
        console.log('playerLoginResult: ' + error);
        login.connectionError = language.error.connection;
        res.render('login', {
            login
        });
    });
});

ROUTER.post('/logout', (req, res) => {
    res.redirect('/');
});

ROUTER.get('/gameBoard', (req, res) => {
    if (req.session.userId) {
        res.render('game-board', {
            gameBoard
        });
    } else {
        res.redirect('/');
    }
});

function renderRegister(res, errors, name, password, confirmPassword) {
    res.render('register', {
        errors,
        name,
        password,
        confirmPassword,
        register
    });
}

module.exports = ROUTER;