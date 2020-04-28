

export class Timed {
    public static for(milliseconds: number): PromiseLike<number> {
        const p: PromiseLike<number> = new Promise((resolve) => {
            setTimeout(() => {
                resolve(milliseconds);
            }, milliseconds);
        });
        return p;
    }
}