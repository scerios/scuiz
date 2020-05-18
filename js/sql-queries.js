const login = (name, password) => {
    return `SELECT * FROM player WHERE name = '${name}' AND password = '${password}'`;
};

const register = (name, password) => {
    return `INSERT INTO player (name, password) VALUES ('${name}', '${password}')`;
};

exports.login = login;
exports.register = register;
