import Statement from 'src/parser/statements/Statement';
import { verifyComparisonStatement } from './comparison';
import If from 'src/parser/statements/If';
import { convertWhereToArrayInArray, parseInnerWhere, toJsWhere, turnBracketToParenthesis } from './where';
import { LineObject } from 'src/syntax/parser';
import Comment from 'src/parser/statements/Comment';

export function verifyIfStatement(line: string, lineNo: number) {
    if (!line.startsWith('if')) {
        throw new Error(JSON.stringify({
            msg: 'SyntaxError: "if" should be at the beginning of the line',
            lineNo: lineNo
        }));
    }
    if (line.match(/\b(if)\b/g)?.length != 1) {
        throw new Error(JSON.stringify({
            msg: 'SyntaxError: Duplicate identifier "if"',
            lineNo: lineNo
        }));
    }
    if (line.match(/\b(where)\b/g)?.length != null) {
        throw new Error(JSON.stringify({
            msg: 'SyntaxError: "where" keyword is not assignable to keyword "if"',
            lineNo: lineNo
        }));
    }
    verifyComparisonStatement(line, lineNo, 'if', lineNo);
}

export function parseIf(line: string, children?: LineObject[]): Statement {
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
    const statement = new Statement<If>('if', new If(conditions, body, comment));
    return statement;
}

export function toJsIf(statement: Statement<If>, level = 0) {
    const prevLevel = level > 0 ? (level - 1) * 4 : 0;
    const thisLevel = level * 4;
    const nextLevel = (level + 1) * 4;
    let result = ' '.repeat(prevLevel) + 'if (';
    result += toJsWhere(statement.expression.conditions);
    result += ') {';
    (statement.expression.body || []).forEach((child) => {
        result += '\n' + ' '.repeat(nextLevel) + child.toJs(level + 1);
    });
    result += '\n' + ' '.repeat(thisLevel) + '}';
    return result;
}