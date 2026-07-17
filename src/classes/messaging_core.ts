import {
  GatewayEvent,
  MessageModel,
  MessageModelDto,
  UserModel,
} from "@matterchat/contracts";
import { Gateway } from "./gateway";

export class MessagingCore {
  static instance: MessagingCore | null = null;

  #gateway: Gateway | null = null;
  #activeChannelId: string | null = null;

  #onMessageCallbacks: ((message: MessageModelDto) => void)[] = [];

  #offGatewayMessageReceived: (() => void) | null = null;

  static getInstance(): MessagingCore {
    if (!MessagingCore.instance) MessagingCore.instance = new MessagingCore();

    return MessagingCore.instance;
  }

  private constructor() {}

  public setGateway(gateway: Gateway | null) {
    if (this.#gateway === gateway) return;

    this.cleanupGatewayListeners();
    this.#gateway = gateway;

    if (!gateway) return;

    gateway.onceReady(() => {
      if (this.#gateway !== gateway) return;

      const offGatewayMessageReceived = gateway.on(
        GatewayEvent.GatewayMessageReceived,
        (data) => {
          this.handleIncomingMessage(data);
        },
      );

      this.#offGatewayMessageReceived = offGatewayMessageReceived;

      gateway.onceClosed(() => {
        if (this.#offGatewayMessageReceived === offGatewayMessageReceived) {
          this.#offGatewayMessageReceived = null;
        }

        offGatewayMessageReceived?.();
      });
    });
  }

  private handleIncomingMessage(message: MessageModelDto) {
    this.#onMessageCallbacks.forEach((callback) => callback(message));
  }

  private cleanupGatewayListeners() {
    if (this.#offGatewayMessageReceived) {
      this.#offGatewayMessageReceived();
      this.#offGatewayMessageReceived = null;
    }
  }

  public setChannelId(channelId: string) {
    if (!this.#gateway) throw new Error("Gateway is not set");
    if (channelId === this.#activeChannelId) return;

    this.#activeChannelId = channelId;
    this.#gateway.emit(GatewayEvent.ClientChannelChanged, channelId);
  }

  public async sendMessage(message: string) {
    if (!this.#gateway) throw new Error("Gateway is not set");
    if (!this.#activeChannelId) throw new Error("Active channel is not set");

    this.#gateway.emit(GatewayEvent.ClientMessageSent, {
      channelId: this.#activeChannelId,
      message,
    });
  }

  public onMessage(callback: (message: MessageModelDto) => void) {
    this.#onMessageCallbacks.push(callback);

    return () => {
      this.#onMessageCallbacks = this.#onMessageCallbacks.filter(
        (cb) => cb !== callback,
      );
    };
  }
}
