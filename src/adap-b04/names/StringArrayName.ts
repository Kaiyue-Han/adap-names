import { DEFAULT_DELIMITER } from "../common/Printable";
import { Name } from "./Name";
import { AbstractName } from "./AbstractName";
import { IllegalArgumentException } from "../common/IllegalArgumentException";
import { MethodFailedException } from "../common/MethodFailedException";
import { InvalidStateException } from "../common/InvalidStateException";

export class StringArrayName extends AbstractName {

    protected components: string[] = [];

    constructor(source: string[], delimiter: string = DEFAULT_DELIMITER) {
        IllegalArgumentException.assert(
            source !== null && source !== undefined,
            "StringArrayName: source array must not be null or undefined"
        );

        super(delimiter);

        this.components = source.slice();
        this.checkInvariant();
    }


    public clone(): Object {
        const copy = new StringArrayName(this.components.slice(), this.delimiter);
        MethodFailedException.assert(
            (copy as Name).isEqual(this),
            "StringArrayName.clone: cloned object must be equal to original"
        );
        return copy;
    }


    public getNoComponents(): number {
        return this.components.length;
    }

    public getComponent(i: number): string {
        this.ensureIndex(i, { allowAtEnd: false });
        const value = this.components[i];
        MethodFailedException.assert(
            value !== null && value !== undefined,
            "getComponent: component must not be null or undefined"
        );
        return value;
    }

    public setComponent(i: number, c: string): void {
        this.ensureIndex(i, { allowAtEnd: false });
        IllegalArgumentException.assert(
            c !== null && c !== undefined,
            "setComponent: component must not be null or undefined"
        );

        const before = this.components.length;
        this.components[i] = c;

        MethodFailedException.assert(
            this.components.length === before,
            "setComponent: must not change number of components"
        );
        this.checkInvariant();
    }

    public insert(i: number, c: string): void {

        this.ensureIndex(i, { allowAtEnd: true });
        IllegalArgumentException.assert(
            c !== null && c !== undefined,
            "insert: component must not be null or undefined"
        );

        const before = this.components.length;
        this.components.splice(i, 0, c);

        MethodFailedException.assert(
            this.components.length === before + 1,
            "insert: number of components must increase by one"
        );
        this.checkInvariant();
    }

    public append(c: string): void {
        IllegalArgumentException.assert(
            c !== null && c !== undefined,
            "append: component must not be null or undefined"
        );

        const before = this.components.length;
        this.components.push(c);

        MethodFailedException.assert(
            this.components.length === before + 1,
            "append: number of components must increase by one"
        );
        this.checkInvariant();
    }

    public remove(i: number): void {
        this.ensureIndex(i, { allowAtEnd: false });

        const before = this.components.length;
        this.components.splice(i, 1);

        MethodFailedException.assert(
            this.components.length === before - 1,
            "remove: number of components must decrease by one"
        );
        this.checkInvariant();
    }



    protected checkInvariant(): void {
        this.verifyInvariant();

        InvalidStateException.assert(
            this.components !== null && this.components !== undefined,
            "invariant: components array must not be null or undefined"
        );
        for (const comp of this.components) {
            InvalidStateException.assert(
                comp !== null && comp !== undefined,
                "invariant: each component must not be null or undefined"
            );
        }
    }


    private ensureIndex(i: number, opts: { allowAtEnd: boolean }): void {
        IllegalArgumentException.assert(
            Number.isInteger(i),
            "index must be an integer"
        );
        IllegalArgumentException.assert(
            i >= 0,
            "index must be non-negative"
        );
        const max = opts.allowAtEnd ? this.components.length : this.components.length - 1;
        IllegalArgumentException.assert(
            i <= max,
            "index out of range"
        );
    }
}
