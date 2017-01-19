export class Breadcrumb {
    name: string;
    command: string;
    params: any;
    enabled: boolean;
    constructor(name: string, command: string, params: any) {
        this.name = name;
        this.command = command;
        this.params = params;
        this.enabled = false;
    }
}