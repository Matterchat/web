import { GatewayEvent } from "@matterchat/contracts";

export class Websocket {
  #socket!: WebSocket;
  #numberOfReconnectAttempts: number = 0;
  #destroyed: boolean = false;
  #eventListeners: Map<GatewayEvent, ((data: any) => void)[]> = new Map();

  constructor(url: string) {
    this.connect(url);
  }

  private connect(url: string) {
    if (this.#destroyed) return;
    if (this.#numberOfReconnectAttempts >= 5)
      throw new Error("Maximum number of reconnect attempts reached.");

    this.#socket = new WebSocket(url);

    this.#socket.addEventListener("close", () => {
      console.log("WebSocket connection closed. Reconnecting...");

      this.#numberOfReconnectAttempts++;

      setTimeout(() => this.connect(url), 1000); // Reconnect after 1 second
    });

    this.#socket.addEventListener("open", () => {
      console.log("WebSocket connection established.");
      this.#numberOfReconnectAttempts = 0; // Reset the counter on successful connection
    });

    this.#socket.addEventListener("error", (event) => {
      console.error("WebSocket error:", event);
    });

    this.#socket.addEventListener("message", (event) => {
      const data = JSON.parse(event.data);
      if (!Object.values(GatewayEvent).includes(data.event))
        throw new Error(`Unknown event: ${data.event}`);

      this.#emit(data.event as GatewayEvent, data.data);
    });
  }

  public close() {
    if (this.#destroyed) return;

    this.#socket.close();
    this.#destroyed = true;
  }

  public on(event: GatewayEvent, callback: (data: any) => void) {
    if (!this.#eventListeners.has(event)) this.#eventListeners.set(event, []);

    this.#eventListeners.get(event)!.push(callback);

    return () => {
      const listeners = this.#eventListeners.get(event);
      if (!listeners) return;

      const index = listeners.indexOf(callback);
      if (index !== -1) listeners.splice(index, 1);
    };
  }

  #emit(event: GatewayEvent, data: any) {
    const listeners = this.#eventListeners.get(event);
    if (listeners) listeners.forEach((callback) => callback(data));
  }
}
