import Statement from 'src/parser/statements/Statement';
import { reserverdWords } from '../keywords';
import { Argument } from 'src/parser/statements/Func';

export function verifyFuncStatement(line: string, lineNo: number) {
    if (!line.startsWith('func')) {
        throw new Error(JSON.stringify({
            msg: 'SyntaxError: "func" should be at the beginning of the line',
            lineNo: lineNo
        }));
    }
    if (line.match(/\b(func)\b/g)?.length != 1) {
        throw new Error(JSON.stringify({
            msg: 'SyntaxError: Duplicate identifier "func"',
            lineNo: lineNo
        }));
    }
    const words = line.split(' ');
    if (words.length >= 2 && reserverdWords.includes(words[1])) {
        throw new Error(JSON.stringify({
            msg: `SyntaxError: "${words[1]}" is a reserved keyword`,
            lineNo: lineNo
        }));
    }
}

export function isArgument(line: string) {
    const words = line.trim().split(' ');
    if (line.includes('is')) {
        if (words.length === 3 && words[1] === 'is') {
            return true;
        }
    }
    return words.length === 1 && reserverdWords.includes(words[0]);
}

export function extractArgumentsStringToObject(line: string) {
    const result: Argument[] = [];
    const words = line.trim().split(' ');
    for (let i = 0; i < words.length; i++) {
        if (words[i] === 'is') {
            result.push(new Argument(words[i - 1], words[i + 1]));
        }
        if (words[i] !== 'is' && words[i + 1] !== 'is' && words[i + 1] !== undefined) {
            result.push(new Argument(words[i]));
        }
    }
    return result;
}

export function extractFuncStatementToObject(line: string) {
    const functionName = line.split(' ')[1];
    const statement = new Statement('func', functionName);
    if (line.split(' ').length > 2) {
        const argumentsString = line.split(' ').slice(2).join(' ');
        // statement.arguments = extractArgumentsStringToObject(argumentsString);
    }
    return statement;
}