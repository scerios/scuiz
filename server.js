// Define needed variables
const PAGES_DIR = 'pages';
const PORT = process.env.PORT || 3000;

// Implementing needed nodes + creating the server.
const PATH = require('path');
const APP = require('express')();
const HTTP = require('http').createServer(APP);
const IO = require('socket.io')(HTTP);

// Implementing custom modules.
const SQL_QUERIES = require('./js/sqlQueries');
const ERRORS = require('./js/error');
const HELPER = require('./js/helper');

// Saving the socked ID for the admin. This will be emitted to all the users so eventually they will be able to send everything back to only the admin.
let adminSocketId = '';

// Listening on an open port.
HTTP.listen(PORT, () => {
    console.log(`Listening on ${PORT}.`);
});

// HTTP endpoint loadings.
APP.get('/', (req, res) => {
    res.sendFile(PATH.join(__dirname, PAGES_DIR, 'player.html'));
});

APP.get('/admin', (req, res) => {
    res.sendFile(PATH.join(__dirname, PAGES_DIR, 'admin.html'));
});

// Socket event listeners.
IO.on('connection', socket => {
    console.log(`A user with ID: ${socket.id} connected.`);

    socket.on('disconnect', () => {
        console.log(`A user with ID: ${socket.id} disconnected.`);
    });

    socket.on('playerLogin', data => {
        let playerResult = SQL_QUERIES.getPlayerByNameAndPassword(data.name, data.password);

        playerResult.then((playerIds) => {
            if (playerIds.length === 1) {
                authenticatePlayerAndLoadCategories(playerIds[0].id, socket.id);
            } else {
                IO.to(socket.id).emit('customError', { title: ERRORS.notFound, msg: ERRORS.badCredentials });
            }

        }).catch(() => {
            IO.to(socket.id).emit('customError', { title: ERRORS.standardError, msg: ERRORS.connectionIssue });
        });
    });

    socket.on('playerRegister', data => {
        let isNameAlreadyRegistered = SQL_QUERIES.getPlayerByName(data.name);

        isNameAlreadyRegistered.then((playerIds) => {
            if (playerIds.length > 0) {
                IO.to(socket.id).emit('customError', { title: ERRORS.namingError, msg: ERRORS.alreadyRegistered });
            } else {
                let newPlayer = SQL_QUERIES.postPlayer(data.name, data.password);

                newPlayer.then((result) => {
                    authenticatePlayerAndLoadCategories(result.insertId, socket.id);
                }).catch(() => {
                    IO.to(socket.id).emit('customError', { title: ERRORS.standardError, msg: ERRORS.connectionIssue });
                });
            }

        }).catch(() => {
            IO.to(socket.id).emit('customError', { title: ERRORS.standardError, msg: ERRORS.connectionIssue });
        });
    });

    socket.on('adminLogin', (data) => {
        let adminResult = SQL_QUERIES.getAdminByNameAndPassword(data.name, data.password);

        adminResult.then((admin) => {
            if (admin.length === 1) {
                adminSocketId = socket.id;
                socket.broadcast.emit('adminSocketId', { adminSocketId: adminSocketId });

            } else {
                IO.to(socket.id).emit('customError', { title: ERRORS.notFound, msg: ERRORS.badCredentials });
            }

        }).catch(() => {
            IO.to(socket.id).emit('customError', { title: ERRORS.standardError, msg: ERRORS.connectionIssue });
        });
    });
});

function authenticatePlayerAndLoadCategories(playerId, socketId) {
    let categoryResult = SQL_QUERIES.getAllCategories();

    categoryResult.then((categories) => {
        let categoryRoundLimitResult = SQL_QUERIES.getCategoryRoundLimit();

        categoryRoundLimitResult.then((roundLimit) => {
            let sortedCategories = HELPER.getCategoryAvailabilities(categories, roundLimit[0].round_limit);
            let setPlayerStatusResult = SQL_QUERIES.putPlayerStatusById(playerId, 1);

            setPlayerStatusResult.then(() => {
                IO.to(socketId).emit('enterSuccess', { adminSocketId: adminSocketId, categories: sortedCategories });

            }).catch(() => {
                IO.to(socketId).emit('customError', { title: ERRORS.standardError, msg: ERRORS.connectionIssue });
            });

        }).catch(() => {
            IO.to(socketId).emit('customError', { title: ERRORS.standardError, msg: ERRORS.connectionIssue });
        });

    }).catch(() => {
        IO.to(socketId).emit('customError', { title: ERRORS.standardError, msg: ERRORS.connectionIssue });
    });
}