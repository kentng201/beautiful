import parseQuery, { Condition, LoadModelQueryObject, getCurrentModel, isModalQueryKeyword, isWhereStatement, parseCondition } from './ModelQueryParser';
import { StatementKeyword, statementKeywords } from '../keywords';
import { extractElseStatementToObject, verifyElseStatement } from './statements/else';
import { extractEveryStatementToObject, verifyEveryStatement } from './statements/every';
import { extractArgumentsStringToObject, extractFuncStatementToObject, isArgument, verifyFuncStatement } from './statements/func';
import { extractIfStatementToObject, verifyIfStatement } from './statements/if';
import { extractLoopStatementToObject, verifyLoopStatement } from './statements/loop';
import { extractSetStatementToObject, verifySetStatement } from './statements/set';
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
    conditions: Condition[] = [];
    body?: (string | StatementObject<T> | LoadModelQueryObject)[] = [];
    parent?: StatementObject<T>;

    constructor(keyword: StatementKeyword, expression: T, conditions: Condition[] = [], body: (string | StatementObject<T>)[] = []) {
        this.keyword = keyword;
        this.expression = expression;
        this.conditions = conditions;
        this.body = body;
    }
    removeParentReference() {
        delete this.parent;
        this.body?.forEach(child => child instanceof StatementObject ? child.removeParentReference() : '');
    }
}

export function verifyStatementSyntax(line: string) {
    if (line.includes('set')) {
        verifySetStatement(line); return;
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

export let lastKeyword: StatementKeyword | undefined;
export function convertStatementToObject(line: string): StatementObject | undefined {
    // cleanup comments
    if (line.includes('.,')) {
        const lineWithComments = line.split('.,')[0];
        line = lineWithComments[0];
    }

    if (line.includes('set')) {
        return extractSetStatementToObject(line);
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
export const statements: (StatementObject | LoadModelQueryObject)[] = [];
export function getStatements() {
    for (const object of statements) {
        if (object instanceof StatementObject) {
            object.removeParentReference();
        }
    }
    return statements;
}

function isStatementKeyword(line: string) {
    return statementKeywords.includes(line.trim().split(' ')[0]);
}

export let lastFunctionObject: StatementObject | undefined;

export default function parse(line: string, lineNo: number) {
    currentLineNo = lineNo;
    line = line.split('.,')[0]; // remove comments
    if (line.trim().length === 0) {
        return;
    } else if (line.startsWith('.,')) {
        return;
    } else if (isWhereStatement(line) && !isModalQueryKeyword(line) && lastKeyword != 'load') {
        if (line.match(/\b(where)\b/)) {
            line = line.split('where')[1];
        } else {
            line = line.replace(line.trim().split(' ')[0], '');
        }
        const conditions = parseCondition(line, false);
        if (currentStatementObject) {
            for (const condition of conditions) {
                currentStatementObject.conditions.push(condition);
            }
        }
        return;
    } else if (line.startsWith(' ') && line.trim().length > 0 && keywordLineNoStack.length > 0 && lastKeyword != 'load') {
        if (isStatementKeyword(line)) {
            lastFunctionObject = undefined;
            verifyStatementSyntax(line.trim());
            parentStatementObject = currentStatementObject;
            lastKeyword = line.trim().split(' ')[0] as StatementKeyword;
            const result = convertStatementToObject(line.trim());
            if (result) {
                const leadingSpaces = line.indexOf(line.trim());
                if (spacingStack[spacingStack.length - 1] < leadingSpaces) {
                    if (currentStatementObject && currentStatementObject.parent) {
                        spacingStack.push(line.indexOf(line.trim()));
                        if (currentStatementObject?.body && currentStatementObject?.body[currentStatementObject?.body.length - 1] instanceof StatementObject) {
                            currentStatementObject = currentStatementObject?.body[currentStatementObject?.body.length - 1] as StatementObject;
                            parentStatementObject = currentStatementObject?.parent;
                        }
                    }
                } else if (spacingStack[spacingStack.length - 1] > leadingSpaces) {
                    if (currentStatementObject && currentStatementObject.parent) {
                        spacingStack.pop();
                        currentStatementObject = currentStatementObject?.parent;
                        parentStatementObject = currentStatementObject?.parent;
                    }
                }
                if (!parentStatementObject) {
                    parentStatementObject = statements[statements.length - 1] as StatementObject;
                    while (parentStatementObject.body) {
                        const lastChild = parentStatementObject.body[parentStatementObject.body.length - 1];
                        if (lastChild instanceof StatementObject && lastChild.keyword != 'set') {
                            parentStatementObject = parentStatementObject.body[parentStatementObject.body.length - 1] as StatementObject;
                        } else {
                            break;
                        }
                    }
                }
                if (parentStatementObject) {
                    // if "set", treat it as normal statement, push out
                    if (parentStatementObject.keyword === 'set' && parentStatementObject.parent) {
                        parentStatementObject = parentStatementObject.parent;
                    }

                    currentStatementObject = result;
                    // if "set", delete the body so it cannot container child
                    if (currentStatementObject.keyword === 'set') {
                        delete currentStatementObject.body;
                    }
                    currentStatementObject.parent = parentStatementObject;
                    if (parentStatementObject.body) {
                        parentStatementObject.body.push(result);
                    }
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
            for (let i = 0; i < spacingStack.length; i++) {
                if (spacingStack[spacingStack.length - 1] == leadingSpaces) {
                    break;
                }
                if (spacingStack[spacingStack.length - 1] < leadingSpaces) {
                    if (currentStatementObject && currentStatementObject.parent && currentStatementObject.body) {
                        spacingStack.push(line.indexOf(line.trim()));
                        if (currentStatementObject?.body && currentStatementObject?.body[currentStatementObject?.body.length - 1] instanceof StatementObject) {
                            currentStatementObject = currentStatementObject?.body[currentStatementObject?.body.length - 1] as StatementObject;
                            parentStatementObject = currentStatementObject?.parent;
                        }
                    }
                } else if (spacingStack[spacingStack.length - 1] > leadingSpaces) {
                    if (currentStatementObject && currentStatementObject.parent) {
                        spacingStack.pop();
                        currentStatementObject = currentStatementObject?.parent;
                        parentStatementObject = currentStatementObject?.parent;
                    }
                }
            }
            if (!currentStatementObject?.body) {
                currentStatementObject = statements[statements.length - 1] as StatementObject;
                while (currentStatementObject.body) {
                    const lastChild = currentStatementObject.body[currentStatementObject.body.length - 1];
                    if (lastChild instanceof StatementObject && lastChild.keyword != 'set') {
                        currentStatementObject = currentStatementObject.body[currentStatementObject.body.length - 1] as StatementObject;
                        parentStatementObject = currentStatementObject?.parent;
                    } else {
                        break;
                    }
                }
            }
            if (currentStatementObject?.body) {
                if (line.trim().startsWith('load')) {
                    lastKeyword = 'load';
                    parseQuery(line.trim(), lineNo);
                    const model = getCurrentModel();
                    if (model) {
                        currentStatementObject?.body.push(model);
                    }

                } else {
                    currentStatementObject?.body.push(line.trim());
                }
            }
        }
    } else if ((lastKeyword == 'load' && getCurrentModel() && !statementKeywords.includes(line.trim().split(' ')[0])) || isModalQueryKeyword(line.trim())) {
        if (line.trim().startsWith('load')) {
            lastKeyword = 'load';
            parseQuery(line.trim(), lineNo);
            const model = getCurrentModel();
            if (model) {
                statements.push(model);
            }
        } else if (lastKeyword == 'load') {
            parseQuery(line.trim().trimStart(), lineNo);
        }
    } else if (isStatementKeyword(line)) {
        verifyStatementSyntax(line.trim());
        const result = convertStatementToObject(line.trim());
        lastKeyword = result?.keyword;
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