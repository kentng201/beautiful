import { StatementObject } from '../StatementParser';
import { reserverdWords } from '../reserved';

export function verifyAssignStatement(line: string) {
    if (!line.startsWith('assign')) {
        throw new Error(JSON.stringify({
            msg: 'SyntaxError: "assign" should be at the beginning of the line',
            lineNo: undefined
        }));
    }
    if (line.match(/\b(assign)\b/g)?.length != 1) {
        throw new Error(JSON.stringify({
            msg: 'SyntaxError: Duplicate identifier "assign"',
            lineNo: undefined
        }));
    }
    const words = line.split(' ');
    if (words.length >= 3 && words[2] != 'via') {
        throw new Error(JSON.stringify({
            msg: 'SyntaxError: Missing identifier "via"',
            lineNo: undefined
        }));
    }
}

class AssignObject {
    name = 'assign';
    variableName: string;
    statement?: StatementObject;
    method?: string;

    constructor(variableName: string, method?: string) {
        this.variableName = variableName;

        this.method = method;
    }
}

export function extractAssignStatementToObject(line: string) {
    const words = line.split(' ');
    const expression = line.replace(`assign ${words[1]} via`, '').trim();
    console.log('expression: ', expression);
    const assign = new AssignObject(words[1], expression);
    console.log('assign: ', assign);
    return new StatementObject<AssignObject>('assign', assign);
}