import { isString } from 'src/syntax/matcher';

export function verifyHttpSyntax(line: string) {
    const words = line.split(' ');
    if (!isString(words[0])) {
        throw new Error(JSON.stringify({
            msg: `SyntaxError: url "${words[0]}" is not a string`,
            lineNo: undefined
        }));
    }
}