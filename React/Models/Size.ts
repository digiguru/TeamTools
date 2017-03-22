

import { IDOMMeasurement } from "./IDomMeasurement";

export class Size {
    width : number;
    height: number;
    constructor(width: number, height: number) {
        this.width  = width;
        this.height = height;
    }
    shortest(): number {
        if (this.width < this.height) {
            return this.width;
        } else {
            return this.height;
        }
    }
    longest(): number {
        if (this.width > this.height) {
            return this.width;
        } else {
            return this.height;
        }
    }
}

export interface ISizable {
    Width : IDOMMeasurement;
    Height: IDOMMeasurement;
}
