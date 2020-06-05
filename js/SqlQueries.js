const mySql = require('./mySqlConnection');
const util = require('util');
const query = util.promisify(mySql.query).bind(mySql);

class SqlQueries {

    async postPlayerAsync(name, password) {
        return await query(`INSERT INTO player (name, password) VALUES ('${name}', '${password}')`);
    }

    async putPlayerStatusByIdAsync(id, status) {
        return await query(`UPDATE player SET status = ${status} WHERE id = ${id}`);
    }

    putPlayerStatusById(id, status) {
        mySql.query(`UPDATE player SET status = ${status} WHERE id = ${id}`);
    }

    async putPlayerSocketIdByIdAsync(id, socketId) {
        return await query(`UPDATE player SET socket_id = '${socketId}' WHERE id = ${id}`);
    }

    async putPlayerStatusAndSocketIdBySocketIdAsync(socketId, status) {
        return await query(`UPDATE player SET status = ${status}, socket_id = '' WHERE socket_id = '${socketId}'`);
    }

    putPlayerPointAddTwoById(id) {
        mySql.query(`UPDATE player SET point = point + 2 WHERE id = ${id}`);
    }

    async getAllLoggedInPlayersAsync() {
        return await query('SELECT id, socket_id, name, point FROM player WHERE status = 1');
    }

    async getPlayerByIdAsync(id) {
        return await query(`SELECT id, socket_id, name, point, status FROM player WHERE id = '${id}'`);
    }

    async getPlayerByNameAsync(name) {
        return await query(`SELECT id, password, status FROM player WHERE name = '${name}'`);
    }

    async putCategoryQuestionIndexByIdAsync(id, index) {
        return await query(`UPDATE category SET question_index = ${index} WHERE id = ${id}`);
    }

    async getAllCategoriesAsync() {
        return await query('SELECT id, name, question_index FROM category');
    }

    async getCategoryRoundLimitAsync() {
        return await query('SELECT round_limit FROM category_limit WHERE id = 1');
    }

    async getAdminPasswordByNameAsync(name) {
        return await query(`SELECT password FROM admin WHERE name = '${name}'`);
    }

    async getAllQuestionsAsync() {
        return await query(
            'SELECT c.name, q.question, q.answer FROM question q ' +
            'INNER JOIN category c ' +
            'ON q.category_id = c.id'
        );
    }

    async getQuestionByCategoryIdAndQuestionIndexAsync(categoryId, index) {
        index--;
        return await query(
            `SELECT q.question, q.answer, c.name FROM question q ` +
            `INNER JOIN category c ` +
            `ON q.category_id = c.id ` +
            `WHERE category_id = ${categoryId} LIMIT ${index}, 1`);
    }

    async putCategoryLimitAsync(limit) {
        limit += 3;
        return await query(`UPDATE category_limit SET round_limit = ${limit} WHERE id = 1`);
    }
}

module.exports = SqlQueries;