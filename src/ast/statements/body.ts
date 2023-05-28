export function verifyBodyStatement(line: string, lineNo: number, leadingSpaces: number, lastKeyword?: string) {
    if (!lastKeyword && leadingSpaces > 0) {
        throw new Error(JSON.stringify({
            msg: 'SyntaxError: "' + line + '" statement should not open without a main statement',
            lineNo: lineNo
        }));
    }
}