import { isNumeric } from 'src/ast/ModelQueryParser';
import { reserverdWords } from 'src/ast/reserved';

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