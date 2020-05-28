const mySql = require('./mySqlConnection');
const util = require('util');
const query = util.promisify(mySql.query).bind(mySql);

async function postPlayer(name, password) {
    return await query(`INSERT INTO player (name, password) VALUES ('${name}', '${password}')`);
}

async function putPlayerStatusById(id, status) {
    return await query(`UPDATE player SET is_logged_in = ${status} WHERE id = ${id}`);
}

async function putPlayerSocketIdById(id, socketId) {
    return await query(`UPDATE player SET socket_id = '${socketId}' WHERE id = ${id}`);
}

async function putPlayerStatusAndSocketIdBySocketId(socketId, status) {
    return await query(`UPDATE player SET is_logged_in = ${status}, socket_id = '' WHERE socket_id = '${socketId}'`);
}

async function getAllLoggedInPlayers() {
    return await query('SELECT id, socket_id, name, point FROM player WHERE is_logged_in = 1');
}

async function getPlayerById(id) {
    return await query(`SELECT id, socket_id, name, point FROM player WHERE id = '${id}'`);
}

async function getPlayerByName(name) {
    return await query(`SELECT id, password, is_logged_in FROM player WHERE name = '${name}'`);
}

async function putCategoryQuestionIndexById(id, index) {
    return await query(`UPDATE category SET question_index = ${index} WHERE id = ${id}`);
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

async function getAllQuestions() {
    return await query(
        'SELECT c.name, q.question, q.answer FROM question q ' +
        'INNER JOIN category c ' +
        'ON q.category_id = c.id'
    );
}

async function getQuestionByCategoryIdAndQuestionIndex(categoryId, index) {
    index--;
    return await query(`SELECT question, answer FROM question WHERE category_id = ${categoryId} LIMIT ${index}, 1`);
}

exports.postPlayer = postPlayer;
exports.putPlayerStatusById = putPlayerStatusById;
exports.putPlayerSocketIdById = putPlayerSocketIdById;
exports.putPlayerStatusAndSocketIdBySocketId = putPlayerStatusAndSocketIdBySocketId;
exports.getAllLoggedInPlayers = getAllLoggedInPlayers;
exports.getPlayerById = getPlayerById;
exports.getPlayerByName = getPlayerByName;
exports.putCategoryQuestionIndexById = putCategoryQuestionIndexById;
exports.getAllCategories = getAllCategories;
exports.getCategoryRoundLimit = getCategoryRoundLimit;
exports.getAdminByNameAndPassword = getAdminByNameAndPassword;
exports.getAllQuestions = getAllQuestions;
exports.getQuestionByCategoryIdAndQuestionIndex = getQuestionByCategoryIdAndQuestionIndex;
