import { StatementKeyword } from 'src/keywords';
import { toJsIf } from 'src/statements/if';
import If from './If';
import { toJsLoop } from 'src/statements/loop';
import Loop from './Loop';
import { toJsWhile } from 'src/statements/while';
import While from './While';
import { toJsEvery } from 'src/statements/every';
import Every from './Every';
import { toJsElse } from 'src/statements/else';
import Else from './Else';

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
            return toJsElse(this as Statement<Else>, level);
        } else if (this.keyword == 'while') {
            return toJsWhile(this as Statement<While>, level);
        } else if (this.keyword == 'every') {
            return toJsEvery(this as Statement<Every>, level);
        } else if (this.keyword == 'loop') {
            return toJsLoop(this as Statement<Loop>, level);
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