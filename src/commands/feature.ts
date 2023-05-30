import chalk from 'chalk';
import validate from 'src/scripts/validate';
import parse from 'src/scripts/parse';
import convert from 'src/scripts/convert';

const command = process.argv[2];

if (command === 'validate') {
    validate();
} else if (command === 'parse') {
    parse();
} else if (command === 'compile') {
    convert();
} else {
    console.log(chalk.red('Invalid command' + (command ? ': ' + command : '')));
    console.log('Usage: elegant <command> <file_path>');
    console.log('Available commands:');
    console.log(chalk.green('    validate') + ' - Validate a .elg file');
    console.log(chalk.green('    parse') + ' - Validate and parse a .elg file');
    console.log(chalk.green('    compile') + ' - Validate, parse, and convert a .elg file');
    process.exit(1);
}