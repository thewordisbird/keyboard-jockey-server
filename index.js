const app = require('express')();
const server = require('http').createServer(app);
const io = require('socket.io')(server, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST']
  }
});

const PLAYER = {
  id: '',
  alias: '',
  avitar: '',
  progress: 0,// The character of the string the player is it
  pace: 0,
}

let PLAYERS = []

io.on('connection', socket => {
  // Initialize player object and broadcast to all players
  console.log(`User ${socket.id} joined the game. Client ${{...socket.Client}}`)
  
  addNewPlayer(socket);
  
  socket.on('disconnect', () => {
    console.log(`Disconnecting user ${socket.id}`)
    PLAYERS = PLAYERS.filter(player => {
      return player.id !== socket.id;
    })
  });

  socket.on('updatePlayer', updatedPlayer => {
    // console.log('Player from client', updatedPlayer)
    const playerIndex = PLAYERS.findIndex(player => {
      // console.log(player.id, updatedPlayer)
      return player.id === updatedPlayer.id
    })
    console.log('Player Index:', playerIndex)
    const updatedPlayers = [...PLAYERS]
    updatedPlayers[playerIndex] = {...updatedPlayer}
    // console.log(updatedPlayers)
    PLAYERS = updatedPlayers
    // console.log(PLAYERS, playerIndex)
    console.log('emitting updated players:', PLAYERS)
    socket.emit('updatedPlayers', PLAYERS)
  })

  
  



})

const addNewPlayer = (socket) => {
  console.log('in add player')
  const player = {
    ...PLAYER,
    id: socket.id
  };

  PLAYERS = [
    ...PLAYERS,
    player
  ];
  
  const response = {
    playerId: player.id,
    players: PLAYERS
  };
  socket.emit("NewPlayer", response);
};

server.listen(3001, () => {
  console.log('Listening on port 3001!');
});