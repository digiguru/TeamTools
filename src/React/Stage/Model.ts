import { Size } from "../Models/Size";

export interface IHidableEvents {
    Events: IHidable;
}
export interface IHidable {
    onHide    : () => void;
    onShow    : () => void;
}
export interface IStageState extends IHidable {
    Size?     : Size;
}
export interface IStageProps {
    children? : any ;
}
