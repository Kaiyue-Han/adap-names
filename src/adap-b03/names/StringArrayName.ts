import { DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "../common/Printable";
import { Name } from "./Name";
import { AbstractName } from "./AbstractName";

export class StringArrayName extends AbstractName {

    protected components: string[] = [];

    constructor(source: string[], delimiter?: string) {
        super(delimiter);
        this.components = source;
    }

    public getNoComponents(): number {
        return this.components.length;
    }

    public getComponent(i: number): string {
        return this.components[i];
    }

    public setComponent(i: number, c: string) {
        if (i < 0 || i >= this.components.length) {
            throw new RangeError(`Index ${i} out of range`);
        }
        this.components[i] = c;
    }

    public insert(i: number, c: string) {
        if (i < 0 || i > this.components.length) {
            throw new RangeError(`Index ${i} out of range`);
        }
        this.components.splice(i, 0, c);
    }

    public append(c: string) {
        this.components.push(c);
    }

    public remove(i: number) {
        if (i < 0 || i >= this.components.length) {
            throw new RangeError(`Index ${i} out of range`);
        }

        this.components.splice(i, 1);
    }

    public concat(other: Name): void {
        const otherDelim = other.getDelimiterCharacter();

        for (let i = 0; i < other.getNoComponents(); i++) {

            let plain = this.unescapeComponent(other.getComponent(i));
            let reMasked = "";
            for (let j = 0; j < plain.length; j++) {
                const ch = plain[j];
                if (ch === ESCAPE_CHARACTER || ch === this.delimiter) {
                    reMasked += ESCAPE_CHARACTER;
                }
                reMasked += ch;
            }
            this.components.push(reMasked);
        }
    }
}