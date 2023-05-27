import { StatementObject } from '../StatementParser';
import { reserverdWords } from '../reserved';

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

export function extractFuncStatementToObject(line: string) {
    const functionName = line.split(' ')[1];
    const statement = new StatementObject('func', functionName);
    if (line.split(' ').length > 2) {
        const argumentsString = line.split(' ').slice(2).join(' ');
        console.log('argumentsString: ', argumentsString);
        statement.arguments = argumentsString;
    }
    return statement;
}