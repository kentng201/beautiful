import { parseCondition } from "../ModelQueryParser";
import { StatementObject, statementKeywords } from "../StatementParser";

export function verifyEveryStatement(line: string) {
    if (!line.startsWith('every')) {
        throw new Error(JSON.stringify({
            msg: 'SyntaxError: "every" should be at the beginning of the line',
            lineNo: undefined,
        }))
    }
    if (line.match(/\b(every)\b/g)?.length != 1) {
        throw new Error(JSON.stringify({
            msg: 'SyntaxError: Duplicate identifier "every"',
            lineNo: undefined,
        }))
    }
    const words = line.split(' ');
    if (words.length < 3 || words[2] != 'in') {
        throw new Error(JSON.stringify({
            msg: 'SyntaxError: Missing identifier "in"',
            lineNo: undefined,
        }))
    }
    if (words.length < 4) {
        throw new Error(JSON.stringify({
            msg: `SyntaxError: Undefined variable for "${words[1]}"`,
            lineNo: undefined,
        }))
    }
    if (statementKeywords.includes(words[1])) {
        throw new Error(JSON.stringify({
            msg: `SyntaxError: "${words[1]}" is a reserved keyword`,
            lineNo: undefined,
        }))
    }
    const conditionStrings = line.replace(`every ${words[1]} in ${words[3]}`, '')
        .trimStart()
        .split(' ');
    if (conditionStrings.length > 0 && conditionStrings[0] == '') {
        return;
    }
    if (conditionStrings.length > 0 && conditionStrings[0] != 'where') {
        throw new Error(JSON.stringify({
            msg: 'SyntaxError: Missing identifier "where"',
            lineNo: undefined,
        }))
    }
}

export function extractEveryStatementToObject(line: string) {
    const words = line.split(' ');
    const expression = `${words[1]} in ${words[3]}`;
    const conditionString = line.replace(`every ${expression}`, '')
        .replace('where ', '');
    const conditions = parseCondition(conditionString);
    return new StatementObject('every', expression, conditions);
}