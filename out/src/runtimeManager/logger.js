"use strict";
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
const lazy_1 = require("./lazy");
function isString(value) {
    return Object.prototype.toString.call(value) === '[object String]';
}
class Logger {
    constructor() {
        this.outputChannel = lazy_1.lazy(() => vscode.window.createOutputChannel('write-cnblog'));
    }
    log(message, data) {
        this.appendLine(`[Log - ${(new Date().toLocaleTimeString())}] ${message}`);
        if (data) {
            this.appendLine(Logger.data2String(data));
        }
    }
    appendLine(value = '') {
        return this.outputChannel.value.appendLine(value);
    }
    append(value) {
        return this.outputChannel.value.append(value);
    }
    show() {
        this.outputChannel.value.show();
    }
    static data2String(data) {
        if (data instanceof Error) {
            if (isString(data.stack)) {
                return data.stack;
            }
            return data.message;
        }
        if (isString(data)) {
            return data;
        }
        return JSON.stringify(data, undefined, 2);
    }
}
exports.Logger = Logger;
//# sourceMappingURL=logger.js.map