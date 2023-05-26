export function hasModelKeyword(line: string): boolean {
    return line.match(/\b(select|load|save|find|order|by|from|where|between|like|first|last)\b/) != null ||
    line.match(/\b(bigger|equal|smaller|than|between|like)\b/) != null;
}

// example: load users select username from User where username...ho... and (id..3 or id>3) or username...kentng201... left join a order by username;

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

export class  Join {
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
    modelName: string;
    fields: string[];
    orderBy: [string, 'asc' | 'desc'][];
    conditions: Condition[];
    join: Join[];
    firstOrLast: 'first' | 'last' | undefined;
    limit: number;
    offset: number;

    constructor(modelName: string, fields: string[], orderBy: [string, 'asc' | 'desc'][], conditions: Condition[], join: Join[], firstOrLast: 'first' | 'last' | undefined, limit: number, offset: number) {
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
export const modelKeywords = ['select', 'load', 'save', 'find', 'order', 'by', 'from', 'where', 'first', 'last', 'limit', 'offset'];
export type ModelKeyword = typeof modelKeywords[number];

export function parseSelect(selectWords: string[]): string[] {
    let line = selectWords.join(' ');
    return line.replace(/,\s*/g, ',').split(',');
}
export function parseCondition(conditionWords: string[]): Condition[] {
    const conditions: Condition[] = [];
    let currentCondition: Condition | undefined;
    let parentCondition: Condition | undefined;
    let currentOperator: string | undefined;
    let currentKey: string | undefined;

    let traceString = '0';

    for (const word of conditionWords) {
        if (word == '(') {
            traceString += '.0';
        } else if (word == ')') {
            let traces = traceString.split('.');
            traces.pop();
            traceString = traces.join('.');
        } else if (word == 'and' || word == 'or') {
            currentCondition = new Condition(word, '', '', '', []);
        } else if (currentCondition && currentOperator && currentKey) {
            currentCondition.value = word;

            if (!traceString.includes('.')) {
                conditions.push(currentCondition);
            } else {
                const traces = traceString.split('.');
                let currentTrace = traces[0];
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
            currentOperator = word;
            currentCondition.operator = word;
        } else if (currentCondition) {
            const wordIsString = word.match(/(\w+)\.\.\.(.*?)\.\.\./);
            if (wordIsString) {
                // currentCondition.key = wordIsString[1];
                // currentCondition.operator = '=';
                // currentCondition.value = wordIsString[2];
                // if (!traceString.includes('.')) {
                //     conditions.push(currentCondition);
                // } else {
                    
                // }
                currentKey = undefined;
                currentOperator = undefined;
                continue;
            } else {
                currentCondition.key = word;
                currentKey = word;
            }
        } else {
            currentCondition = new Condition('none', word, '', '', []);
            currentKey = word;
        }
    }
    return conditions;
}
export function parseOrderBy(orderByWords: string[]): [string, 'asc' | 'desc'][] {
    const line = orderByWords.join(' ');
    const orderByArray = line.replace(/\s+/g, ' ').replace(/\s*,\s*/g, ',').split(',');
    const orderBy: [string, 'asc' | 'desc'][] = [];
    for (const word of orderByArray) {
        const words = word.split(' ');
        if (words.length == 1) {
            orderBy.push([words[0], 'asc']);
        } else {
            orderBy.push([words[0], words[1] as 'asc' | 'desc']);
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

export default function parse(line: string) {
    if (hasModelKeyword(line)) {
        line = line.replace('bigger than', '>');
        line = line.replace('smaller than', '<');
        line = line.replace('bigger than or equal', '>=');
        line = line.replace('smaller than or equal', '<=');
        line = line.replace('equal', '=');
        
        let words = line.split(' ');
        let newWords: any[] = [];
        for (let i = 0; i < words.length; i++) {
            if (words[i].includes('(') || words[i].includes(')')) {
                const tempWords = breakParenthesis(words[i]);
                newWords = newWords.concat(tempWords);
            } else {
                newWords.push(words[i]);
            }
        }

        let currentKeyword: ModelKeyword | undefined;
        let currentBy: 'order' | 'group' | undefined;
        const selectWords: string[] = [];
        const conditionWords: string[] = [];
        const orderByWords: string[] = [];
        for (const word of newWords) {
            if (modelKeywords.includes(word.toLowerCase())) {
                currentKeyword = word.trim().toLowerCase() as ModelKeyword;
                if (currentKeyword == 'order') {
                    currentBy = 'order';
                } else if (currentKeyword == 'first') {
                    currentModel!.firstOrLast = 'first';
                } else if (currentKeyword == 'last') {
                    currentModel!.firstOrLast = 'last';
                }

                if (!currentModel) {
                    currentModel = new LoadModelQueryObject('', [], [], [], [], undefined, 0, 0);
                }
            } else if (!currentModel) {
                continue;
            } else {
                if (currentKeyword == 'from') {
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
                } else {
                }
            }
        }
        if (selectWords.length > 0) {
            currentModel!.fields = parseSelect(selectWords);
        }
        if (conditionWords.length > 0) {
            currentModel!.conditions = parseCondition(conditionWords);
        }
        if (orderByWords.length > 0) {
            currentModel!.orderBy = parseOrderBy(orderByWords);
        }
        return currentModel;
    }
}