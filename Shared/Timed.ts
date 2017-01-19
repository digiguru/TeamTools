

export class Timed {
    public static for(milliseconds: number): Thenable<number> {
        const p: Thenable<Number> = new Promise((resolve) => {
            setTimeout(() => {
                resolve(milliseconds);
            }, milliseconds);
        });
        return p;
    }
}