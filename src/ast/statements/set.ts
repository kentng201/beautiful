import { StatementObject } from '../StatementParser';
import { verifyFilterSyntax } from './assignment/filter';
import { verifyHttpSyntax } from './assignment/http';
import { verifyMapSyntax } from './assignment/map';
import { verifyNewSyntax } from './assignment/new';
import { verifyPickSyntax } from './assignment/pick';

export function verifySetStatement(line: string, lineNo: number) {
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
    if (words.length >= 3 && words[2] != 'to' && words[2] != 'from') {
        throw new Error(JSON.stringify({
            msg: 'SyntaxError: Missing identifier "to"/"from"',
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
    return new StatementObject<SetObject>('set', set);
}