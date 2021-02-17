import { Player } from './player.model';

export class Game {
  public id: String
  public status: String // staging, pre-game, active, finished
  public players: Player[] 

  constructor(gameId: String) {
    this.id = gameId;
    this.status = "staging"
  };

  public addPlayer(player: Player) {
    this.players.push(player)
  }

  public removePlayer(playerId: String) {
    const playerIdx = this.players.findIndex(player => {
      player.id === playerId
    });
  }
}