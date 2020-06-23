const mySql = require('../models/mySqlConnection');
const util = require('util');
const query = util.promisify(mySql.query).bind(mySql);

class SqlQueries {

    postUser(name, password) {
        mySql.query(`INSERT INTO user (name, password) VALUES ('${name}', '${password}')`);
    }

    putUserStatusById(id, status) {
        mySql.query(`UPDATE user SET status = ${status} WHERE id = ${id}`);
    }

    putUserSocketIdById(id, socketId) {
        mySql.query(`UPDATE user SET socket_id = '${socketId}' WHERE id = ${id}`);
    }

    putUserStatusAndSocketIdBySocketId(socketId, status) {
        mySql.query(`UPDATE user SET status = ${status}, socket_id = '' WHERE socket_id = '${socketId}'`);
    }

    putUserPointAddValueById(id, value) {
        mySql.query(`UPDATE user SET point = point + ${value} WHERE id = ${id}`);
    }

    putUserPointSubtractValueById(id, value) {
        mySql.query(`UPDATE user SET point = point - ${value} WHERE id = ${id}`);
    }

    async getAllLoggedInUsersAsync() {
        return await query('SELECT id, socket_id, name, point FROM user WHERE status = 1');
    }

    async getUserByIdAsync(id) {
        let result = await query(`SELECT id, socket_id, name, point, status FROM user WHERE id = '${id}'`);
        return result[0];
    }

    async getPlayerStatusByIdAsync(id) {
        let result = await query(`SELECT status FROM user WHERE id = '${id}'`);
        return result[0].status;
    }

    async getUserByNameAsync(name) {
        let result = await query(`SELECT id, password, status FROM user WHERE name = '${name}'`);
        return result[0];
    }

    putCategoryQuestionIndexById(id, index) {
        mySql.query(`UPDATE category SET question_index = ${index} WHERE id = ${id}`);
    }

    async getAllCategoriesAsync() {
        return await query('SELECT id, name, question_index FROM category');
    }

    async getCategoryRoundLimitAsync() {
        let result = await query('SELECT round_limit FROM category_limit WHERE id = 1');
        return result[0];
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