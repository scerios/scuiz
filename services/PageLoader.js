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
            user: userId !== null? await Queries.getUserByIdAsync(userId) : null
        }
    }

    getNavBar(navBar, currentLanguage, user) {
        return {
            home: navBar.home,
            gameBoard: navBar.gameBoard,
            rules: navBar.rules,
            about: navBar.about,
            controlPanel: navBar.controlPanel,
            questionPanel: navBar.questionPanel,
            register: navBar.register,
            greeting: navBar.greeting,
            login: navBar.login,
            profile: navBar.profile,
            logout: navBar.logout,
            user: user,
            language: currentLanguage
        };
    }

    getIndexPage(index) {
        return {
            welcomeMsg: index.welcomeMsg,
            loginBtn: index.loginBtn,
            registerBtn: index.registerBtn
        };
    }

    getRegisterPage(register) {
        return {
            welcomeMsg: register.welcomeMsg,
            nameLabel: register.nameLabel,
            namePlaceholder: register.namePlaceholder,
            passwordLabel: register.passwordLabel,
            passwordPlaceholder: register.passwordPlaceholder,
            confirmPasswordLabel: register.confirmPasswordLabel,
            confirmPasswordPlaceholder: register.confirmPasswordPlaceholder,
            registerBtn: register.registerBtn,
            isRegisteredQuestion: register.isRegisteredQuestion,
            loginLink: register.loginLink
        };
    }

    getLoginPage(login) {
        return {
            welcomeMsg: login.welcomeMsg,
            nameLabel: login.nameLabel,
            namePlaceholder: login.namePlaceholder,
            passwordLabel: login.passwordLabel,
            passwordPlaceholder: login.passwordPlaceholder,
            loginBtn: login.loginBtn,
            isNotRegisteredQuestion: login.isNotRegisteredQuestion,
            registerLink: login.registerLink
        };
    }

    getGameBoardPage(gameBoard, user, categories) {
        return {
            categories: categories,
            logoutBtn: gameBoard.logoutBtn,
            question: gameBoard.question,
            timer: gameBoard.timer,
            answer: gameBoard.answer,
            doublerBtn: gameBoard.doublerBtn,
            doublerBtnClicked: gameBoard.doublerBtnClicked,
            answerBtn: gameBoard.answerBtn,
            category: gameBoard.category,
            pointText: gameBoard.pointText,
            selectCategory: gameBoard.selectCategory,
            myId: user.id,
            myName: user.name,
            pointValue: user.point
        };
    }

    getControlPanelPage(controlPanel, users, categories) {
        return {
            emptyTable: controlPanel.emptyTable,
            usersTableHead: {
                name: controlPanel.usersTableHead.name,
                points: controlPanel.usersTableHead.points,
                authorizeBtn: controlPanel.usersTableHead.authorizeBtn
            },
            evaluationTableTitle: controlPanel.evaluationTableTitle,
            evaluationTableHead: {
                name: controlPanel.evaluationTableHead.name,
                timeLeft: controlPanel.evaluationTableHead.timeLeft,
                answer: controlPanel.evaluationTableHead.answer,
                evaluate: controlPanel.evaluationTableHead.evaluate,
                point: controlPanel.evaluationTableHead.point
            },
            authorizeBtn: controlPanel.authorizeBtn,
            timer: controlPanel.timer,
            timerLegend: controlPanel.timerLegend,
            pointValue: controlPanel.pointValue,
            pointValueLegend: controlPanel.pointValueLegend,
            showEvaluationModalBtn: controlPanel.showEvaluationModalBtn,
            collectAnswersBtn: controlPanel.collectAnswersBtn,
            evaluateBtn: controlPanel.evaluateBtn,
            logoutEveryoneBtn: controlPanel.logoutEveryoneBtn,
            categories: categories,
            users: users
        };
    }

    getQuestionPanelPage(questionPanel, categories) {
        return {
            selectCategory: questionPanel.selectCategory,
            categoryList: questionPanel.categoryList,
            categories: categories,
            questions: questionPanel.questions
        };
    }
}

module.exports = PageLoader;