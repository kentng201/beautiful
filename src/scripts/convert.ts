import fs from 'fs';
import chalk from 'chalk';
import convert from 'src/syntax/converter';
import parse from 'src/syntax/parser';
import Statement from 'src/parser/statements/Statement';

const filePath: string = process.argv[3];

export default async function execute() {
    return new Promise<void>((resolve) => {
        fs.readFile(filePath, 'utf8', (err, data) => {
            if (!data) {
                console.log(chalk.red(`File ${filePath} not found`));
                process.exit(1);
            }

            const lines = data.split('\n');
            let statements: Statement[];
            try {
                statements = parse(lines);
            } catch (error: any) {
                const errorObject = JSON.parse(error.message);
                console.log(chalk.red(errorObject.msg));
                console.log(chalk.red(`    at (${filePath}:${errorObject.lineNo})`));
                console.log(chalk.red(`    -> "${lines[errorObject.lineNo ? errorObject.lineNo - 1 : '0'].trim()}"`));
                process.exit(1);
            }

            let jsFile: string;
            try {
                jsFile = convert(statements);
            } catch (error: any) {
                const errorObject = JSON.parse(error.message);
                console.log(chalk.red(errorObject.msg));
                console.log(chalk.red(`    at (${filePath}:${errorObject.lineNo})`));
                console.log(chalk.red(`    -> "${lines[errorObject.lineNo ? errorObject.lineNo - 1 : '0'].trim()}"`));
                process.exit(1);
            }
            console.log('jsFile: ', jsFile);
        });
        resolve();
    });
}