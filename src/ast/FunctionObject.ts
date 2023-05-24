export default class FunctionObject {
    name: string;
    args: [string, string][];
    body: string[];

    constructor(name: string, args: [string, string][], body: string[]) {
        this.name = name;
        this.args = args;
        this.body = body;
    }
}