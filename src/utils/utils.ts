import { Piece } from "src/models/BoardState";
import { Piece as BoardPiece, Square } from "react-chessboard/dist/chessboard/types";

export function isCustomEvent(event: Event): event is CustomEvent {
    return "detail" in event;
}

export function mapToBoardPiece(piece: Piece): BoardPiece {
    const color = piece.color === "WHITE" ? "w" : "b";
    return `${color}${piece.piece}` as BoardPiece;
}

export function mapToBoardSquare(piece: Piece): Square {
    const x = String.fromCharCode(97 + piece.x);
    const y = 8 - piece.y;
    return `${x}${y}` as Square;
}
