export const operatorKeywords = ['more than', 'less than', 'equal', 'not equal', 'full equal', 'not full equal', 'more than or equal', 'less than or equal', 'is a', 'is an', 'is', 'a', 'an'];
export const logicalOperatorKeywords = ['>=', '<=', '>', '<', '===', '!==', '!=', '==', '~=', 'like', 'between'];

export const arithemticOperatorKeywords = ['add', 'minus', 'multiply', 'divide', 'mod', 'power'];
export const logicalArtihmeticOperatorKeywords = ['+', '-', '*', '/', '%', '**', '++', '--'];

export const assignKeywords = ['func', 'set', 'select', 'as', 'find', 'from', 'where', 'left join', 'right join', 'inner join', 'outer join', 'join', 'order by', 'group by', 'having', 'between', 'page', 'of', 'first one', 'last one'];

export const statementKeywords = ['if', 'else', 'every', 'while', 'loop'];
export type StatementKeyword = typeof statementKeywords[number];

export const statementControlKeywords = ['in', 'as'];
export const httpKeywords = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS', 'HEAD', 'TRACE', 'CONNECT'];

export const loopControlKeywords = ['stop', 'continue', 'return'];

export const logicalKeywords = ['and', 'or'];
export const logicalLogicalKeywords = ['&&', '||'];

export const whereRegex = /where\s*\((.*)\)/;
export const expressionRegex = /(.*)\s*(==|===|>|>=|<|<=|more than|less than|equal|full equal|between|like|is)\s*(.*)/;

export const dataTypeKeywords = ['string', 'number', 'boolean', 'object', 'array', 'null', 'undefined', 'decimal', 'int', 'collection'];

export type ModelKeyword = typeof assignKeywords[number];

export const reserverdWords = ([] as string[]).concat(
    statementKeywords,
    statementControlKeywords,
    httpKeywords,
    assignKeywords,
    loopControlKeywords,
    logicalKeywords,
    operatorKeywords
);