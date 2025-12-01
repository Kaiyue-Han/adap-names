import { Node } from "./Node";
import { Directory } from "./Directory";
import { MethodFailedException } from "../common/MethodFailedException";
import { IllegalArgumentException } from "../common/IllegalArgumentException";

export class Link extends Node {

    protected targetNode: Node | null = null;

    constructor(bn: string, pn: Directory, tn?: Node) {
        super(bn, pn);

        if (tn != undefined) {
            this.targetNode = tn;
        }
    }

    public getTargetNode(): Node | null {
        return this.targetNode;
    }

    public setTargetNode(target: Node): void {
        IllegalArgumentException.assert(
            target !== null && target !== undefined,
            "target node must not be null or undefined"
        );
        this.targetNode = target;
    }

    public getBaseName(): string {
        const target = this.ensureTargetNode(this.targetNode);
        return target.getBaseName();
    }

    public rename(bn: string): void {
        IllegalArgumentException.assert(
            bn !== null && bn !== undefined,
            "base name must not be null or undefined"
        );
        const target = this.ensureTargetNode(this.targetNode);
        target.rename(bn);
    }

    protected ensureTargetNode(target: Node | null): Node {
        MethodFailedException.assert(
            target !== null && target !== undefined,
            "link target node must be set"
        );
        return target as Node;
    }
}
