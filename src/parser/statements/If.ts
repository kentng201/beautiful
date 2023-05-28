import Condition from './Condition';
import Statement from './Statement';

export default class If {
    name = 'if';
    conditions: Condition[] = [];
    body: Statement[] = [];
}