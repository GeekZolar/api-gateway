declare module 'opossum' {
  interface Options {
    timeout?: number;
    errorThresholdPercentage?: number;
    volumeThreshold?: number;
    resetTimeout?: number;
  }
  interface CircuitBreaker<T, R> {
    fire(...args: T[]): Promise<R>;
    on(event: string, fn: () => void): void;
    fallback(fn: (...args: T[]) => R | Promise<R>): void;
  }
  function CircuitBreaker<T, R>(fn: (...args: T[]) => Promise<R>, options?: Options): CircuitBreaker<T, R>;
}
