import { parseCondition } from '../ast/ModelQueryParser';
import { StatementObject } from '../ast/StatementParser';

export function verifyIfStatement(line: string, lineNo: number) {
    if (!line.startsWith('if')) {
        throw new Error(JSON.stringify({
            msg: 'SyntaxError: "if" should be at the beginning of the line',
            lineNo: lineNo
        }));
    }
    if (line.match(/\b(if)\b/g)?.length != 1) {
        throw new Error(JSON.stringify({
            msg: 'SyntaxError: Duplicate identifier "if"',
            lineNo: lineNo
        }));
    }
    if (line.match(/\b(where)\b/g)?.length != null) {
        throw new Error(JSON.stringify({
            msg: 'SyntaxError: "where" keyword is not assignable to keyword "if"',
            lineNo: lineNo
        }));
    }
}

export function extractIfStatementToObject(line: string) {
    const expressionWithConditions = line.replace('if ', '');
    const conditions = parseCondition(expressionWithConditions);
    return new StatementObject('if', '', conditions);
}