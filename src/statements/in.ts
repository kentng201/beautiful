export function verifyInStatement(line: string, lineNo: number, currentMainKeyword: string, currentMainLineNo: number) {
    if (!['every'].includes(currentMainKeyword)) {
        throw new Error(JSON.stringify({
            msg: 'SyntaxError: "in" keyword is not assignable to keyword "' + currentMainKeyword + '"',
            lineNo: lineNo
        }));
    }
    if (line.match(/\b(in)\b/g)?.length != 1) {
        throw new Error(JSON.stringify({
            msg: 'SyntaxError: Duplicate identifier "in"',
            lineNo: lineNo
        }));
    }
    const words = line.split(' ');
    if (words.length >= 1 && words[0] != 'in') {
        throw new Error(JSON.stringify({
            msg: 'SyntaxError: "in" should be at the beginning of the line',
            lineNo: lineNo
        }));
    }
}