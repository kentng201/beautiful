export function verifyWhereStatement(line: string, lineNo: number, currentMainKeyword: string, currentMainLineNo: number) {
    if (!['loop', 'every'].includes(currentMainKeyword)) {
        throw new Error(JSON.stringify({
            msg: 'SyntaxError: "where" keyword is not assignable to keyword "' + currentMainKeyword + '"',
            lineNo: lineNo
        }));
    }
    if (line.match(/\b(where)\b/g)?.length != 1) {
        throw new Error(JSON.stringify({
            msg: 'SyntaxError: Duplicate identifier "where"',
            lineNo: lineNo
        }));
    }
    const words = line.split(' ');
    if (words.length >= 1 && words[0] != 'where') {
        throw new Error(JSON.stringify({
            msg: 'SyntaxError: "where" should be at the beginning of the line',
            lineNo: lineNo
        }));
    }
}