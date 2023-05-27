import { parseCondition } from "../ModelQueryParser";
import { StatementObject, whereRegex } from "../StatementParser";

export function verifyIfStatement(line: string) {
    if (line.startsWith('if')) {
    } else if (line.includes(' if')) {
        throw new Error(JSON.stringify({
            message: '"if" should be at the beginning of the line',
            lineNo: undefined,
        }))
    }
}

export function extractIfStatementToObject(line: string) {
    if (line.startsWith('if')) {
        const expressionWithConditions = line.replace('if', ''); 
        const conditions = parseCondition(expressionWithConditions.split(' '));
        return new StatementObject('if', '', conditions);
    }
    throw new Error(JSON.stringify({
        message: '"if" should be at the beginning of the line',
        lineNo: undefined,
    }));
}