import fs from 'fs';
import './statement.parser';
import { StatementObject } from '../StatementParser';
import { SetObject } from '../statements/set';
import { LoadModelQueryObject } from '../ModelQueryParser';

const filePath: string = process.argv[2];
const inputJson = 'src/output/statement.test.json';
let output = '';

function convertStatementBodyToString(body: (StatementObject | string)[], layer: number = 1) {
    const layerSpace = '\n' + '    '.repeat(layer);
    let result = '';
    body.forEach((element) => {
        if (typeof element === 'string') {
            result += layerSpace + element;
        } else {
            const statement = element as StatementObject;
            result += layerSpace + statement.keyword;
            if (statement.conditions) {
                const conditions = statement.conditions;
                for (let i = 0; i < conditions.length; i++) {
                    const condition = conditions[i];
                    if (i === 0) {
                        result += ' ' + condition.key + ' ' + condition.operator + ' ' + condition.value;
                    } else {
                        result += condition.join + ' ' + condition.key + ' ' + condition.operator + ' ' + condition.value;
                    }
                }

            }
            if (typeof statement.expression === 'string') {
                result += ' ' + statement.expression;
            } else {
                const expression = statement.expression as SetObject;
                result += ' ' + expression.variableName + ' to ' + expression.statement?.body;
            }
            if (statement.body) {
                const body = convertStatementBodyToString(statement.body, layer + 1);
                result += body;
            }
        }
    });
    return result;
}

fs.readFile(inputJson, 'utf8', async (err, data) => {
    const array = JSON.parse(data);
    if (array.length > 0) {
        array.forEach((element: any) => {
            if (element.name === 'statement') {
                const statement = element as StatementObject;
                output += statement.keyword;
                if (typeof statement.expression === 'string') {
                    output += statement.expression;
                } else {
                    const expression = statement.expression as SetObject;
                    output += ' ' + expression.variableName + ' to ' + expression.statement?.body;
                }
                if (statement.expression && statement.conditions && !['func', 'else'].includes(statement.keyword)) {
                    output += ' where';
                }
                if (statement.conditions) {
                    const conditions = statement.conditions;
                    for (let i = 0; i < conditions.length; i++) {
                        const condition = conditions[i];
                        if (i === 0) {
                            output += ' ' + condition.key + ' ' + condition.operator + ' ' + condition.value;
                        } else {
                            output += condition.join + ' ' + condition.key + ' ' + condition.operator + ' ' + condition.value;
                        }
                    }
                }
                if (statement.body) {
                    const body = convertStatementBodyToString(statement.body);
                    output += body;
                }
                output += '\n';
            } else if (element.name === 'query') {
                const query = element as LoadModelQueryObject;
                output += 'load ' + query.variableName
                    + '\n' + '    ' + 'from ' + query.modelName;
                if (query.fields.length > 0) {
                    output += '\n' + '    ' + 'select ' + query.fields.join(' ');
                }
                if (query.conditions.length > 0) {
                    const conditions = query.conditions;
                    output += '\n' + '    ' + 'where';
                    for (let i = 0; i < conditions.length; i++) {
                        const condition = conditions[i];
                        if (i === 0) {
                            output += ' ' + condition.key + ' ' + condition.operator + ' ' + condition.value;
                        } else {
                            output += '\n' + '    ' + condition.join + ' ' + condition.key + ' ' + condition.operator + ' ' + condition.value;
                        }
                    }
                }
                if (query.firstOrLast) {
                    output += '\n' + '    ' + query.firstOrLast;
                }
                if (query.orderBy.length > 0) {
                    output += '\n' + '    ' + 'order by ' + query.orderBy.map((order) => `${order[0]} ${order[1]}`).join(' ');
                }
                output += '\n';
            }
        });
    }
    fs.writeFileSync(filePath.replace('.beau', '') + '.output.beau', output);
});