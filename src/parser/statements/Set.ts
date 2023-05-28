import Comment from './Comment';
import ModelQuery from './ModelQuery';

export type SetStatementType = 'native' | 'variable' | 'object' | 'http' | 'new' | 'filter' | 'sort' | 'pick' | 'map';

export class SetStatement {
    name = 'assignment';
    type: SetStatementType;
    statement: string;
    method?: string;
    comment?: Comment;

    constructor(type: SetStatementType, statement: string, method?: string) {
        this.type = type;
        this.statement = statement;
        this.method = method;
    }
}

export default class Set {
    name = 'set';
    variableName: string;
    type: 'to' | 'from';
    assign?: SetStatement | ModelQuery;

    constructor(variableName: string, type: 'to' | 'from', assign?: SetStatement | ModelQuery) {
        this.variableName = variableName;
        this.type = type;
        this.assign = assign;
    }
}