import Condition from './Condition';

export default class Join {
    name = 'join';
    type: 'left' | 'right' | 'inner' | 'outer';
    modelName: string;
    conditions: Condition[];

    constructor(type: 'left' | 'right' | 'inner', modelName: string, conditions: Condition[]) {
        this.type = type;
        this.modelName = modelName;
        this.conditions = conditions;
    }
}
