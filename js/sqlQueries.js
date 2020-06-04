const mySql = require('./mySqlConnection');
const util = require('util');
const query = util.promisify(mySql.query).bind(mySql);

async function postPlayer(name, password) {
    return await query(`INSERT INTO player (name, password) VALUES ('${name}', '${password}')`);
}

async function putPlayerStatusById(id, status) {
    return await query(`UPDATE player SET status = ${status} WHERE id = ${id}`);
}

async function putPlayerSocketIdById(id, socketId) {
    return await query(`UPDATE player SET socket_id = '${socketId}' WHERE id = ${id}`);
}

async function putPlayerStatusAndSocketIdBySocketId(socketId, status) {
    return await query(`UPDATE player SET status = ${status}, socket_id = '' WHERE socket_id = '${socketId}'`);
}

async function getAllLoggedInPlayers() {
    return await query('SELECT id, socket_id, name, point FROM player WHERE status = 1');
}

async function getPlayerById(id) {
    return await query(`SELECT id, socket_id, name, point, status FROM player WHERE id = '${id}'`);
}

async function getPlayerByName(name) {
    return await query(`SELECT id, password, status FROM player WHERE name = '${name}'`);
}

async function putCategoryQuestionIndexById(id, index) {
    return await query(`UPDATE category SET question_index = ${index} WHERE id = ${id}`);
}

async function getAllCategories() {
    return await query('SELECT id, name, question_index FROM category');
}

async function getCategoryRoundLimit() {
    return await query('SELECT round_limit FROM category_limit WHERE id = 1');
}

async function getAdminPasswordByName(name) {
    return await query(`SELECT password FROM admin WHERE name = '${name}'`);
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
    return await query(
            `SELECT q.question, q.answer, c.name FROM question q ` +
            `INNER JOIN category c ` +
            `ON q.category_id = c.id ` +
            `WHERE category_id = ${categoryId} LIMIT ${index}, 1`);
}

async function putCategoryLimit(limit) {
    limit += 3;
    return await query(`UPDATE category_limit SET round_limit = ${limit} WHERE id = 1`);
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
exports.getAdminPasswordByName = getAdminPasswordByName;
exports.getAllQuestions = getAllQuestions;
exports.getQuestionByCategoryIdAndQuestionIndex = getQuestionByCategoryIdAndQuestionIndex;
exports.putCategoryLimit = putCategoryLimit;