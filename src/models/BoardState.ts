export type Color = "WHITE" | "BLACK";

export interface Piece {
    x: number;
    y: number;
    piece: string;
    color: Color;
}

export interface Move {
    fromX: number;
    fromY: number;
    toX: number;
    toY: number;
    piece: string;
    color: Color;
}

export interface BoardState {
    pieces: Piece[];
    moves: Move[];
}
