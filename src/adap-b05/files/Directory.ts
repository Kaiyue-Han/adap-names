import { Node } from "./Node";
import { IllegalArgumentException } from "../common/IllegalArgumentException";

export class Directory extends Node {

    protected childNodes: Set<Node> = new Set<Node>();

    constructor(bn: string, pn: Directory) {
        super(bn, pn);
    }

    public hasChildNode(cn: Node): boolean {
        return this.childNodes.has(cn);
    }

    public addChildNode(cn: Node): void {
        IllegalArgumentException.assert(
            cn !== null && cn !== undefined,
            "child node must not be null or undefined"
        );
        this.childNodes.add(cn);
    }

    public removeChildNode(cn: Node): void {
        IllegalArgumentException.assert(
            cn !== null && cn !== undefined,
            "child node must not be null or undefined"
        );
        this.childNodes.delete(cn); // Yikes! Should have been called remove
    }

    public getChildNodes(): Set<Node> {
        return this.childNodes;
    }
    
    public override findNodes(bn: string): Set<Node> {
        const result = super.findNodes(bn);
        for (const child of this.childNodes) {
            const childMatches = child.findNodes(bn);
            childMatches.forEach(n => result.add(n));
        }
        return result;
    }
}