export enum WorkerId {
  PresenceTicker = "presenceTicker",
}

export class BackgroundWorker {
  private id: WorkerId;
  private worker: Worker;
  private onMessageCallbacks: ((message: any) => void)[] = [];

  constructor(id: WorkerId) {
    this.id = id;

    this.worker = new Worker(`/workers/${id}.worker.js`);
    this.worker.onmessage = this.handleMessage.bind(this);
  }

  private handleMessage(event: MessageEvent) {
    for (const callback of this.onMessageCallbacks) {
      callback(event.data);
    }
  }

  public postMessage(message: string) {
    this.worker.postMessage(message);
  }

  public onMessage(callback: (message: any) => void) {
    this.onMessageCallbacks.push(callback);
  }

  public terminate() {
    this.worker.terminate();
  }
}
