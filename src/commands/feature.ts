import validate from 'src/scripts/validate';
import parse from 'src/scripts/parse';
// import convert from 'src/scripts/convert';

const command = process.argv[2];

if (command === 'validate') {
    validate();
} else if (command === 'parse') {
    parse();
} else if (command === 'convert') {
    // convert();
} else if (command === 'run') {
    (async () => {
        await validate();
        await parse();
        // await convert();
    })();
}