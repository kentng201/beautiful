import * as fs from 'fs';
import parse, { getCurrentModel, getModels } from '../ModelQueryParser';

const filePath: string = process.argv[2];


fs.readFile(filePath, 'utf8', (err, data) => {
    const lines = data.split('\n');


    for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        parse(line);
    }
    const currentModel = getCurrentModel();
    const models = getModels();
    if (currentModel) {
        models.push(currentModel);
    }
    fs.writeFileSync('model-query-parser.test.json', JSON.stringify(models, null, 4));
});