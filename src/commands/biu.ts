import chalk from 'chalk';


const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout,
});

async function asking(question: string): Promise<string> {
    return new Promise<string>((resolve, reject) => {
        readline.question(question, (answer: string) => {
            resolve(answer);
        });
    });
}

(async () => {
    // console.log('process args: ', process.argv);
    const command = await asking(chalk.green(`Choose one of the following options:`) + `
    1. Import Beautiful Component(s)
    2. Get Imported Component List
    3. Remove Imported Component(s)
    4. Compile source to exportable component
Your choice is: `);

    if ([1, 2, 3, 4].includes(Number(command))) {
        console.log('hi');
    } else {
        console.log(chalk.red('Invalid command, dismiss.'));
    }

    readline.close();
    process.exit(0);
})();
