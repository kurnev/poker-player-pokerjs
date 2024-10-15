export class Player {
  public async betRequest(
    gameState: any,
    betCallback: (bet: number) => void,
  ): Promise<void> {
    const url = "https://rainman.leanpoker.org/rank";
    const cards = gameState.players.find(
      (player: any) => player.name === "PokerJS",
    )?.hole_cards;
    if (!cards) {
      betCallback(0);
      return;
    }
    const result = await fetch(url, {
      method: "POST",
      body: JSON.stringify({ cards }),
    });
    await result.json();
    console.error("result", JSON.stringify(result, null, 4));
    // @ts-ignore
    if (result && result.rank >= 1) {
      betCallback(50);
    } else {
      betCallback(0);
    }
    console.error(JSON.stringify(gameState, null, 4));
  }

  public showdown(gameState: any): void {
    console.error("showdown", JSON.stringify(gameState, null, 4));
  }
}

export default Player;
