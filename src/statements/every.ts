import Statement from 'src/parser/statements/Statement';
import { reserverdWords } from '../keywords';
import { verifyComparisonStatement } from './comparison';
import { LineObject } from 'src/syntax/parser';
import Every from 'src/parser/statements/Every';
import { convertWhereToArrayInArray, parseInnerWhere, turnBracketToParenthesis } from './where';
import Condition from 'src/parser/statements/Condition';

export function verifyEveryStatement(line: string, lineNo: number) {
    if (!line.startsWith('every')) {
        throw new Error(JSON.stringify({
            msg: 'SyntaxError: "every" should be at the beginning of the line',
            lineNo: lineNo
        }));
    }
    if (line.match(/\b(every)\b/g)?.length != 1) {
        throw new Error(JSON.stringify({
            msg: 'SyntaxError: Duplicate identifier "every"',
            lineNo: lineNo
        }));
    }
    const words = line.split(' ');
    if (words.length >= 3 && words[2] != 'in') {
        throw new Error(JSON.stringify({
            msg: 'SyntaxError: Missing identifier "in"',
            lineNo: lineNo
        }));
    }
    if (words.length >= 5 && words[4] != 'where') {
        throw new Error(JSON.stringify({
            msg: 'SyntaxError: Missing identifier "where"',
            lineNo: lineNo
        }));
    }
    if (words.length < 4) {
        throw new Error(JSON.stringify({
            msg: `SyntaxError: Undefined variable for "${words[1]}"`,
            lineNo: lineNo
        }));
    }
    if (reserverdWords.includes(words[1])) {
        throw new Error(JSON.stringify({
            msg: `SyntaxError: "${words[1]}" is a reserved keyword`,
            lineNo: lineNo
        }));
    }
    verifyComparisonStatement(line, lineNo, 'every', lineNo);
}

export function parseEvery(line: string, children?: LineObject[]): Statement {
    const comment = line.split(' .,')[1];
    let expression = line.replace('if ', '');
    if (comment) {
        expression = line.replace(' .,' + comment, '');
    }
    const conditionString = expression.split(' where ')[1];
    let conditions: Condition[] = [];
    expression = expression.replace(' where ' + conditionString, '');
    if (conditionString) {
        const conditionStatements = convertWhereToArrayInArray(turnBracketToParenthesis(conditionString));
        conditions = parseInnerWhere(conditionStatements);
    }

    const variableName = expression.split(' in ')[0].replace('every ', '');
    const inName = expression.split(' in ')[1];

    const body = (children || [])
        .map((child) => child.toStatement())
        .filter((child) => child) as Statement[];

    const statement = new Statement<Every>('every', new Every(variableName, inName, conditions, body));
    return statement;
}

export function toJsEvery(statement: Statement<Every>, level = 0) {
    const prevLevel = level > 0 ? (level - 1) * 4 : 0;
    const thisLevel = level * 4;
    const nextLevel = (level + 1) * 4;
    let result = ' '.repeat(prevLevel) + 'for (const ' + statement.expression.variableName + ' of ' + statement.expression.inName + ') {';
    (statement.expression.body || []).forEach((child) => {
        result += '\n' + ' '.repeat(nextLevel) + child.toJs(level + 1);
    });
    result += '\n' + ' '.repeat(thisLevel) + '}';
    return result;
}
