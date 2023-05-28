import Condition from './Condition';
import Statement from './Statement';

export default class ElseIf {
    name = 'else if';
    conditions: Condition[] = [];
    body: Statement[] = [];
}