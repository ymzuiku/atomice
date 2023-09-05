class Throttle {
  private timer: NodeJS.Timeout | null = null;
  private lastTime: number = 0;

  constructor(private delay: number) {}

  public throttle(callback: () => void) {
    const currentTime = Date.now();

    if (!this.timer || currentTime - this.lastTime >= this.delay) {
      callback();
      this.lastTime = currentTime;
    } else {
      if (this.timer) {
        clearTimeout(this.timer);
      }

      this.timer = setTimeout(() => {
        callback();
        this.lastTime = Date.now();
      }, this.delay);
    }
  }
  public clear() {
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }
  }
}

export const computedThrottle = new Throttle(16);
export const setValueThrottle = new Throttle(16);
