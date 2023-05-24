import * as fs from 'fs';
import AstObject, { AttributeType } from './AstObject';
import FunctionObject from './FunctionObject';

const filePath: string = process.argv[2];

let mainObject: AstObject | undefined;
let currentParent: AstObject | undefined;

let functionObject: FunctionObject | undefined;
let currentVariable: string | undefined;
let keywordStack: string[] = [];

function getObject(line: string) {
    if (line.startsWith('.')) {
        const tagName = line.replace('.', '');
        const newObject = new AstObject(tagName, {});
        if (currentParent) {
            currentParent.children.push(newObject);
            newObject.parent = currentParent; // Set parent of new object
        } else {
            mainObject = newObject;
        }
        currentParent = newObject;
    } else if (line.endsWith('.') && !line.includes(' ')) {
        if (currentParent && currentParent !== mainObject) {
            currentParent = currentParent.parent; // Move up to the parent object
        } else {
            const newObject = mainObject;
            mainObject = undefined;
            currentParent = undefined;
            return newObject;
        }
    } else if (line.endsWith("{")) {
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
                .replace(')', '')
                .replace('(', '')
                .replace('=>', '')
                .replace('function', '')
                .trim()
                .split(',')
                .map(param => [param.trim(), 'any'] as [string, string]);
            functionObject = new FunctionObject(key, parameters, []);
            currentVariable = key;
        }
    } else if (line.endsWith("}")) {
        if (keywordStack.length > 0) {
            if (functionObject) {
                functionObject.body.push(line);
            }
            keywordStack.pop();
        } else if (currentParent) {
            currentParent.attributes[currentVariable!] = ['function', functionObject!];
            functionObject = undefined;
        }
    // is function body
    } else if (
        line.startsWith('const') || line.startsWith('let') ||
        line.includes('(') && line.includes(')') ||
        line.startsWith('//') ||
        line.startsWith('return')
    ) {
        
        if (functionObject) {
            functionObject.body.push(line);
        }
    } else if (line.startsWith('.,')) {
        // ignore, this is a comment
    } else if (line.includes('...')) {
        const [key, ...rest] = line.trimStart().trimEnd().split('...');
        if (currentParent) {
            const value = rest.join('...').replace('...', '');
            currentParent.attributes[key] = ['string', value];
        }
    } else if (line.includes('..')) {
        const [key, value] = line.trimStart().trimEnd().split('..');
        
        if (currentParent) {
            let type: AttributeType;
            try {
                eval(value);
                type = 'math';
            } catch (e) {
                type = 'variable';
            }
            currentParent.attributes[key] = [type, value.trim()];
        }
    }
}

fs.readFile(filePath, 'utf8', (err, data) => {
    const lines = data.split('\n');

    const ast: AstObject[] = [];

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        const result = getObject(line);
        if (result) {
            ast.push(result);
        }
    }

    for (const object of ast) {
        object.removeParentReference();
    }
    console.log(JSON.stringify(ast, null, 2));
});