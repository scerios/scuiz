const mySql = require('./mySqlConnection');
const util = require('util');
const query = util.promisify(mySql.query).bind(mySql);

async function postPlayerAsync(name, password) {
    return await query(`INSERT INTO player (name, password) VALUES ('${name}', '${password}')`);
}

async function putPlayerStatusByIdAsync(id, status) {
    return await query(`UPDATE player SET status = ${status} WHERE id = ${id}`);
}

function putPlayerStatusById(id, status) {
    mySql.query(`UPDATE player SET status = ${status} WHERE id = ${id}`);
}

async function putPlayerSocketIdByIdAsync(id, socketId) {
    return await query(`UPDATE player SET socket_id = '${socketId}' WHERE id = ${id}`);
}

async function putPlayerStatusAndSocketIdBySocketIdAsync(socketId, status) {
    return await query(`UPDATE player SET status = ${status}, socket_id = '' WHERE socket_id = '${socketId}'`);
}

function putPlayerPointAddTwoById(id) {
    mySql.query(`UPDATE player SET point = point + 2 WHERE id = ${id}`);
}

async function getAllLoggedInPlayersAsync() {
    return await query('SELECT id, socket_id, name, point FROM player WHERE status = 1');
}

async function getPlayerByIdAsync(id) {
    return await query(`SELECT id, socket_id, name, point, status FROM player WHERE id = '${id}'`);
}

async function getPlayerByNameAsync(name) {
    return await query(`SELECT id, password, status FROM player WHERE name = '${name}'`);
}

async function putCategoryQuestionIndexByIdAsync(id, index) {
    return await query(`UPDATE category SET question_index = ${index} WHERE id = ${id}`);
}

async function getAllCategoriesAsync() {
    return await query('SELECT id, name, question_index FROM category');
}

async function getCategoryRoundLimitAsync() {
    return await query('SELECT round_limit FROM category_limit WHERE id = 1');
}

async function getAdminPasswordByNameAsync(name) {
    return await query(`SELECT password FROM admin WHERE name = '${name}'`);
}

async function getAllQuestionsAsync() {
    return await query(
        'SELECT c.name, q.question, q.answer FROM question q ' +
        'INNER JOIN category c ' +
        'ON q.category_id = c.id'
    );
}

async function getQuestionByCategoryIdAndQuestionIndexAsync(categoryId, index) {
    index--;
    return await query(
            `SELECT q.question, q.answer, c.name FROM question q ` +
            `INNER JOIN category c ` +
            `ON q.category_id = c.id ` +
            `WHERE category_id = ${categoryId} LIMIT ${index}, 1`);
}

async function putCategoryLimitAsync(limit) {
    limit += 3;
    return await query(`UPDATE category_limit SET round_limit = ${limit} WHERE id = 1`);
}

exports.postPlayerAsync = postPlayerAsync;
exports.putPlayerStatusByIdAsync = putPlayerStatusByIdAsync;
exports.putPlayerStatusById = putPlayerStatusById;
exports.putPlayerSocketIdByIdAsync = putPlayerSocketIdByIdAsync;
exports.putPlayerStatusAndSocketIdBySocketIdAsync = putPlayerStatusAndSocketIdBySocketIdAsync;
exports.putPlayerPointAddTwoById = putPlayerPointAddTwoById;
exports.getAllLoggedInPlayersAsync = getAllLoggedInPlayersAsync;
exports.getPlayerByIdAsync = getPlayerByIdAsync;
exports.getPlayerByNameAsync = getPlayerByNameAsync;
exports.putCategoryQuestionIndexByIdAsync = putCategoryQuestionIndexByIdAsync;
exports.getAllCategoriesAsync = getAllCategoriesAsync;
exports.getCategoryRoundLimitAsync = getCategoryRoundLimitAsync;
exports.getAdminPasswordByNameAsync = getAdminPasswordByNameAsync;
exports.getAllQuestionsAsync = getAllQuestionsAsync;
exports.getQuestionByCategoryIdAndQuestionIndexAsync = getQuestionByCategoryIdAndQuestionIndexAsync;
exports.putCategoryLimitAsync = putCategoryLimitAsync;