import { useEffect } from "react";
import { Chessboard } from "react-chessboard";
import GameService from "src/services/GameService";

export interface GameBoardProps {
    gameId: string;
    playerId: string;
}

export function GameBoard({ gameId, playerId }: GameBoardProps) {
    useEffect(() => {
        GameService.joinGame(gameId);
    }, [gameId, playerId]);
    return (
        <div
            style={{
                margin: "3rem auto",
                maxWidth: "70vh",
                width: "70vw",
            }}
        >
            <Chessboard id="BasicBoard" />
        </div>
    );
}

export default GameBoard;
