const LANG_EN = {
    index: {
        welcomeMsg: 'Hi',
        loginBtn: 'Login',
        registerBtn: 'Register'
    },
    register: {
        welcomeMsg: 'Register',
        nameLabel: 'Name',
        namePlaceHolder: 'Enter your name',
        passwordLabel: 'Password',
        passwordPlaceHolder: 'Enter a password',
        confirmPasswordLabel: 'Confirm password',
        confirmPasswordPlaceHolder: 'Confirm your password',
        registerBtn: 'Register',
        isRegisteredQuestion: 'Are you already registered?',
        loginLink: 'Login'
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
        namePlaceHolder: 'Add meg a neved',
        passwordLabel: 'Jelszó',
        passwordPlaceHolder: 'Adj meg egy jelszót',
        confirmPasswordLabel: 'Jelszó újra',
        confirmPasswordPlaceHolder: 'Add meg újra a jelszavad',
        registerBtn: 'Regisztráció',
        isRegisteredQuestion: 'Regisztráltál már?',
        loginLink: 'Bejelentkezés'
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