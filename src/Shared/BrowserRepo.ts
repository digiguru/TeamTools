import {IAllRepostiory} from "./IUsers";

export class BrowserRepo<T> implements IAllRepostiory<T> {
    key: string;
    br: Window;
    constructor (key: string, window: Window) {
        this.br = window;
        this.key = key;
    }
    get(): PromiseLike<T> {
        const text: string = this.br.localStorage.getItem(this.key);
        const json: T = JSON.parse(text);
        return Promise.resolve(json);
    }
    save(thing: T): PromiseLike<T> {
        const text = JSON.stringify(thing);
        this.br.localStorage.setItem(this.key, text);
        return Promise.resolve(thing);
    }

}