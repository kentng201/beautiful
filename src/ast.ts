import * as fs from 'fs';

const filePath: string = process.argv[2];

fs.readFile(filePath, 'utf8', (err, data) => {
    const lines = data.split('\n');
    console.log('lines: ', lines)
});
