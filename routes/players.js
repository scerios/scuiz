const EXPRESS = require('express');
const ROUTER = EXPRESS.Router();
const BCRYPT = require('bcryptjs');
const LANGUAGE = require('./../js/language');
const SQL_QUERIES = require('./../js/sqlQueries');
const HELPER = require('./../js/helper');

let language = LANGUAGE.getLanguage('en');

let index = {
    welcomeMsg: language.index.welcomeMsg,
    loginBtn: language.index.loginBtn,
    registerBtn: language.index.registerBtn
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

ROUTER.get('/', (req, res) => {
    res.render('index', {
        index
    });
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
                    res.render('index', {
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
                    res.render('game-board', {
                        logoutBtn: language.gameBoard.logoutBtn
                    });
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
            IO.to(socket.id).emit('customError', { title: ERRORS.notFound, msg: ERRORS.badCredentials });
        }

    }).catch((error) => {
        console.log('playerLoginResult: ' + error);
        IO.to(socket.id).emit('customError', { title: ERRORS.standardError, msg: ERRORS.connectionIssue });
    });
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