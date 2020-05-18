const loginQuery = (name, password) => {
    `SELECT * FROM player WHERE name = '${name}' AND password = '${password}'`;
};

const registerQuery = (name, password) => {
    `INSERT INTO player ('name', 'password') VALUES ('${name}', '${password}')`;
};


