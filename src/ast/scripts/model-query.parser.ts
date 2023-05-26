import * as fs from 'fs';
import parse, { LoadModelQueryObject } from '../ModelQueryParser';

const filePath: string = process.argv[2];


fs.readFile(filePath, 'utf8', (err, data) => {
    const lines = data.split('\n');

    const ast: LoadModelQueryObject[] = [];

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        const result = parse(line);
        if (result instanceof LoadModelQueryObject) {
            ast.push(result);
        }
    }
    fs.writeFileSync('model-query-parser.test.json', JSON.stringify(ast, null, 4));
});