

import { IDOMMeasurement } from "./IDomMeasurement";

export class Size {
    width: number;
    height: number;
    constructor(width: number, height: number) {
        this.width = width;
        this.height = height;
    }
}

export interface ISizable {
    Width: IDOMMeasurement;
    Height: IDOMMeasurement;
}
