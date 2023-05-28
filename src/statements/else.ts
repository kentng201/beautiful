
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
    if (line.startsWith('else if') && line.match(/\b(else)\b/g)?.length != 1) {
        throw new Error(JSON.stringify({
            msg: 'SyntaxError: it should have only one "else" keyword',
            lineNo: lineNo
        }));
    }
    if (line.startsWith('else if') && line.match(/\b(if)\b/g)?.length != 1) {
        throw new Error(JSON.stringify({
            msg: 'SyntaxError: it should have only one "if" keyword',
            lineNo: lineNo
        }));
    }
    if (line.match(/\b(where)\b/g)?.length != null) {
        const keyword = line.startsWith('else if') ? 'else if' : 'else';
        throw new Error(JSON.stringify({
            msg: 'SyntaxError: "where" keyword is not assignable to keyword "' + keyword + '"',
            lineNo: lineNo
        }));
    }
}

export function extractElseStatementToObject(line: string) {
    if (line == 'else') {
        // return new StatementObject('else', '');
    } else if (line.includes('else if ')) {
        const expressionWithConditions = line.replace('else if ', '');
        // const conditions = parseCondition(expressionWithConditions);
        // return new StatementObject('else if', '', conditions);
    }
}