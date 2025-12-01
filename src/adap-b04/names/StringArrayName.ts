import { DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "../common/Printable";
import { Name } from "./Name";
import { AbstractName } from "./AbstractName";
import { IllegalArgumentException } from "../common/IllegalArgumentException";

export class StringArrayName extends AbstractName {

    protected components: string[] = [];

    constructor(source: string[], delimiter?: string) {
        IllegalArgumentException.assert(
            source !== null && source !== undefined,
            "source must not be null or undefined"
        );
        super(delimiter);
        this.components = source;
        this.assertInvariant();
    }

    public getNoComponents(): number {
        return this.components.length;
    }

    public getComponent(i: number): string {
        IllegalArgumentException.assert(
            i >= 0 && i < this.components.length,
            `Index ${i} out of range`
        );
        return this.components[i];
    }

    public setComponent(i: number, c: string) {
        IllegalArgumentException.assert(
            i >= 0 && i < this.components.length,
            `Index ${i} out of range`
        );
        this.components[i] = c;
        this.assertInvariant();
    }

    public insert(i: number, c: string) {
        IllegalArgumentException.assert(
            i >= 0 && i <= this.components.length,
            `Index ${i} out of range`
        );
        this.components.splice(i, 0, c);
        this.assertInvariant();
    }

    public append(c: string) {
        this.components.push(c);
        this.assertInvariant();
    }

    public remove(i: number) {
        IllegalArgumentException.assert(
            i >= 0 && i < this.components.length,
            `Index ${i} out of range`
        );
        this.components.splice(i, 1);
        this.assertInvariant();
    }

}
