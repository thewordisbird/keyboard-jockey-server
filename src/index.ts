import { Socket } from "socket.io";
import { Player } from "./models/player.model"
const app = require('express')();
const server = require('http').createServer(app);
const io = require('socket.io')(server, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST']
  }
});

/* Interfaces */


/* Data structures */
let players = {};

let games: Game[] = [];

io.on('connection', (socket: Socket) => {
  // Initialize player object and broadcast to all players
  const playerId = socket.id;
  console.log(`User ${playerId} joined the game.`)
  const player = new Player(playerId)

  // Add player to waiting object until they trigger a game start
  // TODO: Create a waiting queue
  players = {
    ...players,
    playerId: player
  }
  console.log(players)

  socket.on('disconnect', () => disconnectPlayer(socket))

  // socket.on('joinGame', () => {
    // Check to see if there are any open rooms that have a status of staging
    // If availible place player into that room and emit the current game countdown status
    // joinGame(socket)

    // Else: start a new room and start a countdown time waiting for others to join

  })
})

// const disconnectPlayer = (socket => {
//   console.log(`Disconnecting user ${socket.id}`)
//     const player = {...activePlayers[socket.id] }
//     // Remove player from room
//     const game = {...activeGames[player.gameId] }
//     const playerGameIdx = game.players.findIndex(p => p === player.id)
//     const updatedGame = {
//       ...game,
//       players: game.players.splice(playerGameIdx,1)
//     }
//     activeGames = {
//       ...activeGames,
      
//     }
//     // Remove the user from the activePlayers object
    
//     delete tmpactivePlayers[socket.id]
//     activePlayers = {
//       ...tmpactivePlayers,
//     }
//     console.log(activePlayers)
// })

// const joinGame = ((socket) => {
//   // Add a player to a game if availible or begin a new game
//   // TODO: in the add methods creat the socket.io room for the game 
//   let openGame = false
//     for (const game of activeGames) {
//       if (game.status === 'staging') {
//         addPlayerToGame(socket, game.gameId)
//         openGame = true
//         break;
//       }
//     }

//     if (!openGame) {
//       addPlayerToNewGame(socket)
//     }
//     console.log('the socket has been added to:', socket.rooms)
// })
// const addPlayerToNewGame = (socket => {
//   // The room id will be the string concatination of socketId + timestring
//   console.log('Adding Player to new game')
//   const timestamp = +new Date()
//   const gameId = socket.id + '-' + timestamp.toString()
//   socket.join(gameId)
//   activeGames = [
//     ...activeGames,
//     {
//       gameId: gameId,
//       status: 'staging',
//       players: [socket.id]
//     }
//   ]
// })

// const addPlayerToGame = ((socket, gameId) =>{
//   console.log('Adding Player to staging game')
//   console.log('activeGames: ', activeGames)
//   const gameIdx = activeGames.findIndex(game => {
//     console.log(game.gameId, gameId)
//     return game.gameId === gameId
//   })
//   console.log('gameIdx: ', gameIdx)
//   const game = activeGames[gameIdx]
//   console.log('game', game)
//   socket.join(game.gameId)
//   const tmpGame = {
//     ...game,
//     players: [...game.players, socket.id],
//     status: game.players.length < 3 ? 'staging' : 'pre-game'
//   }
//   tmpActiveGames = [...activeGames]
//   tmpActiveGames[gameIdx] = tmpGame
//   activeGames = [...tmpActiveGames]
// })


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