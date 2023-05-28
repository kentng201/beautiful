import Condition from './Condition';
import Statement from './Statement';

export default class Every {
    name = 'every';
    variableName: string;
    inName?: string;
    conditions: Condition[] = [];
    body: Statement[] = [];

    constructor(variableName: string, inName?: string, conditions: Condition[] = [], body: Statement[] = []) {
        this.variableName = variableName;
        this.inName = inName;
        this.conditions = conditions;
        this.body = body;
    }
}