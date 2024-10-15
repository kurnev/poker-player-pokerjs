type Card = {
  rank: string
  suit: string
}

export class Player {
  public async betRequest(
    gameState: any,
    betCallback: (bet: number) => void,
  ): Promise<void> {

    const cards = gameState.players.find(
      (player: any) => player.name === "PokerJS",
    )?.hole_cards || [];

    const stack = gameState.players.find(
      (player: any) => player.name === "PokerJS",
    )?.stack || 0;
    
    if (cards[0] && cards[1] && stack && this.doWePlayIt(cards[0], cards[1]) ) {
      betCallback(stack)
    }
  }

  doWePlayIt(cardA: Card, cardB: Card) {
    if (cardA.rank === cardB.rank) return true
    return false
  }

  public showdown(gameState: any): void {
    console.error("showdown", JSON.stringify(gameState, null, 4));
  }

  public goAllIn(): void {
    
  }

  async sendRankReq(gameState: any): Promise<any> {
    const url = "https://rainman.leanpoker.org/rank";
    const holeCards = gameState.players.find(
      (player: any) => player.name === "PokerJS",
    )?.hole_cards || [];
    console.error("cards", JSON.stringify({ cards: holeCards }));

    const comCards = gameState?.community_cards || [];

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
