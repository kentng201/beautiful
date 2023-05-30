import { parseIf } from 'src/statements/if';
import Statement from './statements/Statement';
import { LineObject } from 'src/syntax/parser';
import { parseEvery } from 'src/statements/every';

export default function parseStatement(line: string, lineNo: number, children?: LineObject[], lastStatement?: Statement): Statement | undefined {
    if (line.startsWith('if')) {
        return parseIf(line, children);
    } else if (line.startsWith('else')) {
        // return parseElse(line, children);
    } else if (line.startsWith('while')) {
        // return parseWhile(line, children);
    } else if (line.startsWith('every')) {
        return parseEvery(line, children);
    } else if (line.startsWith('loop')) {
        // return parseLoop(line, children);
    } else if (line.startsWith('set')) {
        // return parseSet(line, children);
    } else if (line.startsWith('func')) {
        // return parseFunc(line, children);
    }
    return new Statement<string>('', line);
}