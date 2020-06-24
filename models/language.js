const LANG_EN = {
    error: {
        required: "All fields must be filled.",
        different: "Passwords you entered doesn't match.",
        registered: "This name is already registered.",
        tooShortName: "Your name must be at least 3 characters.",
        tooShortPassword: "Your password must be at least 6 characters.",
        connection: "Due to some connection error your request has failed. Please try again."
    },
    navBar: {
        home: "Home",
        gameBoard: "Game Board",
        rules: "Rules",
        about: "About",
        controlPanel: "Admin panel",
        questionPanel: "Questions",
        greeting: "Hello",
        register: "Register",
        login: "Login",
        profile: "Profile",
        logout: "Logout"
    },
    index: {
        welcomeMsg: "Hello and welcome to Scuiz! To play the game you must first register an account and then you'll be able to login.",
        alreadyLoggedIn:  "You may already be logged in. A player can be logged in only at one tab at a time."
    },
    register: {
        welcomeMsg: "Register",
        nameLabel: "Name",
        namePlaceholder: "Enter your name",
        passwordLabel: "Password",
        passwordPlaceholder: "Enter a password",
        confirmPasswordLabel: "Confirm password",
        confirmPasswordPlaceholder: "Confirm your password",
        registerBtn: "Register",
        isRegisteredQuestion: "Are you already registered?",
        loginLink: "Login"
    },
    login: {
        welcomeMsg: "Login",
        nameLabel: "Name",
        namePlaceholder: "Enter your name",
        passwordLabel: "Password",
        passwordPlaceholder: "Enter your password",
        loginBtn: "Login",
        isNotRegisteredQuestion: "Not registered yet?",
        registerLink: "Register",
        registerSuccess: "Registered successfully. Now you can log in to play!",
        badCredentials: "Bad credentials."
    },
    gameBoard: {
        logoutBtn: "Logout",
        question: "Question",
        timer: "Time",
        answer: "Your answer",
        doublerBtn: "Doubler",
        doublerBtnClicked: "Doubled",
        answerBtn: "Send",
        category: "Category",
        pointText: "Current points",
        selectCategory: "Select category"
    },
    adminLogin: {
        welcomeMsg: "Smart only",
        nameLabel: "Name",
        passwordLabel: "Password",
        loginBtn: "Login",
    },
    controlPanel: {
        emptyTable: "No player online at the moment",
        usersTableHead: {
            name: "Name",
            points: "Points",
            authorizeBtn: "Authorize"
        },
        evaluationTableTitle: "Evaluation of answers",
        evaluationTableHead: {
            name: "Name",
            timeLeft: "Time left",
            answer: "Answer",
            evaluate: "Evaluate",
            point: "Points"
        },
        authorizeBtn: "Authorize",
        timer: "How much time for players to answer?",
        timerLegend: "numbers only, in seconds, if 0: infinite",
        pointValue: "How much point for the next question?",
        pointValueLegend: "numbers only, default: 2",
        showEvaluationModalBtn: "Show evaluation",
        collectAnswersBtn: "Collect answers",
        evaluateBtn: "Evaluate",
        logoutEveryoneBtn: "Logout everyone"
    },
    questionPanel: {
        categoryHead: "Categories",
        categoryList: "Category list",
        default: "- - -",
        questions: "Questions"
    }
}

const LANG_HU = {
    error: {
        required: "Minden mezőt ki kell tölteni.",
        different: "A beírt jelszók nem egyeznek.",
        registered: "Ezzel a névvel már regisztráltak.",
        tooShortName: "A névnek legalább 3 karakterből kell állnia.",
        tooShortPassword: "A jelszónak legalább 6 karakterből kell állnia.",
        connection: "Csatlakozási hiba miatt nem sikerült a művelet. Kérlek próbáld újra."
    },
    navBar: {
        home: "Főoldal",
        gameBoard: "Játék",
        rules: "Szabályok",
        about: "Rólunk",
        controlPanel: "Admin felület",
        questionPanel: "Kérdések",
        greeting: "Szia",
        register: "Regisztráció",
        login: "Belépés",
        profile: "Profil",
        logout: "Kilépés"
    },
    index: {
        welcomeMsg: "Szia, légy üdvözölve a Scuiz-nél! Ahhoz, hogy játszani tudj, először regisztálj, utána tudsz majd belépni.",
        alreadyLoggedIn:  "Lehet, hogy már bejelentkeztél? Egyszerre egy játékos csak egy ablakban lehet bejelentkezve."
    },
    register: {
        welcomeMsg: "Regisztráció",
        nameLabel: "Név",
        namePlaceholder: "Add meg a neved",
        passwordLabel: "Jelszó",
        passwordPlaceholder: "Adj meg egy jelszót",
        confirmPasswordLabel: "Jelszó újra",
        confirmPasswordPlaceholder: "Add meg újra a jelszavad",
        registerBtn: "Regisztráció",
        isRegisteredQuestion: "Regisztráltál már?",
        loginLink: "Bejelentkezés"
    },
    login: {
        welcomeMsg: "Bejelentkezés",
        nameLabel: "Név",
        namePlaceholder: "Add meg a neved",
        passwordLabel: "Jelszó",
        passwordPlaceholder: "Add meg a jelszavad",
        loginBtn: "Bejelentkezek",
        isNotRegisteredQuestion: "Még nem regisztráltál?",
        registerLink: "Regisztráció",
        registerSuccess: "Sikeresen regisztráltál. Most már be tudsz jelentkezni járszani!",
        badCredentials: "Rossz felhasználónév vagy jelszó."
    },
    gameBoard: {
        logoutBtn: "Kilépés",
        question: "Kérdés",
        timer: "Idő",
        answer: "A válaszod",
        doublerBtn: "Duplázok",
        doublerBtnClicked: "Dupláztam",
        answerBtn: "Elküldöm",
        category: "Kategória",
        pointText: "Jelenlegi pontok",
        selectCategory: "Válassz témakört"
    },
    adminLogin: {
        welcomeMsg: "Csak okosoknak",
        nameLabel: "Név",
        passwordLabel: "Jelszó",
        loginBtn: "Belépés",
    },
    controlPanel: {
        emptyTable: "Jelenleg nincs aktív játékos",
        usersTableHead: {
            name: "Név",
            points: "Pontok",
            authorizeBtn: "Felhatalmazás"
        },
        evaluationTableTitle: "Válaszok értékelése",
        evaluationTableHead: {
            name: "Név",
            timeLeft: "Maradék idő",
            answer: "Válasz",
            evaluate: "Értékelés",
            point: "Pontok"
        },
        authorizeBtn: "Felhatalmaz",
        timer: "Mennyi idő alatt kell válaszolni?",
        timerLegend: "csak számok, másodpercben, ha 0: végtelen",
        pointValue: "Mennyi pont a következő kérdésért?",
        pointValueLegend: "csak számok, alap: 2",
        showEvaluationModalBtn: "Értékelés mutatása",
        collectAnswersBtn: "Válaszok begyűjtése",
        evaluateBtn: "Értékelés",
        logoutEveryoneBtn: "Mindenki kiléptetése"
    },
    questionPanel: {
        categoryHead: "Kategóriák",
        categoryList: "Kategória lista",
        default: "- - -",
        questions: "Kérdések"
    }
}

function getLanguageVersionByCode(languageCode) {
    if (languageCode === 'us') {
        return LANG_EN;
    } else {
        return LANG_HU;
    }
}

exports.getLanguageVersionByCode = getLanguageVersionByCode;