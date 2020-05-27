// Define needed variables
const PORT = process.env.PORT || 3000;

// Implementing needed nodes + creating the server.
const EXPRESS_LAYOUTS = require('express-ejs-layouts');
const APP = require('express')();
const HTTP = require('http').createServer(APP);
const IO = require('socket.io')(HTTP);

// Implementing custom modules.
const SQL_QUERIES = require('./js/sqlQueries');
const ERRORS = require('./js/error');
const HELPER = require('./js/helper');

// Saving the socked ID of the admin. This will be emitted to all the users so eventually they will be able to send everything back to only the admin.
let adminSocketId = '';

// Listening on an open port.
HTTP.listen(PORT, () => {
    console.log(`Listening on ${PORT}.`);
});

// Definition and config of express layouts.
APP.use(EXPRESS_LAYOUTS);
APP.set('view engine', 'ejs');

// Routes definition
APP.get('/', require('./routes/players'));
APP.get('/register', require('./routes/players'));

APP.get('/admin', require('./routes/admin'));

// Socket event listeners.
IO.on('connection', socket => {
    console.log(`A user with ID: ${socket.id} connected.`);

    socket.on('disconnect', () => {
        console.log(`A user with ID: ${socket.id} disconnected.`);
        let playerLeft = SQL_QUERIES.putPlayerStatusAndSocketIdBySocketId(socket.id, 0);

        playerLeft.then(() => {
            IO.to(adminSocketId).emit('playerLeft', { playerSocketId: socket.id });
        }).catch((error) => {
            console.log('playerLeave: ' + error);
        });
    });

    socket.on('playerLogin', data => {
        let playerLoginResult = SQL_QUERIES.getPlayerByNameAndPassword(data.name, data.password);

        playerLoginResult.then((player) => {
            if (player.length === 1) {
                if (player[0].is_logged_in === 0) {
                    authenticatePlayerAndLoadCategories(player[0].id, socket.id);
                } else {
                    IO.to(socket.id).emit('customError', { title: ERRORS.alreadyLoggedIn, msg: ERRORS.onceAtATime });
                }
            } else {
                IO.to(socket.id).emit('customError', { title: ERRORS.notFound, msg: ERRORS.badCredentials });
            }

        }).catch((error) => {
            console.log('playerLoginResult: ' + error);
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
                }).catch((error) => {
                    console.log('newPlayer: ' + error);
                    IO.to(socket.id).emit('customError', { title: ERRORS.standardError, msg: ERRORS.connectionIssue });
                });
            }

        }).catch((error) => {
            console.log('isNameAlreadyRegistered: ' + error);
            IO.to(socket.id).emit('customError', { title: ERRORS.standardError, msg: ERRORS.connectionIssue });
        });
    });

    socket.on('adminLogin', (data) => {
        let adminResult = SQL_QUERIES.getAdminByNameAndPassword(data.name, data.password);

        adminResult.then((admin) => {
            if (admin.length === 1) {
                adminSocketId = socket.id;
                socket.broadcast.emit('adminSocketId', { adminSocketId: adminSocketId });
                authenticateAdminAndLoadControlPanel(socket.id);

            } else {
                IO.to(socket.id).emit('customError', { title: ERRORS.notFound, msg: ERRORS.badCredentials });
            }

        }).catch((error) => {
            console.log('adminResult: ' + error);
            IO.to(socket.id).emit('customError', { title: ERRORS.standardError, msg: ERRORS.connectionIssue });
        });
    });

    socket.on('signUpForGame', (data) => {
        let playerResult = SQL_QUERIES.getPlayerById(data.playerId);

        playerResult.then((player) => {
            IO.to(adminSocketId).emit('showPlayer', { player: player[0]});
        }).catch((error) => {
            console.log('playerResult:' + error);
        });
    });

    socket.on('pickQuestion', (data) => {
        let putCategoryResult = SQL_QUERIES.putCategoryQuestionIndexById(data.categoryId, data.index);
        putCategoryResult.then(() => {
            let getQuestionResult = SQL_QUERIES.getQuestionByCategoryIdAndQuestionIndex(data.categoryId, data.index);

            getQuestionResult.then((question) => {
                console.log(question);
            }).catch((error) => {
                console.log('getQuestionResult: ' + error);
            })
        }).catch((error) => {
            console.log('putCategoryResult: ' + error);
        });
    });
});

function authenticatePlayerAndLoadCategories(playerId, socketId) {
    let categoryResult = SQL_QUERIES.getAllCategories();

    categoryResult.then((categories) => {
        let categoryRoundLimitResult = SQL_QUERIES.getCategoryRoundLimit();

        categoryRoundLimitResult.then((roundLimit) => {
            let sortedCategories = HELPER.getCategoryAvailabilities(categories, roundLimit[0].round_limit);
            let setPlayerStatusAndSocketIdResult = SQL_QUERIES.putPlayerStatusAndSocketIdById(playerId, 1, socketId);

            setPlayerStatusAndSocketIdResult.then(() => {
                IO.to(socketId).emit('enterSuccess', { myId: playerId, adminSocketId: adminSocketId, categories: sortedCategories });

            }).catch((error) => {
                console.log('setPlayerStatusAndSocketIdResult: ' + error);
                IO.to(socketId).emit('customError', { title: ERRORS.standardError, msg: ERRORS.connectionIssue });
            });

        }).catch((error) => {
            console.log('categoryRoundLimitResult: ' + error);
            IO.to(socketId).emit('customError', { title: ERRORS.standardError, msg: ERRORS.connectionIssue });
        });

    }).catch((error) => {
        console.log('categoryResult: ' + error);
        IO.to(socketId).emit('customError', { title: ERRORS.standardError, msg: ERRORS.connectionIssue });
    });
}

function authenticateAdminAndLoadControlPanel(socketId) {
    let categoryResult = SQL_QUERIES.getAllCategories();

    categoryResult.then((categories) => {
        let categoryRoundLimitResult = SQL_QUERIES.getCategoryRoundLimit();

        categoryRoundLimitResult.then((roundLimit) => {
            let sortedCategories = HELPER.getCategoryAvailabilities(categories, roundLimit[0].round_limit);
            let playersResult = SQL_QUERIES.getAllLoggedInPlayers();

            playersResult.then((players) => {
                IO.to(socketId).emit('enterSuccess', {
                    categories: sortedCategories,
                    players: players
                });

            }).catch((error) => {
                console.log('questionsResult: ' + error);
            });

        }).catch((error) => {
            console.log('categoryRoundLimitResult: ' + error);
            IO.to(socketId).emit('customError', { title: ERRORS.standardError, msg: ERRORS.connectionIssue });
        });

    }).catch((error) => {
        console.log('categoryResult: ' + error);
        IO.to(socketId).emit('customError', { title: ERRORS.standardError, msg: ERRORS.connectionIssue });
    });
}