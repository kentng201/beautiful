import { parseCondition } from "../ModelQueryParser";
import { StatementObject } from "../StatementParser";

export function verifyIfStatement(line: string) {
    if (line.startsWith('if') && line.match(/\b(if)\b/g)?.length == 1) {
    } else if (line.includes(' if')) {
        throw new Error(JSON.stringify({
            msg: 'SyntaxError: "if" should be at the beginning of the line',
            lineNo: undefined,
        }))
    }
}

export function extractIfStatementToObject(line: string) {
    const expressionWithConditions = line.replace('if ', ''); 
    const conditions = parseCondition(expressionWithConditions);
    return new StatementObject('if', '', conditions);
}