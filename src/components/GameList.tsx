import { useEffect, useState } from "react";
import { GameSession } from "src/models/GameSession";
import HttpService from "src/services/HttpService";

interface GameListProps {
    onJoinGame: (gameId: string) => void;
}

function GameList({ onJoinGame }: GameListProps) {
    const [gameSessions, setGameSessions] = useState<GameSession[]>([]);
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
            <h3>Lobbies:</h3>
            {gameSessions.length === 0 ? <p>No lobbies found</p> : null}
            <ul>
                {gameSessions.map((gameSession) => (
                    <li key={gameSession.gameId}>
                        <a
                            href="#"
                            onClick={(e) => {
                                e.preventDefault();
                                onJoinGame(gameSession.gameId);
                            }}
                        >
                            {gameSession.gameId}
                        </a>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default GameList;
