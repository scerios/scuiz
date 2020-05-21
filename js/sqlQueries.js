const mySql = require('./mySqlConnection');
const util = require('util');
const query = util.promisify(mySql.query).bind(mySql);

async function postPlayer(name, password) {
    return await query(`INSERT INTO player (name, password) VALUES ('${name}', '${password}')`);
}

async function putPlayerStatusById(id, status) {
    return await query(`UPDATE player SET is_logged_in = ${status} WHERE id = ${id}`);
}

async function getPlayerByName(name) {
    return await query(`SELECT id FROM player WHERE name = '${name}'`);
}

async function getPlayerByNameAndPassword(name, password) {
    return await query(`SELECT id FROM player WHERE name = '${name}' AND password = '${password}'`);
}

async function getAllCategories() {
    return await query('SELECT id, name, question_index FROM category');
}

async function getCategoryRoundLimit() {
    return await query('SELECT round_limit FROM round_count WHERE id = 1');
}

async function getAdminByNameAndPassword(name, password) {
    return await query(`SELECT * FROM admin WHERE name = '${name}' AND password = '${password}'`);
}

exports.postPlayer = postPlayer;
exports.putPlayerStatusById = putPlayerStatusById;
exports.getPlayerByName = getPlayerByName;
exports.getPlayerByNameAndPassword = getPlayerByNameAndPassword;
exports.getAllCategories = getAllCategories;
exports.getCategoryRoundLimit = getCategoryRoundLimit;
exports.getAdminByNameAndPassword = getAdminByNameAndPassword;
