const LANG_EN = {
    error: {
        required: "All fields must be filled.",
        different: "Passwords you entered doesn't match.",
        registered: "This name is already registered.",
        tooShortName: "Your name must be at least 3 characters.",
        tooShortPassword: "Your password must be at least 6 characters.",
        connection: "Due to some connection error your request has failed. Please try again."
    },
    index: {
        welcomeMsg: "Hello and welcome to Scuiz! To play the game you must first register an account and then you'll be able to login.",
        loginBtn: "Login",
        registerBtn: "Register",
        languageSelect: "Select language",
        english: "English",
        hungarian: "Hungarian"
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
        badCredentials: "Bad credentials.",
        alreadyLoggedIn:  "You may already be logged in. A player can be logged in only at one tab at a time."
    },
    gameBoard: {
        logoutBtn: "Logout",
        question: "Question",
        timer: "Time",
        answer: "Your answer",
        category: "Category"
    },
    adminLogin: {
        welcomeMsg: "Smart only",
        nameLabel: "Name",
        passwordLabel: "Password",
        loginBtn: "Login",
    },
    controlPanel: {
        authorizeBtn: "Authorize"
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
    index: {
        welcomeMsg: "Szia, légy üdvözölve a Scuiz-nél! Ahhoz, hogy játszani tudj, először regisztálj, utána tudsz majd belépni.",
        loginBtn: "Bejelentkezés",
        registerBtn: "Regisztrálás",
        languageSelect: "Válassz nyelvet",
        english: "Angol",
        hungarian: "Magyar"
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
        badCredentials: "Rossz felhasználónév vagy jelszó.",
        alreadyLoggedIn:  "Lehet, hogy már bejelentkeztél? Egyszerre egy játékos csak egy ablakban lehet bejelentkezve."
    },
    gameBoard: {
        logoutBtn: "Kilépés",
        question: "Kérdés",
        timer: "Idő",
        answer: "A válaszod",
        category: "Kategória"
    },
    adminLogin: {
        welcomeMsg: "Csak okosoknak",
        nameLabel: "Név",
        passwordLabel: "Jelszó",
        loginBtn: "Belépés",
    },
    controlPanel: {
        authorizeBtn: "Felhatalmaz"
    }
}

function getLanguage(lang) {
    if (lang === 'en') {
        return LANG_EN;
    } else {
        return LANG_HU;
    }
}

exports.getLanguage = getLanguage;