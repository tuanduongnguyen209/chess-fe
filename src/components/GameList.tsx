import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { Link } from "react-router-dom";
import { GameContext } from "src/App";
import { GameSession } from "src/models/GameSession";
import GameService from "src/services/GameService";
import HttpService from "src/services/HttpService";

function GameList() {
    const navigate = useNavigate();
    const context = useContext(GameContext);
    const playerId = context.playerId;
    const [gameSessions, setGameSessions] = useState<GameSession[]>([]);

    async function createGame() {
        const createdGameId = await GameService.createGame(playerId);
        navigate(`/game/${createdGameId}`);
    }

    useEffect(() => {
        HttpService.getGameSessions()
            .then((response) => {
                setGameSessions(response.data);
            })
            .catch((error) => {
                console.log(error);
            });
    }, []);
    return (
        <div>
            <button onClick={createGame}>Create Game</button>
            <h3>Lobbies:</h3>
            {gameSessions.length === 0 ? <p>No lobbies found</p> : null}
            <ul>
                {gameSessions.map((gameSession) => (
                    <li key={gameSession.gameId}>
                        <Link to={`/game/${gameSession.gameId}`}>{gameSession.gameId}</Link>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default GameList;
