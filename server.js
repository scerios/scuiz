let app = require('express')();
let http = require('http').createServer(app);
let io = require('socket.io')(http);

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

io.on('connection', (socket) => {
    console.log('a user connected');
    setInterval(() => io.emit('time', new Date().toTimeString()), 1000);
});

http.listen(3000, () => {
    console.log('listening on *:3000');
});