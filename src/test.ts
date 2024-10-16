import { CardType } from "./Player";

const hole_cards = [
    {"rank":"5","suit":"diamonds"},
    {"rank":"6","suit":"diamonds"},
    {"rank":"7","suit":"diamonds"},
    {"rank":"7","suit":"spades"},
    {"rank":"8","suit":"diamonds"},
    {"rank":"9","suit":"diamonds"}
]

const game_state = (hole_cards: CardType[] = []) => ({
    "players":[
      {
        "name":"Player 1",
        "stack":1000,
        "status":"active",
        "bet":0,
        "hole_cards":[],
        "version":"Version name 1",
        "id":0
      },
      {
        "name":"PokerJS",
        "stack":1000,
        "status":"active",
        "bet":0,
        hole_cards,
        "version":"Version name 2",
        "id":1
      }
    ],
    "tournament_id":"550d1d68cd7bd10003000003",
    "game_id":"550da1cb2d909006e90004b1",
    "round":0,
    "bet_index":0,
    "small_blind":10,
    "orbits":0,
    "dealer":0,
    "community_cards":[],
    "current_buy_in":0,
    "pot":0
})

describe('POST /', () => {
    it('should return 200 status code without hole_cards', async () => {
        const url = "http://0.0.0.0:1337?action=bet_request&game_state=" + JSON.stringify(game_state());
        const res = await fetch(url, {
            method: "POST",
        });
    
        expect(res.status).toBe(200);
    });

    it('should return 200 status code with hole_cards', async () => {
        const url = "http://0.0.0.0:1337?action=bet_request&game_state=" + JSON.stringify(game_state(hole_cards));
        const res = await fetch(url, {
            method: "POST",
        });
    
        expect(res.status).toBe(200);
    });
});
