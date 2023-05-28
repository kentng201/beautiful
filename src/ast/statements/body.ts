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
    let notMatchIndention = false;
    console.log('-------------------');
    console.log('line: ', line);
    console.log('indentStack: ', indentStack);
    for (let i = indentStack.length - 1; i > 0; i--) {
        const indentInfo = indentStack[i];
        if (i == indentStack.length - 1 && leadingSpaces > indentInfo.indent) {
            notMatchIndention = false;
            break;
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