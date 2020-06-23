const LanguageVersions = require('../models/language');
const Session = require('../services/Session');
const SqlQueries = require('../services/SqlQueries');

let SessionService = new Session();
let Queries = new SqlQueries();

class PageLoader {

    async getPageBasics(session) {
        let languageCode = SessionService.getLanguageCode(session);
        let userId = SessionService.getUserId(session);

        return {
            languageCode: languageCode,
            language: LanguageVersions.getLanguageVersionByCode(languageCode),
            user: userId !== null? await Queries.getPlayerByIdAsync(userId) : null
        }
    }

    getNavBar(language, currentLanguage, user) {
        return {
            home: language.navBar.home,
            gameBoard: language.navBar.gameBoard,
            rules: language.navBar.rules,
            about: language.navBar.about,
            controlPanel: language.navBar.controlPanel,
            questionPanel: language.navBar.questionPanel,
            register: language.navBar.register,
            greeting: language.navBar.greeting,
            login: language.navBar.login,
            profile: language.navBar.profile,
            logout: language.navBar.logout,
            user: user,
            language: currentLanguage
        };
    }

    getIndexPage(language) {
        return {
            welcomeMsg: language.index.welcomeMsg,
            loginBtn: language.index.loginBtn,
            registerBtn: language.index.registerBtn
        };
    }

    getRegisterPage(language) {
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

    getLoginPage(language) {
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

    getAdminLoginPage(language) {
        return {
            welcomeMsg: language.adminLogin.welcomeMsg,
            nameLabel: language.adminLogin.nameLabel,
            namePlaceholder: language.adminLogin.namePlaceholder,
            passwordLabel: language.adminLogin.passwordLabel,
            passwordPlaceholder: language.adminLogin.passwordPlaceholder,
            loginBtn: language.adminLogin.loginBtn,
        };
    }

    getGameBoardPage(language, player, categories) {
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

    getControlPanelPage(language, players, categories) {
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
}

module.exports = PageLoader;