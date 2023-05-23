import * as fs from 'fs';

const filePath: string = process.argv[2];

class AstObject {
    tagName: string;
    attributes: { [key: string]: string };
    children: AstObject[];

    constructor(tagName: string, attributes: { [key: string]: string }) {
        this.tagName = tagName;
        this.attributes = attributes;
        this.children = [];
    }
}

let mainObject: AstObject | undefined;
// let currentTagName: string | undefined;

let object: AstObject | undefined;


function getObject(line: string) {
    if (line.startsWith('.')) {
        if (mainObject) {
            object = new AstObject(line.replace('.', ''), {});
        } else {
            mainObject = new AstObject(line.replace('.', ''), {});
            object = mainObject;
            // currentTagName = line.replace('.', '');
        }
    } else if (line.endsWith('.') && !line.includes(' ')) {
        if (mainObject && object && mainObject.tagName !== object.tagName) {
            mainObject.children.push(object);
            object = undefined;
        } else {
            const newObject = mainObject;
            mainObject = undefined;
            object = undefined;
            return newObject;
        }
        
    } else if (line.startsWith('.,')) {
        // ignore, this is a comment
    } else if (line.includes('..')) {
        const [key, value] = line.trimStart().trimEnd().split('..');
        if (object) {
            object.attributes[key] = value;
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
        console.log(object);
    }
});
