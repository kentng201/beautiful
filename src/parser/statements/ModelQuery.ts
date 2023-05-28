import Comment from './Comment';
import Condition from './Condition';
import Join from './Join';

export type Sort = {
    key: string;
    order: 'asc' | 'desc';
};

export default class ModelQuery {
    name = 'query';
    variableName: string;
    from: string;
    conditions: Condition[] = [];
    select?: string[];
    sort?: Sort[];
    join?: Join[];
    comment?: Comment;

    constructor(variableName: string, from: string) {
        this.variableName = variableName;
        this.from = from;
    }
}