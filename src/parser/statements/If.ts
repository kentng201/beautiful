import Comment from './Comment';
import Condition from './Condition';
import Statement from './Statement';

export default class If {
    name = 'if';
    conditions: Condition[] = [];
    body: Statement[] = [];
    comment?: Comment;

    constructor(conditions?: Condition[], body?: Statement[], comment?: Comment) {
        if (conditions) {
            this.conditions = conditions;
        }
        if (body) {
            this.body = body;
        }
        if (comment) {
            this.comment = comment;
        }
    }
}