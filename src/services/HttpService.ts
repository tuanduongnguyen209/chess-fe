import axios from "axios";
import { GameSession } from "src/models/GameSession";

class HttpService {
    static async createGameSession(playerId: string) {
        return await axios.post<GameSession>(
            "http://localhost:8080/api/game-sessions",
            {},
            { params: { playerId } }
        );
    }
    static async getGameSessions() {
        return await axios.get<GameSession[]>("http://localhost:8080/api/game-sessions");
    }
}

export default HttpService;
