import Statement from 'src/parser/statements/Statement';

export function toJsNative(statement: Statement<string>, level = 0) {
    const result = statement.expression;
    if (!result) return '';
    let strings = result.split(' ');
    if (strings[0] == 'waiting') {
        strings[0] = 'await';
        strings = [strings[0] + ' ' + strings[1], ...strings.slice(2)];
    }
    const funcName = strings[0];
    const args = '(' + strings.slice(1).map((arg) => {
        if (arg.match(/\.\.\./) && arg.match(/\.\.\./)!.length > 0) {
            arg = arg.replace(/\.\.\./g, '\'');
        }
        return arg;
    }).join(', ') + ')';
    return funcName + args + ';';
}