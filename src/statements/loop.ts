import Statement from 'src/parser/statements/Statement';
import { reserverdWords } from '../keywords';

export function verifyLoopStatement(line: string, lineNo: number) {
    if (!line.startsWith('loop')) {
        throw new Error(JSON.stringify({
            msg: 'SyntaxError: "loop" should be at the beginning of the line',
            lineNo: lineNo
        }));
    }
    if (line.match(/\b(loop)\b/g)?.length != 1) {
        throw new Error(JSON.stringify({
            msg: 'SyntaxError: Duplicate identifier "loop"',
            lineNo: lineNo
        }));
    }
    const words = line.split(' ');
    if (words.length >= 3 && words[2] != 'times') {
        throw new Error(JSON.stringify({
            msg: 'SyntaxError: Missing identifier "times"',
            lineNo: lineNo
        }));
    }
    if (words.length >= 4 && words[3] != 'as') {
        throw new Error(JSON.stringify({
            msg: 'SyntaxError: Missing identifier "as"',
            lineNo: lineNo
        }));
    }
    if (words.length >= 5 && reserverdWords.includes(words[4])) {
        throw new Error(JSON.stringify({
            msg: `SyntaxError: "${words[4]}" is a reserved keyword`,
            lineNo: lineNo
        }));
    }
    if (words.length >= 6 && words[5] != 'where') {
        throw new Error(JSON.stringify({
            msg: 'SyntaxError: Missing identifier "where"',
            lineNo: lineNo
        }));
    }
}

export function extractLoopStatementToObject(line: string) {
    const words = line.split(' ');
    let expression = `${words[1]} ${words[2]}`;
    if (words.length >= 5) {
        expression += ` ${words[3]} ${words[4]}`;
    }
    line = line.replace(`loop ${expression}`, '').trim();
    if (line.length > 0) {
        line = line.replace('where', '').trim();
        // const conditions = parseCondition(line);
        return new Statement('loop', expression);
    }
    return new Statement('loop', expression);
}