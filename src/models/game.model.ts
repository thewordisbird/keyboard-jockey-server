import { Player } from './player.model';

export class Game {
  private MAX_PLAYERS: number = 4
  private COUNTDOWN_START: number = 10
  private io: any;
  private countdownTimer?: any;
  public id: string
  public status: string // staging, pre-game, active, finished
  public players: Player[] = []
  public timer: number
  

  constructor(gameId: string, io: any) {
    this.id = gameId;
    this.status = "staging"
    this.timer = this.COUNTDOWN_START;
    this.io = io;
    this.startCountdown();
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

  // Don't think this is needed. Remove once working
  public toJSON() {
    return JSON.stringify(
      {
        id: this.id,
        status: this.status,
        players: this.players,
        timer: this.timer
      }
    )
  }

  public startCountdown() {
      
      this.countdownTimer = setInterval(() => {
      console.log('emitting to room: ', this.id)
      if (this.timer < 0) { clearInterval(this.countdownTimer)}
      this.io.to(this.id).emit('updateGame', this.toJSON())
      this.timer -= 1
    }, 1000)
  }
}