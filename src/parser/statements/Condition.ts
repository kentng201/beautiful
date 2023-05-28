export const operators = ['==', '===', '>', '>=', '<', '<=', 'between', 'like', '~='];
export type Operator = typeof operators[number];

export default class Condition {
    name = 'condition';
    join?: 'and' | 'or';
    statement?: {
        key: string;
        operator: Operator;
        value: string;
    };
    children: Condition[] = [];
    parent: Condition | undefined;
}