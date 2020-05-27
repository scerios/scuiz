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
        welcomeMsg: "Hi",
        loginBtn: "Login",
        registerBtn: "Register",
        registerSuccess: "Registered successfully. Now you can log in to play!"
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
        registerLink: "Register"
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
        welcomeMsg: "Szia",
        loginBtn: "Bejelentkezés",
        registerBtn: "Regisztrálás",
        registerSuccess: "Sikeresen regisztráltál. Most már be tudsz jelentkezni járszani!"
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
        registerLink: "Regisztráció"
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