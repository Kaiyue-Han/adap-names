import { DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "../common/Printable";
import { Name } from "./Name";
import { IllegalArgumentException } from "../common/IllegalArgumentException";
import { MethodFailedException } from "../common/MethodFailedException";
import { InvalidStateException } from "../common/InvalidStateException";

export abstract class AbstractName implements Name {

    protected delimiter: string = DEFAULT_DELIMITER;

    constructor(delimiter: string = DEFAULT_DELIMITER) {

        IllegalArgumentException.assert(
            delimiter !== null && delimiter !== undefined,
            "delimiter must not be null or undefined"
        );
        IllegalArgumentException.assert(
            delimiter.length === 1,
            "delimiter must be exactly one character"
        );

        this.delimiter = delimiter;
        this.verifyInvariant();
    }
    
    public abstract clone(): Object;

    public asString(delimiter: string = this.delimiter): string {

        IllegalArgumentException.assert(
            delimiter !== null && delimiter !== undefined,
            "asString: delimiter must not be null or undefined"
        );
        IllegalArgumentException.assert(
            delimiter.length === 1,
            "asString: delimiter must be one character"
        );

        let result = "";
        const n = this.getNoComponents();
        for (let i = 0; i < n; i++) {
            const masked = this.getComponent(i);
            const plain = this.unescapeComponent(masked);
            result += plain;
            if (i < n - 1) {
                result += delimiter;
            }
        }


        MethodFailedException.assert(
            result !== null && result !== undefined,
            "asString: result must not be null"
        );

        return result;
    }

    public toString(): string {
        return this.asDataString();
    }

    public asDataString(): string {
        const n = this.getNoComponents();
        let result = "";
        for (let i = 0; i < n; i++) {
            result += this.getComponent(i);
            if (i < n - 1) {
                result += DEFAULT_DELIMITER;
            }
        }

        MethodFailedException.assert(
            result !== null && result !== undefined,
            "asDataString: result must not be null"
        );
        return result;
    }

    public isEqual(other: Object): boolean {
        IllegalArgumentException.assert(
            other !== null && other !== undefined,
            "isEqual: other must not be null"
        );

        const o = other as any as Name;
        if (typeof o.getNoComponents !== "function" ||
            typeof o.getComponent !== "function" ||
            typeof o.getDelimiterCharacter !== "function") {
            return false;
        }

        if (this.getDelimiterCharacter() !== o.getDelimiterCharacter()) {
            return false;
        }
        const n = this.getNoComponents();
        if (n !== o.getNoComponents()) {
            return false;
        }
        for (let i = 0; i < n; i++) {
            if (this.getComponent(i) !== o.getComponent(i)) {
                return false;
            }
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
            "concat: other must not be null"
        );

        const before = this.getNoComponents();
        const addCount = other.getNoComponents();

        for (let i = 0; i < addCount; i++) {
            const incomingMasked = other.getComponent(i);
            const plain = this.unescapeComponent(incomingMasked);

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

        MethodFailedException.assert(
            this.getNoComponents() === before + addCount,
            "concat: number of components incorrect after concat"
        );
        this.verifyInvariant();
    }


    protected verifyInvariant(): void {
        InvalidStateException.assert(
            this.delimiter !== null && this.delimiter !== undefined,
            "invariant: delimiter must not be null or undefined"
        );
        InvalidStateException.assert(
            this.delimiter.length === 1,
            "invariant: delimiter must be one character"
        );
        const n = this.getNoComponents();
        InvalidStateException.assert(
            Number.isInteger(n) && n >= 0,
            "invariant: number of components must be a non-negative integer"
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