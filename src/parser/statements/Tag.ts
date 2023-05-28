import Comment from './Comment';

export class TagAttribute {
    name = 'attribute';
    key: string = '';
    value: string = '';
    comment?: Comment;
}

export default class Tag {
    name = 'tag';
    tagName: string;
    attributes: TagAttribute[] = [];
    body: Tag[] = [];
    comment?: Comment;

    constructor(tagName: string) {
        this.tagName = tagName;
    }
}