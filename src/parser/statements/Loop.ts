import Condition from './Condition';
import Statement from './Statement';

export default class Loop {
    name = 'loop';
    variableName: string;
    asName?: string;
    conditions: Condition[] = [];
    body: Statement[] = [];

    constructor(variableName: string, asName?: string, conditions: Condition[] = [], body: Statement[] = []) {
        this.variableName = variableName;
        this.asName = asName;
        this.conditions = conditions;
        this.body = body;
    }
}