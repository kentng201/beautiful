import { parseCondition } from "../ModelQueryParser";
import { StatementObject, whereRegex } from "../StatementParser";

export function verifyElseStatement(line: string) {
    if (line.startsWith('else')) {
    } else if (line.includes(' else')) {
        throw new Error(JSON.stringify({
            message: '"else" should be at the beginning of the line',
            lineNo: undefined,
        }))
    }
}

export function extractElseStatementToObject(line: string) {
    if (line == 'else') {
        return new StatementObject('else', '');
    }
    throw new Error(JSON.stringify({
        message: '"else" should be at the beginning of the line',
        lineNo: undefined,
    }));
}