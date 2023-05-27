import { parseCondition } from "../ModelQueryParser";
import { StatementObject } from "../StatementParser";

export function verifyIfStatement(line: string) {
    if (!line.startsWith('if')) {
        throw new Error(JSON.stringify({
            msg: 'SyntaxError: "if" should be at the beginning of the line',
            lineNo: undefined,
        }))
    }
    if (line.match(/\b(if)\b/g)?.length != 1) {
        throw new Error(JSON.stringify({
            msg: 'SyntaxError: Duplicate identifier "if"',
            lineNo: undefined,
        }))
    }
}

export function extractIfStatementToObject(line: string) {
    const expressionWithConditions = line.replace('if ', '');
    const conditions = parseCondition(expressionWithConditions);
    return new StatementObject('if', '', conditions);
}