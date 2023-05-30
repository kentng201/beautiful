import { LineObject } from 'src/syntax/parser';
import { verifyComparisonStatement } from './comparison';
import Statement from 'src/parser/statements/Statement';
import Condition from 'src/parser/statements/Condition';
import { convertWhereToArrayInArray, parseInnerWhere, turnBracketToParenthesis } from './where';
import While from 'src/parser/statements/While';
import Comment from 'src/parser/statements/Comment';

export function verifyWhileStatement(line: string, lineNo: number) {
    if (!line.startsWith('while')) {
        throw new Error(JSON.stringify({
            msg: 'SyntaxError: "while" should be at the beginning of the line',
            lineNo: lineNo
        }));
    }
    if (line.match(/\b(while)\b/g)?.length != 1) {
        throw new Error(JSON.stringify({
            msg: 'SyntaxError: Duplicate identifier "while"',
            lineNo: lineNo
        }));
    }
    if (line.match(/\b(where)\b/g)?.length != null) {
        throw new Error(JSON.stringify({
            msg: 'SyntaxError: "where" keyword is not assignable to keyword "' + 'while' + '"',
            lineNo: lineNo
        }));
    }
    verifyComparisonStatement(line, lineNo, 'while', lineNo);
}

export function parseWhile(line: string, children?: LineObject[]): Statement {
    const commentString = line.split(' .,')[1];
    let comment;
    let expression = line.replace('if ', '');
    if (commentString) {
        expression = line.replace(' .,' + commentString, '');
        comment = new Comment(commentString);
    }
    const conditionStatements = convertWhereToArrayInArray(turnBracketToParenthesis(expression));
    const conditions = parseInnerWhere(conditionStatements);

    const body = (children || [])
        .map((child) => child.toStatement())
        .filter((child) => child) as Statement[];

    return new Statement<While>('while', new While(conditions, body, comment));
}