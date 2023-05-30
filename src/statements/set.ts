import { isMainLeadingKeyword } from 'src/syntax/matcher';
import { verifyFilterSyntax } from './assignment/filter';
import { verifyHttpSyntax } from './assignment/http';
import { verifyMapSyntax } from './assignment/map';
import { verifyNewSyntax } from './assignment/new';
import { verifyPickSyntax } from './assignment/pick';
import Statement from 'src/parser/statements/Statement';
import { reserverdWords } from 'src/keywords';
import Set from 'src/parser/statements/Set';
import Comment from 'src/parser/statements/Comment';
import { LineObject } from 'src/syntax/parser';
import { SetStatement } from 'src/parser/statements/Set';

export function verifySetStatement(line: string, lineNo: number, nextLine?: string) {
    if (!line.startsWith('set')) {
        throw new Error(JSON.stringify({
            msg: 'SyntaxError: "set" should be at the beginning of the line',
            lineNo: lineNo
        }));
    }
    if (line.match(/\b(set)\b/g)?.length != 1) {
        throw new Error(JSON.stringify({
            msg: 'SyntaxError: Duplicate identifier "set"',
            lineNo: lineNo
        }));
    }
    const words = line.split(' ');
    const setKeywords = [
        'to', 'map', 'filter', 'reduce', 'sort', 'pick',
        'from', 'where', 'left join', 'right join', 'order by', 'find', 'page', 'per'
    ];
    const MISSING_KEYWORD = 'SyntaxError: "set" statement should have at least one keyword of the line:'
        + '\n"to", "from"';

    if (words.length >= 2 && reserverdWords.includes(words[1])) {
        throw new Error(JSON.stringify({
            msg: `SyntaxError: "${words[1]}" is a reserved keyword`,
            lineNo: lineNo
        }));
    }

    if (words.length == 2 && !nextLine) {
        throw new Error(JSON.stringify({
            msg: MISSING_KEYWORD,
            lineNo: lineNo
        }));
    }
    if (words.length == 2 && nextLine && isMainLeadingKeyword(nextLine)) {
        throw new Error(JSON.stringify({
            msg: MISSING_KEYWORD,
            lineNo: lineNo
        }));
    }
    if (words.length >= 3 && !setKeywords.includes(words[2]) && !setKeywords.includes(words[2] + ' ' + words[3])) {
        throw new Error(JSON.stringify({
            msg: MISSING_KEYWORD,
            lineNo: lineNo
        }));
    }
}

export class SetMethodObject {
    method: string;
    body: string;

    constructor(method: string, body: string) {
        this.method = method;
        this.body = body;
    }
}

export class SetObject {
    variableName: string;
    statement?: SetMethodObject;

    constructor(variableName: string, statement?: SetMethodObject) {
        this.variableName = variableName;
        this.statement = statement;
    }
}

export function verifySetSyntax(method: string, body: string) {
    if (method == 'map') {
        verifyMapSyntax(body);
    } else if (method == 'filter') {
        verifyFilterSyntax(body);
    } else if (method == 'reduce') {
        // verifyReduceSyntax(body);
    } else if (method == 'sort') {
        // verifySortSyntax(body);
    } else if (method == 'pick') {
        verifyPickSyntax(body);
    } else if (method == 'GET' || method == 'POST' || method == 'PUT' || method == 'DELETE') {
        verifyHttpSyntax(body);
    } else if (method == 'new') {
        verifyNewSyntax(body);
    }
}

function extractSetStatementToMethod(line: string) {
    let object, body = '';
    let [method] = line.split(' ');
    const rest = line.split(' ').slice(1);
    if (method == 'map' || method == 'filter' || method == 'reduce' || method == 'sort' || method == 'pick') {
        body = rest.join(' ');
    }
    if (method == 'GET' || method == 'POST' || method == 'PUT' || method == 'DELETE') {
        body = rest.join(' ');
    }
    if (method == 'new' || rest[0] == 'new') {
        method = 'new';
        body = line.split('new')[1].trim();
    }
    object = new SetMethodObject(method, body);
    verifySetSyntax(method, body);
    if (object && body) return object;

    line = line.replace(/\b(or)\b/g, '||');
    line = line.replace(/\b(and)\b/g, '&&');
    line = line.replace(/\b(mod)\b/g, '%');
    line = line.replace(/\b(power)\b/g, '**');
    line = line.replace(/\b(more than or equal)\b/g, '>=');
    line = line.replace(/\b(less than or equal)\b/g, '<=');
    line = line.replace(/\b(more than)\b/g, '>');
    line = line.replace(/\b(less than)\b/g, '<');
    line = line.replace(/\b(not full equal)\b/g, '!==');
    line = line.replace(/\b(full equal)\b/g, '===');
    line = line.replace(/\b(not equal)\b/g, '!=');
    line = line.replace(/\b(equal)\b/g, '==');
    line = line.replace(/\b(is an)\b/g, '~=');
    line = line.replace(/\b(is a)\b/g, '~=');
    line = line.replace(/\b(is)\b/g, '~=');

    let type;
    try {
        const mathVal = line;
        eval(mathVal);
        type = 'native';
    } catch (e) {
        type = 'variable';
    }

    object = new SetMethodObject(type, line);
    return object;
}

export function extractSetStatementToObject(line: string) {
    const words = line.split(' ');
    const expression = line.replace(`set ${words[1]} to`, '').trim();
    const setMethod = extractSetStatementToMethod(expression);
    const set = new SetObject(words[1], setMethod);
    return new Statement<SetObject>('set', set);
}

export function parseSet(line: string): Statement {
    const commentString = line.split(' .,')[1];
    let comment;
    let expression = line.replace('set ', '');
    if (commentString) {
        expression = line.replace(' .,' + commentString, '');
        comment = new Comment(commentString);
    }
    const variableName = expression.split(' ')[0];
    console.log('variableName: ', variableName);


    let type: 'to' | 'from' = 'to';
    let assign;
    if (expression.includes(' to ')) {
        type = 'to';
        expression = expression.replace(`${variableName} to`, '').trim();
        const obj = extractSetStatementToObject(expression);
        assign = new SetStatement('native', obj.expression.statement!.body, obj.expression.statement!.method);
        // assign = 
    } else if (expression.includes(' from ')) {
        type = 'from';
    }

    const statement = new Statement<Set>('set', new Set(variableName, type, assign, comment));
    return statement;
}

export function toJsSet(statement: Statement<Set>, level = 0) {
    const prevLevel = level > 0 ? (level - 1) * 4 : 0;
    const thisLevel = level * 4;
    const nextLevel = (level + 1) * 4;
    let result = ' '.repeat(thisLevel) + 'const ';
    const set = statement.expression;
    result += set.variableName + ' = ';
    if (set.type == 'to') {
        result += (set.assign as SetStatement).statement;
    }
    result += ';';
    if (statement.expression.comment) {
        result += '// ' + statement.expression.comment.content + '\n';
    }
    return result;
}