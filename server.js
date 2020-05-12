// Implementing needed nodes + creating the server.
const app = require('express')();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

// Listening on an open port.
http.listen(PORT, () => {
    console.log(`Listening on ${PORT}.`);
});

// Setting what should be loaded on different endpoints.
app.get('/', (req, res) => {
    res.sendFile(__dirname + INDEX);
});

// Setting what should be done when someone connects.
io.on('connection', (socket) => {
    console.log(`A user with ID: ${socket.id} connected.`);

    io.on('disconnect', (socket) => {
        console.log(`A user with ID: ${socket.id} disconnected.`)
    })
});

// Emitting server time for testing purpose.
setInterval(() => io.emit('time', new Date().toTimeString()), 1000);