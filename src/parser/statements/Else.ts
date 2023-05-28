import Comment from './Comment';
import Statement from './Statement';

export default class Else {
    name = 'else';
    body: Statement[] = [];
    comment?: Comment;
}