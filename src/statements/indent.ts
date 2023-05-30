export type IndentInfo = {
    keyword: string;
    line: string;
    lineNo: number;
    indent: number;
};
export function verifyIndentSpacing(indentStack: IndentInfo[], leadingSpaces: number, line: string, lineNo: number) {
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
    if (notMatchIndention && leadingSpaces > 0 && line.trim() !== '') {
        throw new Error(JSON.stringify({
            msg: 'SyntaxError: "' + line + '" statement should be same indentation as previous statement',
            lineNo: lineNo
        }));
    }
}