import { Node } from "./Node";
import { Directory } from "./Directory";
import { MethodFailedException } from "../common/MethodFailedException";
import { IllegalArgumentException } from "../common/IllegalArgumentException";


enum FileState {
    OPEN,
    CLOSED,
    DELETED        
};

export class File extends Node {

    protected state: FileState = FileState.CLOSED;

    constructor(baseName: string, parent: Directory) {
        super(baseName, parent);
    }

    public open(): void {
        IllegalArgumentException.assert(
            this.state !== FileState.DELETED,
            "cannot open a deleted file"
        );
        this.state = FileState.OPEN;

        MethodFailedException.assert(
            this.state === FileState.OPEN,
            "file must be open after open()"
        );
    }

    public read(noBytes: number): Int8Array {
        IllegalArgumentException.assert(
            noBytes >= 0,
            "noBytes must not be negative"
        );
        IllegalArgumentException.assert(
            this.state === FileState.OPEN,
            "file must be open for reading"
        );

        let result: Int8Array = new Int8Array(noBytes);

        let tries: number = 0;
        for (let i: number = 0; i < noBytes; i++) {
            try {
                result[i] = this.readNextByte();
            } catch(ex) {
                tries++;
                if (ex instanceof MethodFailedException) {
                    MethodFailedException.assert(tries < 3, "too many failed reads");
                }
            }
        }

        return result;
    }

    protected readNextByte(): number {
        IllegalArgumentException.assert(
            this.state === FileState.OPEN,
            "file must be open for reading"
        );
        return 0; // @todo
    }

    public close(): void {
        IllegalArgumentException.assert(
            this.state === FileState.OPEN,
            "file must be open to be closed"
        );
        this.state = FileState.CLOSED;


        MethodFailedException.assert(
            this.state === FileState.CLOSED,
            "file must be closed after close()"
        );
    }

    protected doGetFileState(): FileState {
        return this.state;
    }

}