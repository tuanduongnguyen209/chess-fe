import { createContext, useEffect, useMemo, useState } from "react";
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
    const playerId = useMemo(() => uuidv4(), []);
    const [gameId, setGameId] = useState("");
    useEffect(() => {
        if (!playerId) return;
        GameService.connect(playerId);
        GameService.addEventListener("GAME_CREATED", (event) => {
            console.log("GAME_CREATED", event);
            if (!isCustomEvent(event)) return;
            setGameId(event.detail.gameId);
        });
        return () => {
            GameService.disconnect();
        };
    }, [playerId]);

    function createGame() {
        if (gameId) return;
        GameService.createGame();
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
                    <GameList />
                </>
            )}
        </GameContext.Provider>
    );
}

export default App;
