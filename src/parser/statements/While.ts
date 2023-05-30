import Comment from './Comment';
import Condition from './Condition';
import Statement from './Statement';

export default class While {
    name = 'while';
    conditions: Condition[] = [];
    body: Statement[] = [];
    comment?: Comment;

    constructor(conditions: Condition[], body: Statement[], comment?: Comment) {
        this.conditions = conditions;
        this.body = body;
        this.comment = comment;
    }
}