import { BoardState } from "src/models/BoardState";

export type GameEventType =
    | "GAME_CREATED"
    | "PLAYER_JOINED"
    | "GAME_START"
    | "GAME_END"
    | "GAME_STATUS_CHANGED"
    | "BOARD_STATE_CHANGED";

export type GameStatus =
    | "IN_PROGRESS"
    | "CHECK"
    | "CHECKMATE"
    | "STALEMATE"
    | "DRAW_INSUFFICIENT_MATERIAL"
    | "DRAW_THREEFOLD_REPETITION"
    | "DRAW_FIFTY_MOVE_RULE"
    | "DRAW_AGREEMENT";

export interface GameEvent {
    type: GameEventType;
    status: GameStatus;
    gameId: string;
    boardState?: BoardState;
}
