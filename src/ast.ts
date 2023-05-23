import * as fs from 'fs';

const filePath: string = process.argv[2];

class AstObject {
    tagName: string;
    attributes: { [key: string]: string };
    children: AstObject[];
    parent: AstObject | undefined; // Add parent property

    constructor(tagName: string, attributes: { [key: string]: string }) {
        this.tagName = tagName;
        this.attributes = attributes;
        this.children = [];
        this.parent = undefined; // Initialize parent as undefined
    }
}

let mainObject: AstObject | undefined;
let currentParent: AstObject | undefined;

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
    } else if (line.startsWith('.,')) {
        // ignore, this is a comment
    } else if (line.includes('..')) {
        const [key, value] = line.trimStart().trimEnd().split('..');
        if (currentParent) {
            currentParent.attributes[key] = value;
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
});