const app = require('express')();
const server = require('http').createServer(app);
const io = require('socket.io')(server, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST']
  }
});

let activePlayers = {};

/*
game = {
  gameId: string;
  status: string (staging, pre-game, active, finished);
  players: []
}
*/
let activeGames = []

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
  console.log(`User ${socket.id} joined the game.`)
  
  // Add player to waiting object until they trigger a game start
  addPlayerToWaiting(socket.id)
  joinGame(socket.id)
  console.log(activeGames)
  socket.on('disconnect', () => removePlayerFromWaiting(socket.id))

  socket.on('joinGame', () => {
    // Check to see if there are any open rooms that have a status of staging
    // If availible place player into that room and emit the current game countdown status
    joinGame(socket.id)

    // Else: start a new room and start a countdown time waiting for others to join

  })
  // addNewPlayer(socket);
  
  // socket.on('disconnect', () => {
  //   console.log(`Disconnecting user ${socket.id}`)
  //   PLAYERS = PLAYERS.filter(player => {
  //     return player.id !== socket.id;
  //   })
  // });

  // socket.on('updatePlayer', updatedPlayer => {
  //   // console.log('Player from client', updatedPlayer)
  //   const playerIndex = PLAYERS.findIndex(player => {
  //     // console.log(player.id, updatedPlayer)
  //     return player.id === updatedPlayer.id
  //   })
  //   console.log('Player Index:', playerIndex)
  //   const updatedPlayers = [...PLAYERS]
  //   updatedPlayers[playerIndex] = {...updatedPlayer}
  //   // console.log(updatedPlayers)
  //   PLAYERS = updatedPlayers
  //   // console.log(PLAYERS, playerIndex)
  //   console.log('emitting updated players:', PLAYERS)
  //   socket.emit('updatedPlayers', PLAYERS)
  // })
})

const addPlayerToWaiting = (socketId => {
  activePlayers = {
    ...activePlayers,
    [socketId]: true
  }
  console.log(activePlayers)
})

const removePlayerFromWaiting = (socketId => {
  console.log(`Disconnecting user ${socketId}`)
    // Remove the user from the activePlayers object
    const tmpactivePlayers = activePlayers
    delete tmpactivePlayers[socketId]
    activePlayers = {
      ...tmpactivePlayers,
    }
    console.log(activePlayers)
})

const joinGame = (socketId => {
  // Add a player to a game if availible or begin a new game
  // TODO: in the add methods creat the socket.io room for the game 
  let openGame = false
    for (const game of activeGames) {
      if (game.status === 'staging') {
        addPlayerToGame(socketId, game.gameId)
        openGame = true
        break;
      }
    }

    if (!openGame) {
      addPlayerToNewGame(socketId)
    }
})
const addPlayerToNewGame = (socketId => {
  // The room id will be the string concatination of socketId + timestring
  console.log('Adding Player to new game')
  const timestamp = +new Date()
  const gameId = socketId + '-' + timestamp.toString()
  console.log('gameId:', gameId)
  activeGames = [
    ...activeGames,
    {
      gameId: gameId,
      status: 'staging',
      players: [socketId]
    }
  ]
})

const addPlayerToGame = ((socketId, gameId) =>{
  console.log('Adding Player to staging game')
  console.log('activeGames: ', activeGames)
  const gameIdx = activeGames.findIndex(game => {
    console.log(game.gameId, gameId)
    return game.gameId === gameId
  })
  console.log('gameIdx: ', gameIdx)
  const game = activeGames[gameIdx]
  console.log('game', game)
  const tmpGame = {
    ...game,
    players: [...game.players, socketId],
    status: game.players.length < 3 ? 'staging' : 'pre-game'
  }
  tmpActiveGames = [...activeGames]
  tmpActiveGames[gameIdx] = tmpGame
  activeGames = [...tmpActiveGames]
})


// const addNewPlayer = (socket) => {
//   console.log('in add player')
//   const player = {
//     ...PLAYER,
//     id: socket.id
//   };

//   PLAYERS = [
//     ...PLAYERS,
//     player
//   ];
  
//   const response = {
//     playerId: player.id,
//     players: PLAYERS
//   };
//   socket.emit("newPlayer", response);
// };

server.listen(3001, () => {
  console.log('Listening on port 3001!');
});