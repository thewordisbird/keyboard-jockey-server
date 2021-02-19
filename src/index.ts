import { Socket } from 'dgram';
import { Player } from './models/player.model';
import { Game } from './models/game.model';
const app = require('express')();
const server = require('http').createServer(app);
const io = require('socket.io')(server, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST']
  }
});

let players: Record<string, Player> = {}
let games: Record<string, Game> = {}

io.on('connection', (socket: any) => {
  // Initialize player object and broadcast to all players
  const playerId: string  = socket.id;
  console.log(`User ${playerId} connected.`)

  // socket.on('testClient', (message: string) => {
  //   console.log('Test message from client to socket', message)
  //   io.emit('testServer', 'Major Tom to ground control')
  // })

 

  // Add new player to players object
  const player = new Player(playerId)
  players = {
    ...players,
    [playerId]: player
  }
  // console.log(players)

  // Add a player to a game
  socket.on('joinGame', () => {
    
    console.log('Handling request to join a game')
    console.log('Current Games: ', games)
    const timestamp = +new Date();
    let gameId = playerId + '-' + timestamp.toString();
    
    // Look for availible games in stageing.
    for (const gameKey in games) {
      if (games[gameKey].status === 'staging') {
        gameId = gameKey;
        break;
      }
    }

    const game = games[gameId] || new Game(gameId, socket)
    game.addPlayer(player);
    socket.join(gameId);
    games = {
      ...games,
      [gameId]: game
    }

    player.setGame(gameId);

    console.log('Rooms', socket.rooms)
    console.log(gameId)
    io.to(gameId).emit('The game will be starting soon')
    console.log(`Player ${playerId} has joined game ${gameId}`)
    console.log('Games after join:', games)


    
  })

  // Update the gamestate and re-brodcast
  socket.on('updatePlayer', (updatedPlayer: Player) => {
    const playerId = updatedPlayer.id;
    const player = {
      ...players[playerId],

    }

  
  })

  // On disconnect remove the player from the players object and from any games they are in
  socket.on('disconnect', () => {
    const player = players[playerId];

    const updatedPlayers = { ...players };
    delete updatedPlayers[playerId];
    players = updatedPlayers;
    // console.log('updated', players);

    // Remove player from game if they are in one.
    if (player.game) {
      const game = games[player.game]
      game.removePlayer(playerId)
    }
  })


})



server.listen(3001, () => {
  console.log('Listening on port 3001!');
});

