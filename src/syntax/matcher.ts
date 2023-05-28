import { reserverdWords } from 'src/keywords';

export function isReservedWord(word: string) {
    return reserverdWords.includes(word);
}

export function isComparisonExpression(line: string) {
    return !!(
        line.match(/\b(is)\b/g)
        || line.match(/\b(is a)\b/g)
        || line.match(/\b(is an)\b/g)
        || line.match(/\b(more than or equal)\b/g)
        || line.match(/\b(less than or equal)\b/g)
        || line.match(/\b(more than)\b/g)
        || line.match(/\b(less than)\b/g)
        || line.match(/\b(not full equal)\b/g)
        || line.match(/\b(full equal)\b/g)
        || line.match(/\b(not equal)\b/g)
        || line.match(/\b(equal)\b/g)
        || line.match(/\b(like)\b/g)

        || line.match(/\b(~=)\b/g)
        || line.match(/\b(>=)\b/g)
        || line.match(/\b(<=)\b/g)
        || line.match(/\b(>)\b/g)
        || line.match(/\b(<)\b/g)
        || line.match(/\b(!==)\b/g)
        || line.match(/\b(===)\b/g)
        || line.match(/\b(!=)\b/g)
        || line.match(/\b(==)\b/g)
    );
}

export function isWhereExpression(line: string) {
    return !!(
        line.match(/\b(or)\b/g)
        || line.match(/\b(and)\b/g)

        || line.match(/&&/g)
        || line.match(/\|\|/g)

        || line.match(/\b(\()\b/g)
        || line.match(/\b(\))\b/g)
    );
}

export function isArithemticExpression(line: string) {
    return !!(
        line.match(/\b(or)\b/g)
    );
}

export function isControlExpression(line: string) {
    return !!(
        line.match(/\b(if)\b/g)
        || line.match(/\b(else)\b/g)
        || line.match(/\b(else if)\b/g)
        || line.match(/\b(while)\b/g)
        || line.match(/\b(every)\b/g)
        || line.match(/\b(loop)\b/g)
    );
}

export function isControlKeywordExpression(line: string) {
    return !!(
        line.match(/\b(break)\b/g)
        || line.match(/\b(continue)\b/g)
        || line.match(/\b(return)\b/g)
    );
}

export function isAssignmentExpression(line: string) {
    return !!(
        line.match(/\b(func)\b/g)
        || line.match(/\b(set)\b/g)
        || line.match(/\b(select)\b/g)
        || line.match(/\b(as)\b/g)
        || line.match(/\b(find)\b/g)
        || line.match(/\b(from)\b/g)
        || line.match(/\b(where)\b/g)
        || line.match(/\b(left join)\b/g)
        || line.match(/\b(right join)\b/g)
        || line.match(/\b(inner join)\b/g)
        || line.match(/\b(outer join)\b/g)
        || line.match(/\b(join)\b/g)
        || line.match(/\b(order by)\b/g)
        || line.match(/\b(group by)\b/g)
        || line.match(/\b(having)\b/g)
        || line.match(/\b(between)\b/g)
        || line.match(/\b(page)\b/g)
        || line.match(/\b(of)\b/g)
        || line.match(/\b(first one)\b/g)
        || line.match(/\b(last one)\b/g)
    );
}

export function isSaveExpression(line: string) {
    return !!(
        line.match(/\b(save)\b/g)
    );
}

export function isHttpExpression(line: string) {
    return !!(
        line.match(/\b(GET)\b/g)
        || line.match(/\b(POST)\b/g)
        || line.match(/\b(PUT)\b/g)
        || line.match(/\b(DELETE)\b/g)
        || line.match(/\b(PATCH)\b/g)
        || line.match(/\b(OPTIONS)\b/g)
        || line.match(/\b(HEAD)\b/g)
        || line.match(/\b(TRACE)\b/g)
        || line.match(/\b(CONNECT)\b/g)
    );
}


export function isMainLeadingKeyword(line: string) {
    return !!(
        line.match(/^(if)\b/g)
        || line.match(/^(else)\b/g)
        || line.match(/^(else if)\b/g)
        || line.match(/^(while)\b/g)
        || line.match(/^(every)\b/g)
        || line.match(/^(loop)\b/g)
        || line.match(/^(func)\b/g)
        || line.match(/^(set)\b/g)
    );
}

export function isCommentKeyword(line: string) {
    return !!(
        line.match(/\b(\.,)\b/g)
    );
}

export function isSubKeyword(line: string) {
    return !!(
        line.match(/\b(as)\b/g)
        || line.match(/\b(in)\b/g)
        || line.match(/\b(times)\b/g)
        || line.match(/\b(to)\b/g)
        || line.match(/\b(select)\b/g)
        || line.match(/\b(from)\b/g)
        || line.match(/\b(where)\b/g)
        || line.match(/\b(left join)\b/g)
        || line.match(/\b(right join)\b/g)
        || line.match(/\b(inner join)\b/g)
        || line.match(/\b(outer join)\b/g)
        || line.match(/\b(join)\b/g)
        || line.match(/\b(order by)\b/g)
        || line.match(/\b(group by)\b/g)
        || line.match(/\b(having)\b/g)
        || line.match(/\b(between)\b/g)
        || line.match(/\b(page)\b/g)

    );
}