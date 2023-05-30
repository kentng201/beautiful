import Statement from 'src/parser/statements/Statement';
import { verifyComparisonStatement } from './comparison';
import If from 'src/parser/statements/If';
import { parseWhere } from './where';

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

export function parseIf(line: string): Statement {
    const comment = line.split(' .,')[1];
    let expression = line.replace('if ', '');
    if (comment) {
        expression = line.replace(' .,' + comment, '');
    }
    const conditions = parseWhere(expression);
    const statement = new Statement<If>('if', new If(conditions, []));
    return statement;
}