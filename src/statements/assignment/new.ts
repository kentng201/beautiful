import { reserverdWords } from 'src/keywords';
import { isNumeric } from 'src/syntax/matcher';

export function verifyNewSyntax(line: string) {
    const words = line.split(' ');
    if (words.length >= 1 && reserverdWords.includes(words[0])) {
        throw new Error(JSON.stringify({
            msg: `SyntaxError: "${words[0]}" is a reserved keyword`,
            lineNo: undefined
        }));
    }
    if (words.length >= 2 && isNumeric(words[0]) && reserverdWords.includes(words[1])) {
        throw new Error(JSON.stringify({
            msg: `SyntaxError: "${words[1]}" is a reserved keyword`,
            lineNo: undefined
        }));
    }
}