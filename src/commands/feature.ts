import validate from 'src/scripts/validate';
import parse from 'src/scripts/parse';
import chalk from 'chalk';
// import convert from 'src/scripts/convert';

const command = process.argv[2];

if (command === 'validate') {
    validate();
} else if (command === 'parse') {
    parse();
} else if (command === 'convert') {
    // convert();
} else if (command === 'build') {
    (async () => {
        await validate();
        await parse();
        // await convert();
    })();
} else {
    console.log(chalk.red('Invalid command' + (command ? ': ' + command : '')));
    console.log('Usage: elegant <command> <file_path>');
    console.log('Available commands:');
    console.log(chalk.green('    validate') + ' - Validate a .elg file');
    console.log(chalk.green('    parse') + ' - Parse a .elg file');
    console.log(chalk.green('    convert') + ' - Convert a .elg file to .js');
    console.log(chalk.green('    build') + ' - Validate, parse, and convert a .elg file');
    process.exit(1);
}