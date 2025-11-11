import { DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "../common/Printable";
import { Name } from "./Name";

export class StringArrayName implements Name {

    protected delimiter: string = DEFAULT_DELIMITER;
    protected components: string[] = [];

    constructor(source: string[], delimiter?: string) {
        this.components = source;
        this.delimiter = delimiter ?? DEFAULT_DELIMITER;
    }

    public asString(delimiter: string = this.delimiter): string {
        let result : string = "";
        for (let i = 0; i < this.components.length; i++) {
            let ch = this.components[i];
            ch = this.unescapeComponent(ch);
            result += ch;
            if (i != this.components.length - 1){
                result += delimiter;
            }
        }
        return result;
    }

    public asDataString(): string {
        let result : string = "";
        for (let i = 0; i < this.components.length; i++) {
            const ch = this.components[i];
            result += ch;
            if (i != this.components.length - 1){
                result += DEFAULT_DELIMITER;
            }
        }
        return result;
    }

    public getDelimiterCharacter(): string {
        return this.delimiter;
    }

    public isEmpty(): boolean {
        return this.components.length == 0;
    }

    public getNoComponents(): number {
        return this.components.length;
    }

    public getComponent(i: number): string {
        return this.components[i];
    }

    public setComponent(i: number, c: string): void {
        if (i < 0 || i >= this.components.length) {
            throw new RangeError(`Index ${i} out of range`);
        }
        this.components[i] = c;
    }

    public insert(i: number, c: string): void {
        if (i < 0 || i > this.components.length) {
            throw new RangeError(`Index ${i} out of range [0, ${this.components.length}]`);
        }
        this.components.splice(i, 0, c);
    }

    public append(c: string): void {
        this.components.push(c);
    }

    public remove(i: number): void {
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

    private unescapeComponent(c: string): string {
        let result : string = "";
        for (let i = 0; i < c.length; i++) {
            const ch = c[i];
            if (ch === "\\" ) {
                if (i  < c.length - 1) {
                    result += c[i + 1];
                    i++;
                }
                else {
                    result += "\\";
                }
            } else {
            result += ch; 
            }
        }
        return result;
    }

}