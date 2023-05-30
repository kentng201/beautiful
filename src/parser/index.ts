import { parseIf } from 'src/statements/if';
import Statement from './statements/Statement';

export default function parseStatement(line: string, lineNo: number, lastStatement?: Statement): Statement | undefined {
    if (line.startsWith('if')) {
        return parseIf(line);
    } else if (line.startsWith('else')) {
    } else if (line.startsWith('while')) {
    } else if (line.startsWith('every')) {
    } else if (line.startsWith('loop')) {
    } else if (line.startsWith('set')) {
    } else if (line.startsWith('func')) {
    }
    return undefined;
}