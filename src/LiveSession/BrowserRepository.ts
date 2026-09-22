export interface Repository<T> {
  get(): PromiseLike<T>;
  save(value: T): PromiseLike<T>;
}

export class BrowserRepository<T> implements Repository<T> {
  constructor(
    private readonly key: string,
    private readonly browserWindow: Window
  ) {}

  get(): PromiseLike<T> {
    const text = this.browserWindow.localStorage.getItem(this.key);
    const value = text === null ? null : JSON.parse(text);
    return Promise.resolve(value as T);
  }

  save(value: T): PromiseLike<T> {
    this.browserWindow.localStorage.setItem(this.key, JSON.stringify(value));
    return Promise.resolve(value);
  }
}
