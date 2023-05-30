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

export function turnBracketToParenthesis(line: string): string[] {
    if (!line.includes('(') && !line.includes(')')) {
        return [line];
    }
    const newLines: string[] = [];
    let newLineIndex = 0;
    let bracketCount = 0;
    for (let i = 0; i <= line.length - 1; i++) {
        if (line[i] == '(') {
            bracketCount++;
            if (bracketCount == 1) {
                newLines.push(line.slice(newLineIndex, i).trim());
                newLineIndex = i + 1;
            }
        } else if (line[i] == ')') {
            bracketCount--;
            if (bracketCount == 0) {
                newLines.push(line.slice(newLineIndex, i).trim());
                newLineIndex = i + 1;
            }
        }
    }
    if (newLineIndex != line.length) {
        newLines.push(line.slice(newLineIndex).trim());
    }
    return newLines;
}

export function convertWhereToArrayInArray(lines: string[]): any[] {
    const newLines: any[] = [];
    for (let i = 0; i <= lines.length - 1; i++) {
        if (lines[i].includes('(') || lines[i].includes(')')) {
            newLines.push(convertWhereToArrayInArray(turnBracketToParenthesis(lines[i])));
        } else {
            newLines.push(lines[i]);
        }
    }
    return newLines;
}

export function parseInnerWhere(lines: any[]): Condition[] {
    const result: Condition[] = [];
    for (const line of lines) {
        if (typeof line === 'string') {
            const items = parseWhere(line);
            for (let i = 0; i <= items.length - 1; i++) {
                if (i != 0 && !items[i].join && items[i].children.length == 0) {
                    continue;
                }
                result.push(items[i]);
            }
        } else if (Array.isArray(line)) {
            const output = parseInnerWhere(line);
            const children: Condition[] = [];
            for (let i = 0; i <= output.length - 1; i++) {
                const item = output[i];
                if (i != 0 && !item.join && item.children.length == 0) {
                    continue;
                }
                children.push(item);
            }
            result[result.length - 1].children = children;
        }
    }
    return result;
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
                key: ((expression || [])[0] || '').trim(),
                operator: operator as Operator,
                value: ((expression || [])[1] || '').trim()
            };
            conditions.push(condition);
            condition = undefined;
        }
    }
    return conditions;
}

export function toJsWhere(conditions: Condition[]) {
    let result = '';
    conditions.forEach((condition, index) => {
        if (index > 0) {
            const join = condition.join == 'and' ? '&&' : '||';
            result += ' ' + join + ' ';
        }
        if (condition.statement && condition.statement.key && condition.statement.operator && condition.statement.value) {
            result += condition.statement?.key + ' ' + condition.statement?.operator + ' ' + condition.statement?.value;
        } else if (condition.children) {
            result += '(';
            result += toJsWhere(condition.children);
            result += ')';
        }
    });
    return result;
}