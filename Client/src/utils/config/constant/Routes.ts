enum Routes {
    HOME = '/',
    LOGIN = "/login",
    SIGNUP = "/signup",
    CREATE_ROOM = "/create-room",
    GAME_PLAY = "/game-play/:data",
    READY = "/ready",
    JOIN_ROOM = "/join-room",
    CARD_SELECTION = "/cards-selection/:data",
    GAME_WINNER = "/game-winner",
    CHECKOUT = "/checkout",
    LEADERBOARD = "/leaderboard",
    NOT_FOUND = "/404",
    BATTLE_HISTORY="/battle-history"
}

export default Routes;