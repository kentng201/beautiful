import { IndentInfo } from 'src/syntax/fileValidator';
import { isCommentKeyword } from 'src/syntax/matcher';

export function verifyBodyStatement(line: string, lineNo: number, leadingSpaces: number, indentStack: IndentInfo[]) {
    if (isCommentKeyword(line) || line === '') {
        return true;
    }
    if (leadingSpaces > 0 && indentStack.length == 0) {
        throw new Error(JSON.stringify({
            msg: 'SyntaxError: "' + line + '" statement should not open without a main statement',
            lineNo: lineNo
        }));
    }
    let notMatchIndention = true;
    for (let i = indentStack.length - 1; i >= 0; i--) {
        const indentInfo = indentStack[i];
        if (i == indentStack.length - 1 && leadingSpaces > indentInfo.indent && indentInfo.keyword !== '') {
            notMatchIndention = false;
            break;
        } else if (i != indentStack.length - 1 && indentInfo.indent !== leadingSpaces) {
            notMatchIndention = true;
        } else if (indentInfo.indent === leadingSpaces) {
            notMatchIndention = false;
            break;
        }
        notMatchIndention = true;
    }
    if (notMatchIndention && leadingSpaces > 0) {
        throw new Error(JSON.stringify({
            msg: 'SyntaxError: "' + line + '" statement should be indented properly',
            lineNo: lineNo
        }));
    }
}