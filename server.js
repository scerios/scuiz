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

// Language selection
app.get('/setLanguageEn', require('./controllers/navigation'));
app.get('/setLanguageHu', require('./controllers/navigation'));

// Page loadings
app.get('/', require('./controllers/navigation'));
app.get('/register', require('./controllers/navigation'));
app.get('/login', require('./controllers/navigation'));
app.get('/gameBoard', require('./controllers/navigation'));
app.get('/controlPanel', require('./controllers/navigation'));
app.get('/questionPanel', require('./controllers/navigation'));

// Authentications
app.post('/login', require('./controllers/authentication'));
app.get('/logout', require('./controllers/authentication'));

// User
app.post('/register', require('./controllers/user'));

// Question
app.post('/getQuestions', require('./controllers/question'));

//#endregion

//#region Socket event listeners.

io.on('connection', socket => {

    socket.on('disconnect', () => {
        Queries.putUserStatusAndSocketIdBySocketId(socket.id, 0);
        io.to(adminSocketId).emit('userLeft', { userSocketId: socket.id });
    });

    socket.on('postAdminSocketId', () => {
        adminSocketId = socket.id;
    });

    socket.on('signUpForGame', async (data) => {
        Queries.putUserSocketIdById(data.userId, socket.id);

        let user = await Queries.getUserByIdAsync(data.userId);
        io.to(adminSocketId).emit('showPlayer', { user: user });
    });

    socket.on('pickQuestion', async (data) => {
        isDoublerClicked = false;
        await Queries.putCategoryQuestionIndexById(data.categoryId, data.index);

        let nextTwoQuestions = await Queries.getNextTwoQuestionsByCategoryIdAndQuestionIndexAsync(data.categoryId, data.index);

        socket.broadcast.emit('getNextQuestion', {
            question: nextTwoQuestions[0].question,
            category: {
                id: nextTwoQuestions[0].id,
                name: nextTwoQuestions[0].name
            },
            timer: data.timer
        });
        io.to(adminSocketId).emit('getQuestion', { question: nextTwoQuestions[0], nextQuestion: nextTwoQuestions[1] });

    });

    socket.on('raiseCategoryLimit', (data) => {
        Queries.putCategoryLimit(data.index);
    });

    socket.on('collectAnswers', () => {
        socket.broadcast.emit('forcePostAnswer');
    });

    socket.on('postAnswer', (data) => {
        io.to(adminSocketId).emit('getAnswer', {
            user: {
                id: data.user.id,
                socketId: socket.id,
                name: data.user.name,
                timeLeft: data.user.timeLeft,
                answer: data.user.answer,
                isDoubled: data.user.isDoubled
            }
        });
    });

    socket.on('finishQuestion', (data) => {
        data.correct.forEach((user) => {
            Queries.putUserPointAddValueById(user.id, user.changeValue);
            io.to(user.socketId).emit('updatePoint', { point: user.point + user.changeValue });
        });
        data.incorrect.forEach((user) => {
            Queries.putUserPointSubtractValueById(user.id, user.changeValue);
            io.to(user.socketId).emit('updatePoint', { point: user.point - user.changeValue });
        });
    });

    socket.on('logoutEveryone', async () => {
        let allLoggedInUsers = await Queries.getAllLoggedInUsersAsync();

        allLoggedInUsers.forEach((user) => {
            Queries.putUserStatusById(user.id, 0);
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

    socket.on('authorizeUser', (data) => {
        io.to(data.userSocketId).emit('authorizeCategoryPick');
    });

    socket.on('chooseCategory', (data) => {
        io.to(adminSocketId).emit('chosenCategory', { categoryId: data.categoryId });
    });
});

//#endregion