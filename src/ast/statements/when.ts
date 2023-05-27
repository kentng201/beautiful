import { parseCondition } from "../ModelQueryParser";
import { StatementObject, whereRegex } from "../StatementParser";

export function verifyWhenStatement(line: string) {
    if (line.startsWith('when') && line.match(/\b(when)\b/g)?.length == 1) {
    } else if (line.includes(' when')) {
        throw new Error(JSON.stringify({
            msg: 'SyntaxError: "when" should be at the beginning of the line',
            lineNo: undefined,
        }))
    }
}

export function extractWhenStatementToObject(line: string) {
    if (line.startsWith('when')) {
        const expressionWithConditions = line.replace('when ', ''); 
        const conditions = parseCondition(expressionWithConditions);
        return new StatementObject('when', '', conditions);
    }
}