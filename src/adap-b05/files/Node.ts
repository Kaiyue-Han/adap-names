import { IllegalArgumentException } from "../common/IllegalArgumentException";
import { InvalidStateException } from "../common/InvalidStateException";

import { Name } from "../names/Name";
import { Directory } from "./Directory";

export class Node {

    protected baseName: string = "";
    protected parentNode: Directory;

    constructor(bn: string, pn: Directory) {
        IllegalArgumentException.assert(
            bn !== null && bn !== undefined,
            "base name must not be null or undefined"
        );
        IllegalArgumentException.assert(
            pn !== null && pn !== undefined,
            "parent node must not be null or undefined"
        );

        this.doSetBaseName(bn);
        this.parentNode = pn; // why oh why do I have to set this
        this.initialize(pn);
        this.assertInvariant();
    }

    protected initialize(pn: Directory): void {
        this.parentNode = pn;
        this.parentNode.addChildNode(this);
    }

    protected assertInvariant(): void {
        InvalidStateException.assert(
            this.baseName !== null && this.baseName !== undefined,
            "baseName must not be null or undefined"
        );
        InvalidStateException.assert(
            this.parentNode !== null && this.parentNode !== undefined,
            "parentNode must not be null or undefined"
        );
        InvalidStateException.assert(
            this.baseName.length > 0 || this.parentNode === (this as any),
            "baseName must not be empty"
        );
    }

    public move(to: Directory): void {
        IllegalArgumentException.assert(
            to !== null && to !== undefined,
            "target directory must not be null or undefined"
        );
        this.parentNode.removeChildNode(this);
        to.addChildNode(this);
        this.parentNode = to;
        this.assertInvariant();
    }

    public getFullName(): Name {
        const result: Name = this.parentNode.getFullName();
        result.append(this.getBaseName());
        return result;
    }

    public getBaseName(): string {
        const bn = this.doGetBaseName();
        this.assertInvariant();
        return bn;
    }

    protected doGetBaseName(): string {
        return this.baseName;
    }

    public rename(bn: string): void {
        IllegalArgumentException.assert(
            bn !== null && bn !== undefined,
            "base name must not be null or undefined"
        );
        this.doSetBaseName(bn);
        this.assertInvariant();
    }

    protected doSetBaseName(bn: string): void {
        this.baseName = bn;
    }

    public getParentNode(): Directory {
        return this.parentNode;
    }

    /**
     * Returns all nodes in the tree that match bn
     * @param bn basename of node being searched for
     */
    public findNodes(bn: string): Set<Node> {
        IllegalArgumentException.assert(
            bn !== null && bn !== undefined,
            "basename must not be null or undefined"
        );

        this.assertInvariant();
        const result = new Set<Node>();
        if (this.getBaseName() === bn) {
            result.add(this);
        }
        return result;
    }

}
