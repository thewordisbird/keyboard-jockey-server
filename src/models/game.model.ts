import { Player } from './player.model';

export class Game {
  private MAX_PLAYERS: number = 4
  public id: string
  public status: string // staging, pre-game, active, finished
  public players: Player[] = []

  constructor(gameId: string) {
    this.id = gameId;
    this.status = "staging"
  };

  public addPlayer(player: Player) {
    this.players.push(player)
    if (this.players.length === this.MAX_PLAYERS) {
      this.status = 'pre-game';
    }
  }

  public removePlayer(playerId: string) {
    const playerIdx = this.players.findIndex(player => {
      player.id === playerId
    });
  }
}