export type GameCommandType =
    | "PLAYER_JOIN_A_GAME"
    | "PLAYER_LEAVE_A_GAME"
    | "PLAYER_MOVE_A_PIECE"
    | "PLAYER_RESIGN_A_GAME"
    | "PLAYER_OFFER_DRAW"
    | "PLAYER_ACCEPT_DRAW"
    | "PLAYER_REJECT_DRAW"
    | "PLAYER_CANCEL_DRAW";

export type GameCommand = {
    type: GameCommandType;
    gameId: string;
    playerId: string;
    move: string;
};
