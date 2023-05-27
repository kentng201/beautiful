import { StatementObject } from '../StatementParser';
import { reserverdWords } from '../reserved';

export function verifyLoopStatement(line: string) {
    if (!line.startsWith('loop')) {
        throw new Error(JSON.stringify({
            msg: 'SyntaxError: "loop" should be at the beginning of the line',
            lineNo: undefined,
        }));
    }
    if (line.match(/\b(loop)\b/g)?.length != 1) {
        throw new Error(JSON.stringify({
            msg: 'SyntaxError: Duplicate identifier "loop"',
            lineNo: undefined,
        }));
    }
    const words = line.split(' ');
    if (words.length >= 3 && words[2] != 'times') {
        throw new Error(JSON.stringify({
            msg: 'SyntaxError: Missing identifier "times"',
            lineNo: undefined,
        }));
    }
    if (words.length >= 4 && words[3] != 'as') {
        throw new Error(JSON.stringify({
            msg: 'SyntaxError: Missing identifier "as"',
            lineNo: undefined,
        }));
    }
    console.log('words: ', words);
    if (words.length >= 5 && reserverdWords.includes(words[4])) {
        throw new Error(JSON.stringify({
            msg: `SyntaxError: "${words[4]}" is a reserved keyword`,
            lineNo: undefined,
        }));
    }
    if (words.length >= 6 && words[5] != 'where') {
        throw new Error(JSON.stringify({
            msg: 'SyntaxError: Missing identifier "where"',
            lineNo: undefined,
        }));
    }
}

export function extractLoopStatementToObject(line: string) {
    const words = line.split(' ');
    console.log('words: ', words);
    return new StatementObject('loop', '');
}