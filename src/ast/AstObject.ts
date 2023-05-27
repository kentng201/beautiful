import FunctionObject from './FunctionObject';

export type AttributeType = 'string' | 'variable' | 'native' | 'function' | 'comment';

export default class AstObject {
    tagName: string;
    attributes: { [key: string]: [AttributeType, string | FunctionObject] };
    children: AstObject[];
    parent: AstObject | undefined; // Add parent property

    constructor(tagName: string, attributes: { [key: string]: [AttributeType, string] }) {
        this.tagName = tagName;
        this.attributes = attributes;
        this.children = [];
        this.parent = undefined; // Initialize parent as undefined
    }
    removeParentReference() {
        delete this.parent;
        this.children.forEach(child => child.removeParentReference());
    }
}