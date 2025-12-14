import { DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "../common/Printable";
import { Name } from "./Name";

export abstract class AbstractName implements Name {

    protected delimiter: string = DEFAULT_DELIMITER;

    constructor(delimiter: string = DEFAULT_DELIMITER) {
        this.delimiter = delimiter;
    }

    public clone(): Name {
        const arr = [];
        for (let i = 0; i < this.getNoComponents(); i++) {
            arr.push(this.getComponent(i));
        }
        return this.createFromComponents(arr);
    }

    public asString(delimiter: string = this.delimiter): string {
        let result = "";
        for (let i = 0; i < this.getNoComponents(); i++) {
            const masked = this.getComponent(i);
            const plain = this.unescapeComponent(masked);
            result += plain;
            if (i !== this.getNoComponents() - 1) {
                result += delimiter;
            }
        }
        return result;
    }

    public toString(): string {
        return this.asDataString();
    }

    public asDataString(): string {
        let result = "";
        for (let i = 0; i < this.getNoComponents(); i++) {
            result += this.getComponent(i);
            if (i !== this.getNoComponents() - 1) {
                result += DEFAULT_DELIMITER;
            }
        }
        return result;
    }

    public isEqual(other: Name): boolean {
        if (this.getDelimiterCharacter() !== other.getDelimiterCharacter()) 
            return false;
        if (this.getNoComponents() !== other.getNoComponents()) 
            return false;

        for (let i = 0; i < this.getNoComponents(); i++) {
            if (this.getComponent(i) !== other.getComponent(i)) 
                return false;
        }
        return true;
    }

    public getHashCode(): number {
        const s = this.asDataString();
        let hash = 0;
        for (let i = 0; i < s.length; i++) {
            hash = (hash * 31 + s.charCodeAt(i)) | 0;
        }
        return hash;
    }

    public isEmpty(): boolean {
        return this.getNoComponents() === 0;
    }

    public getDelimiterCharacter(): string {
        return this.delimiter;
    }

    abstract getNoComponents(): number;

    abstract getComponent(i: number): string;

    abstract insert(i: number, c: string): Name;
    abstract append(c: string): Name;
    abstract remove(i: number): Name;

    public concat(other: Name): Name {

        const newComponents: string[] = [];

        for (let i = 0; i < this.getNoComponents(); i++) {
            newComponents.push(this.getComponent(i));
        }

        for (let i = 0; i < other.getNoComponents(); i++) {

            const plain = this.unescapeComponent(other.getComponent(i));
            let reMasked = "";
            for (let j = 0; j < plain.length; j++) {
                const ch = plain[j];
                if (ch === ESCAPE_CHARACTER || ch === this.delimiter) {
                    reMasked += ESCAPE_CHARACTER;
                }
                reMasked += ch;
            }
            newComponents.push(reMasked);
        }

        return this.createFromComponents(newComponents);
    }

    protected unescapeComponent(c: string): string {
        let result = "";
        for (let i = 0; i < c.length; i++) {
            const ch = c[i];
            if (ch === ESCAPE_CHARACTER) {
                if (i < c.length - 1) {
                    i++;
                    result += c[i];
                } else {
                    result += ESCAPE_CHARACTER;
                }
            } else {
                result += ch;
            }
        }
        return result;
    }

    protected abstract createFromComponents(components: string[]): Name;

}