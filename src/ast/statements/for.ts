import { parseCondition } from '../ModelQueryParser';
import { StatementObject } from '../StatementParser';

export function verifyForStatement(line: string) {
    if (!line.startsWith('for')) {
        throw new Error(JSON.stringify({
            msg: 'SyntaxError: "for" should be at the beginning of the line',
            lineNo: undefined
        }));
    }
    if (line.match(/\b(for)\b/g)?.length != 1) {
        throw new Error(JSON.stringify({
            msg: 'SyntaxError: Duplicate identifier "for"',
            lineNo: undefined
        }));
    }
}

export function extractForStatementToObject(line: string) {
    const expressionWithConditions = line.replace('for ', '');
    return new StatementObject('for', expressionWithConditions);
}