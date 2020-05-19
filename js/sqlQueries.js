const getByName = (name) => {
    return `SELECT * FROM player WHERE name = '${name}'`;
}

const getByNameAndPassword = (name, password) => {
    return `SELECT * FROM player WHERE name = '${name}' AND password = '${password}'`;
};

const postNameAndPassword = (name, password) => {
    return `INSERT INTO player (name, password) VALUES ('${name}', '${password}')`;
};

const getAllCategories = () => {
    return 'SELECT id, name, question_index as index FROM category';
};

exports.getByName = getByName;
exports.getByNameAndPassword = getByNameAndPassword;
exports.postNameAndPassword = postNameAndPassword;
exports.getAllCategories = getAllCategories;