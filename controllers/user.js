const express = require('express');
const bCrypt = require('bcryptjs');
const router = express.Router();
const Pages = require('../services/PageLoader');
const SqlQueries = require('../services/SqlQueries');
const Register = require('../services/Register');

let PageLoader = new Pages();
let Queries = new SqlQueries();
let RegisterService = new Register();

router.post('/register', async (req, res) => {
    let session = req.session;

    let pageBasics = await PageLoader.getPageBasics(session);
    let { name, password, confirmPassword } = req.body;
    let errors = RegisterService.tryGetInputErrors(req.body, pageBasics.language.error);

    if (errors.length === 0) {
        let user = await Queries.getPlayerByNameAsync(name);

        if (user === undefined) {
            Queries.postPlayer(name, bCrypt.hashSync(password, bCrypt.genSaltSync(10)));

            let login = PageLoader.getLoginPage(pageBasics.language);
            login.registerSuccess = pageBasics.language.login.registerSuccess;

            res.render('login', {
                navBar: PageLoader.getNavBar(pageBasics.language, pageBasics.languageCode, pageBasics.user),
                login
            });
        } else {
            let register = PageLoader.getRegisterPage(pageBasics.language);

            errors.push(pageBasics.language.error.registered);
            res.render('register', {
                navBar: PageLoader.getNavBar(pageBasics.language, pageBasics.languageCode, pageBasics.user),
                errors,
                password,
                confirmPassword,
                register
            });
        }
    } else {
        let register = PageLoader.getRegisterPage(pageBasics.language);

        res.render('register', {
            navBar: PageLoader.getNavBar(pageBasics.language, pageBasics.languageCode, pageBasics.user),
            errors,
            name,
            register
        });
    }
});

module.exports = router;