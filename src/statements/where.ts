import Condition, { Operator } from 'src/parser/statements/Condition';
import { verifyComparisonStatement } from './comparison';

export function verifyWhereStatement(line: string, lineNo: number, currentMainKeyword: string, currentMainLineNo: number) {
    if (!['loop', 'every', 'set'].includes(currentMainKeyword)) {
        throw new Error(JSON.stringify({
            msg: 'SyntaxError: "where" keyword is not assignable to keyword "' + currentMainKeyword + '"',
            lineNo: lineNo
        }));
    }
    if (line.match(/\b(where)\b/g)?.length != 1) {
        throw new Error(JSON.stringify({
            msg: 'SyntaxError: Duplicate identifier "where"',
            lineNo: lineNo
        }));
    }
    const words = line.split(' ');
    if (words.length >= 1 && words[0] != 'where') {
        throw new Error(JSON.stringify({
            msg: 'SyntaxError: "where" should be at the beginning of the line',
            lineNo: lineNo
        }));
    }
    if (words.length >= 2) {
        verifyComparisonStatement(words.slice(1).join(' '), lineNo, 'where', currentMainLineNo);
    }
}

export function parseWhere(line: string): Condition[] {
    const expression = line.replace('where ', '');
    let conditionStrings = expression.split(' and ');
    conditionStrings = conditionStrings.map((condition, index) => {
        if (index == conditionStrings.length - 1) {
            return [condition];
        }
        return [condition, 'and'];
    }).flat();

    // split by 'or' keyword
    conditionStrings = conditionStrings.map((condition) => {
        const newConditions = condition.split(' or ');
        const resultConditions: string[][] = [];
        for (let i = 0; i <= newConditions.length - 1; i++) {
            if (i == conditionStrings.length - 1) {
                resultConditions[i] = [newConditions[i]];
            } else {
                resultConditions[i] = [newConditions[i], 'or'];
            }
        }
        return resultConditions.flat();
    }).flat();


    const conditions: Condition[] = [];
    for (let i = 0; i <= conditionStrings.length - 1; i++) {
        conditionStrings[i] = conditionStrings[i].trim()
            .replace(/\b(and)\b/g, '&&')
            .replace(/\b(or)\b/g, '||')
            .replace(/\b(mod)\b/g, '%')
            .replace(/\b(more than or equal)\b/g, '>=')
            .replace(/\b(less than or equal)\b/g, '<=')
            .replace(/\b(more than)\b/g, '>')
            .replace(/\b(less than)\b/g, '<')
            .replace(/\b(not full equal)\b/g, '!==')
            .replace(/\b(full equal)\b/g, '===')
            .replace(/\b(not equal)\b/g, '!=')
            .replace(/\b(equal)\b/g, '==')
            .replace(/\b(is an)\b/g, '~=')
            .replace(/\b(is a)\b/g, '~=')
            .replace(/\b(is)\b/g, '~=');
        const condition = new Condition();
        let expression: string[] | undefined;
        let operator: string | undefined;
        if (conditionStrings[i].includes('===')) {
            expression = conditionStrings[i].split('===');
            operator = '===';
        } else if (conditionStrings[i].includes('!==')) {
            expression = conditionStrings[i].split('!==');
            operator = '!==';
        } else if (conditionStrings[i].includes('==')) {
            expression = conditionStrings[i].split('==');
            operator = '==';
        } else if (conditionStrings[i].includes('!=')) {
            expression = conditionStrings[i].split('!=');
            operator = '!=';
        } else if (conditionStrings[i].includes('>=')) {
            expression = conditionStrings[i].split('>=');
            operator = '>=';
        } else if (conditionStrings[i].includes('<=')) {
            expression = conditionStrings[i].split('<=');
            operator = '<=';
        } else if (conditionStrings[i].includes('>')) {
            expression = conditionStrings[i].split('>');
            operator = '>';
        } else if (conditionStrings[i].includes('<')) {
            expression = conditionStrings[i].split('<');
            operator = '<';
        } else if (conditionStrings[i].includes('~=')) {
            expression = conditionStrings[i].split('~=');
            operator = '~=';
        }
        condition.statement = {
            key: (expression || [])[0],
            operator: operator as Operator,
            value: (expression || [])[1]
        };

        conditions.push(condition);
    }
    return conditions;
}