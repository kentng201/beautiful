export const operatorKeywords = ['more than', 'less than', 'equal', 'not equal', 'full equal', 'not full equal', 'more than or equal', 'less than or equal', 'is a', 'is an', 'is', 'a', 'an'];
export const logicalOperatorKeywords = ['>=', '<=', '>', '<', '===', '!==', '!=', '=', '~=', 'like', 'between'];

export const arithemticOperatorKeywords = ['add', 'minus', 'multiply', 'divide', 'mod', 'power'];
export const logicalArtihmeticOperatorKeywords = ['+', '-', '*', '/', '%', '**', '++', '--'];

export const assignKeywords = ['via'];

export const statementKeywords = ['if', 'else', 'for', 'every', 'switch', 'while', 'loop', 'assign', 'func'];
export type StatementKeyword = typeof statementKeywords[number];

export const statementControlKeywords = ['in', 'as'];
export const httpKeywords = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS', 'HEAD', 'TRACE', 'CONNECT'];

export const loopControlKeywords = ['break', 'continue', 'return'];

export const logicaKeywords = ['and', 'or'];

export const whereRegex = /where\s*\((.*)\)/;
export const expressionRegex = /(.*)\s*(==|===|>|>=|<|<=|more than|less than|equal|full equal|between|like|is)\s*(.*)/;


export const modelKeywords = ['select', 'load', 'save', 'find', 'order', 'by', 'from', 'where', 'first', 'last', 'limit', 'offset'];
export type ModelKeyword = typeof modelKeywords[number];

export const reserverdWords = ([] as string[]).concat(
    statementKeywords,
    statementControlKeywords,
    httpKeywords,
    modelKeywords,
    assignKeywords,
    loopControlKeywords,
    logicaKeywords,
    operatorKeywords
);