export interface IIndexableObject {
    id: string;
}

export interface ICache<T> {
    update(item: T): Thenable<T[]>;
    add(item: T): Thenable<T[]>;
    get(): Thenable<T[]>;
    getById(id: string): Thenable<T>;
    set(items: T[]): Thenable<T[]>;
}

export class GenericCache implements ICache<IIndexableObject> {
    store: IIndexableObject[];

    constructor() {
        this.store = [];
    }

    update(item: any): Thenable<any[]> {
        for (let i = 0; i < this.store.length; i++) {
            if (item.id === this.store[i].id) {
                this.store[i] = item;
            }
        }
        return Promise.resolve(this.store);
    }

    add(item: any): Thenable<any[]> {
        this.store.push(item);
        return Promise.resolve(this.store);
    }

    get(): Thenable<any[]> {
        return Promise.resolve(this.store);
    }

    getById(id: string): Thenable<any> {
        const store = this.store.filter((x: any) => x.id === id);
        if (store.length) {
            return Promise.resolve(store[0]);
        }
        throw Error("Cannot find item by ID: " + id);
    }

    set(items: IIndexableObject[]): Thenable<any[]> {
        this.store = items;
        return Promise.resolve(this.store);
    }
}