import { Node } from "./Node";

export class Directory extends Node {

    protected childNodes: Set<Node> = new Set<Node>();

    constructor(bn: string, pn: Directory) {
        super(bn, pn);
    }

    public hasChildNode(cn: Node): boolean {
        return this.childNodes.has(cn);
    }

    public addChildNode(cn: Node): void {
        this.childNodes.add(cn);
    }

    public removeChildNode(cn: Node): void {
    	if (!this.childNodes.has(cn)) {
            throw new IllegalArgumentException("Cannot remove node that is not a child");
        }
        this.childNodes.delete(cn); // Yikes! Should have been called remove
    }

}