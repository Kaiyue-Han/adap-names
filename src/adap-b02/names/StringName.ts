import { DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "../common/Printable";
import { Name } from "./Name";

export class StringName implements Name {

    protected delimiter: string = DEFAULT_DELIMITER;
    protected name: string = "";
    protected noComponents: number = 0;

    constructor(source: string, delimiter?: string) {
        this.name = source;
        this.delimiter = delimiter ?? DEFAULT_DELIMITER;
        this.setNoComponents();
    }

    public asString(delimiter: string = this.delimiter): string {
        const comps = this.parseComponents(this.name, this.delimiter);
        let result = "";
        for (let i = 0; i < comps.length; i++) {
            const human = this.unescapeComponent(comps[i]);
            result += human;
            if (i !== comps.length - 1) {
                result += delimiter;
            }
        }
        return result;
    }

    public asDataString(): string {
        const comps = this.parseComponents(this.name, this.delimiter);
        let result = "";
        for (let i = 0; i < comps.length; i++) {
            result += comps[i];
            if (i !== comps.length - 1) {
                result += DEFAULT_DELIMITER;
            }
        }
        return result;
    }

    public getDelimiterCharacter(): string {
        return this.delimiter;
    }

    public isEmpty(): boolean {
        return this.name.length == 0;
    }

    public getNoComponents(): number {
        return this.noComponents;
    }

    public getComponent(x: number): string {
        const comps = this.parseComponents(this.name, this.delimiter);
        if (x < 0 || x >= comps.length) {
            throw new RangeError(`Index ${x} out of range`);
        }
        return comps[x];
    }

    public setComponent(n: number, c: string): void {
        const comps = this.parseComponents(this.name, this.delimiter);
        if (n < 0 || n >= comps.length) {
            throw new RangeError(`Index ${n} out of range`);
        }
        comps[n] = c;
        this.rebuildFromComponents(comps);
    }

    public insert(n: number, c: string): void {
        const comps = this.parseComponents(this.name, this.delimiter);
        if (n < 0 || n > comps.length) {
            throw new RangeError(`Index ${n} out of range`);
        }
        comps.splice(n, 0, c);
        this.rebuildFromComponents(comps);
    }

    public append(c: string): void {
        const comps = this.parseComponents(this.name, this.delimiter);
        comps.push(c);
        this.rebuildFromComponents(comps);
    }

    public remove(n: number): void {
        const comps = this.parseComponents(this.name, this.delimiter);
        if (n < 0 || n >= comps.length) {
            throw new RangeError(`Index ${n} out of range`);
        }
        comps.splice(n, 1);
        this.rebuildFromComponents(comps);
    }

    public concat(other: Name): void {
        const comps = this.parseComponents(this.name, this.delimiter);

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

            comps.push(reMasked);
        }

        this.rebuildFromComponents(comps);

    }

    private setNoComponents(): void {
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
    
    private unescapeComponent(c: string): string {
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