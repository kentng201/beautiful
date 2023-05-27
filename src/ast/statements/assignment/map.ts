import { reserverdWords } from 'src/ast/reserved';

export function verifyMapSyntax(line: string) {
    const words = line.split(' ');
    if (words.length >= 1 && reserverdWords.includes(words[0])) {
        throw new Error(JSON.stringify({
            msg: `SyntaxError: "${words[0]}" is a reserved keyword`,
            lineNo: undefined
        }));
    }
    if (words.length >= 2 && words[1] != 'as' && words[1] != 'return') {
        throw new Error(JSON.stringify({
            msg: 'SyntaxError: Missing identifier "return"',
            lineNo: undefined
        }));
    }
    if (words.length >= 3 && reserverdWords.includes(words[2])) {
        throw new Error(JSON.stringify({
            msg: `SyntaxError: "${words[2]}" is a reserved keyword`,
            lineNo: undefined
        }));
    }
    if (words.length >= 4 && words[1] == 'as' && words[3] != 'return') {
        throw new Error(JSON.stringify({
            msg: 'SyntaxError: Missing identifier "return"',
            lineNo: undefined
        }));
    }
    if (words[1] == 'as' && words.length < 5) {
        throw new Error(JSON.stringify({
            msg: `SyntaxError: Undefined return for "${words[0]}"`,
            lineNo: undefined
        }));
    }
    if (words[1] == 'return' && words.length < 3) {
        throw new Error(JSON.stringify({
            msg: `SyntaxError: Undefined return for "${words[0]}"`,
            lineNo: undefined
        }));
    }


}