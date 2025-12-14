import { DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "../common/Printable";
import { Name } from "./Name";
import { AbstractName } from "./AbstractName";

export class StringArrayName extends AbstractName {

    protected components: string[] = [];

    constructor(source: string[], delimiter?: string) {
        super(delimiter);
        this.components = [...source];
    }

    public getNoComponents(): number {
        return this.components.length;
    }

    public getComponent(i: number): string {
        return this.components[i];
    }

    public insert(i: number, c: string): StringArrayName {
        if (i < 0 || i > this.components.length) {
            throw new RangeError(`Index ${i} out of range`);
        }
        let newcomponents = [...this.components];
        newcomponents.splice(i, 0, c);
        let result = new StringArrayName (newcomponents, this.delimiter);
        return result;
    }

    public append(c: string): StringArrayName {
        let newcomponents = [...this.components];
        newcomponents.push(c);
        let result = new StringArrayName (newcomponents, this.delimiter);
        return result;
    }

    public remove(i: number): StringArrayName {
        if (i < 0 || i >= this.components.length) {
            throw new RangeError(`Index ${i} out of range`);
        }

        let newcomponents = [...this.components];
        newcomponents.splice(i, 1);
        let result = new StringArrayName (newcomponents, this.delimiter);
        return result;
    }

    protected createFromComponents(components: string[]): StringArrayName {
        return new StringArrayName(components, this.delimiter);
    }
}