
export const tagStack: [string, number][] = [];

export function verifyTagSyntax(line: string, lineNo: number) {
    if (!(line.startsWith('.') && !line.startsWith('.,')) && tagStack.length == 0) {
        throw new Error(JSON.stringify({
            msg: 'SyntaxError: "tag" statement should start with "."',
            lineNo: 0
        }));
    }
    if (line.startsWith('.')) {
        tagStack.push([
            line.split(' ')[0].replace('.', ''),
            lineNo
        ]);
    }
    if (line.endsWith('.')) {
        const lastTagName = tagStack.pop();
        if (!lastTagName) {
            return;
        }
        const words = line.split(' ');
        const currentTagName = words[words.length - 1].replace('.', '');
        if (lastTagName[0] != currentTagName) {
            throw new Error(JSON.stringify({
                msg: 'SyntaxError: Tag "' + lastTagName[0] + '" are not closed properly',
                lineNo: lastTagName[1]
            }));
        }
    }
}

export function verifyTagBodySyntax(line: string, lineNo: number) {
    if (line.match(/\.\./) == null) {
        throw new Error(JSON.stringify({
            msg: 'SyntaxError: Tag body should be separated by ".."',
            lineNo: lineNo
        }));
    }
    // if (line.match(/\.\.\./) != null || line.match(/\.\.\./)?.length != 2) {
    //     throw new Error(JSON.stringify({
    //         msg: 'SyntaxError: String should enclosed by "..."',
    //         lineNo: lineNo
    //     }));
    // }
}