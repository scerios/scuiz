let app = require('express')();
let http = require('http').createServer(app);
let io = require('socket.io')(http);

let PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

io.on('connection', (socket) => {
    console.log(`A user with ID: ${socket.id} connected.`);
    setInterval(() => socket.emit('time', new Date().toTimeString()), 1000);

    io.on('disconnect', (socket) => {
        console.log(`A user with ID: ${socket.id} disconnected.`)
    })
});

http.listen(PORT, () => {
    console.log(`Listening on ${PORT}.`);
});