import { useCallback, useContext, useEffect, useState } from "react";
import { Chessboard } from "react-chessboard";
import { BoardPosition, Square } from "react-chessboard/dist/chessboard/types";
import { useParams } from "react-router";
import { GameContext } from "src/App";
import { Color } from "src/models/BoardState";
import { GameCommand } from "src/models/GameCommand";
import { GameEvent } from "src/models/GameEvent";
import GameService from "src/services/GameService";
import { isEmpty, mapToBoardPiece, mapToBoardSquare, mapToMoveString } from "src/utils/utils";

export function GameBoard() {
    const context = useContext(GameContext);
    const [started, setStarted] = useState(false);
    const params = useParams();
    const gameId = params.gameId || "";
    const playerId = context.playerId;
    const initialPosition = useCallback(
        (gameEvent: GameEvent) => {
            if (gameEvent.gameId !== gameId) return;
            const newPosition: BoardPosition = {};
            for (const piece of gameEvent.boardState?.pieces ?? []) {
                const square = mapToBoardSquare(piece);
                const boardPiece = mapToBoardPiece(piece);
                newPosition[square] = boardPiece;
            }
            console.log("New Position:", newPosition);
            setPosition({ ...newPosition });
            if (!isEmpty(newPosition)) setStarted(true);
        },
        [gameId]
    );

    const handleBoardStateChanged = useCallback(
        (event: Event) => {
            if (!(event instanceof CustomEvent)) return;
            const gameEvent = event.detail as GameEvent;
            initialPosition(gameEvent);
        },
        [initialPosition]
    );

    const handlePlayerJoined = useCallback(
        (event: Event) => {
            console.log("Player Joined Event:", event);
            if (!(event instanceof CustomEvent)) return;
            const gameEvent = event.detail as GameEvent;
            if (gameEvent.gameId !== gameId) return;
            if (gameEvent.playerId !== playerId) return;
            setColor(gameEvent.color || "WHITE");
            initialPosition(gameEvent);
        },
        [gameId, initialPosition, playerId]
    );

    const init = useCallback(async () => {
        if (!playerId) return;
        try {
            await GameService.connect(playerId);
            GameService.joinGame(gameId);
        } catch (error) {
            console.log(error);
        }
    }, [gameId, playerId]);
    useEffect(() => {
        init();
        GameService.addEventListener("BOARD_STATE_CHANGED", handleBoardStateChanged);
        GameService.addEventListener("PLAYER_JOINED", handlePlayerJoined);
        return () => {
            GameService.removeEventListener("BOARD_STATE_CHANGED", handleBoardStateChanged);
            GameService.removeEventListener("PLAYER_JOINED", handlePlayerJoined);
        };
    }, [gameId, handleBoardStateChanged, handlePlayerJoined, init, playerId]);
    const [position, setPosition] = useState<BoardPosition>({});
    const [color, setColor] = useState<Color>("WHITE");

    function handlePieceDrop(sourceSquare: Square, targetSquare: Square) {
        const gameCommand: GameCommand = {
            type: "PLAYER_MOVE_A_PIECE",
            gameId,
            playerId,
            move: mapToMoveString(sourceSquare, targetSquare),
        };
        GameService.sendCommand(gameCommand);
        return true;
    }

    console.log("STARTED: ", started);

    return (
        <div
            style={{
                margin: "3rem auto",
                maxWidth: "70vh",
                width: "70vw",
            }}
        >
            {started ? null : <p>Waiting for opponent...</p>}
            {color ? (
                <Chessboard
                    boardOrientation={color === "WHITE" ? "black" : "white"}
                    id="BasicBoard"
                    position={position}
                    onPieceDrop={handlePieceDrop}
                />
            ) : null}
        </div>
    );
}

export default GameBoard;
