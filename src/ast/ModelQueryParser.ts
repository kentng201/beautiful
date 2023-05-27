import { ModelKeyword, logicalOperatorKeywords, modelKeywords, operatorKeywords, reserverdWords } from './reserved';

export function hasModelKeyword(line: string): boolean {
    return (
        line.match(/\b(select|load|save|find|order|by|from|where|between|like|first|last|limit|offset|and|or)\b/) != null
        ||
        line.match(/\b(more|equal|less|than|between|like|and|or)\b/) != null
        ||
        line.match(/\b(join|left|right|inner)\b/) != null
    )
        && !line.startsWith('.');
}


export class Condition {
    join: 'and' | 'or' | 'none' | 'childrens';
    key: string;
    operator: string;
    value: string;
    children: Condition[];
    parent: Condition | undefined;

    constructor(join: 'and' | 'or' | 'none' | 'childrens', key: string, operator: string, value: string, children: Condition[]) {
        this.join = join;
        this.key = key;
        this.operator = operator;
        this.value = value;
        this.children = children;
    }
}

export class Join {
    type: 'left' | 'right' | 'inner';
    modelName: string;
    conditions: Condition[];

    constructor(type: 'left' | 'right' | 'inner', modelName: string, conditions: Condition[]) {
        this.type = type;
        this.modelName = modelName;
        this.conditions = conditions;
    }
}

export class LoadModelQueryObject {
    variableName: string;
    modelName: string;
    fields: string[];
    orderBy: [string, 'asc' | 'desc'][];
    conditions: Condition[];
    join: Join[];
    firstOrLast: 'first' | 'last' | undefined;
    limit: number;
    offset: number;

    constructor(variableName: string, modelName: string, fields: string[], orderBy: [string, 'asc' | 'desc'][], conditions: Condition[], join: Join[], firstOrLast: 'first' | 'last' | undefined, limit: number, offset: number) {
        this.variableName = variableName;
        this.modelName = modelName;
        this.fields = fields;
        this.orderBy = orderBy;
        this.conditions = conditions;
        this.join = join;
        this.firstOrLast = firstOrLast;
        this.limit = limit;
        this.offset = offset;
    }

}

export let currentModel: LoadModelQueryObject | null = null;
export function getCurrentModel() {
    return currentModel;
}
export const models: LoadModelQueryObject[] = [];
export function getModels() {
    return models;
}

export function parseSelect(selectWords: string[]): string[] {
    const line = selectWords.join(' ');
    return line.replace(/,\s*/g, ',').split(',');
}

let currentCondition: Condition | undefined;
let currentOperator: string | undefined;
let currentKey: string | undefined;
let traceString = '0';
export function parseCondition(line: string): Condition[] {
    line = line.replace('more than or equal', '>=');
    line = line.replace('less than or equal', '<=');
    line = line.replace('more than', '>');
    line = line.replace('less than', '<');
    line = line.replace('not full equal', '!==');
    line = line.replace('full equal', '===');
    line = line.replace('not equal', '!=');
    line = line.replace('equal', '=');

    const conditions: Condition[] = [];
    const words: string[] = line.split(' ');
    let newWords: any[] = [];
    for (let i = 0; i < words.length; i++) {
        if (words[i].includes('(') || words[i].includes(')')) {
            const tempWords = breakParenthesis(words[i]);
            newWords = newWords.concat(tempWords);
        } else if (words[i] != 'where') {
            newWords.push(words[i]);
        }
    }

    for (const word of newWords) {
        if (word == '(') {
            traceString += '.0';
        } else if (word == ')') {
            const traces = traceString.split('.');
            traces.pop();
            traceString = traces.join('.');
        } else if (word == 'and' || word == 'or') {
            currentCondition = new Condition(word, '', '', '', []);
            currentKey = undefined;
            currentOperator = undefined;
        } else if (currentCondition && currentOperator && currentKey) {
            currentCondition.value = word;

            if (!traceString.includes('.')) {
                conditions.push(currentCondition);
            } else {
                const traces = traceString.split('.');
                const currentTrace = traces[0];
                let currentConditionTrace = conditions[parseInt(currentTrace)];
                for (let i = 1; i < traces.length - 1; i++) {
                    currentConditionTrace = currentConditionTrace.children[currentConditionTrace.children.length - 1];
                }
                currentConditionTrace.children.push(currentCondition);
            }
            currentCondition = undefined;
            currentKey = undefined;
            currentOperator = undefined;
        } else if (currentCondition && currentKey) {
            if (!operatorKeywords.includes(word) && !logicalOperatorKeywords.includes(word)) {
                throw new Error(JSON.stringify({
                    msg: `SyntaxError: Unexpected identifier "${word}"`,
                    lineNo: undefined,
                }));
            }
            currentOperator = word;
            currentCondition.operator = word;
        } else if (currentCondition) {
            if (reserverdWords.includes(word)) {
                throw new Error(JSON.stringify({
                    msg: `SyntaxError: "${word}" is a reserved word`,
                    lineNo: undefined,
                }));
            }
            currentCondition.key = word;
            currentKey = word;
        } else {
            currentCondition = new Condition('none', word, '', '', []);
            currentKey = word;
        }
    }

    currentCondition = undefined;
    currentOperator = undefined;
    currentKey = undefined;
    traceString = '0';

    return conditions;
}
export function parseOrderBy(orderByWords: string[]): [string, 'asc' | 'desc'][] {
    const line = orderByWords.join(' ');
    const orderByArray = line.replace(/\s+/g, ' ').replace(/\s*,\s*/g, ',').split(',');
    const orderBy: [string, 'asc' | 'desc'][] = [];
    for (const word of orderByArray) {
        const words = word.split(' ');
        if (words.length == 1) {
            orderBy.push([words[0], 'asc',]);
        } else {
            orderBy.push([words[0], words[1] as 'asc' | 'desc',]);
        }
    }
    return orderBy;
}

function breakParenthesis(word: string) {
    const words = [];
    let currentWord = '';
    for (const char of word) {
        if (char == '(' || char == ')') {
            if (currentWord != '') {
                words.push(currentWord);
            }
            words.push(char);

        } else {
            currentWord += char;
        }
    }
    if (currentWord != '') {
        words.push(currentWord);
    }
    return words;
}

let currentKeyword: ModelKeyword | undefined;
let currentBy: 'order' | 'group' | undefined;
let currentUsedKeywords: ModelKeyword[] = [];
let selectWords: string[] = [];
let conditionWords: string[] = [];
let orderByWords: string[] = [];

let lastLoadLineNumber: number | undefined;

export default function parse(line: string, lineNo: number) {
    if (hasModelKeyword(line)) {
        if (line.startsWith('load')) {
            if (currentModel) {
                models.push(currentModel);
            }
            currentModel = new LoadModelQueryObject('', '', [], [], [], [], undefined, 0, 0);
            currentCondition = undefined;
            currentOperator = undefined;
            currentKey = undefined;
            traceString = '0';
            currentKeyword = undefined;
            currentBy = undefined;
            lastLoadLineNumber = lineNo;
            selectWords = [];
            conditionWords = [];
            orderByWords = [];
            currentUsedKeywords = [];
        }
        line = line.replace('more than or equal', '>=');
        line = line.replace('less than or equal', '<=');
        line = line.replace('more than', '>');
        line = line.replace('less than', '<');
        line = line.replace('not full equal', '!==');
        line = line.replace('full equal', '===');
        line = line.replace('not equal', '!=');
        line = line.replace('equal', '=');

        const words = line.split(' ');
        let newWords: any[] = [];
        for (let i = 0; i < words.length; i++) {
            if (words[i].includes('(') || words[i].includes(')')) {
                const tempWords = breakParenthesis(words[i]);
                newWords = newWords.concat(tempWords);
            } else {
                newWords.push(words[i]);
            }
        }

        for (const word of newWords) {
            if (modelKeywords.includes(word.toLowerCase())) {
                currentKeyword = word.trim().toLowerCase() as ModelKeyword;
                if (currentKeyword == 'order') {
                    currentBy = 'order';
                } else if (currentModel && currentKeyword == 'first') {
                    if (currentModel.firstOrLast == 'last') {
                        throw new Error(JSON.stringify({
                            msg: 'SyntaxError: "first" and "last" cannot be used together',
                            lineNo: undefined,
                        }));
                    }
                    currentModel.firstOrLast = 'first';
                } else if (currentModel && currentKeyword == 'last') {
                    if (currentModel.firstOrLast == 'first') {
                        throw new Error(JSON.stringify({
                            msg: 'SyntaxError: "first" and "last" cannot be used together',
                            lineNo: undefined,
                        }));
                    }
                    currentModel.firstOrLast = 'last';
                }
                if (currentUsedKeywords.includes(currentKeyword)) {
                    throw new Error(JSON.stringify({
                        msg: `SyntaxError: Duplicate identitfier "${currentKeyword}"`,
                        lineNo: undefined,
                    }));
                }
                currentUsedKeywords.push(currentKeyword);

                if (!currentModel) {
                    currentModel = new LoadModelQueryObject('', '', [], [], [], [], undefined, 0, 0);
                }
            } else if (!currentModel) {
                continue;
            } else {
                if (currentKeyword == 'load') {
                    currentModel.variableName = word;
                } else if (currentKeyword == 'from') {
                    currentModel.modelName = word;
                } else if (currentKeyword == 'select') {
                    selectWords.push(word);
                } else if (currentKeyword == 'find') {
                    currentModel.offset = 0;
                    currentModel.limit = 1;
                    currentModel.conditions.push(new Condition('none', '_id', '=', word, []));
                } else if (currentKeyword == 'limit') {
                    currentModel.limit = parseInt(word);
                } else if (currentKeyword == 'offset') {
                    currentModel.offset = parseInt(word);
                } else if (currentKeyword == 'by') {
                    if (currentBy == 'order') {
                        orderByWords.push(word);
                    }
                } else if (currentKeyword == 'where') {
                    conditionWords.push(word);
                }
            }
        }
        if (currentModel && selectWords.length > 0) {
            currentModel.fields = parseSelect(selectWords);
        }
        if (currentModel && conditionWords.length > 0) {
            currentModel.conditions = parseCondition(conditionWords.join(' '));
        }
        if (currentModel && orderByWords.length > 0) {
            currentModel.orderBy = parseOrderBy(orderByWords);
        }
        return currentModel;
    } else if (currentModel) {
        if (!currentModel.modelName) {
            throw new Error(JSON.stringify({
                msg: 'SyntaxError: load statement must have "from" keyword',
                lineNo: lastLoadLineNumber,
            }));
        }
        models.push(currentModel);
        currentModel = null;
    }
}