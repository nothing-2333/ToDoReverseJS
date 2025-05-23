import { Log } from "./Log";
import { TextStorage } from "./TextStorage";
declare class StackTrace {
    open: boolean;
    details: boolean;
    line: number;
    lengthLimit: number;
    log: Log;
    textStorage: TextStorage;
    proxy_map: Map<object, string>;
    constructor(open?: boolean, details?: boolean, lengthLimit?: number);
    getType(target: any): string;
    stringify(...variables: any[]): string;
    addContent(text: string, maxLine?: number): void;
    proxy(proxyObject: object, name: string, condition?: Function): object;
    download(fileName?: string): void;
    clear(): void;
}
export { StackTrace };
