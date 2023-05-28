import { verifyComparisonStatement } from './comparison';

export function verifyWhileStatement(line: string, lineNo: number) {
    if (!line.startsWith('while')) {
        throw new Error(JSON.stringify({
            msg: 'SyntaxError: "while" should be at the beginning of the line',
            lineNo: lineNo
        }));
    }
    if (line.match(/\b(while)\b/g)?.length != 1) {
        throw new Error(JSON.stringify({
            msg: 'SyntaxError: Duplicate identifier "while"',
            lineNo: lineNo
        }));
    }
    if (line.match(/\b(where)\b/g)?.length != null) {
        throw new Error(JSON.stringify({
            msg: 'SyntaxError: "where" keyword is not assignable to keyword "' + 'while' + '"',
            lineNo: lineNo
        }));
    }
    verifyComparisonStatement(line, lineNo, 'while', lineNo);
}

export function extractWhileStatementToObject(line: string) {
    const expressionWithConditions = line.replace('while ', '');
    // const conditions = parseCondition(expressionWithConditions);
    // return new StatementObject('while', '', conditions);
}