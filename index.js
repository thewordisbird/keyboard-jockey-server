const app = require('express')();
const server = require('http').createServer(app);
const io = require('socket.io')(server, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST']
  }
});

io.on('connection', socket => {
  // Initialize player object and broadcast to all players
  console.log(`User ${socket.id} joined the game`)
  io.emit('new player', {
    id: socket.id,
    alias: 'player' + socket.id,
    avitar: '',
    progress: 0,// The character of the string the player is it
    pace: 0,
  })
})

server.listen(3001, () => {
  console.log('Listening on port 3001!');
});