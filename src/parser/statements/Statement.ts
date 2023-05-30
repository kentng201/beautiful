import { StatementKeyword } from 'src/keywords';
import { toJsIf } from 'src/statements/if';
import If from './If';

export default class Statement<T = {}> {
    keyword: StatementKeyword | 'set' | 'func';
    expression: T;

    constructor(keyword: StatementKeyword | 'set' | 'func', expression: T) {
        this.keyword = keyword;
        this.expression = expression;
    }

    toJs(level = 0): any {
        if (this.keyword == 'if') {
            return toJsIf(this as Statement<If>, level);
        } else if (this.keyword == 'else') {
            // toJsElse();
        } else if (this.keyword == 'while') {
            // return toJsWhile();
        } else if (this.keyword == 'every') {
            // return toJsEvery();
        } else if (this.keyword == 'loop') {
            // return toJsLoop();
        } else if (this.keyword == 'set') {
            // return toJsSet();
        } else if (this.keyword == 'func') {
            // return toJsFunc();
        } else if (this.keyword == 'native') {
            // return toJsNative();
            return this.expression;
        }
    }
}