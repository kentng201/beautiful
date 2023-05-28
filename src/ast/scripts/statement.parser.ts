import chalk from 'chalk';
import * as fs from 'fs';
import parse, { StatementObject, getStatements } from '../StatementParser';
import { LoadModelQueryObject } from '../ModelQueryParser';

const filePath: string = process.argv[2];

export default function execute() {
    return new Promise<(StatementObject | LoadModelQueryObject)[]>((resolve) => {
        fs.readFile(filePath, 'utf8', (err, data) => {
            if (!data) {
                console.log(chalk.red(`File ${filePath} not found`));
                process.exit(1);
            }
            const lines = data.split('\n');

            for (let i = 0; i < lines.length; i++) {
                const line = lines[i];
                try {
                    parse(line, i + 1);
                } catch (error: any) {
                    console.log('error: ', error);

                    const errorObject = JSON.parse(error.message);
                    console.log(chalk.red(errorObject.msg));
                    console.log(chalk.red(`    at (${filePath}:${errorObject.lineNo || i + 1})`));
                    console.log(chalk.red(`    -> "${lines[errorObject.lineNo ? errorObject.lineNo - 1 : i].trim()}"`));
                    process.exit(1);
                }
            }
            const statements = getStatements();
            if (!fs.existsSync('src/output')) {
                fs.mkdirSync('src/output');
            }
            fs.writeFileSync('src/output/statement.test.json', JSON.stringify(statements, null, 4));
            resolve(statements);
        });
    });
}