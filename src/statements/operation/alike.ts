export function isAlikeSyntax(statement: string) {
    return statement.includes('~=');
}

export const nativeKeywords = ['int', 'decimal', 'string', 'boolean'];
export const objectKeywords = ['object', 'array', 'collection'];

export function convertAlikeStringToTsString(statement: string) {
    const [key] = statement.split(' ~= ');
    let value = statement.split(' ~= ')[1];
    const statementInt = statement.match(/\b(\d+)\b/g);
    let lengthCheckStatement;
    if (statementInt) {
        lengthCheckStatement = `${key}.length === ${statementInt[0]}`;
        value = value.replace(/\b(\d+)\b/g, '');
    }

    let typeCheckStatement;
    if (value.match(/\b(object)\b/)) {
        typeCheckStatement = `typeof ${key} === 'object'`;
        value = value.replace(/\b(object)\b/, '');
    } else if (value.match(/\b(array)\b/)) {
        typeCheckStatement = `Array.isArray(${key})`;
        value = value.replace(/\b(array)\b/, '');
    } else if (value.match(/\b(collection)\b/)) {
        typeCheckStatement = `${key} instanceof Collection`;
        value = value.replace(/\b(collection)\b/, '');
    } else if (value.match(/\b(int)\b/)) {
        typeCheckStatement = `typeof ${key} === 'number' && Number.isInteger(${key})`;
        value = value.replace(/\b(int)\b/, '');
    } else if (value.match(/\b(decimal)\b/)) {
        typeCheckStatement = `typeof ${key} === 'number' && !Number.isInteger(${key})`;
        value = value.replace(/\b(decimal)\b/, '');
    } else if (value.match(/\b(string)\b/)) {
        typeCheckStatement = `typeof ${key} === 'string'`;
        value = value.replace(/\b(string)\b/, '');
    } else if (value.match(/\b(boolean)\b/)) {
        typeCheckStatement = `typeof ${key} === 'boolean'`;
        value = value.replace(/\b(boolean)\b/, '');
    }

    let classCheckStatement;
    if (value) {
        classCheckStatement = `${key} instanceof ${value}`;
    }
    const statements = [lengthCheckStatement, typeCheckStatement, classCheckStatement].filter(Boolean);
    return statements.join(' && ');
}