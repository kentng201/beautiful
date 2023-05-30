import Else from 'src/parser/statements/Else';
import Statement from 'src/parser/statements/Statement';
import { LineObject } from 'src/syntax/parser';
import { convertWhereToArrayInArray, parseInnerWhere, turnBracketToParenthesis } from './where';

export function verifyElseStatement(line: string, lineNo: number) {
    if (!line.startsWith('else')) {
        throw new Error(JSON.stringify({
            msg: 'SyntaxError: "else" should be at the beginning of the line',
            lineNo: lineNo
        }));
    }
    if (line.match(/\b(else)\b/g)?.length != 1) {
        throw new Error(JSON.stringify({
            msg: 'SyntaxError: it should have only one "else" keyword',
            lineNo: lineNo
        }));
    }
    if (line.match(/\b(if)\b/g)?.length != null) {
        throw new Error(JSON.stringify({
            msg: 'SyntaxError: "if" keyword is not assignable to keyword "else"',
            lineNo: lineNo
        }));
    }
    if (line.match(/\b(where)\b/g)?.length != null) {
        throw new Error(JSON.stringify({
            msg: 'SyntaxError: "where" keyword is not assignable to keyword "else"',
            lineNo: lineNo
        }));
    }
}



export function parseElse(line: string, children?: LineObject[]): Statement {
    const comment = line.split(' .,')[1];
    let expression = line.replace('else ', '');
    if (comment) {
        expression = line.replace(' .,' + comment, '');
    }
    const conditionStatements = convertWhereToArrayInArray(turnBracketToParenthesis(expression));
    let conditions;
    if (conditionStatements) {
        conditions = parseInnerWhere(conditionStatements);
    }
    const body = (children || [])
        .map((child) => child.toStatement())
        .filter((child) => child) as Statement[];
    const statement = new Statement<Else>('else', new Else(conditions, body));
    return statement;
}