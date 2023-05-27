import { Condition, parseCondition } from "./ModelQueryParser";
import { extractIfStatementToObject, verifyIfStatement } from "./statements/if";

export let statementKeywords = ['if', 'else', 'when', 'for', 'every', 'switch', 'while', 'case', 'loop']
export type StatementKeyword = typeof statementKeywords[number];

export let loopControlKeywords = ['break', 'continue', 'return'];

export let logicaKeywords = ['and', 'or'];
export let operatorKeywords = ['==', '===', '>', '>=', '<', '<=', 'bigger than', 'smaller than', 'equal', 'full equal', 'between', 'like', 'is']

export let whereRegex = /where\s*\((.*)\)/;
export let expressionRegex = /(.*)\s*(==|===|>|>=|<|<=|bigger than|smaller than|equal|full equal|between|like|is)\s*(.*)/;

export class StatementObject {
    keyword: StatementKeyword;
    expression: string;
    condition: Condition[] = [];
    body: string[] = [];

    constructor(keyword: StatementKeyword, expression: string, condition: Condition[] = [], body: string[] = []) {
        this.keyword = keyword;
        this.expression = expression;
        this.condition = condition;
        this.body = body;
    }
}

export function verifyStatementSyntax(line: string) {
    if (line.includes('if ')) {
        verifyIfStatement(line);
    } else if (line.includes('else ')) {
        verifyElseStatement(line);
    } else if (line.includes('when ')) {
        // verifyWhenStatement(line);
    } else if (line.includes('for ')) {
        // verifyForStatement(line);
    } else if (line.includes('every ')) {
        // verifyEveryStatement(line);
    } else if (line.includes('switch ')) {
        // verifySwitchStatement(line);
    } else if (line.includes('while ')) {
        // verifyWhileStatement(line);
    } else if (line.includes('case ')) {
        // verifyCaseStatement(line);
    } else if (line.includes('loop ')) {
        // verifyLoopStatement(line);
    }
}

export function convertStatementToObject(line: string): StatementObject | undefined {
    if (line.includes('if ')) {
        return extractIfStatementToObject(line);
    }
    return undefined;
}

export let currentLineNo: number | undefined;
export let currentKeywordStackLineNo: number[] = [];
export let currentStatementObject: StatementObject | undefined;
export let statements: StatementObject[] = [];
export function getStatements() {
    return statements;
}

export default function parse(line: string, lineNo: number) {
    currentLineNo = lineNo;
    if (line.trim().length === 0) {
        return;
    } else if (line.startsWith('.,')) {
        return;
    } else if (statementKeywords.includes(line.trim().split(' ')[0])) {
        verifyStatementSyntax(line);
        const result = convertStatementToObject(line);
        if (result) {
            currentStatementObject = result;
            currentKeywordStackLineNo.push(lineNo);
            statements.push(result);
        }
    }
}