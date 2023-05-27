import { StatementObject } from '../StatementParser';

export function verifyAssignStatement(line: string) {
    if (!line.startsWith('assign')) {
        throw new Error(JSON.stringify({
            msg: 'SyntaxError: "assign" should be at the beginning of the line',
            lineNo: undefined
        }));
    }
    if (line.match(/\b(assign)\b/g)?.length != 1) {
        throw new Error(JSON.stringify({
            msg: 'SyntaxError: Duplicate identifier "assign"',
            lineNo: undefined
        }));
    }
    const words = line.split(' ');
    if (words.length >= 3 && words[2] != 'via') {
        throw new Error(JSON.stringify({
            msg: 'SyntaxError: Missing identifier "via"',
            lineNo: undefined
        }));
    }
}

class AssignMethodObject {
    method: string;
    body: string;

    constructor(method: string, body: string) {
        this.method = method;
        this.body = body;
    }
}

class AssignObject {
    name = 'assign';
    variableName: string;
    statement?: AssignMethodObject;

    constructor(variableName: string, statement?: AssignMethodObject) {
        this.variableName = variableName;
        this.statement = statement;
    }
}

export function extractAssignStatementToMethod(line: string) {
    const [method, ...rest] = line.split(' ');
    if (method == 'map' || method == 'filter' || method == 'reduce' || method == 'sort' || method == 'pick') {
        const object = new AssignMethodObject(method, rest.join(' '));
        return object;
    }
    if (method == 'GET' || method == 'POST' || method == 'PUT' || method == 'DELETE') {
        const object = new AssignMethodObject(method, rest.join(' '));
        return object;
    }
    if (method == 'new' || rest[0] == 'new') {
        const object = new AssignMethodObject('new', line.split('new')[1].trim());
        return object;
    }

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
        type = 'math';
    } catch (e) {
        type = 'variable';
    }

    const object = new AssignMethodObject(type, line);
    return object;
}

export function extractAssignStatementToObject(line: string) {
    const words = line.split(' ');
    const expression = line.replace(`assign ${words[1]} via`, '').trim();
    const assignMethod = extractAssignStatementToMethod(expression);
    const assign = new AssignObject(words[1], assignMethod);
    return new StatementObject<AssignObject>('assign', assign);
}