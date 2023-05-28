export function verifyEnclosingBrackets(line: string) {
    const leftBrackets = line.match(/\(/g)?.length || 0;
    const rightBrackets = line.match(/\)/g)?.length || 0;
    return leftBrackets == rightBrackets;
}

export function verifyComparisonStatement(line: string, lineNo: number, currentMainKeyword: string, currentMainLineNo: number) {
    const verifyEnclosing = verifyEnclosingBrackets(line);
    if (!verifyEnclosing) {
        throw new Error(JSON.stringify({
            msg: 'SyntaxError: Brackets are not closed properly',
            lineNo: lineNo
        }));
    }

}
