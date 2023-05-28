export function verifyLoadStatement(line: string, lineNo: number, currentMainKeyword: string, currentMainLineNo: number) {
    if (
        !line.startsWith('select')
        && !line.startsWith('from')
        && !line.startsWith('where')
        && !line.startsWith('left join')
        && !line.startsWith('right join')
        && !line.startsWith('order by')
        && !line.startsWith('find')
        && !line.startsWith('page')
        && !line.startsWith('per')
    ) {
        throw new Error(JSON.stringify({
            msg: 'SyntaxError: "set" statement should have at least one at the beginning of the line:'
                + '\n"select", "from", "where", "left join", "right join", "order by", "find", "page", "per"',
            lineNo: lineNo
        }));
    }
}