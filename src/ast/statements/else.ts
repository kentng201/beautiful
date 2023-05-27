import { parseCondition } from "../ModelQueryParser";
import { StatementObject } from "../StatementParser";

export function verifyElseStatement(line: string) {
    if (!line.startsWith('else')) {
        throw new Error(JSON.stringify({
            msg: 'SyntaxError: "else" should be at the beginning of the line',
            lineNo: undefined,
        }))
    }
    if (line.match(/\b(else)\b/g)?.length != 1) {
        throw new Error(JSON.stringify({
            msg: 'SyntaxError: it should have only one "else" keyword',
            lineNo: undefined,
        }))
    }
    if (line.startsWith('else if') && line.match(/\b(else)\b/g)?.length != 1) {
        throw new Error(JSON.stringify({
            msg: 'SyntaxError: it should have only one "else" keyword',
            lineNo: undefined,
        }))
    }
    if (line.startsWith('else if') && line.match(/\b(if)\b/g)?.length != 1) {
        throw new Error(JSON.stringify({
            msg: 'SyntaxError: it should have only one "if" keyword',
            lineNo: undefined,
        }))
    }
}

export function extractElseStatementToObject(line: string) {
    if (line == 'else') {
        return new StatementObject('else', '');
    } else if (line.includes('else if ')) {
        const expressionWithConditions = line.replace('else if ', '');
        const conditions = parseCondition(expressionWithConditions);
        return new StatementObject('else if', '', conditions);
    }
}