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

    public insert(i: number, c: string): StringName{
        const comps = this.parseComponents(this.name, this.delimiter);
        if (i < 0 || i > comps.length) {
            throw new RangeError(`Index ${i} out of range`);
        }
        comps.splice(i, 0, c);
        return this.createFromComponents(comps);

    }

    public append(c: string): StringName {
        const comps = this.parseComponents(this.name, this.delimiter);
        comps.push(c);
        return this.createFromComponents(comps);
    }

    public remove(i: number): StringName {
        const comps = this.parseComponents(this.name, this.delimiter);
        if (i < 0 || i >= comps.length) {
            throw new RangeError(`Index ${i} out of range`);
        }
        comps.splice(i, 1);
        return this.createFromComponents(comps);
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

    protected createFromComponents(components: string[]): StringName {
        const data = components.join(DEFAULT_DELIMITER);
        return new StringName(data, this.delimiter);
    }
    

}