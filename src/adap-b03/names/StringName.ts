import { DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "../common/Printable";
import { Name } from "./Name";
import { AbstractName } from "./AbstractName";

export class StringName extends AbstractName {

    protected name: string = "";
    protected noComponents: number = 0;

    constructor(source: string, delimiter?: string) {
        super(delimiter);
        this.name = source;
        this.setNoComponents();
    }

    public getNoComponents(): number {
        return this.noComponents;
    }

    public getComponent(i: number): string {
        const comps = this.parseComponents(this.name, this.delimiter);
        if (i < 0 || i >= comps.length) {
            throw new RangeError(`Index ${i} out of range`);
        }
        return comps[i];
    }

    public setComponent(i: number, c: string) {
        const comps = this.parseComponents(this.name, this.delimiter);
        if (i < 0 || i >= comps.length) {
            throw new RangeError(`Index ${i} out of range`);
        }
        comps[i] = c;
        this.rebuildFromComponents(comps);
    }

    public insert(i: number, c: string) {
        const comps = this.parseComponents(this.name, this.delimiter);
        if (i < 0 || i > comps.length) {
            throw new RangeError(`Index ${i} out of range`);
        }
        comps.splice(i, 0, c);
        this.rebuildFromComponents(comps);
    }

    public append(c: string) {
        const comps = this.parseComponents(this.name, this.delimiter);
        comps.push(c);
        this.rebuildFromComponents(comps);
    }

    public remove(i: number) {
        const comps = this.parseComponents(this.name, this.delimiter);
        if (i < 0 || i >= comps.length) {
            throw new RangeError(`Index ${i} out of range`);
        }
        comps.splice(i, 1);
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
    

}