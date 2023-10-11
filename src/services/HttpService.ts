import axios from "axios";
import { GameSession } from "src/models/GameSession";

class HttpService {
    static async createGameSession(playerId: string) {
        return await axios.post<GameSession>(
            `${import.meta.env.VITE_API_URL}/game-sessions`,
            {},
            { params: { playerId } }
        );
    }
    static async getGameSessions() {
        return await axios.get<GameSession[]>(`${import.meta.env.VITE_API_URL}/game-sessions`);
    }
}

export default HttpService;
