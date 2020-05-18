const loginQuery = (name, password) => {
    return `SELECT * FROM player WHERE name = '${name}' AND password = '${password}'`;
};

const registerQuery = (name, password) => {
    return `INSERT INTO player (name, password) VALUES ('${name}', '${password}')`;
};

exports.loginQuery = loginQuery;
exports.registerQuery = registerQuery;
