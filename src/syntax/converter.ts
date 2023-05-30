import fs from 'fs';
import Statement from 'src/parser/statements/Statement';

export default function convert(statements: Statement[]) {
    let result = '';
    for (const statement of statements) {
        result += '\n';
        result += statement.toJs();
    }
    fs.writeFileSync('js.txt', result);
    return result;
}