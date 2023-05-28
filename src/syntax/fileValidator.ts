import { verifySetStatement } from 'src/ast/statements/set';
import { isCommentKeyword, isControlExpression, isMainLeadingKeyword, isSubKeyword, isWhereExpression } from './matcher';
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

export default function validate(lines: string[]) {
    let currentMainKeyword = '';
    let currentMainLineNo = 0;

    for (let i = 0; i < lines.length; i++) {
        let line = lines[i];
        line = line.split('.,')[0]; // remove comments
        const lineNo = i + 1;
        const hasLeadingSpace = line.match(/^\s+/) as RegExpMatchArray;
        const leadingSpaces = hasLeadingSpace ? hasLeadingSpace[0].length : 0;
        line = line.trim();
        console.log('---------');
        console.log('line: ', line);
        console.log('leadingSpaces: ', leadingSpaces);
        if (isMainLeadingKeyword(line)) {
            if (line.startsWith('set')) {
                verifySetStatement(line, lineNo);
            } else if (line.startsWith('func')) {
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
            currentMainKeyword = line.split(' ')[0];
            currentMainLineNo = lineNo;
        } else if (isSubKeyword(line)) {
            if (line.startsWith('to')) {
                verifyToStatement(line, lineNo, currentMainKeyword, currentMainLineNo);
            } else if (line.startsWith('where')) {
                verifyWhereStatement(line, lineNo, currentMainKeyword, currentMainLineNo);
            } else if (line.startsWith('as')) {
                verifyAsStatement(line, lineNo, currentMainKeyword, currentMainLineNo);
            } else if (line.startsWith('in')) {
                verifyInStatement(line, lineNo, currentMainKeyword, currentMainLineNo);
            }
        } else if (isWhereExpression(line)) {
            console.log('where expression');
        } else if (isAssignmentExpression(line)) {
            console.log('assignment expression');
        } else if (isCommentKeyword(line)) {
            console.log('comments');
        } else if (line === '') {
            console.log('empty line');
        } else {
            console.log('is body');
        }
    }
}