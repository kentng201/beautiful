import { reserverdWords } from 'src/keywords';

export function verifyToStatement(line: string, lineNo: number, currentMainKeyword: string, currentMainLineNo: number) {
    if (currentMainKeyword != 'set') {
        throw new Error(JSON.stringify({
            msg: 'SyntaxError: "to" keyword is not assignable to keyword "' + currentMainKeyword + '"',
            lineNo: lineNo
        }));
    }
    if (line.match(/\b(to)\b/g)?.length != 1) {
        throw new Error(JSON.stringify({
            msg: 'SyntaxError: Duplicate identifier "to"',
            lineNo: undefined
        }));
    }
    const words = line.split(' ');
    if (words.length >= 1 && words[0] != 'to') {
        throw new Error(JSON.stringify({
            msg: 'SyntaxError: "to" should be at the beginning of the line',
            lineNo: lineNo
        }));
    }
    if (words.length >= 2 && reserverdWords.includes(words[1])) {
        throw new Error(JSON.stringify({
            msg: `SyntaxError: "${words[1]}" is a reserved keyword`,
            lineNo: lineNo
        }));
    }
}