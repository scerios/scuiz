// Define needed variables
const PAGES_DIR = 'pages';
const PORT = process.env.PORT || 3000;

// Implementing needed nodes + creating the server.
const path = require('path');
const app = require('express')();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

const mySql = require('./js/mysql-connect');
const sqlQueries = require('./js/sql-queries');

// Listening on an open port.
http.listen(PORT, () => {
    console.log(`Listening on ${PORT}.`);
});

// Setting what should be loaded on different endpoints.
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, PAGES_DIR, 'player.html'));
});

app.get('/admin', (req, res) => {
    res.sendFile(path.join(__dirname, PAGES_DIR, 'admin.html'));
});

// Setting what should be done when someone connects.
io.on('connection', socket => {
    console.log(`A user with ID: ${socket.id} connected.`);

    socket.on('disconnect', () => {
        console.log(`A user with ID: ${socket.id} disconnected.`);
    });

    socket.on('login', data => {
        mySql.connect();

        mySql.query(sqlQueries.getByNameAndPassword(data.name, data.password), (error, results, fields) => {
            if (error) console.log(error);
            console.log(results);
        });

        mySql.end();
    });

    socket.on('register', data => {
        mySql.connect();

        mySql.query(sqlQueries.postNameAndPassword(data.name, data.password), (error, results, fields) => {
            if (error) console.log(error);
            console.log(results.insertId);
        });

        mySql.end();
    })
});