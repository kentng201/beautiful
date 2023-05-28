import { reserverdWords } from '../keywords';

export function verifyEveryStatement(line: string, lineNo: number) {
    if (!line.startsWith('every')) {
        throw new Error(JSON.stringify({
            msg: 'SyntaxError: "every" should be at the beginning of the line',
            lineNo: lineNo
        }));
    }
    if (line.match(/\b(every)\b/g)?.length != 1) {
        throw new Error(JSON.stringify({
            msg: 'SyntaxError: Duplicate identifier "every"',
            lineNo: lineNo
        }));
    }
    const words = line.split(' ');
    if (words.length >= 3 && words[2] != 'in') {
        throw new Error(JSON.stringify({
            msg: 'SyntaxError: Missing identifier "in"',
            lineNo: lineNo
        }));
    }
    if (words.length >= 5 && words[4] != 'where') {
        throw new Error(JSON.stringify({
            msg: 'SyntaxError: Missing identifier "where"',
            lineNo: lineNo
        }));
    }
    if (words.length < 4) {
        throw new Error(JSON.stringify({
            msg: `SyntaxError: Undefined variable for "${words[1]}"`,
            lineNo: lineNo
        }));
    }
    if (reserverdWords.includes(words[1])) {
        throw new Error(JSON.stringify({
            msg: `SyntaxError: "${words[1]}" is a reserved keyword`,
            lineNo: lineNo
        }));
    }
}

export function extractEveryStatementToObject(line: string) {
    const words = line.split(' ');
    const expression = `${words[1]} in ${words[3]}`;
    line = line.replace(`every ${expression}`, '');
    if (line.length > 0) {
        line = line.replace('where', '').trim();
        // const conditions = parseCondition(line);
        // return new StatementObject('every', expression, conditions);
    }
    // return new StatementObject('every', expression);
}