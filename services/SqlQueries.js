const mySql = require('../models/mySqlConnection');
const util = require('util');
const query = util.promisify(mySql.query).bind(mySql);

class SqlQueries {

    postPlayer(name, password) {
        mySql.query(`INSERT INTO player (name, password) VALUES ('${name}', '${password}')`);
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

    putPlayerPointAddValueById(id, value) {
        mySql.query(`UPDATE player SET point = point + ${value} WHERE id = ${id}`);
    }

    putPlayerPointSubtractValueById(id, value) {
        mySql.query(`UPDATE player SET point = point - ${value} WHERE id = ${id}`);
    }

    async getAllLoggedInPlayersAsync() {
        return await query('SELECT id, socket_id, name, point FROM player WHERE status = 1');
    }

    async getPlayerByIdAsync(id) {
        let result = await query(`SELECT id, socket_id, name, point, status FROM player WHERE id = '${id}'`);
        return result[0];
    }

    async getPlayerStatusByIdAsync(id) {
        let result = await query(`SELECT status FROM player WHERE id = '${id}'`);
        return result[0].status;
    }

    async getPlayerByNameAsync(name) {
        let result = await query(`SELECT id, password, status FROM player WHERE name = '${name}'`);
        return result[0];
    }

    async putCategoryQuestionIndexByIdAsync(id, index) {
        return await query(`UPDATE category SET question_index = ${index} WHERE id = ${id}`);
    }

    async getAllCategoriesAsync() {
        return await query('SELECT id, name, question_index FROM category');
    }

    async getCategoryRoundLimitAsync() {
        let result = await query('SELECT round_limit FROM category_limit WHERE id = 1');
        return result[0];
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

    async getNextQuestionByCategoryIdAndQuestionIndexAsync(categoryId, index) {
        return await query(
            `SELECT c.id, c.name, q.question, q.answer FROM question q ` +
            `INNER JOIN category c ` +
            `ON q.category_id = c.id ` +
            `WHERE category_id = ${categoryId} LIMIT ${index}, 1`);
    }

    async getNextTwoQuestionsByCategoryIdAndQuestionIndexAsync(categoryId, index) {
        index--;
        return await query(
            `SELECT c.id, c.name, q.question, q.answer FROM question q ` +
            `INNER JOIN category c ` +
            `ON q.category_id = c.id ` +
            `WHERE category_id = ${categoryId} LIMIT ${index}, 2`);
    }

    putCategoryLimit(limit) {
        mySql.query(`UPDATE category_limit SET round_limit = round_limit + ${limit} WHERE id = 1`);
    }
}

module.exports = SqlQueries;