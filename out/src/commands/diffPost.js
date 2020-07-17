"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
function diffPostActivate(context) {
    let diffPostDisposable = vscode.commands.registerCommand('writeCnblog.diffPost', (blogPostItem) => __awaiter(this, void 0, void 0, function* () {
        let postBaseInfo = blogPostItem.postBaseInfo;
        if (postBaseInfo && postBaseInfo.fsPath && postBaseInfo.remotePath) {
            let title = `远端：${postBaseInfo.remoteTitle}<--->本地：${postBaseInfo.title}`;
            yield vscode.commands.executeCommand('vscode.diff', vscode.Uri.file(postBaseInfo.remotePath), vscode.Uri.file(postBaseInfo.fsPath), title, { preview: true });
        }
    }));
    context.subscriptions.push(diffPostDisposable);
}
exports.diffPostActivate = diffPostActivate;
//# sourceMappingURL=diffPost.js.map