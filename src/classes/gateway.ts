import { GatewayEvent } from "@matterchat/contracts";
import { API } from "./api/api";
import { Websocket } from "./ws";

export class Gateway {
  #ws: Websocket | null = null;
  #destroyed: boolean = false;

  #isConnected = false;
  #readyCallbacks: (() => void)[] = [];

  constructor(gatewayAddress: string) {
    this.requestTicket().then((ticket) => {
      if (this.#destroyed) return;

      const url = new URL(gatewayAddress);
      url.searchParams.append("ticket", ticket);

      this.#ws = new Websocket(url.href);
      this.attachListeners();

      this.#readyCallbacks.forEach((callback) => callback());
    });
  }

  private attachListeners() {
    if (!this.#ws) return;

    this.#ws.on(GatewayEvent.GatewayConnected, () => {
      this.#isConnected = true;
    });
  }

  private async requestTicket(): Promise<string> {
    const response = await API.gateway.requestTicket();
    return response.ticket;
  }

  public get isConnected() {
    return this.#isConnected;
  }

  public close() {
    if (this.#destroyed) return;

    this.#ws?.close();
    this.#destroyed = true;
  }

  public get on() {
    if (!this.#ws) throw new Error("WebSocket is not initialized yet.");
    return this.#ws.on.bind(this.#ws);
  }

  public onceReady(callback: () => void) {
    if (this.#ws) callback();
    else {
      this.#readyCallbacks.push(callback);
    }
  }
}
