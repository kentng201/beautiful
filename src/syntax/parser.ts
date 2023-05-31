import Statement from 'src/parser/statements/Statement';
import fs from 'fs';
import parseStatement from 'src/parser';

export class LineObject {
    lineNo: number;
    line: string;
    comment?: string;
    children?: LineObject[];

    constructor(lineNo: number, line: string, comment?: string, children?: LineObject[]) {
        this.lineNo = lineNo;
        this.line = line;
        this.comment = comment;
        this.children = children;
    }

    checkChildrenHaveSpacing(): boolean {
        for (const child of this.children || []) {
            if (child.line.match(/^\s+/)) {
                return true;
            } else if (child.children) {
                return child.checkChildrenHaveSpacing();
            }
        }
        return false;
    }

    convertIndentionToNewChild(): LineObject[] {
        const result: LineObject[] = [];
        let currentLevel = 0;
        let currentSpace = ' '.repeat(currentLevel);
        for (const child of this.children || []) {
            if (child.children) {
                child.children = child.convertIndentionToNewChild();
            }
            const hasLeadingSpace = child.line.match(/^\s+/) as RegExpMatchArray;
            const leadingSpaces = hasLeadingSpace ? hasLeadingSpace[0].length : 0;
            if (leadingSpaces === 0) {
                result.push(child);
            } else {
                const last = result[result.length - 1];
                if (last) {
                    if (!last.children) {
                        currentLevel = leadingSpaces;
                        currentSpace = ' '.repeat(currentLevel);
                    }
                    last.children = last.children || [];
                    last.children.push(new LineObject(child.lineNo, child.line.replace(currentSpace, ''), child.comment));
                }
            }
        }
        return result;
    }

    toStatement(): Statement | undefined {
        const statement = parseStatement(this.line, this.lineNo, this.children);
        return statement;
    }
}

function convertLinesToObject(lines: string[]): LineObject[] {
    const result: LineObject[] = [];
    let currentLevel = 0;
    let currentSpace = ' '.repeat(currentLevel);
    for (let i = 0; i < lines.length; i++) {
        let line = lines[i];
        const comment = line.split('.,')[1];
        line = line.split('.,')[0];
        const lineNo = i + 1;
        const hasLeadingSpace = line.match(/^\s+/) as RegExpMatchArray;
        const leadingSpaces = hasLeadingSpace ? hasLeadingSpace[0].length : 0;
        if (leadingSpaces === 0) {
            result.push(new LineObject(lineNo, line, comment));
        } else {
            const last = result[result.length - 1];
            if (last) {
                if (!last.children) {
                    currentLevel = leadingSpaces;
                    currentSpace = ' '.repeat(currentLevel);
                }
                last.children = last.children || [];
                last.children.push(new LineObject(lineNo, line.replace(currentSpace, ''), comment));
            }
        }
    }
    return result;
}

function getSpacingLines(lines: LineObject[]): number[] {
    const spacingLines: number[] = [];
    for (const line of lines) {
        if (line.children && line.checkChildrenHaveSpacing()) {
            spacingLines.push(line.lineNo);
        }
    }
    return spacingLines;
}

function convertLinesToTree(lines: (string | LineObject)[], spacingLines: number[] = []): LineObject[] {
    if (typeof lines[0] === 'string') {
        return convertLinesToObject(lines as string[]);
    }

    const newLines: LineObject[] = [];
    for (let line of lines) {
        line = line as LineObject;
        if (spacingLines.includes(line.lineNo)) {
            line.children = line.convertIndentionToNewChild();
        }
        newLines.push(line);
    }
    return newLines;
}

export default function parse(lines: string[]) {
    console.time('compile time');
    let arr = convertLinesToObject(lines);
    for (let i = 0; i < 100; i++) {
        const spacingLines = getSpacingLines(arr);
        if (spacingLines.length === 0) break;
        arr = convertLinesToTree(arr, spacingLines);
    }
    // fs.writeFileSync('output.test.json', JSON.stringify(arr, null, 4));

    const statements: Statement[] = [];
    let lastStatement: Statement | undefined;
    for (const line of arr) {
        lastStatement = line.toStatement();
        if (lastStatement) {
            statements.push(lastStatement);
        }
    }
    fs.writeFileSync('parsed.test.json', JSON.stringify(statements, null, 4));

    console.timeEnd('compile time');
    return statements;
}