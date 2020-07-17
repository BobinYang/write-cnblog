"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
function seeLinkActivate(context) {
    let seeLinkDisposable = vscode.commands.registerCommand('writeCnblog.seeLink', (blogPostItem) => {
        if (blogPostItem.postBaseInfo && blogPostItem.postBaseInfo.link) {
            vscode.commands.executeCommand('vscode.open', vscode.Uri.parse(blogPostItem.postBaseInfo.link));
        }
        else {
            vscode.window.showInformationMessage("文章还未发布到网站");
        }
    });
    context.subscriptions.push(seeLinkDisposable);
}
exports.seeLinkActivate = seeLinkActivate;
//# sourceMappingURL=seeLink.js.map