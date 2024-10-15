type Card = {
  rank: string
  suit: string
}

export class Player {
  public async betRequest(
    gameState: any,
    betCallback: (bet: number) => void,
  ): Promise<void> {

    const cards = this.getHoleCards(gameState);

    const stack = gameState.players.find(
      (player: any) => player.name === "PokerJS",
    )?.stack || 0;
    
    if (cards[0] && cards[1] && stack && this.doWePlayIt(cards[0], cards[1]) ) {
      betCallback(stack)
    } else {
      betCallback(0)
    }
  }
  doWePlayIt(cardA: Card, cardB: Card) {
    const highCards = ['A', 'K', 'Q', 'J', '10']
    const middleCards = ['7', '8', '9'];
    const lowCards = ['2', '3', '4', '5', '6'];
    
    if (cardA.rank === cardB.rank) {
      if (highCards.includes(cardA.rank) || middleCards.includes(cardA.rank)) return true;
    }

    if (highCards.includes(cardA.rank) && highCards.includes(cardB.rank) && this.suitedCard(cardA, cardB)) {
      return true;
    }

    return false;
  }

  oneOfCardContains(cardA: Card, cardB: Card, rank: string) {
    if (cardA.rank === rank || cardB.rank === rank) {
      return true
    } else {
      return false
    }
  }

  suitedCard(cardA: Card, cardB: Card) {
    if (cardA.suit === cardB.suit) {
      return true
    } else {
      return false
    }
  }


  public showdown(gameState: any): void {
    console.error("showdown", JSON.stringify(gameState, null, 4));
  }

  public goAllIn(): void {
    
  }

  getHoleCards(gameState: any): Card[] {
    return gameState.players.find(
      (player: any) => player.name === "PokerJS",
    )?.hole_cards || [];
  }

  async sendRankReq(gameState: any): Promise<any> {
    const url = "https://rainman.leanpoker.org/rank";
    const holeCards = this.getHoleCards(gameState);
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
