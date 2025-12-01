import { DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "../common/Printable";
import { Name } from "./Name";
import { IllegalArgumentException } from "../common/IllegalArgumentException";
import { InvalidStateException } from "../common/InvalidStateException";
import { MethodFailedException } from "../common/MethodFailedException";

export abstract class AbstractName implements Name {

    protected delimiter: string = DEFAULT_DELIMITER;

    private static isValidDelimiter(d: string | null | undefined): boolean {
        return d != null && d.length === 1;
    }

    constructor(delimiter: string = DEFAULT_DELIMITER) {
        IllegalArgumentException.assert(
            AbstractName.isValidDelimiter(delimiter),
            "delimiter must be a single, non-null character"
        );
        this.delimiter = delimiter;
    }

    protected assertInvariant(): void {
        InvalidStateException.assert(
            AbstractName.isValidDelimiter(this.delimiter),
            "delimiter must always be a single character"
        );
        InvalidStateException.assert(
            this.getNoComponents() >= 0,
            "number of components must not be negative"
        );
    }

    public clone(): Name {
        const arr: string[] = [];
        const count = this.getNoComponents();

        for (let i = 0; i < count; i++) {
            arr.push(this.getComponent(i));
        }

        const cloned = new (this.constructor as any)(arr, this.delimiter) as Name;

        MethodFailedException.assert(
            cloned.getNoComponents() === count,
            "clone must have the same number of components"
        );

        return cloned;
    }

    public asString(delimiter: string = this.delimiter): string {
        IllegalArgumentException.assert(
            AbstractName.isValidDelimiter(delimiter),
            "delimiter must be a single, non-null character"
        );

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
        IllegalArgumentException.assert(
            other !== null && other !== undefined,
            "other must not be null or undefined"
        );

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
    abstract setComponent(i: number, c: string): void;

    abstract insert(i: number, c: string): void;
    abstract append(c: string): void;
    abstract remove(i: number): void;

    public concat(other: Name): void {
        IllegalArgumentException.assert(
            other !== null && other !== undefined,
            "other must not be null or undefined"
        );

        const before = this.getNoComponents();

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

            this.append(reMasked);
        }

        this.assertInvariant();

        MethodFailedException.assert(
            this.getNoComponents() === before + other.getNoComponents(),
            "concat must increase number of components by the size of other"
        );
    }

    protected unescapeComponent(c: string): string {
        let result = "";
        for (let i = 0; i < c.length; i++) {
            const ch = c[i];
            if (ch === ESCAPE_CHARACTER) {
                if (i < c.length - 1) {
                    result += c[i + 1];
                    i++;
                } else {
                    result += ESCAPE_CHARACTER;
                }
            } else {
                result += ch;
            }
        }
        return result;
    }

}