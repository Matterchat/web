class PresenceTickerWorker {
  worker;
  timer;

  constructor(worker) {
    this.worker = worker;
    this.timer = null;

    this.worker.onmessage = this.onMessage.bind(this);
  }

  onMessage(event) {
    if (event.data === "start") this.start();
    else if (event.data === "stop") this.stop();
  }

  start() {
    this.timer = setInterval(() => this.tick(), 10000);
  }

  stop() {
    if (!this.timer) return;

    clearInterval(this.timer);
    this.timer = null;
  }

  tick() {
    this.worker.postMessage("tick");
  }
}

const worker = new PresenceTickerWorker(self);
