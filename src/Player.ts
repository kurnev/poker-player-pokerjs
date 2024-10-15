type Card = {
  rank: string;
  suit: string;
};

export class Player {
  public async betRequest(
    gameState: any,
    betCallback: (bet: number) => void,
  ): Promise<void> {
    // const data = await this.sendRankReq(gameState);
    // // @ts-ignore
    // if (data && data.rank >= 1) {
    //   betCallback(50);
    // } else {
    //   betCallback(0);
    // }
    console.error(JSON.stringify(gameState, null, 4));
    const minimum = gameState.minimum_raise ?? 0;
    if (minimum < 20) {
      betCallback(minimum);
    } else {
      betCallback(0);
    }
  }

  rankTwoCards(cards: Array<Card>) {}

  rankAllCards(cards: Array<Card>) {}

  public showdown(gameState: any): void {
    console.error("showdown", JSON.stringify(gameState, null, 4));
  }

  public gwenanMethod(): void {
    // stuff
  }

  async sendRankReq(gameState: any): Promise<any> {
    const url = "https://rainman.leanpoker.org/rank";
    const holeCards = gameState.players.find(
      (player: any) => player.name === "PokerJS",
    )?.hole_cards;
    console.error("cards", JSON.stringify({ cards: holeCards }));

    const comCards = gameState.players.find(
      (player: any) => player.name === "PokerJS",
    )?.community_cards;

    const combinedCards = [...holeCards, ...comCards];

    let formData = new FormData();
    formData.append("cards", JSON.stringify(combinedCards));

    if (combinedCards.length >= 5) {
      const result = await fetch(url, {
        method: "POST",
        body: formData,
      });
      const data = await result.json();
      return data;
    }

    return {};
  }
}

export default Player;
