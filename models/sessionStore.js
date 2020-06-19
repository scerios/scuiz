const SESSION = require('express-session');
const MYSQL_STORE = require('express-mysql-session')(SESSION);

const STORE_OPTIONS = {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME
};

const SESSION_STORE = new MYSQL_STORE(STORE_OPTIONS);

module.exports = SESSION_STORE;