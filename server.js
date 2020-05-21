// Define needed variables
const PAGES_DIR = 'pages';
const PORT = process.env.PORT || 3000;

// Implementing needed nodes + creating the server.
const path = require('path');
const app = require('express')();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

// Implementing custom modules.
const sqlQueries = require('./js/sqlQueries');
const errors = require('./js/error');
const helper = require('./js/helper');

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

    socket.on('playerLogin', data => {
        let playerResult = sqlQueries.getPlayerByNameAndPassword(data.name, data.password);

        playerResult.then((players) => {
            if (players.length === 1) {
                authenticatePlayerAndLoadCategories(socket.id);
            } else {
                io.to(socket.id).emit('customError', { title: errors.notFound, msg: errors.badCredentials });
            }

        }).catch(() => {
            io.to(socket.id).emit('customError', { title: errors.standardError, msg: errors.connectionIssue });
        });
    });

    socket.on('playerRegister', data => {
        let isNameAlreadyRegistered = sqlQueries.getPlayerByName(data.name);

        isNameAlreadyRegistered.then((isRegistered) => {
            if (isRegistered.length > 0) {
                io.to(socket.id).emit('customError', { title: errors.namingError, msg: errors.alreadyRegistered });
            } else {
                let newPlayer = sqlQueries.postPlayerNameAndPassword(data.name, data.password);

                newPlayer.then(() => {
                    authenticatePlayerAndLoadCategories(socket.id);
                }).catch(() => {
                    io.to(socket.id).emit('customError', { title: errors.standardError, msg: errors.connectionIssue });
                });
            }

        }).catch(() => {
            io.to(socket.id).emit('customError', { title: errors.standardError, msg: errors.connectionIssue });
        });
    });

    socket.on('adminLogin', (data) => {
        let adminResult = sqlQueries.getAdminByNameAndPassword(data.name, data.password);

        adminResult.then((admin) => {
            if (admin.length === 1) {
                adminSocketId = socket.id;
                socket.broadcast.emit('adminSocketId', { adminSocketId: adminSocketId });

            } else {
                io.to(socket.id).emit('customError', { title: errors.notFound, msg: errors.badCredentials });
            }

        }).catch(() => {
            io.to(socket.id).emit('customError', { title: errors.standardError, msg: errors.connectionIssue });
        });
    });
});

function authenticatePlayerAndLoadCategories(socketId) {
    let categoryResult = sqlQueries.getAllCategories();

    categoryResult.then((categories) => {
        let categoryRoundLimitResult = sqlQueries.getCategoryRoundLimit();

        categoryRoundLimitResult.then((roundLimit) => {
            let sortedCategories = helper.getCategoryAvailabilities(categories, roundLimit[0].round_limit);

            io.to(socketId).emit('enterSuccess', { adminSocketId: adminSocketId, categories: sortedCategories });

        }).catch(() => {
            io.to(socketId).emit('customError', { title: errors.standardError, msg: errors.connectionIssue });
        });

    }).catch(() => {
        io.to(socketId).emit('customError', { title: errors.standardError, msg: errors.connectionIssue });
    });
}