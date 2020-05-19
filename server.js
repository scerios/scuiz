// Define needed variables
const PAGES_DIR = 'pages';
const PORT = process.env.PORT || 3000;

// Implementing needed nodes + creating the server.
const path = require('path');
const app = require('express')();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

// Implementing custom modules.
const mySql = require('./js/mySqlConnection');
const sqlQueries = require('./js/sqlQueries');
const errors = require('./js/error');

// Saving the socked ID for the admin. This will be emitted to all the users so eventually they will be able to send everything back to only the admin.
let adminSocketId = '';

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
        mySql.query(sqlQueries.getByNameAndPassword(data.name, data.password), (error, results, fields) => {
            if (error) {
                io.to(socket.id).emit('customError', { title: errors.standardError, msg: errors.connectionIssue, error: error });
            } else {
                if (results.length === 1) {
                    io.to(socket.id).emit('loginSuccess', { adminSocketId: adminSocketId, categories: getAllCategories() });
                } else {
                    io.to(socket.id).emit('customError', { title: errors.notFound, msg: errors.badCredentials });
                }
            }
        });
    });

    socket.on('register', data => {
        mySql.query(sqlQueries.getByName(data.name), (error, results, fields) => {
            if (error) {
                io.to(socket.id).emit('customError', { title: errors.standardError, msg: errors.connectionIssue });
            } else {
                if (results.length === 0) {
                    mySql.query(sqlQueries.postNameAndPassword(data.name, data.password), (error, results, fields) => {
                        if (error) {
                            io.to(socket.id).emit('customError', { title: errors.standardError, msg: errors.connectionIssue });
                        } else {
                            io.to(socket.id).emit('registerSuccess', { adminSocketId: adminSocketId, categories: getAllCategories() });
                        }
                    });
                } else {
                    io.to(socket.id).emit('customError', { title: errors.namingError, msg: errors.alreadyRegistered });
                }
            }
        });
    });
});