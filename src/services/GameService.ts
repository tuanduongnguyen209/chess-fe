import { GameEvent } from "src/models/GameEvent";
import HttpService from "src/services/HttpService";
import WebSocketService from "src/services/WebSocketService";

class GameService extends EventTarget {
    private playerId: string = "";
    private connected: boolean = false;

    constructor() {
        super();
        this.handleGameMessage = this.handleGameMessage.bind(this);
        this.dispatchEvent = this.dispatchEvent.bind(this);
    }

    isConnected() {
        return this.connected;
    }

    connect(playerId: string) {
        return new Promise<void>((resolve, reject) => {
            WebSocketService.connect()
                .then(() => {
                    this.playerId = playerId;
                    this.connected = true;
                    WebSocketService.registerHandler(this.handleGameMessage);
                    resolve();
                })
                .catch(() => {
                    this.connected = false;
                    reject();
                });
        });
    }

    async createGame(playerId: string) {
        this.playerId = playerId;
        const res = await HttpService.createGameSession(playerId);
        const gameId = res.data.gameId;
        return gameId;
    }

    joinGame(gameId: string) {
        WebSocketService.send(
            JSON.stringify({
                type: "PLAYER_JOIN_A_GAME",
                gameId,
                playerId: this.playerId,
            })
        );
    }

    private handleGameMessage(message: GameEvent | string) {
        if (typeof message === "string") {
            console.error("GAME ERROR:", message);
            return;
        }
        try {
            console.log("GAME EVENT:", message);
            this.dispatchEvent(new CustomEvent(message.type, { detail: message }));
        } catch (error) {
            console.error(error);
        }
    }

    disconnect() {
        this.playerId = "";
    }
}

export default new GameService();
