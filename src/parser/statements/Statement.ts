import { StatementKeyword } from 'src/keywords';

export default class Statement<T = {}> {
    keyword: StatementKeyword | 'set' | 'func';
    expression: T;

    constructor(keyword: StatementKeyword | 'set' | 'func', expression: T) {
        this.keyword = keyword;
        this.expression = expression;
    }
}