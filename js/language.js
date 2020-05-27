const LANG_EN = {
    index: {
        welcomeMsg: 'Hi',
        loginBtn: 'Login',
        registerBtn: 'Register'
    }
}

const LANG_HU = {
    index: {
        welcomeMsg: 'Szia',
        loginBtn: 'Bejelentkezés',
        registerBtn: 'Regisztrálás'
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