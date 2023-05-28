export function verifyInStatement(line: string, lineNo: number, currentMainKeyword: string, currentMainLineNo: number) {
    if (!['times'].includes(currentMainKeyword)) {
        throw new Error(JSON.stringify({
            msg: 'SyntaxError: "times" keyword is not assignable to keyword "' + currentMainKeyword + '"',
            lineNo: lineNo
        }));
    }
    if (line.match(/\b(times)\b/g)?.length != 1) {
        throw new Error(JSON.stringify({
            msg: 'SyntaxError: Duplicate identifier "times"',
            lineNo: lineNo
        }));
    }
    const words = line.split(' ');
    if (words.length >= 1 && words[0] != 'times') {
        throw new Error(JSON.stringify({
            msg: 'SyntaxError: "times" should be at the beginning of the line',
            lineNo: lineNo
        }));
    }
}