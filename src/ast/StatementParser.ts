import { Condition } from './ModelQueryParser';
import { extractElseStatementToObject, verifyElseStatement } from './statements/else';
import { extractEveryStatementToObject, verifyEveryStatement } from './statements/every';
import { extractForStatementToObject, verifyForStatement } from './statements/for';
import { extractIfStatementToObject, verifyIfStatement } from './statements/if';
import { extractWhileStatementToObject, verifyWhileStatement } from './statements/while';

export const statementKeywords = ['if', 'else', 'for', 'every', 'switch', 'while', 'loop',];
export type StatementKeyword = typeof statementKeywords[number];

export const loopControlKeywords = ['break', 'continue', 'return',];
export const expressionKeywords = ['where', 'select', 'from', 'order by', 'group by', 'having', 'limit', 'offset', 'distinct', 'as', 'in', 'not in', 'exists', 'not exists', 'between', 'like', 'is', 'is not', 'null', 'not null', 'union', 'union all', 'intersect', 'except', 'case', 'when', 'then', 'else', 'end', 'cast', 'as', 'coalesce', 'nullif', 'in', 'not in', 'exists', 'not exists', 'between', 'like', 'is', 'is not', 'null', 'not null', 'union', 'union all', 'intersect', 'except', 'case', 'when', 'then', 'else', 'end', 'cast', 'as', 'coalesce', 'nullif',];

export const logicaKeywords = ['and', 'or',];
export const operatorKeywords = ['==', '===', '>', '>=', '<', '<=', 'more than', 'less than', 'equal', 'full equal', 'between', 'like', 'is',];

export const whereRegex = /where\s*\((.*)\)/;
export const expressionRegex = /(.*)\s*(==|===|>|>=|<|<=|more than|less than|equal|full equal|between|like|is)\s*(.*)/;

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
    if (line.includes('every ')) {
        verifyEveryStatement(line); return;
    }
    if (line.includes('while ')) {
        verifyWhileStatement(line); return;
    }
    if (line.includes('for ')) {
        verifyForStatement(line); return;
    }
    if (line.includes('else')) {
        verifyElseStatement(line); return;
    }
    if (line.includes('if ')) {
        verifyIfStatement(line); return;
    }
    if (line.includes('switch ')) {
        // verifySwitchStatement(line); return;
    }
    if (line.includes('loop ')) {
        // verifyLoopStatement(line); return;
    }
}

export function convertStatementToObject(line: string): StatementObject | undefined {
    if (line.includes('every ')) {
        return extractEveryStatementToObject(line);
    }
    if (line.includes('while ')) {
        return extractWhileStatementToObject(line);
    }
    if (line.includes('else')) {
        return extractElseStatementToObject(line);
    }
    if (line.includes('if ')) {
        return extractIfStatementToObject(line);
    }
    if (line.includes('else')) {
        return extractElseStatementToObject(line);
    }
    if (line.includes('for ')) {
        return extractForStatementToObject(line);
    }
    if (line.includes('switch ')) {
        // return extractSwitchStatementToObject(line);
    }
    if (line.includes('loop ')) {
        // return extractLoopStatementToObject(line);
    }

    return undefined;
}

export let currentLineNo: number | undefined;
export const currentKeywordStackLineNo: number[] = [];
export let currentStatementObject: StatementObject | undefined;
export const statements: StatementObject[] = [];
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