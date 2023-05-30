import Statement from 'src/parser/statements/Statement';
import { reserverdWords } from '../keywords';
import { verifyComparisonStatement } from './comparison';
import { LineObject } from 'src/syntax/parser';
import Loop from 'src/parser/statements/Loop';
import Condition from 'src/parser/statements/Condition';
import { convertWhereToArrayInArray, parseInnerWhere, turnBracketToParenthesis } from './where';
import Comment from 'src/parser/statements/Comment';

export function verifyLoopStatement(line: string, lineNo: number) {
    if (!line.startsWith('loop')) {
        throw new Error(JSON.stringify({
            msg: 'SyntaxError: "loop" should be at the beginning of the line',
            lineNo: lineNo
        }));
    }
    if (line.match(/\b(loop)\b/g)?.length != 1) {
        throw new Error(JSON.stringify({
            msg: 'SyntaxError: Duplicate identifier "loop"',
            lineNo: lineNo
        }));
    }
    const words = line.split(' ');
    if (words.length >= 3 && words[2] != 'times') {
        throw new Error(JSON.stringify({
            msg: 'SyntaxError: Missing identifier "times"',
            lineNo: lineNo
        }));
    }
    if (words.length >= 4 && words[3] != 'as') {
        throw new Error(JSON.stringify({
            msg: 'SyntaxError: Missing identifier "as"',
            lineNo: lineNo
        }));
    }
    if (words.length >= 5 && reserverdWords.includes(words[4])) {
        throw new Error(JSON.stringify({
            msg: `SyntaxError: "${words[4]}" is a reserved keyword`,
            lineNo: lineNo
        }));
    }
    if (words.length >= 6 && words[5] != 'where') {
        throw new Error(JSON.stringify({
            msg: 'SyntaxError: Missing identifier "where"',
            lineNo: lineNo
        }));
    }
    verifyComparisonStatement(line, lineNo, 'loop', lineNo);
}

export function parseLoop(line: string, children?: LineObject[]): Statement {
    const commentString = line.split(' .,')[1];
    let comment;
    let expression = line.replace('if ', '');
    if (commentString) {
        expression = line.replace(' .,' + commentString, '');
        comment = new Comment(commentString);
    }
    const conditionString = expression.split(' where ')[1];
    let conditions: Condition[] = [];
    expression = expression.replace(' where ' + conditionString, '');
    if (conditionString) {
        const conditionStatements = convertWhereToArrayInArray(turnBracketToParenthesis(conditionString));
        conditions = parseInnerWhere(conditionStatements);
    }

    const variableName = expression.split(' as ')[0].replace('loop ', '').replace(' times', '');
    const asName = expression.split(' as ')[1];

    const body = (children || [])
        .map((child) => child.toStatement())
        .filter((child) => child) as Statement[];

    const statement = new Statement<Loop>('loop', new Loop(variableName, asName, conditions, body, comment));
    return statement;
}

export function toJsLoop(statement: Statement<Loop>, level = 0) {
    const prevLevel = level > 0 ? (level - 1) * 4 : 0;
    const thisLevel = level * 4;
    const nextLevel = (level + 1) * 4;
    let result = ' '.repeat(prevLevel) + 'for (let ';
    result += statement.expression.asName;
    result += ' = 0; ';
    result += statement.expression.asName;
    result += ' < ';
    result += statement.expression.variableName;
    result += '; ';
    result += statement.expression.asName;
    result += '++) {';
    (statement.expression.body || []).forEach((child) => {
        result += '\n' + ' '.repeat(nextLevel) + child.toJs(level + 1);
    });
    result += '\n' + ' '.repeat(thisLevel) + '}';
    return result;
}
