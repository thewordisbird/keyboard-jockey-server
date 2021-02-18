export class Player {
  constructor(
    public id: string,
    public alias?: string,
    public avitar?: string,
    public progress?: number,
    public pace?: number,
    public game?: string
    ) {};

  updateProgress(updatedProgress: number) {
    this.progress = updatedProgress;
  }

  updatePace(updatedPace: number) {
    this.pace = updatedPace;
  }

  setGame(gameId: string) {
    this.game = gameId;
  }
}