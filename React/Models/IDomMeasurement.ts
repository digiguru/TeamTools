export interface IDOMMeasurement {
    Unit: "px" | "%";
    Value: number;
}

export class DOMMeasurement implements IDOMMeasurement {
    constructor(input: string) {

        if (input.indexOf("%") !== -1) {
            this.Value = parseInt(input.substr(0, input.indexOf("%")), 10);
            this.Unit  = "%";
        } else if (input.indexOf("%") !== -1) {
            this.Value = parseInt(input.substr(0, input.indexOf("px")), 10);
            this.Unit  = "px";
        } else {
            this.Value = parseInt(input, 10);
            this.Unit  = "px";
        }
    }
    Unit: "px" | "%";
    Value: number;
    toString(): string {
        return "" + this.Value + this.Unit;
    };
}
