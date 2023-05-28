import fs from 'fs';
import execute from './statement.parser';
import Collection from '../Collection';
import { StatementObject } from '../StatementParser';
import { LoadModelQueryObject } from '../ModelQueryParser';
import { SetObject } from '../statements/set';
import { isAlikeSyntax } from '../statements/operation/alike';
import { convertAlikeStringToTsString } from '../statements/operation/alike';

const filePath: string = process.argv[2];
const filename = filePath.split('/').pop();
const outputFilePath = 'dist/' + filename?.replace('.beau', '.ts');
if (!fs.existsSync('dist')) {
    fs.mkdirSync('dist');
}

function convertStatementBodyToString(body: (StatementObject | LoadModelQueryObject | string)[], layer: number = 1) {
    const layerSpace = '\n' + '    '.repeat(layer);
    let result = '';
    body.forEach((element) => {
        if (typeof element === 'string') {
            result += layerSpace + element.replace(' ', '(') + ');';
        } else if (element.name === 'statement') {
            const statement = element as StatementObject;
            result += layerSpace;
            if (statement.keyword !== 'set') {
                result += statement.keyword + ' (';
            }
            if (statement.conditions) {
                let condtionString = '';
                const conditions = statement.conditions;
                for (let i = 0; i < conditions.length; i++) {
                    const condition = conditions[i];
                    if (i === 0) {
                        condtionString += condition.key + ' ' + condition.operator + ' ' + condition.value.trim();
                    } else {
                        condtionString += condition.join + ' ' + condition.key + ' ' + condition.operator + ' ' + condition.value.trim();
                    }
                }
                if (isAlikeSyntax(condtionString)) {
                    condtionString = convertAlikeStringToTsString(condtionString);
                }
                result += condtionString;
            }
            if (typeof statement.expression === 'string') {
                result += statement.expression.trim();
            } else {
                const expression = statement.expression as SetObject;
                result += 'const ' + expression.variableName + ' = ' + expression.statement?.body;
            }
            if (statement.keyword !== 'set') {
                result += ') {';
            } else {
                result += ';';
            }
            if (statement.body && statement.keyword !== 'key') {
                const body = convertStatementBodyToString(statement.body, layer + 1);
                result += body;
            }
            if (statement.keyword !== 'set') {
                result += layerSpace;
                result += '}';
            }
        } else if (element.name === 'query') {
            const query = element as LoadModelQueryObject;
            result += layerSpace + 'const ' + query.variableName
                + ' = `' + query.modelName;
            if (query.fields.length > 0) {
                result += layerSpace + '\n' + 'select ' + query.fields.join(' ');
            }
            if (query.conditions.length > 0) {
                const conditions = query.conditions;
                result += layerSpace + '    ' + 'where';
                for (let i = 0; i < conditions.length; i++) {
                    const condition = conditions[i];
                    if (i === 0) {
                        result += condition.key + ' ' + condition.operator + ' ' + condition.value.trim();
                    } else {
                        result += '\n' + layerSpace + condition.join + ' ' + condition.key + ' ' + condition.operator + ' ' + condition.value.trim();
                    }
                }
            }
            if (query.firstOrLast) {
                result += layerSpace + '\n' + '    ' + query.firstOrLast;
            }
            if (query.orderBy.length > 0) {
                result += layerSpace + '\n' + '    ' + 'order by ' + query.orderBy.map((order) => `${order[0]} ${order[1]}`).join(' ');
            }
            result += '`;';
        }
    });
    return result;
}


function convertObjectsToTs<T>(array: (StatementObject<T> | LoadModelQueryObject)[]): string {
    let output = '';
    const collection = Collection.toString();
    output += collection;
    output += '\n';
    output += '\n';
    output += '\n';


    if (array.length > 0) {
        array.forEach((element: StatementObject | LoadModelQueryObject) => {
            if (element.name === 'statement') {
                const statement = element as StatementObject;
                if (statement.keyword !== 'set') {
                    output += statement.keyword + ' (';
                }
                if (typeof statement.expression === 'string') {
                    output += statement.expression;
                } else {
                    const expression = statement.expression as SetObject;
                    output += 'const ' + expression.variableName + ' = ' + expression.statement?.body;
                }
                if (statement.expression && statement.conditions && !['func', 'else', 'set'].includes(statement.keyword)) {
                    output += ' where';
                }
                if (statement.conditions) {
                    let condtionString = '';
                    const conditions = statement.conditions;
                    for (let i = 0; i < conditions.length; i++) {
                        const condition = conditions[i];
                        if (i === 0) {
                            condtionString += condition.key + ' ' + condition.operator + ' ' + condition.value.trim();
                        } else {
                            condtionString += condition.join + ' ' + condition.key + ' ' + condition.operator + ' ' + condition.value.trim();
                        }
                    }
                    if (isAlikeSyntax(condtionString)) {
                        condtionString = convertAlikeStringToTsString(condtionString);
                    }
                    output += condtionString;
                }
                if (statement.keyword !== 'set') {
                    output += ') {';
                }
                if (statement.body && statement.keyword !== 'set') {
                    const body = convertStatementBodyToString(statement.body);
                    output += body;
                }
                if (statement.keyword !== 'set') {
                    output += '\n}';
                } else {
                    output += ';\n';
                }
            } else if (element.name === 'query') {
                const query = element as LoadModelQueryObject;
                output += 'const ' + query.variableName
                    + '\n' + '    ' + '= `' + query.modelName;
                if (query.fields.length > 0) {
                    output += '\n' + '    ' + 'select ' + query.fields.join(' ');
                }
                if (query.conditions.length > 0) {
                    const conditions = query.conditions;
                    output += '\n' + '    ' + 'where';
                    for (let i = 0; i < conditions.length; i++) {
                        const condition = conditions[i];
                        if (i === 0) {
                            output += condition.key + ' ' + condition.operator + ' ' + condition.value.trim();
                        } else {
                            output += '\n' + '    ' + condition.join + ' ' + condition.key + ' ' + condition.operator + ' ' + condition.value.trim();
                        }
                    }
                }
                if (query.firstOrLast) {
                    output += '\n' + '    ' + query.firstOrLast;
                }
                if (query.orderBy.length > 0) {
                    output += '\n' + '    ' + 'order by ' + query.orderBy.map((order) => `${order[0]} ${order[1]}`).join(' ');
                }
                output += '`;';
            }
        });
    }
    return output;
}

new Promise(async () => {
    const src = await execute();
    let dest = convertObjectsToTs(src);
    const stringMatched = dest.match(/\.\.\.(.*)\.\.\./g) || [];
    for (let i = 0; i < stringMatched.length; i++) {
        const oldString = stringMatched[i];
        let newString = oldString.replace(/\.\.\./, '`');
        newString = newString.trimEnd().slice(0, -3) + '`';
        dest = dest.replace(oldString, newString);
    }
    fs.writeFileSync(outputFilePath, dest);

});