import { createContext, useCallback, useEffect, useMemo, useState } from "react";
import "./App.css";
import { v4 as uuidv4 } from "uuid";
import GameList from "src/components/GameList";
import GameService from "src/services/GameService";
import { isCustomEvent } from "src/utils/utils";
import GameBoard from "src/components/GameBoard";

const GameContext = createContext({
    playerId: "",
    gameId: "",
    // eslint-disable-next-line no-unused-vars
    setGameId: (gameId: string) => {},
});

function App() {
    const playerId = useMemo(() => {
        const storedPlayerId = localStorage.getItem("playerId");
        if (storedPlayerId) return storedPlayerId;
        const newPlayerId = uuidv4();
        localStorage.setItem("playerId", newPlayerId);
        return newPlayerId;
    }, []);
    const [gameId, setGameId] = useState("");

    const joinGame = useCallback(
        async (gameId: string) => {
            if (!playerId) return;
            try {
                await GameService.connect(playerId);
                GameService.joinGame(gameId);
            } catch (error) {
                console.log(error);
            }
            setGameId(gameId);
        },
        [playerId]
    );

    useEffect(() => {
        if (!playerId) return;
        GameService.addEventListener("GAME_CREATED", (event) => {
            console.log("GAME_CREATED", event);
            if (!isCustomEvent(event)) return;
            joinGame(event.detail.gameId);
        });
        return () => {
            GameService.disconnect();
        };
    }, [joinGame, playerId]);

    async function createGame() {
        if (gameId) return;
        const createdGameId = await GameService.createGame(playerId);
        joinGame(createdGameId);
    }

    return (
        <GameContext.Provider
            value={{
                playerId,
                gameId,
                setGameId,
            }}
        >
            {gameId ? (
                <>
                    <h1>Game ID: {gameId}</h1>
                    <GameBoard gameId={gameId} playerId={playerId} />
                </>
            ) : (
                <>
                    <button onClick={createGame}>New Game</button>
                    <GameList onJoinGame={joinGame} />
                </>
            )}
        </GameContext.Provider>
    );
}

export default App;
