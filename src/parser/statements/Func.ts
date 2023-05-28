import Comment from './Comment';
import Statement from './Statement';

export class Argument {
    type?: 'string' | 'number' | 'boolean' | 'int' | 'decimal' | 'func';
    dataType?: 'array' | 'collection';
    argumentName: string;
    comment?: Comment;

    constructor(...anything: any[]) {
        this.argumentName = anything[0];
    }
}

export default class Func {
    name = 'func';
    functionName: string;
    arguments: Argument[] = [];
    body: Statement[] = [];
    comment?: Comment;

    constructor(functionName: string, args: Argument[] = [], body: Statement[] = []) {
        this.functionName = functionName;
        this.arguments = args;
        this.body = body;
    }
}