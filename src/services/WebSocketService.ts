// WebSocketService.js

class WebSocketService {
    private socket: WebSocket | null;
    constructor() {
        this.socket = null;
    }

    connect() {
        return new Promise<void>((resolve, reject) => {
            this.socket = new WebSocket(import.meta.env.VITE_WS_URL);

            this.socket.onopen = () => {
                console.log("WebSocket connected");
                resolve();
            };

            this.socket.onclose = () => {
                console.log("WebSocket disconnected");
                reject();
            };
        });
    }

    send(message: string) {
        if (this.socket) {
            this.socket.send(message);
        }
    }

    // eslint-disable-next-line no-unused-vars
    registerHandler(handler: (message: any) => void) {
        if (this.socket) {
            this.socket.onmessage = (event) => {
                try {
                    const message = JSON.parse(event.data);
                    handler(message);
                } catch (error: any) {
                    handler(error.message);
                }
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
