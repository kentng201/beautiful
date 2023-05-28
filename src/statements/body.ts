import { isCommentKeyword } from 'src/syntax/matcher';
import { IndentInfo, verifyIndentSpacing } from './indent';

export function verifyBodyStatement(line: string, lineNo: number, leadingSpaces: number, indentStack: IndentInfo[]) {
    if (isCommentKeyword(line) || line === '') {
        return true;
    }

    verifyIndentSpacing(indentStack, leadingSpaces, line, lineNo);
}