import * as fs from 'fs';
import AstObject, { AttributeType } from './AstObject';
import FunctionObject from './FunctionObject';

const filePath: string = process.argv[2];

let mainObject: AstObject | undefined;
let currentParent: AstObject | undefined;

let functionObject: FunctionObject | undefined;
let currentVariable: string | undefined;
let keywordStack: string[] = [];

const isMultipleAttributeLine = (line: string) => {
    const attributes = line.match(/(?<!\.)\.(?!\.)\.(?!\.)/) || [];
    const stringPairs = line.match(/(\w+)\.\.\.(.*?)\.\.\./g) || [];
    if (attributes.length == 0 && stringPairs.length == 0) return false;
    return attributes.length + stringPairs.length > 1;
};

const isOneLiner = (line: string) => {
    const attributes = line.match(/(\.\.)/);
    const hasStartTag = line.startsWith('.') && !line.startsWith('.,');
    const hasEndTag = line.endsWith('.') && !line.endsWith('...');
    const hasAttributes = !!(attributes && attributes.length > 1);
    return hasAttributes && (hasStartTag || hasEndTag);
}

const seperateMultipleAttributeLine = (line: string): string[] => {
    const hasStartTag = line.startsWith('.') && !line.startsWith('.,');
    const hasEndTag = line.endsWith('.') && !line.endsWith('...');

    const tags = [];

    let startTag, endTag;
    if (hasStartTag) {
        startTag = line.match(/(\.\w+)/)![0];
        tags.push(startTag);
        line = line.replace(/(?<!\.)\.(\w+)/, '');
    }
    if (hasEndTag) {
        endTag = line.match(/(\w+\.)$/)![0];
        tags.push(endTag);
        line = line.replace(/\b\w+\.$/, '');
    }

    const strings = line.match(/(\w+)\.\.\.(.*?)\.\.\./g) || [];
    const booleans = line.match(/(\w+)\.\.\ ?\b(true|false)\b/g) || [];
    const numericFormula = line.match(/(\w+)\.\.\ ?\-?\b\d+(\.\d+)?\b(\/|\*|\+|\-)\b\d+(\.\d+)?\b/g) || [];

    const result = [];
    if (startTag) result.push(startTag);
    for (let i = 0; i < strings.length; i++) {
        result.push(strings[i]);
    }
    for (let i = 0; i < booleans.length; i++) {
        result.push(booleans[i]);
    }
    for (let i = 0; i < numericFormula.length; i++) {
        result.push(numericFormula[i]);
    }
    if (endTag) result.push(endTag);
    return result;
}

function getObject(line: string) {
    // is inside a function body
    if (!line.startsWith('.,') && (isMultipleAttributeLine(line) || isOneLiner(line))) {
        console.log('no', 0);
        const lines = seperateMultipleAttributeLine(line);
        console.log('preparing get object');
        for (let i = 0; i < lines.length; i++) {
            const output = getObject(lines[i]);
            console.log('output: ', output)
        }
        console.log('done get object');
        // is start of tag
    } else if (line.startsWith('.') && !line.startsWith('.,')) {
        console.log('line: ', line)
        console.log('no', 1);
        const tagName = line.replace('.', '');
        const newObject = new AstObject(tagName, {});
        if (currentParent) {
            currentParent.children.push(newObject);
            newObject.parent = currentParent; // Set parent of new object
        } else {
            mainObject = newObject;
        }
        currentParent = newObject;
    // is end of tag
    } else if (line.endsWith('.') && !line.endsWith('...')) {
        console.log('no', 2);
        if (currentParent && currentParent !== mainObject) {
            currentParent = currentParent.parent; // Move up to the parent object
        } else if (mainObject) {
            const newObject = mainObject;
            mainObject = undefined;
            currentParent = undefined;
            return newObject;
        } else {
            console.log('ignoring line:', line);
        }
    // is start of a class/function/keyword
    } else if (line.endsWith("{")) {
        console.log('no', 3);
        const isFunction = line.match(/(\([a-zA-Z0-9_, ]*\) (=>*) {)/) !== null;
        const isClass = line.match(/(class [a-zA-Z0-9_]* {)/) !== null;
        const isKeyword = line.match(/(if|else|for|while|switch|case)/) !== null;
        const [key, value] = line.trimStart().trimEnd().split('..').map(x => x.trim());
        if (isKeyword) {
            keywordStack.push(line);
            if (functionObject) {
                functionObject.body.push(line);
            }
        } if (isFunction) {
            const parameters = value
                .replace('{', '')
                .replace('}', '')
                .replace(')', '')
                .replace('(', '')
                .replace('=>', '')
                .replace('function', '')
                .trim()
                .split(',')
                .filter(param => param !== '')
                .map(param => [param.trim(), 'any'] as [string, string]);
            functionObject = new FunctionObject(key, parameters, []);
            currentVariable = key;

            if (line.endsWith('}')) {
                if (currentParent) {
                    currentParent.attributes[currentVariable] = ['function', functionObject];
                }
                functionObject = undefined;
            }
        }
    // is end of a class/function/keyword
    } else if (line.endsWith("}")) {
        console.log('no', 4);
        if (keywordStack.length > 0) {
            if (functionObject) {
                functionObject.body.push(line);
            }
            keywordStack.pop();
        } 
        else if (currentParent) {
            console.log('no', 5);
            if (functionObject) {
                currentParent.attributes[currentVariable!] = ['function', functionObject];
                functionObject = undefined;
            } else if (line.includes('=>')) {
                const [key, value] = line.trimStart().trimEnd().split('..').map(x => x.trim());
                console.log('func key, value: ', key, value)
                const parameters = value
                    .replace('{', '')
                    .replace('}', '')
                    .replace(')', '')
                    .replace('(', '')
                    .replace('=>', '')
                    .replace('function', '')
                    .trim()
                    .split(',')
                    .filter(param => param !== '')
                    .map(param => [param.trim(), 'any'] as [string, string]);
                const newFunctionObject = new FunctionObject(key, parameters, []);
                currentParent.attributes[key] = ['function', newFunctionObject];
            }
        }
    // is function body
    } else if (
        line.startsWith('const') || line.startsWith('let') ||
        line.includes('(') && line.includes(')') ||
        line.startsWith('//') ||
        line.startsWith('return')
    ) {
        console.log('no', 6);
        if (functionObject) {
            functionObject.body.push(line);
        }
    } else if (line.startsWith('.,')) {
        console.log('no', 7);
        if (currentParent) {
            const [key, value] = line.replace('.,', '').trimStart().trimEnd().split('..');
            currentParent.attributes[key] = ['comment', value.trim()];
        }
    } else if (line.includes('...')) {
        console.log('no', 8);
        const [key, ...rest] = line.trimStart().trimEnd().split('...');
        console.log('key, ...rest: ', key, ...rest)
        if (currentParent) {
            const value = rest.join('...').replace('...', '');
            currentParent.attributes[key] = ['string', value];
        }
    } else if (line.includes('..')) {
        console.log('no', 9);
        const [key, value] = line.trimStart().trimEnd().split('..');
        
        if (currentParent) {
            let type: AttributeType;
            try {
                const mathVal = value.replace('and', '&&').replace('or', '||');
                eval(mathVal);
                type = 'math';
            } catch (e) {
                type = 'variable';
            }
            currentParent.attributes[key] = [type, value.trim()];
        }
    } else {
        console.log('ignoring line:', line);
        return undefined;
    }

    return line;
}

fs.readFile(filePath, 'utf8', (err, data) => {
    const lines = data.split('\n');

    const ast: AstObject[] = [];

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        const result = getObject(line);
        if (result instanceof AstObject) {
            ast.push(result);
        }
    }

    for (const object of ast) {
        object.removeParentReference();
    }
    fs.writeFileSync('ast-result.test.json', JSON.stringify(ast, null, 4));
});