import { reserverdWords } from 'src/keywords';

export function verifyFilterSyntax(line: string) {
    const words = line.split(' ');
    if (words.length >= 1 && reserverdWords.includes(words[0])) {
        throw new Error(JSON.stringify({
            msg: `SyntaxError: "${words[0]}" is a reserved keyword`,
            lineNo: undefined
        }));
    }
    if (words.length >= 2 && words[1] != 'as' && words[1] != 'where') {
        throw new Error(JSON.stringify({
            msg: 'SyntaxError: Missing identifier "where"',
            lineNo: undefined
        }));
    }
    if (words.length >= 3 && words[1] == 'as' && reserverdWords.includes(words[2])) {
        throw new Error(JSON.stringify({
            msg: `SyntaxError: "${words[2]}" is a reserved keyword`,
            lineNo: undefined
        }));
    }
    if (words.length >= 4 && words[1] == 'as' && words[3] != 'where') {
        throw new Error(JSON.stringify({
            msg: 'SyntaxError: Missing identifier "where"',
            lineNo: undefined
        }));
    }

    const condition = line.split('where ')[1];
    // parseCondition(condition);
}