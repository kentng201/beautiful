import * as fs from 'fs';
import AstObject from 'src/ast/AstObject';
import parse from 'src/ast/FrontendParser';

const filePath: string = process.argv[2];


fs.readFile(filePath, 'utf8', (err, data) => {
    const lines = data.split('\n');

    const ast: AstObject[] = [];

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        const result = parse(line);
        if (result instanceof AstObject) {
            ast.push(result);
        }
    }

    for (const object of ast) {
        object.removeParentReference();
    }
    fs.writeFileSync('main-parser.test.json', JSON.stringify(ast, null, 4));
});