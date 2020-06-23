//#region Constants + variables

// Define needed variables.
const PORT = process.env.PORT || 3000;
const COOKIE_MAX_AGE = process.env.COOKIE_MAX_AGE || 1000 * 60 * 60 * 10;
const IS_COOKIE_SECURE = process.env.COOKIE_SECURE !== undefined || false;

// Implementing needed nodes + creating the server.
const expressLayouts = require('express-ejs-layouts');
const express = require('express');
const session = require('express-session');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

// Implementing custom modules.
const SqlQueries = require('./services/SqlQueries');
const SessionStore = require('./models/sessionStore');

// Saving the socked ID of the admin. This will be emitted to all the users so eventually they will be able to send everything back to only the admin.
let adminSocketId = '';
let Queries = new SqlQueries();
let isDoublerClicked = false;

//#endregion

//#region App config

// Listening on an open port.
http.listen(PORT, () => {
    console.log(`Listening on ${PORT}.`);
});

// Default folder for static content.
app.use(express.static("public"));

// Session configuration.
app.use(session({
    name: 'sid',
    resave: false,
    saveUninitialized: false,
    key: 'scuiz_session',
    secret: 'outrageous',
    store: SessionStore,
    cookie: {
        maxAge: COOKIE_MAX_AGE,
        sameSite: true,
        secure: IS_COOKIE_SECURE
    }
}));

// Definition and config of express layouts.
app.use(expressLayouts);
app.set('view engine', 'ejs');

// Express body parser.
app.use(express.urlencoded({ extended: true }));

//#endregion

//#region Routes definition.

app.get('/', require('./controllers/navigation'));
app.get('/setLanguageEn', require('./controllers/navigation'));
app.get('/setLanguageHu', require('./controllers/navigation'));
app.get('/register', require('./controllers/navigation'));
app.get('/login', require('./controllers/navigation'));
app.get('/gameBoard', require('./controllers/navigation'));
app.get('/controlPanel', require('./controllers/navigation'));

app.post('/register', require('./controllers/user'));
app.post('/login', require('./controllers/authentication'));
app.get('/logout', require('./controllers/authentication'));

//#endregion

//#region Socket event listeners.

io.on('connection', socket => {
    console.log(`A user with ID: ${socket.id} connected.`);

    socket.on('disconnect', () => {
        console.log(`A user with ID: ${socket.id} disconnected.`);
        let playerLeft = Queries.putPlayerStatusAndSocketIdBySocketIdAsync(socket.id, 0);

        playerLeft.then(() => {
            io.to(adminSocketId).emit('playerLeft', { playerSocketId: socket.id });
        }).catch((error) => {
            console.log('playerLeft: ' + error);
        });
    });

    socket.on('postAdminSocketId', () => {
        adminSocketId = socket.id;
    });

    socket.on('signUpForGame', (data) => {
        let setSocketIdResult = Queries.putPlayerSocketIdByIdAsync(data.playerId, socket.id);

        setSocketIdResult.then(() => {
            let playerResult = Queries.getPlayerByIdAsync(data.playerId);

            playerResult.then((player) => {
                io.to(adminSocketId).emit('showPlayer', { player: player[0] });
            }).catch((error) => {
                console.log('playerResult:' + error);
            });
        }).catch((error) => {
            console.log('setSocketIdResult:' + error);
        });
    });

    socket.on('pickQuestion', (data) => {
        isDoublerClicked = false;
        let putCategoryResult = Queries.putCategoryQuestionIndexByIdAsync(data.categoryId, data.index);
        putCategoryResult.then(() => {
            let getQuestionResult = Queries.getNextTwoQuestionsByCategoryIdAndQuestionIndexAsync(data.categoryId, data.index);

            getQuestionResult.then((question) => {
                socket.broadcast.emit('getNextQuestion', { question: question[0].question , category: { id: question[0].id, name: question[0].name }, timer: data.timer });
                io.to(adminSocketId).emit('getQuestion', { question: question[0], nextQuestion: question[1] });
            }).catch((error) => {
                console.log('getQuestionResult: ' + error);
            })
        }).catch((error) => {
            console.log('putCategoryResult: ' + error);
        });
    });

    socket.on('raiseCategoryLimit', (data) => {
        Queries.putCategoryLimit(data.index);
    });

    socket.on('collectAnswers', () => {
        socket.broadcast.emit('forcePostAnswer');
    });

    socket.on('postAnswer', (data) => {
        io.to(adminSocketId).emit('getAnswer', {
            player: {
                id: data.player.id,
                socketId: socket.id,
                name: data.player.name,
                timeLeft: data.player.timeLeft,
                answer: data.player.answer,
                isDoubled: data.player.isDoubled
            }
        });
    });

    socket.on('finishQuestion', (data) => {
        data.correct.forEach((user) => {
            Queries.putPlayerPointAddValueById(user.id, user.changeValue);
            io.to(user.socketId).emit('updatePoint', { point: user.point + user.changeValue });
        });
        data.incorrect.forEach((user) => {
            Queries.putPlayerPointSubtractValueById(user.id, user.changeValue);
            io.to(user.socketId).emit('updatePoint', { point: user.point - user.changeValue });
        });
    });

    socket.on('logoutEveryone', () => {
        let getAllLoggedInPlayerResult = Queries.getAllLoggedInPlayersAsync();

        getAllLoggedInPlayerResult.then((players) => {
            players.forEach((player) => {
                Queries.putPlayerStatusById(player.id, 0);
            });
        }).catch((error) => {
            console.log('getAllLoggedInPlayerResult: ' + error);
        });
    });

    socket.on('takeChances', () => {
        if (!isDoublerClicked) {
            io.to(socket.id).emit('doublerClicked', { isClicked: true });
            socket.broadcast.emit('doublerDisabled');
            isDoublerClicked = true;
        } else {
            io.to(socket.id).emit('doublerClicked', { isClicked: false });
        }
    });

    socket.on('authorizePlayer', (data) => {
        io.to(data.playerSocketId).emit('authorizeCategoryPick');
    });

    socket.on('chooseCategory', (data) => {
        io.to(adminSocketId).emit('chosenCategory', { categoryId: data.categoryId });
    });
});

//#endregion