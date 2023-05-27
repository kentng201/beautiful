export const operatorKeywords = ['more than', 'less than', 'equal', 'not equal', 'full equal', 'not full equal', 'more than or equal', 'less than or equal', 'is a', 'is an', 'is',];
export const logicalOperatorKeywords = ['>=', '<=', '>', '<', '===', '!==', '!=', '=', '~=', 'like', 'between',];

export const arithemticOperatorKeywords = ['add', 'minus', 'multiply', 'divide', 'mod', 'power',];
export const logicalArtihmeticOperatorKeywords = ['+', '-', '*', '/', '%', '**', '++', '--',];

export const statementKeywords = ['if', 'else', 'for', 'every', 'switch', 'while', 'loop',];
export type StatementKeyword = typeof statementKeywords[number];

export const loopControlKeywords = ['break', 'continue', 'return',];
export const expressionKeywords = ['where', 'select', 'from', 'order by', 'group by', 'having', 'limit', 'offset', 'distinct', 'as', 'in', 'not in', 'exists', 'not exists', 'between', 'like', 'is', 'is not', 'null', 'not null', 'union', 'union all', 'intersect', 'except', 'case', 'when', 'then', 'else', 'end', 'cast', 'as', 'coalesce', 'nullif', 'in', 'not in', 'exists', 'not exists', 'between', 'like', 'is', 'is not', 'null', 'not null', 'union', 'union all', 'intersect', 'except', 'case', 'when', 'then', 'else', 'end', 'cast', 'as', 'coalesce', 'nullif',];

export const logicaKeywords = ['and', 'or',];

export const whereRegex = /where\s*\((.*)\)/;
export const expressionRegex = /(.*)\s*(==|===|>|>=|<|<=|more than|less than|equal|full equal|between|like|is)\s*(.*)/;


export const modelKeywords = ['select', 'load', 'save', 'find', 'order', 'by', 'from', 'where', 'first', 'last', 'limit', 'offset',];
export type ModelKeyword = typeof modelKeywords[number];

export const reserverdWords = ([] as string[])
    .concat(statementKeywords)
    .concat(modelKeywords)
    .concat(loopControlKeywords)
    .concat(expressionKeywords)
    .concat(logicaKeywords)
    .concat(operatorKeywords);