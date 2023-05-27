import { Condition } from './ModelQueryParser';
import { StatementKeyword, statementKeywords } from './reserved';
import { extractAssignStatementToObject, verifyAssignStatement } from './statements/assign';
import { extractElseStatementToObject, verifyElseStatement } from './statements/else';
import { extractEveryStatementToObject, verifyEveryStatement } from './statements/every';
import { extractForStatementToObject, verifyForStatement } from './statements/for';
import { extractArgumentsStringToObject, extractFuncStatementToObject, isArgument, verifyFuncStatement } from './statements/func';
import { extractIfStatementToObject, verifyIfStatement } from './statements/if';
import { extractLoopStatementToObject, verifyLoopStatement } from './statements/loop';
import { extractWhileStatementToObject, verifyWhileStatement } from './statements/while';


export class ArgumentObject {
    name: string;
    type?: string;
    constructor(name: string, type?: string) {
        this.name = name;
        this.type = type;
    }
}
export class StatementObject<T = any> {
    name: string = 'statement';
    keyword: StatementKeyword;
    expression: T;
    arguments?: ArgumentObject[];
    condition: Condition[] = [];
    body: (string | StatementObject<T>)[] = [];
    parent?: StatementObject<T>;

    constructor(keyword: StatementKeyword, expression: T, condition: Condition[] = [], body: (string | StatementObject<T>)[] = []) {
        this.keyword = keyword;
        this.expression = expression;
        this.condition = condition;
        this.body = body;
    }
    removeParentReference() {
        delete this.parent;
        this.body.forEach(child => child instanceof StatementObject ? child.removeParentReference() : '');
    }
}

export function verifyStatementSyntax(line: string) {
    if (line.includes('assign')) {
        verifyAssignStatement(line); return;
    }
    if (line.includes('func')) {
        verifyFuncStatement(line); return;
    }
    if (line.includes('every ')) {
        verifyEveryStatement(line); return;
    }
    if (line.includes('while ')) {
        verifyWhileStatement(line); return;
    }
    if (line.includes('for ')) {
        verifyForStatement(line); return;
    }
    if (line.includes('switch ')) {
        // verifySwitchStatement(line); return;
    }
    if (line.includes('loop ')) {
        verifyLoopStatement(line); return;
    }
    if (line.includes('else')) {
        verifyElseStatement(line); return;
    }
    if (line.includes('if ')) {
        verifyIfStatement(line); return;
    }
}

export function convertStatementToObject(line: string): StatementObject | undefined {
    // cleanup comments
    if (line.includes('.,')) {
        const lineWithComments = line.split('.,')[0];
        line = lineWithComments[0];
    }

    if (line.includes('assign')) {
        return extractAssignStatementToObject(line);
    }
    if (line.includes('func')) {
        return extractFuncStatementToObject(line);
    }
    if (line.includes('every ')) {
        return extractEveryStatementToObject(line);
    }
    if (line.includes('while ')) {
        return extractWhileStatementToObject(line);
    }
    if (line.includes('for ')) {
        return extractForStatementToObject(line);
    }
    if (line.includes('switch ')) {
        // return extractSwitchStatementToObject(line);
    }
    if (line.includes('loop ')) {
        return extractLoopStatementToObject(line);
    }
    if (line.includes('else')) {
        return extractElseStatementToObject(line);
    }
    if (line.includes('if ')) {
        return extractIfStatementToObject(line);
    }
    return undefined;
}

export let currentLineNo: number | undefined;
export const keywordLineNoStack: number[] = [];
export const spacingStack: number[] = [];
export let currentStatementObject: StatementObject | undefined;
export let parentStatementObject: StatementObject | undefined;
export const statements: StatementObject[] = [];
export function getStatements() {
    for (const object of statements) {
        object.removeParentReference();
    }
    return statements;
}

function isStatementKeyword(line: string) {
    return statementKeywords.includes(line.trim().split(' ')[0]);
}

export let lastFunctionObject: StatementObject | undefined;

export default function parse(line: string, lineNo: number) {
    currentLineNo = lineNo;
    if (line.trim().length === 0) {
        return;
    } else if (line.startsWith('.,')) {
        return;
    } else if (line.startsWith(' ') && line.trim().length > 0 && keywordLineNoStack.length > 0) {
        if (isStatementKeyword(line)) {
            lastFunctionObject = undefined;
            verifyStatementSyntax(line.trim());
            parentStatementObject = currentStatementObject;
            const result = convertStatementToObject(line.trim());
            if (result) {
                const leadingSpaces = line.indexOf(line.trim());
                if (spacingStack[spacingStack.length - 1] < leadingSpaces) {
                    spacingStack.push(line.indexOf(line.trim()));
                }
                currentStatementObject = result;
                currentStatementObject.parent = parentStatementObject;
                if (parentStatementObject) {
                    parentStatementObject.body.push(result);
                }
            } else {
                parentStatementObject = undefined;
            }
        } else if (lastFunctionObject && isArgument(line)) {
            const args = extractArgumentsStringToObject(line);
            if (lastFunctionObject.arguments) {
                for (const arg of args) {
                    lastFunctionObject.arguments.push(arg);
                }
            }
        } else {
            const leadingSpaces = line.indexOf(line.trim());
            if (spacingStack[spacingStack.length - 1] < leadingSpaces) {
                spacingStack.push(line.indexOf(line.trim()));
            }
            for (let i = 0; i < spacingStack.length; i++) {
                if (spacingStack[spacingStack.length - 1] > leadingSpaces) {
                    if (currentStatementObject && currentStatementObject.parent) {
                        spacingStack.pop();
                        currentStatementObject = currentStatementObject?.parent;
                        parentStatementObject = currentStatementObject?.parent;
                    }
                } else {
                    break;
                }
            }
            currentStatementObject?.body.push(line.trim());
        }
    } else if (isStatementKeyword(line)) {
        verifyStatementSyntax(line.trim());
        const result = convertStatementToObject(line.trim());
        if (result) {
            currentStatementObject = result;
            if (result.keyword === 'func') {
                lastFunctionObject = result;
            }
            keywordLineNoStack.push(lineNo);
            if (spacingStack.length == 0) {
                spacingStack.push(line.indexOf(line.trim()));
            }
            statements.push(result);
        }
    }
}