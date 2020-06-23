class Session {
    setLastPosition(session, position) {
        session.lastPosition = position;
    }

    getLastPosition(session) {
        return session.lastPosition;
    }

    setLanguageCode(session, code) {
        session.languageCode = code;
    }

    getLanguageCode(session) {
        if (!session.languageCode) {
            session.languageCode = "hu";
        }
        return session.languageCode;
    }

    setUserId(session, userId) {
        session.userId = userId;
    }

    getUserId(session) {
        return session.userId === undefined? null : session.userId;
    }
}

module.exports = Session;