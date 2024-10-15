export class Player {
  public async betRequest(
    gameState: any,
    betCallback: (bet: number) => void,
  ): Promise<void> {
    const url = "https://rainman.leanpoker.org/rank";
    const cards = gameState.players.find(
      (player: any) => player.name === "PokerJS",
    )?.hole_cards;
    console.error("cards", cards);
    if (!cards?.length) {
      betCallback(0);
      return;
    }
    const result = await fetch(url, {
      method: "POST",
      body: JSON.stringify({ cards }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await result.json();
    console.log("data", data);
    console.error("result", data);
    // @ts-ignore
    if (data && data.rank >= 1) {
      betCallback(50);
    } else {
      betCallback(0);
    }
    console.error(JSON.stringify(gameState, null, 4));
  }

  public showdown(gameState: any): void {
    console.error("showdown", JSON.stringify(gameState, null, 4));
  }

  public gwenanMethod(): void {
    // stuff
  }
}

export default Player;
