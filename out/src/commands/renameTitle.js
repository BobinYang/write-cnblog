"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
const blog_post_provider_1 = require("../blog/blog-post-provider");
const blog_file_1 = require("../blog/blog-file");
function renameTitleActivate(context) {
    let renameTitleDisposable = vscode.commands.registerCommand('writeCnblog.renameTitle', (blogPostItem) => {
        vscode.window.showInputBox({ value: blogPostItem.postBaseInfo.title }).then(title => {
            if (title) {
                try {
                    if (blogPostItem.postBaseInfo && title) {
                        let oldFilePath = blogPostItem.postBaseInfo.fsPath;
                        let newFilePath = blog_file_1.blogFile.renameTitle(blogPostItem.postBaseInfo, title);
                        let textEditor = vscode.window.visibleTextEditors
                            .find(t => t.document.fileName === oldFilePath);
                        if (textEditor && newFilePath) {
                            let viewColumn = textEditor.viewColumn;
                            textEditor.hide();
                            vscode.window.showTextDocument(vscode.Uri.file(newFilePath), { viewColumn: viewColumn });
                        }
                        blog_post_provider_1.blogPostProvider.refresh();
                    }
                }
                catch (error) {
                    vscode.window.showErrorMessage(error.message);
                }
            }
        });
    });
    context.subscriptions.push(renameTitleDisposable);
}
exports.renameTitleActivate = renameTitleActivate;
//# sourceMappingURL=renameTitle.js.map