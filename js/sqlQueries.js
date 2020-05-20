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
    return 'SELECT id, name, question_index FROM category';
};

const getCategoryRoundLimit = () => {
    return 'SELECT round_limit FROM round_count WHERE id = 1';
}

exports.getByName = getByName;
exports.getByNameAndPassword = getByNameAndPassword;
exports.postNameAndPassword = postNameAndPassword;
exports.getAllCategories = getAllCategories;
exports.getCategoryRoundLimit = getCategoryRoundLimit;