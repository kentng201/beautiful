import { isCommentKeyword } from 'src/syntax/matcher';
import { IndentInfo, validateIndentSpacing } from './indent';

export function verifyBodyStatement(line: string, lineNo: number, leadingSpaces: number, indentStack: IndentInfo[]) {
    if (isCommentKeyword(line) || line === '') {
        return true;
    }

    validateIndentSpacing(indentStack, leadingSpaces, line, lineNo);
}