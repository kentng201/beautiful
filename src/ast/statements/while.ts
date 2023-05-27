import { parseCondition } from '../ModelQueryParser';
import { StatementObject } from '../StatementParser';

export function verifyWhileStatement(line: string) {
    if (!line.startsWith('while')) {
        throw new Error(JSON.stringify({
            msg: 'SyntaxError: "while" should be at the beginning of the line',
            lineNo: undefined
        }));
    }
    if (line.match(/\b(while)\b/g)?.length != 1) {
        throw new Error(JSON.stringify({
            msg: 'SyntaxError: Duplicate identifier "while"',
            lineNo: undefined
        }));
    }
}

export function extractWhileStatementToObject(line: string) {
    const expressionWithConditions = line.replace('while ', '');
    const conditions = parseCondition(expressionWithConditions);
    return new StatementObject('while', '', conditions);
}