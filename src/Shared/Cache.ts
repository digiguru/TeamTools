export interface IIndexableObject {
    id: string;
}

export interface ICache<T> {
    update(item: T): PromiseLike<T[]>;
    add(item: T): PromiseLike<T[]>;
    get(): PromiseLike<T[]>;
    getById(id: string): PromiseLike<T>;
    set(items: T[]): PromiseLike<T[]>;
}

export class GenericCache implements ICache<IIndexableObject> {
    store: IIndexableObject[];

    constructor() {
        this.store = [];
    }

    update(item: any): PromiseLike<any[]> {
        for (let i = 0; i < this.store.length; i++) {
            if (item.id === this.store[i].id) {
                this.store[i] = item;
            }
        }
        return Promise.resolve(this.store);
    }

    add(item: any): PromiseLike<any[]> {
        this.store.push(item);
        return Promise.resolve(this.store);
    }

    get(): PromiseLike<any[]> {
        return Promise.resolve(this.store);
    }

    getById(id: string): PromiseLike<any> {
        const store = this.store.filter((x: any) => x.id === id);
        if (store.length) {
            return Promise.resolve(store[0]);
        }
        throw Error("Cannot find item by ID: " + id);
    }

    set(items: IIndexableObject[]): PromiseLike<any[]> {
        this.store = items;
        return Promise.resolve(this.store);
    }
}