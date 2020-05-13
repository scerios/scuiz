// Define needed variables
const PAGES_DIR = 'pages';
const PORT = process.env.PORT || 3000;

// Implementing needed nodes + creating the server.
const path = require('path');
const app = require('express')();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

const mySql = require('./js/mysql-connect');

// Listening on an open port.
http.listen(PORT, () => {
    console.log(`Listening on ${PORT}.`);
});

// Setting what should be loaded on different endpoints.
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, PAGES_DIR, 'player-login.html'));
});

app.get('/admin', (req, res) => {
    res.sendFile(path.join(__dirname, PAGES_DIR, 'admin-login.html'));
});

// Setting what should be done when someone connects.
io.on('connection', socket => {
    console.log(`A user with ID: ${socket.id} connected.`);

    socket.on('disconnect', () => {
        console.log(`A user with ID: ${socket.id} disconnected.`)
    })

    socket.on('login', data => {
        mySql.connect();

        mySql.query(`SELECT * FROM player WHERE name = '${data.name}' AND password = '${data.password}'`, (error, results, fields) => {
            console.log(results);
        });

        mySql.end();
    })
});