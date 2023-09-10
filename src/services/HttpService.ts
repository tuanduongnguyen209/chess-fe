import axios from "axios";
import { GameSession } from "src/models/GameSession";

class HttpService {
    static async getGameSessions() {
        return await axios.get<GameSession[]>("http://localhost:8080/api/game-sessions");
    }
}

export default HttpService;
