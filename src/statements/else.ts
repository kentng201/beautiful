
export function verifyElseStatement(line: string, lineNo: number) {
    if (!line.startsWith('else')) {
        throw new Error(JSON.stringify({
            msg: 'SyntaxError: "else" should be at the beginning of the line',
            lineNo: lineNo
        }));
    }
    if (line.match(/\b(else)\b/g)?.length != 1) {
        throw new Error(JSON.stringify({
            msg: 'SyntaxError: it should have only one "else" keyword',
            lineNo: lineNo
        }));
    }
    if (line.match(/\b(if)\b/g)?.length != null) {
        throw new Error(JSON.stringify({
            msg: 'SyntaxError: "if" keyword is not assignable to keyword "else"',
            lineNo: lineNo
        }));
    }
    if (line.match(/\b(where)\b/g)?.length != null) {
        throw new Error(JSON.stringify({
            msg: 'SyntaxError: "where" keyword is not assignable to keyword "else"',
            lineNo: lineNo
        }));
    }
}

export function extractElseStatementToObject(line: string) {
    if (line == 'else') {
        // return new StatementObject('else', '');
    }
}