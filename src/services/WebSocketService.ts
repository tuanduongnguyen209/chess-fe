// WebSocketService.js

class WebSocketService {
    private socket: WebSocket | null;
    constructor() {
        this.socket = null;
    }

    connect(onConnected: () => void, onClosed: () => void) {
        // Establish WebSocket connection
        this.socket = new WebSocket("ws://localhost:8080/api/ws");

        // Add event listeners for WebSocket events (e.g., onmessage, onclose, etc.)
        this.socket.onopen = () => {
            console.log("WebSocket connected");
            onConnected();
        };

        this.socket.onclose = () => {
            console.log("WebSocket disconnected");
            onClosed();
        };

        // Handle other WebSocket events here
    }

    send(message: string) {
        if (this.socket) {
            this.socket.send(message);
        }
    }

    registerHandler(handler: (message: any) => void) {
        if (this.socket) {
            this.socket.onmessage = (event) => {
                const message = JSON.parse(event.data);
                handler(message);
            };
        }
    }

    disconnect() {
        if (this.socket) {
            this.socket.close();
            this.socket = null;
        }
    }
}

export default new WebSocketService();
