import Comment from './Comment';
import Condition from './Condition';
import Statement from './Statement';

export default class Every {
    name = 'every';
    variableName: string;
    inName?: string;
    conditions: Condition[] = [];
    body: Statement[] = [];
    comment?: Comment;

    constructor(variableName: string, inName?: string, conditions: Condition[] = [], body: Statement[] = []) {
        this.variableName = variableName;
        this.inName = inName;
        this.conditions = conditions;
        this.body = body;
    }
}