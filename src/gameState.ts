import { GameState, PlayerType } from "./Player";

export function readGameState(gameState: GameState) {
  const { players, dealer, community_cards: communityCards, current_buy_in: currentBuyIn, small_blind: smallBlind } = gameState
  const selfPlayer = players.find(
    (player: PlayerType) => player.name === "PokerJS",
  )

  const holeCards = selfPlayer?.hole_cards || []

  const dealerPlayer = players.find(
    (player: PlayerType) => player.id === dealer
  )

  const smallBlindPlayer = players.find(
    (player: PlayerType) => player.id === dealer + 1
  )

  const bigBlindPlayer = players.find(
    (player: PlayerType) => player.id === dealer + 2
  )

  // if we are the dealer, we are one before the dealer or the one after the dealer
  const blindStealingPosition = dealer === 7 || dealer === 6 || dealer === 0 || dealer === 5

  const preFlop = communityCards.length === 0

  const postFlop = communityCards.length > 0

  const nobodyPlayedPostFlop = postFlop && currentBuyIn === 0

  return { selfPlayer, holeCards, communityCards, blindStealingPosition, preFlop, postFlop, nobodyPlayedPostFlop }
}