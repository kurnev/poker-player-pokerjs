import { readGameState } from "./gameState";

export type CardType = {
  rank: string;
  suit: string;
};

export type PlayerType = {
  id: number;
  name: string;
  status: 'active' | 'folded' | 'out';
  version: string;
  stack: number;
  bet: number;
  hole_cards?: CardType[];
};

export type GameState = {
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
    gameState: GameState,
    betCallback: (bet: number) => void,
  ): Promise<void> {
    // this.version1(gameState, betCallback)
    await this.version2(gameState, betCallback)
  }

  version1(gameState: GameState, betCallback: (bet: number ) => void) {
    console.error("gameState", JSON.stringify(gameState, null, 4));

    const cards = this.getHoleCards(gameState);
    const communityCards = gameState.community_cards;

    if (cards[0] && cards[1] && this.doWePlayIt(cards[0], cards[1]) ) {
      betCallback(this.getAllInAmount(gameState))
    } else {
      betCallback(0)
    }
  }

  async version2(gameState: GameState, betCallback: (bet: number ) => void) {
    const { selfPlayer, holeCards, communityCards, blindStealingPosition, preFlop, postFlop, nobodyPlayedPostFlop } = readGameState(gameState)
    if (postFlop) {
      return await this.postFlop(gameState, betCallback, blindStealingPosition, nobodyPlayedPostFlop);
    }
    return this.preFlop(gameState, betCallback);
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

  preFlop(gameState: GameState, betCallback: (bet: number ) => void) {
    const { blindStealingPosition } = readGameState(gameState)
    const cards = this.getHoleCards(gameState);
    const { pot, small_blind, minimum_raise } = gameState;
    if (cards[0] && cards[1] && this.doWePlayIt(cards[0], cards[1]) ) {
      // Same as v1
      betCallback(this.getAllInAmount(gameState))
    } else {
      // v2 change: check if nobody played
      if (blindStealingPosition && pot === small_blind + small_blind * 2) {
        betCallback(minimum_raise)
        return
      }
      betCallback(0)
    }
  }

  async postFlop(gameState: GameState, betCallback: (bet: number ) => void, blindStealingPosition: boolean, nobodyPlayedPostFlop: boolean) {
    const rank = await this.getRanking(gameState)

    const communityRank = await this.getCommunityRanking(gameState)
    // steal the blind if nobody played

    if (rank > 1 && rank > communityRank) {
      betCallback(this.getAllInAmount(gameState))
    } else if (nobodyPlayedPostFlop) {
      betCallback(gameState.small_blind * 2)
    } else {
      betCallback(0)
    }
   
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

  positionOneHasPlayed(gameState: GameState) {
   
  }

  public showdown(gameState: any): void {
    console.error("showdown", JSON.stringify(gameState, null, 4));

  }

/*   public call(gameState: any): number {
    return gameState.
  } */

  public getAllInAmount(gameState: any): number {
    return gameState.players.find(
      (player: any) => player.name === "PokerJS",
    )?.stack || 0;
  }

  getHoleCards(gameState: any): CardType[] {
    return gameState.players.find(
      (player: any) => player.name === "PokerJS",
    )?.hole_cards || [];
  }

  getComCards(gameState: GameState): CardType[] {
    return gameState.community_cards || [];
  }

  async getRanking(gameState: any): Promise<number> {
    const url = "https://rainman.leanpoker.org/rank";
    const holeCards = this.getHoleCards(gameState);
    const comCards = this.getComCards(gameState);
    const combinedCards = [...holeCards, ...comCards];

    let formData = new FormData();
    formData.append("cards", JSON.stringify(combinedCards));

    if (combinedCards.length >= 5) {
      try {
        const result = await fetch(url, {
          method: "POST",
          body: formData,
        });
        const data = await result.json();
        console.error("ranking data", JSON.stringify(data, null, 4));
        return data?.rank;
      } catch (err) {
        console.error('rank', err)
      }
     
    }

    return 0;
  }

  async getCommunityRanking(gameState: any): Promise<number> {
    const url = "https://rainman.leanpoker.org/rank";
    const comCards = this.getComCards(gameState);

    let formData = new FormData();
    formData.append("cards", JSON.stringify(comCards));

    if (comCards.length >= 5) {
      try {
        const result = await fetch(url, {
          method: "POST",
          body: formData,
        });
        const data = await result.json();
        console.error("community ranking data", JSON.stringify(data, null, 4));
        return data?.rank;
      } catch (err) {
        console.error('rank', err)
      }
     
    }

    return 0;
  }
}

export default Player;
