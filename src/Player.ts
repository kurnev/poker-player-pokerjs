type CardType = {
  rank: string;
  suit: string;
};

type PlayerType = {
  id: number;
  name: string;
  status: 'active' | 'folded' | 'out';
  version: string;
  stack: number;
  bet: number;
  hole_cards?: CardType[];
};

type GameState = {
  tournament_id: string;
  game_id: string;
  round: number;
  bet_index: number;
  small_blind: number;
  current_buy_in: number;
  pot: number;
  minimum_raise: number;
  dealer: number;
  orbits: number;
  in_action: number;
  players: PlayerType[];
  community_cards: CardType[];
};

export class Player {
  public async betRequest(
    gameState: any,
    betCallback: (bet: number) => void,
  ): Promise<void> {
    this.version1(gameState, betCallback)
  }

  version1(gameState: any, betCallback: (bet: number ) => void) {
    console.error("gameState", JSON.stringify(gameState, null, 4));
    // if (gameState.round === 4)
    // 

    const cards = this.getHoleCards(gameState);
    const communityCards = gameState.community_cards;

    // if (communityCards.length > 0) {
    //   return this.postFlop(gameState);
    // }
    
    if (cards[0] && cards[1] && this.doWePlayIt(cards[0], cards[1]) ) {
      betCallback(this.goAllIn(gameState))
    } else {
      betCallback(0)
    }
  }
  doWePlayIt(cardA: CardType, cardB: CardType) {
    const highCards = ['A', 'K', 'Q', 'J', '10']
    const middleCards = ['7', '8', '9'];
    const lowCards = ['2', '3', '4', '5', '6'];
    
    if (cardA.rank === cardB.rank) {
      if (highCards.includes(cardA.rank) || middleCards.includes(cardA.rank)) return true;
    }

    if (highCards.includes(cardA.rank) && highCards.includes(cardB.rank) && this.suitedCard(cardA, cardB)) {
      return true;
    }
    
    // AK AQ AJ KQ
    if (cardA.rank === 'A' && cardB.rank === 'K') { return true; }
    if (cardA.rank === 'A' && cardB.rank === 'Q') { return true; }
    if (cardA.rank === 'A' && cardB.rank === 'J') { return true; }
    if (cardA.rank === 'K' && cardB.rank === 'Q') { return true; }
    
    // KA QA JA QK
    if (cardB.rank === 'A' && cardA.rank === 'K') { return true; }
    if (cardB.rank === 'A' && cardA.rank === 'Q') { return true; }
    if (cardB.rank === 'A' && cardA.rank === 'J') { return true; }
    if (cardB.rank === 'K' && cardA.rank === 'Q') { return true; }

    return false;
  }

  postFlop(gameState: any) {
  }

  stealBlind(gameState: any) {
    // We are 7
    if (gameState.dealer === 7) {
      
    }
  }

  minBet(gameState: any) {
    

    return 0 
  }

  oneOfCardContains(cardA: CardType, cardB: CardType, rank: string) {
    if (cardA.rank === rank || cardB.rank === rank) {
      return true
    } else {
      return false
    }
  }

  suitedCard(cardA: CardType, cardB: CardType) {
    if (cardA.suit === cardB.suit) {
      return true
    } else {
      return false
    }
  }


  public showdown(gameState: any): void {
    console.error("showdown", JSON.stringify(gameState, null, 4));
  }

/*   public call(gameState: any): number {
    return gameState.
  } */

  public goAllIn(gameState: any): number {
    return gameState.players.find(
      (player: any) => player.name === "PokerJS",
    )?.stack || 0;
  }

  getHoleCards(gameState: any): CardType[] {
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
