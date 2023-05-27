import { parseCondition } from '../ModelQueryParser';
import { StatementObject } from '../StatementParser';
import { reserverdWords } from '../reserved';

export function verifyEveryStatement(line: string) {
    if (!line.startsWith('every')) {
        throw new Error(JSON.stringify({
            msg: 'SyntaxError: "every" should be at the beginning of the line',
            lineNo: undefined,
        }));
    }
    if (line.match(/\b(every)\b/g)?.length != 1) {
        throw new Error(JSON.stringify({
            msg: 'SyntaxError: Duplicate identifier "every"',
            lineNo: undefined,
        }));
    }
    const words = line.split(' ');
    if (words.length >= 3 && words[2] != 'in') {
        throw new Error(JSON.stringify({
            msg: 'SyntaxError: Missing identifier "in"',
            lineNo: undefined,
        }));
    }
    if (words.length >= 5 && words[4] != 'where') {
        throw new Error(JSON.stringify({
            msg: 'SyntaxError: Missing identifier "where"',
            lineNo: undefined,
        }));
    }
    if (words.length < 4) {
        throw new Error(JSON.stringify({
            msg: `SyntaxError: Undefined variable for "${words[1]}"`,
            lineNo: undefined,
        }));
    }
    if (reserverdWords.includes(words[1])) {
        throw new Error(JSON.stringify({
            msg: `SyntaxError: "${words[1]}" is a reserved keyword`,
            lineNo: undefined,
        }));
    }
}

export function extractEveryStatementToObject(line: string) {
    const words = line.split(' ');
    const expression = `${words[1]} in ${words[3]}`;
    line = line.replace(`every ${expression}`, '');
    if (line.length > 0) {
        line = line.replace('where', '').trim();
        const conditions = parseCondition(line);
        return new StatementObject('loop', expression, conditions);
    }
    return new StatementObject('every', expression);
}