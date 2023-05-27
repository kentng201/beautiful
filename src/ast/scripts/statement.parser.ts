import * as fs from 'fs';
import chalk from 'chalk';
import parse, { getStatements } from '../StatementParser';

const filePath: string = process.argv[2];


fs.readFile(filePath, 'utf8', (err, data) => {
    const lines = data.split('\n');

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        try {
            parse(line, i+1);
        } catch (error: any) {
            const errorObject = JSON.parse(error.message);
            console.log(chalk.red(errorObject.msg));
            console.log(chalk.red(`    at (${filePath}:${errorObject.lineNo || i+1})`));
            console.log(chalk.red(`    -> "${lines[errorObject.lineNo ? errorObject.lineNo - 1 : i].trim()}"`));
            process.exit(1);
        }
    }
    const statements = getStatements();
    fs.writeFileSync('statements.test.json', JSON.stringify(statements, null, 4));
});