type CurrentMain = {
    currentMainKeyword: string;
    currentMainLine: string;
    currentMainLineNo: number;
    currentMainIndentation: number;
};

export function verifyBodyStatement(line: string, lineNo: number, leadingSpaces: number, main?: CurrentMain) {
    if (!main?.currentMainKeyword && leadingSpaces > 0) {
        throw new Error(JSON.stringify({
            msg: 'SyntaxError: "' + line + '" statement should not open without a main statement',
            lineNo: lineNo
        }));
    }
    console.log('main: ', main);
    console.log('line: ', line);
    console.log('leadingSpaces: ', leadingSpaces);
    if (main?.currentMainIndentation !== undefined && leadingSpaces == 0) {
        throw new Error(JSON.stringify({
            msg: 'SyntaxError: "' + line + '" statement should be indented more than the main statement',
            lineNo: lineNo
        }));
    }
    if (main?.currentMainIndentation !== undefined && leadingSpaces <= main.currentMainIndentation) {
        throw new Error(JSON.stringify({
            msg: 'SyntaxError: "Statement should be indented more than statement "' + main.currentMainLine + '"',
            lineNo: lineNo
        }));
    }
}