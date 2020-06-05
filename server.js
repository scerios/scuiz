//#region Constants + variables

// Define needed variables.
const PORT = process.env.PORT || 3000;
const COOKIE_MAX_AGE = process.env.COOKIE_MAX_AGE || 1000 * 60 * 60;
const IS_COOKIE_SECURE = process.env.COOKIE_SECURE !== undefined || false;

// Implementing needed nodes + creating the server.
const EXPRESS_LAYOUTS = require('express-ejs-layouts');
const EXPRESS = require('express');
const SESSION = require('express-session');
const APP = EXPRESS();
const HTTP = require('http').createServer(APP);
const IO = require('socket.io')(HTTP);

// Implementing custom modules.
const SQL_QUERIES = require('./js/sqlQueries');
const SESSION_STORE = require('./js/sessionStore');

// Saving the socked ID of the admin. This will be emitted to all the users so eventually they will be able to send everything back to only the admin.
let adminSocketId = '';

//#endregion

//#region App config

// Listening on an open port.
HTTP.listen(PORT, () => {
    console.log(`Listening on ${PORT}.`);
});

// Default folder for static content.
APP.use(EXPRESS.static("public"));

// Session configuration.
APP.use(SESSION({
    name: 'sid',
    resave: false,
    saveUninitialized: false,
    key: 'scuiz_session',
    secret: 'outrageous',
    store: SESSION_STORE,
    cookie: {
        maxAge: COOKIE_MAX_AGE,
        sameSite: true,
        secure: IS_COOKIE_SECURE
    }
}));

// Definition and config of express layouts.
APP.use(EXPRESS_LAYOUTS);
APP.set('view engine', 'ejs');

// Express body parser.
APP.use(EXPRESS.urlencoded({ extended: true }));

//#endregion

//#region Routes definition.

//#region Player

APP.get('/', require('./routes/players'));
APP.get('/setLanguageEn', require('./routes/players'));
APP.get('/setLanguageHu', require('./routes/players'));
APP.get('/register', require('./routes/players'));
APP.get('/login', require('./routes/players'));
APP.get('/logout', require('./routes/players'));
APP.get('/gameBoard', require('./routes/players'));

APP.post('/register', require('./routes/players'));
APP.post('/login', require('./routes/players'));

//#endregion

//#region Admin
APP.get('/admin', require('./routes/admin'));
APP.get('/controlPanel', require('./routes/admin'));

APP.post('/adminLogin', require('./routes/admin'));

//#endregion

//#endregion

//#region Socket event listeners.

IO.on('connection', socket => {
    console.log(`A user with ID: ${socket.id} connected.`);

    socket.on('disconnect', () => {
        console.log(`A user with ID: ${socket.id} disconnected.`);
        let playerLeft = SQL_QUERIES.putPlayerStatusAndSocketIdBySocketIdAsync(socket.id, 0);

        playerLeft.then(() => {
            IO.to(adminSocketId).emit('playerLeft', { playerSocketId: socket.id });
        }).catch((error) => {
            console.log('playerLeft: ' + error);
        });
    });

    socket.on('postAdminSocketId', () => {
        adminSocketId = socket.id;
    });

    socket.on('signUpForGame', (data) => {
        let setSocketIdResult = SQL_QUERIES.putPlayerSocketIdByIdAsync(data.playerId, socket.id);

        setSocketIdResult.then(() => {
            let playerResult = SQL_QUERIES.getPlayerByIdAsync(data.playerId);

            playerResult.then((player) => {
                IO.to(adminSocketId).emit('showPlayer', { player: player[0] });
            }).catch((error) => {
                console.log('playerResult:' + error);
            });
        }).catch((error) => {
            console.log('setSocketIdResult:' + error);
        });
    });

    socket.on('pickQuestion', (data) => {
        let putCategoryResult = SQL_QUERIES.putCategoryQuestionIndexByIdAsync(data.categoryId, data.index);
        putCategoryResult.then(() => {
            let getQuestionResult = SQL_QUERIES.getQuestionByCategoryIdAndQuestionIndexAsync(data.categoryId, data.index);

            getQuestionResult.then((question) => {
                socket.broadcast.emit('getNextQuestion', { question: question[0].question, category: question[0].name, timer: data.timer });
                IO.to(adminSocketId).emit('getQuestion', { question: question[0] });
            }).catch((error) => {
                console.log('getQuestionResult: ' + error);
            })
        }).catch((error) => {
            console.log('putCategoryResult: ' + error);
        });
    });

    socket.on('raiseCategoryLimit', (data) => {
        let putCategoryLimitResult = SQL_QUERIES.putCategoryLimitAsync(data.index);

        putCategoryLimitResult.then(() => {

        }).catch((error) => {
            console.log('putCategoryLimitResult: ' + error);
        });
    });

    socket.on('postAnswer', (data) => {
        IO.to(adminSocketId).emit('getAnswer', {
            player: {
                id: data.player.id,
                socketId: socket.id,
                name: data.player.name,
                timeLeft: data.player.timeLeft,
                answer: data.player.answer
            }
        });
    });

    socket.on('finishQuestion', (data) => {
        data.correct.forEach((user) => {
            SQL_QUERIES.putPlayerPointAddTwoById(user.id);
            IO.to(user.socketId).emit('updatePoint', { point: user.point + 2 });
        });
    });

    socket.on('logoutEveryone', () => {
        let getAllLoggedInPlayerResult = SQL_QUERIES.getAllLoggedInPlayersAsync();

        getAllLoggedInPlayerResult.then((players) => {
            players.forEach((player) => {
                SQL_QUERIES.putPlayerStatusById(player.id, 0);
            });
        }).catch((error) => {
            console.log('getAllLoggedInPlayerResult: ' + error);
        });
    });
});

//#endregion