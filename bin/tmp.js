"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StackTrace = void 0;
const Log_1 = require("./Log");
const TextStorage_1 = require("./TextStorage");
const stringify_1 = require("./stringify");
const proxy_1 = require("./proxy");
class StackTrace {
    constructor(open = false, details = false, lengthLimit = 50) {
        this.open = open;
        this.details = details;
        this.line = 0;
        this.lengthLimit = lengthLimit;
        this.log = new Log_1.Log();
        this.textStorage = new TextStorage_1.TextStorage();
        this.proxy_map = new Map();
    }
    getType(target) {
        if (Array.isArray(target))
            return 'array';
        else if (target && target.buffer)
            return 'arraybuffer'; // target instanceof ArrayBuffer 不算在内
        else if (target == null)
            return 'null';
        return typeof target;
    }
    stringify(...variables) {
        let result = "";
        for (let variable of variables) {
            result += (0, stringify_1.stringify)(variable, this.lengthLimit);
            result += " ";
        }
        return result.slice(0, -1);
    }
    addContent(text, maxLine = 10000) {
        this.textStorage.add(text + '\r\n');
        this.line += 1;
        if (this.line % maxLine == 0) {
            this.log.debug(this.line + "");
            this.textStorage.blobStored();
        }
    }
    proxy(proxyObject, name, condition = () => { return false; }) {
        let is_has = this.proxy_map.has(proxyObject);
        if (is_has)
            return proxyObject;
        else {
            let tmp = (0, proxy_1.proxy)(proxyObject, name, (name, mode, target, property, value) => {
                if (!this.open)
                    return;
                if (mode != "set" && mode != "get")
                    return;
                let content;
                let select;
                let text;
                if (this.details)
                    select = target;
                else
                    select = value;
                content = this.stringify(select);
                text = `${name}|${mode}| 下标: ${property.toString()} 内容: ${content}`;
                this.addContent(text, 10000);
                if (condition(this.line, name, mode, property.toString(), select, content))
                    debugger;
            });
            this.proxy_map.set(tmp, name);
            return tmp;
        }
    }
    download(fileName = '日志.txt') {
        this.textStorage.download(fileName);
        this.clear();
    }
    clear() {
        this.textStorage.clear();
        this.line = 0;
        this.open = false;
    }
}
exports.StackTrace = StackTrace;
