const express = require('express');
const router = express.Router();
const Session = require('../services/Session');
const Pages = require('../services/PageLoader');
const SqlQueries = require('../services/SqlQueries');
const Category = require('../services/CategoryService');

let SessionService = new Session();
let PageLoader = new Pages();
let Queries = new SqlQueries();
let CategoryService = new Category();

router.get('/setLanguageEn', (req, res) => {
    let session = req.session;

    SessionService.setLanguageCode(session, 'us');
    res.redirect(SessionService.getLastPosition(session));
});

router.get('/setLanguageHu', (req, res) => {
    let session = req.session;

    SessionService.setLanguageCode(session, 'hu');
    res.redirect(SessionService.getLastPosition(session));
});

router.get('/', async (req, res) => {
    let session = req.session;
    SessionService.setLastPosition(session, "/");

    let pageBasics = await PageLoader.getPageBasics(session);
    let index = PageLoader.getIndexPage(pageBasics.language.index);

    res.render('index', {
        navBar: PageLoader.getNavBar(pageBasics.language.navBar, pageBasics.languageCode, pageBasics.user),
        index
    });
});

router.get('/register', async (req, res) => {
    let session = req.session;
    SessionService.setLastPosition(session, '/register');

    let pageBasics = await PageLoader.getPageBasics(session);
    let register = PageLoader.getRegisterPage(pageBasics.language.register);

    res.render('register', {
        navBar: PageLoader.getNavBar(pageBasics.language.navBar, pageBasics.languageCode, pageBasics.user),
        register
    });
});

router.get('/login', async (req, res) => {
    let session = req.session;

    let pageBasics = await PageLoader.getPageBasics(session);
    let login = PageLoader.getLoginPage(pageBasics.language.login);

    res.render('login', {
        navBar: PageLoader.getNavBar(pageBasics.language.navBar, pageBasics.languageCode, pageBasics.user),
        login
    });
});

router.get('/gameBoard', async (req, res) => {
    let session = req.session;
    SessionService.setLastPosition(session, '/gameBoard');

    let pageBasics = await PageLoader.getPageBasics(session);

    if (pageBasics.user === null) {
        res.redirect('/login');
    } else {
        if (pageBasics.user.status === 0) {
            Queries.putUserStatusById(pageBasics.user.id, 1);

            let categories = await Queries.getAllCategoriesAsync();
            let categoryRoundLimit = await Queries.getCategoryRoundLimitAsync();
            let sortedCategories = CategoryService.getCategoryAvailabilities(categories, categoryRoundLimit.round_limit);

            let gameBoard = PageLoader.getGameBoardPage(pageBasics.language.gameBoard, pageBasics.user, sortedCategories);

            res.render('game-board', {
                navBar: PageLoader.getNavBar(pageBasics.language.navBar, pageBasics.languageCode, pageBasics.user),
                gameBoard
            });

        } else {
            let index = PageLoader.getIndexPage(pageBasics.language.index);
            index.alreadyLoggedIn = pageBasics.language.index.alreadyLoggedIn;

            res.render('index', {
                navBar: PageLoader.getNavBar(pageBasics.language.navBar, pageBasics.languageCode, pageBasics.user),
                index
            });
        }
    }
});

router.get('/controlPanel', async (req, res) => {
    let session = req.session;
    let pageBasics = await PageLoader.getPageBasics(session);

    if (pageBasics.user && pageBasics.user.id === 1) {
        SessionService.setLastPosition(session, '/controlPanel');

        let categories = await Queries.getAllCategoriesAsync();
        let categoryRoundLimit = await Queries.getCategoryRoundLimitAsync();
        let sortedCategories = CategoryService.getCategoryAvailabilities(categories, categoryRoundLimit.round_limit);
        sortedCategories = await CategoryService.matchNextQuestionToCategories(sortedCategories);
        let users = await Queries.getAllLoggedInUsersAsync();

        let controlPanel = PageLoader.getControlPanelPage(pageBasics.language.controlPanel, users, sortedCategories);

        res.render('control-panel', {
            navBar: PageLoader.getNavBar(pageBasics.language.navBar, pageBasics.languageCode, pageBasics.user),
            controlPanel
        });
    } else {
        res.redirect(SessionService.getLastPosition(session));
    }
});

module.exports = router;
