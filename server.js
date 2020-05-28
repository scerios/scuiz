// Define needed variables
const PORT = process.env.PORT || 3000;
const COOKIE_MAX_AGE = process.env.COOKIE_MAX_AGE || 1000 * 60 * 60;
const IS_COOKIE_SECURE = process.env.COOKIE_SECURE || false;

// Implementing needed nodes + creating the server.
const EXPRESS_LAYOUTS = require('express-ejs-layouts');
const EXPRESS = require('express');
const SESSION = require('express-session');
const MYSQL_STORE = require('express-mysql-session')(SESSION);
const APP = EXPRESS();
const HTTP = require('http').createServer(APP);
const IO = require('socket.io')(HTTP);

// Implementing custom modules.
const SQL_QUERIES = require('./js/sqlQueries');
const ERRORS = require('./js/error');
const HELPER = require('./js/helper');

// Saving the socked ID of the admin. This will be emitted to all the users so eventually they will be able to send everything back to only the admin.
let adminSocketId = '';

// Express MySQL Session configuration
const STORE_OPTIONS = {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME
};

const SESSION_STORE = new MYSQL_STORE(STORE_OPTIONS);

// Listening on an open port.
HTTP.listen(PORT, () => {
    console.log(`Listening on ${PORT}.`);
});

// Session configuration
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

// Express body parser
APP.use(EXPRESS.urlencoded({ extended: true }));

// Routes definition
APP.get('/', require('./routes/players'));
APP.get('/register', require('./routes/players'));
APP.get('/login', require('./routes/players'));
APP.get('/gameBoard', require('./routes/players'));

APP.get('/admin', require('./routes/admin'));

APP.post('/register', require('./routes/players'));
APP.post('/login', require('./routes/players'));

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