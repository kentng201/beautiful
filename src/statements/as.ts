export function verifyAsStatement(line: string, lineNo: number, currentMainKeyword: string, currentMainLineNo: number) {
    if (!['loop', 'set'].includes(currentMainKeyword)) {
        throw new Error(JSON.stringify({
            msg: 'SyntaxError: "as" keyword is not assignable to keyword "' + currentMainKeyword + '"',
            lineNo: lineNo
        }));
    }
    if (line.match(/\b(as)\b/g)?.length != 1) {
        throw new Error(JSON.stringify({
            msg: 'SyntaxError: Duplicate identifier "as"',
            lineNo: lineNo
        }));
    }
    const words = line.split(' ');
    if (words.length >= 1 && words[0] != 'as') {
        throw new Error(JSON.stringify({
            msg: 'SyntaxError: "as" should be at the beginning of the line',
            lineNo: lineNo
        }));
    }
}