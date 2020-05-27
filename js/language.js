const LANG_EN = {
    index: {
        welcomeMsg: 'Hi',
        loginBtn: 'Login',
        registerBtn: 'Register'
    },
    register: {
        welcomeMsg: 'Register',
        nameLabel: 'Name',
        namePlaceholder: 'Enter your name',
        passwordLabel: 'Password',
        passwordPlaceholder: 'Enter a password',
        confirmPasswordLabel: 'Confirm password',
        confirmPasswordPlaceholder: 'Confirm your password',
        registerBtn: 'Register',
        isRegisteredQuestion: 'Are you already registered?',
        loginLink: 'Login'
    },
    login: {
        welcomeMsg: 'Login',
        nameLabel: 'Name',
        namePlaceholder: 'Enter your name',
        passwordLabel: 'Password',
        passwordPlaceholder: 'Enter your password',
        loginBtn: 'Login',
        isNotRegisteredQuestion: 'Not registered yet?',
        registerLink: 'Register'
    }
}

const LANG_HU = {
    index: {
        welcomeMsg: 'Szia',
        loginBtn: 'Bejelentkezés',
        registerBtn: 'Regisztrálás'
    },
    register: {
        welcomeMsg: 'Regisztráció',
        nameLabel: 'Név',
        namePlaceholder: 'Add meg a neved',
        passwordLabel: 'Jelszó',
        passwordPlaceholder: 'Adj meg egy jelszót',
        confirmPasswordLabel: 'Jelszó újra',
        confirmPasswordPlaceholder: 'Add meg újra a jelszavad',
        registerBtn: 'Regisztráció',
        isRegisteredQuestion: 'Regisztráltál már?',
        loginLink: 'Bejelentkezés'
    },
    login: {
        welcomeMsg: 'Bejelentkezés',
        nameLabel: 'Név',
        namePlaceholder: 'Add meg a neved',
        passwordLabel: 'Jelszó',
        passwordPlaceholder: 'Add meg a jelszavad',
        loginBtn: 'Bejelentkezek',
        isNotRegisteredQuestion: 'Még nem regisztráltál?',
        registerLink: 'Regisztráció'
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