
import {Breadcrumb} from "./Breadcrumb";
export class BreadcrumbControl {
    items = new Array<Breadcrumb>();
    public addBreadcrumb(name: string, command: string, params: any) {
        this.items.push(new Breadcrumb(name, command, params));
    }
}