import { ArgumentObject, StatementObject } from '../StatementParser';
import { reserverdWords } from '../../keywords';

export function verifyFuncStatement(line: string) {
    if (!line.startsWith('func')) {
        throw new Error(JSON.stringify({
            msg: 'SyntaxError: "func" should be at the beginning of the line',
            lineNo: undefined
        }));
    }
    if (line.match(/\b(func)\b/g)?.length != 1) {
        throw new Error(JSON.stringify({
            msg: 'SyntaxError: Duplicate identifier "func"',
            lineNo: undefined
        }));
    }
    const words = line.split(' ');
    if (words.length >= 2 && reserverdWords.includes(words[1])) {
        throw new Error(JSON.stringify({
            msg: `SyntaxError: "${words[1]}" is a reserved keyword`,
            lineNo: undefined
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
    const result: ArgumentObject[] = [];
    const words = line.trim().split(' ');
    for (let i = 0; i < words.length; i++) {
        if (words[i] === 'is') {
            result.push(new ArgumentObject(words[i - 1], words[i + 1]));
        }
        if (words[i] !== 'is' && words[i + 1] !== 'is' && words[i + 1] !== undefined) {
            result.push(new ArgumentObject(words[i]));
        }
    }
    return result;
}

export function extractFuncStatementToObject(line: string) {
    const functionName = line.split(' ')[1];
    const statement = new StatementObject('func', functionName);
    if (line.split(' ').length > 2) {
        const argumentsString = line.split(' ').slice(2).join(' ');
        statement.arguments = extractArgumentsStringToObject(argumentsString);
    }
    return statement;
}