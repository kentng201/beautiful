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
    let conditionStrings: string[];
    if (expression.match(/\b(and)\b/g)) {
        conditionStrings = expression.replace(/\b(and)\b/g, '&&').split('&&');
    } else {
        conditionStrings = [expression];
    }
    conditionStrings = conditionStrings.map((str, strIndex) => {
        const newStrings: string[] = [];
        if (str.match(/\b(or)\b/g)) {
            const strings = str.replace(/\b(or)\b/g, '||').split('||');
            for (let i = 0; i <= strings.length - 1; i++) {
                if (i != 0) {
                    newStrings.push('||');
                }
                newStrings.push(strings[i].trim());
            }
        } else {
            newStrings.push(str);
        }
        if (strIndex != 0) {
            return ['&&'].concat(newStrings);
        }
        return newStrings;
    }).flat(1);

    const conditions: Condition[] = [];
    console.log('conditionStrings: ', conditionStrings);
    let condition: Condition | undefined = new Condition();
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
        } else {
            expression = [conditionStrings[i]];
        }
        if ((expression || [])[0] == '&&') {
            condition = new Condition();
            condition.join = 'and';
        } else if ((expression || [])[0] == '||') {
            condition = new Condition();
            condition.join = 'or';
        } else if (condition) {
            condition.statement = {
                key: (expression || [])[0],
                operator: operator as Operator,
                value: (expression || [])[1]
            };
            conditions.push(condition);
            condition = undefined;
        }
    }
    return conditions;
}