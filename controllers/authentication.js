const express = require('express');
const router = express.Router();
const bCrypt = require('bcryptjs');
const LanguageVersions = require('../models/language');
const Session = require('../services/Session');
const SqlQueries = require('../services/SqlQueries');
const Pages = require('../services/PageLoader');

let SessionService = new Session();
let Queries = new SqlQueries();
let PageLoader = new Pages();

router.post('/login', async (req, res) => {
    let session = req.session;

    let languageCode = SessionService.getLanguageCode(session);
    let language = LanguageVersions.getLanguageVersionByCode(languageCode);
    let { name, password } = req.body;
    let user = await Queries.getUserByNameAsync(name);
    let navBar = PageLoader.getNavBar(language.navBar, languageCode, SessionService.getUserId(session));
    let login = PageLoader.getLoginPage(language.login);

    if (bCrypt.compareSync(password, user.password)) {
        if (user.status === 0) {
            session.userId = user.id;
            res.redirect(SessionService.getLastPosition(session));
        } else {
            login.alreadyLoggedIn = language.login.alreadyLoggedIn;

            res.render('login', {
                navBar,
                login
            });
        }
    } else {
        login.badCredentials = language.login.badCredentials;

        res.render('login', {
            navBar,
            login
        });
    }
});

router.get('/logout', (req, res) => {
    let session = req.session;
    Queries.putUserStatusById(SessionService.getUserId(session), 0);
    SessionService.setUserId(session, null);
    res.redirect(SessionService.getLastPosition(session));
});

module.exports = router;