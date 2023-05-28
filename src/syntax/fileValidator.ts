import { verifySetStatement } from 'src/ast/statements/set';
import { isCommentKeyword, isEndTagKeyword, isMainLeadingKeyword, isStartTagKeyword, isSubKeyword, isTagBody, isWhereExpression } from './matcher';
import { verifyFuncStatement } from 'src/ast/statements/func';
import { verifyElseStatement } from 'src/ast/statements/else';
import { verifyIfStatement } from 'src/ast/statements/if';
import { verifyLoopStatement } from 'src/ast/statements/loop';
import { verifyEveryStatement } from 'src/ast/statements/every';
import { verifyWhereStatement } from 'src/ast/statements/where';
import { verifyToStatement } from 'src/ast/statements/to';
import { verifyAsStatement } from 'src/ast/statements/as';
import { verifyInStatement } from 'src/ast/statements/in';
import { isAssignmentExpression } from './matcher';
import { verifyLoadStatement } from 'src/ast/statements/load';
import { verifyTagBodySyntax, verifyTagSyntax } from 'src/ast/statements/tag';
import { verifyBodyStatement } from 'src/ast/statements/body';

export type IndentInfo = {
    keyword: string;
    line: string;
    lineNo: number;
    indent: number;
};


export default function validate(lines: string[]) {
    let indentStack: IndentInfo[] = [];
    let currentKeyword: IndentInfo = {
        keyword: '',
        line: '',
        lineNo: 0,
        indent: 0
    };

    for (let i = 0; i < lines.length; i++) {
        let line = lines[i];
        line = line.split('.,')[0]; // remove comments
        const lineNo = i + 1;
        const hasLeadingSpace = line.match(/^\s+/) as RegExpMatchArray;
        const leadingSpaces = hasLeadingSpace ? hasLeadingSpace[0].length : 0;
        line = line.trim();
        if (isMainLeadingKeyword(line)) {
            if (line.startsWith('func')) {
                verifyFuncStatement(line, lineNo);
            } else if (line.startsWith('else')) {
                verifyElseStatement(line, lineNo);
            } else if (line.startsWith('if')) {
                verifyIfStatement(line, lineNo);
            } else if (line.startsWith('loop')) {
                verifyLoopStatement(line, lineNo);
            } else if (line.startsWith('every')) {
                verifyEveryStatement(line, lineNo);
            }
            const keyword = line.split(' ')[0];
            currentKeyword = {
                keyword: keyword,
                line: line,
                lineNo: lineNo,
                indent: leadingSpaces
            };
            if (leadingSpaces === 0) {
                indentStack = [];
            }
            const lastKeyword = indentStack.length > 0 ? indentStack[indentStack.length - 1] : undefined;
            if (lastKeyword && lastKeyword.indent < leadingSpaces) {
                indentStack.push(currentKeyword);
            } else if (lastKeyword && lastKeyword.indent === leadingSpaces) {
                indentStack.pop();
                indentStack.push(currentKeyword);
            } else if (!lastKeyword) {
                indentStack.push(currentKeyword);
            }
        } else if (line.startsWith('set')) {
            verifySetStatement(line, lineNo, lines[i + 1]);
        } else if (isSubKeyword(line)) {
            if (line.startsWith('to')) {
                verifyToStatement(line, lineNo, currentKeyword.keyword, currentKeyword.lineNo);
            } else if (line.startsWith('where')) {
                verifyWhereStatement(line, lineNo, currentKeyword.keyword, currentKeyword.lineNo);
            } else if (line.startsWith('as')) {
                verifyAsStatement(line, lineNo, currentKeyword.keyword, currentKeyword.lineNo);
            } else if (line.startsWith('in')) {
                verifyInStatement(line, lineNo, currentKeyword.keyword, currentKeyword.lineNo);
            } else {
                verifyLoadStatement(line, lineNo, currentKeyword.keyword, currentKeyword.lineNo);
            }
        } else if (isWhereExpression(line)) {
            verifyWhereStatement(line, lineNo, currentKeyword.keyword, currentKeyword.lineNo);
        } else if (isAssignmentExpression(line)) {
            verifyLoadStatement(line, lineNo, currentKeyword.keyword, currentKeyword.lineNo);
        } else if (isTagBody(line)) {
            verifyTagBodySyntax(line, lineNo);
        } else if (isStartTagKeyword(line) || isEndTagKeyword(line)) {
            verifyTagSyntax(line, lineNo);
        } else if (isCommentKeyword(line) || line === '') {
            // comments or empty line
        }
        if (!isMainLeadingKeyword(line) && leadingSpaces > 0) {
            const lastInfo = indentStack[indentStack.length - 1];
            if (lastInfo && lastInfo.indent < leadingSpaces && lastInfo.keyword === '') {
                throw new Error(JSON.stringify({
                    msg: 'SyntaxError: "' + line + '" statement should be indented properly',
                    lineNo: lineNo
                }));
            } else {
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
            indentStack.push({
                keyword: '',
                line: line,
                lineNo: lineNo,
                indent: leadingSpaces
            });
        }
        verifyBodyStatement(line, lineNo, leadingSpaces, indentStack);
    }
}