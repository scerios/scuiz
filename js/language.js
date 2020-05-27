const LANG_EN = {
    indexWelcomeMsg: 'Hi',
    indexLoginBtn: 'Login',
    indexRegisterBtn: 'Register'
}

const LANG_HU = {
    indexWelcomeMsg: 'Szia',
    indexLoginBtn: 'Bejelentkezés',
    indexRegisterBtn: 'Regisztrálás'
}

function getLanguage(lang) {
    if (lang === 'en') {
        return LANG_EN;
    } else {
        return LANG_HU;
    }
}

exports.getLanguage = getLanguage;