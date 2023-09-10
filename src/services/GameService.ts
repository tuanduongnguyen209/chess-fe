import { GameEvent } from "src/models/GameEvent";
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
        WebSocketService.connect(
            () => {
                this.playerId = playerId;
                this.connected = true;
                WebSocketService.registerHandler(this.handleGameMessage);
            },
            () => {
                this.connected = false;
            }
        );
    }

    createGame() {
        WebSocketService.send(
            JSON.stringify({
                type: "CREATE_A_NEW_GAME",
                playerId: this.playerId,
            })
        );
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

    private handleGameMessage(message: GameEvent) {
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
