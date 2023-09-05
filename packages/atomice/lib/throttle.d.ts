declare class Throttle {
    private delay;
    private timer;
    private lastTime;
    constructor(delay: number);
    throttle(callback: () => void): void;
    clear(): void;
}
export declare const computedThrottle: Throttle;
export declare const setValueThrottle: Throttle;
export {};
