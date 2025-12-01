import { DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "../common/Printable";
import { Name } from "./Name";
import { AbstractName } from "./AbstractName";
import { IllegalArgumentException } from "../common/IllegalArgumentException";
import { MethodFailedException } from "../common/MethodFailedException";
import { InvalidStateException } from "../common/InvalidStateException";

export class StringName extends AbstractName {

    protected name: string = "";
    protected noComponents: number = 0;

    constructor(source: string, delimiter: string = DEFAULT_DELIMITER) {
        IllegalArgumentException.assert(
            source !== null && source !== undefined,
            "StringName: source string must not be null or undefined"
        );

        super(delimiter);

        this.name = source;
        this.updateComponentCount();
        this.checkInvariant();
    }


    public clone(): Object {
        const copy = new StringName(this.name, this.delimiter);
        MethodFailedException.assert(
            (copy as Name).isEqual(this),
            "StringName.clone: cloned object must be equal to original"
        );
        return copy;
    }


    public getNoComponents(): number {
        return this.noComponents;
    }

    public getComponent(i: number): string {
        this.ensureIndex(i, { allowAtEnd: false });

        const comps = this.parseComponents(this.name, this.delimiter);
        const value = comps[i];

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

        const comps = this.parseComponents(this.name, this.delimiter);
        const before = comps.length;

        comps[i] = c;
        this.rebuildFromComponents(comps);

        MethodFailedException.assert(
            this.noComponents === before,
            "setComponent: number of components must stay the same"
        );
        this.checkInvariant();
    }

    public insert(i: number, c: string): void {
        this.ensureIndex(i, { allowAtEnd: true });
        IllegalArgumentException.assert(
            c !== null && c !== undefined,
            "insert: component must not be null or undefined"
        );

        const comps = this.parseComponents(this.name, this.delimiter);
        const before = comps.length;

        comps.splice(i, 0, c);
        this.rebuildFromComponents(comps);

        MethodFailedException.assert(
            this.noComponents === before + 1,
            "insert: number of components must increase by one"
        );
        this.checkInvariant();
    }

    public append(c: string): void {
        IllegalArgumentException.assert(
            c !== null && c !== undefined,
            "append: component must not be null or undefined"
        );

        const comps = this.parseComponents(this.name, this.delimiter);
        const before = comps.length;

        comps.push(c);
        this.rebuildFromComponents(comps);

        MethodFailedException.assert(
            this.noComponents === before + 1,
            "append: number of components must increase by one"
        );
        this.checkInvariant();
    }

    public remove(i: number): void {
        this.ensureIndex(i, { allowAtEnd: false });

        const comps = this.parseComponents(this.name, this.delimiter);
        const before = comps.length;

        comps.splice(i, 1);
        this.rebuildFromComponents(comps);

        MethodFailedException.assert(
            this.noComponents === before - 1,
            "remove: number of components must decrease by one"
        );
        this.checkInvariant();
    }


    protected checkInvariant(): void {
        this.verifyInvariant();

        InvalidStateException.assert(
            this.name !== null && this.name !== undefined,
            "invariant: name string must not be null or undefined"
        );

        const comps = this.parseComponents(this.name, this.delimiter);
        InvalidStateException.assert(
            comps.length === this.noComponents,
            "invariant: noComponents must equal parsed component count"
        );
        for (const c of comps) {
            InvalidStateException.assert(
                c !== null && c !== undefined,
                "invariant: each component must not be null or undefined"
            );
        }
    }


    private updateComponentCount(): void {
        this.noComponents = this.parseComponents(this.name, this.delimiter).length;
    }

    private parseComponents(source: string, delimiter: string): string[] {
        const result: string[] = [];
        let current = "";
        for (let i = 0; i < source.length; i++) {
            const ch = source[i];
            if (ch === ESCAPE_CHARACTER) {
                if (i < source.length - 1) {
                    current += source[i + 1];
                    i++;
                } else {
                    current += ESCAPE_CHARACTER;
                }
            } else if (ch === delimiter) {
                result.push(current);
                current = "";
            } else {
                current += ch;
            }
        }
        result.push(current);
        return result;
    }

    private rebuildFromComponents(components: string[]): void {
        this.name = components.join(this.delimiter);
        this.noComponents = components.length;
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
        const max = opts.allowAtEnd ? this.noComponents : this.noComponents - 1;
        IllegalArgumentException.assert(
            i <= max,
            "index out of range"
        );
    }

}
