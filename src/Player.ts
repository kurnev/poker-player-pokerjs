export class Player {
  public betRequest(gameState: any, betCallback: (bet: number) => void): void {
    betCallback(10);
    console.log(JSON.stringify(gameState, null, 4));
  }

  public showdown(gameState: any): void {
    console.log("showdown", JSON.stringify(gameState, null, 4));
  }
}

export default Player;
