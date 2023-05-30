import fs from 'fs';
import Statement from 'src/parser/statements/Statement';

export default function convert(statements: Statement[], fileName: string) {
    let result = '';
    for (const statement of statements) {
        result += '\n';
        result += statement.toJs();
    }
    if (!fs.existsSync('dist')) {
        fs.mkdirSync('dist');
    }

    const file = 'dist/' + fileName + '.js';
    fs.writeFileSync(file, result);
    return result;
}