import Statement from 'src/parser/statements/Statement';

export default function convert(statements: Statement[]) {
    let result = '';
    for (const statement of statements) {
        result += '\n';
        result += statement.toJs();
    }
    return result;
}