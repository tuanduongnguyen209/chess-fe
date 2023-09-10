import { useCallback, useEffect, useState } from "react";
import { Chessboard } from "react-chessboard";
import { BoardPosition } from "react-chessboard/dist/chessboard/types";
import { GameEvent } from "src/models/GameEvent";
import GameService from "src/services/GameService";
import { mapToBoardPiece, mapToBoardSquare } from "src/utils/utils";

export interface GameBoardProps {
    gameId: string;
    playerId: string;
}

export function GameBoard({ gameId, playerId }: GameBoardProps) {
    const handleBoardStateChanged = useCallback(
        (event: Event) => {
            if (!(event instanceof CustomEvent)) return;
            const gameEvent = event.detail as GameEvent;
            if (gameEvent.gameId !== gameId) return;
            const newPosition: BoardPosition = {};
            for (const piece of gameEvent.boardState?.pieces ?? []) {
                const square = mapToBoardSquare(piece);
                const boardPiece = mapToBoardPiece(piece);
                newPosition[square] = boardPiece;
            }
            setPosition(newPosition);
        },
        [gameId]
    );
    useEffect(() => {
        GameService.addEventListener("BOARD_STATE_CHANGED", handleBoardStateChanged);
        return () =>
            GameService.removeEventListener("BOARD_STATE_CHANGED", handleBoardStateChanged);
    }, [gameId, handleBoardStateChanged, playerId]);
    const [position, setPosition] = useState<BoardPosition>({});
    return (
        <div
            style={{
                margin: "3rem auto",
                maxWidth: "70vh",
                width: "70vw",
            }}
        >
            <Chessboard id="BasicBoard" position={position} />
        </div>
    );
}

export default GameBoard;
