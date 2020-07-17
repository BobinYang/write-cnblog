"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
function openPostActivate(context) {
    let openPostDisposable = vscode.commands.registerCommand('writeCnblog.openPost', (resource) => {
        vscode.window.showTextDocument(resource);
    });
    context.subscriptions.push(openPostDisposable);
}
exports.openPostActivate = openPostActivate;
//# sourceMappingURL=openPost.js.map