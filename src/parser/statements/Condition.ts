import Comment from './Comment';

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
    comment?: Comment;
    parent: Condition | undefined;
}