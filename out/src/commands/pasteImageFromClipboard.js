"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
const fs = require("fs");
const path = require("path");
const blog_workspace_1 = require("../blog/blog-workspace");
const constants_1 = require("../constants");
let clip;
function pasteImageFromClipboardActivate(context) {
    if (!clip) {
        clip = require('clipboard-data');
    }
    let pasteImageFromClipboardDisposable = vscode.commands.registerCommand('writeCnblog.pasteImageFromClipboard', () => {
        try {
            let textEditor = vscode.window.activeTextEditor;
            if (textEditor) {
                let pngData = clip.getImage();
                let imageShortPath = path.join(constants_1.imageDirName, `${Date.now().toString()}.png`);
                let imagePath = path.join(blog_workspace_1.blogWorkspace.folderPath, imageShortPath);
                let writeStream = fs.createWriteStream(imagePath)
                    .on('close', function () {
                    if (textEditor) {
                        var url = `![](${imageShortPath})`;
                        textEditor.edit(function editDocument(editParams) {
                            if (textEditor) {
                                editParams.insert(textEditor.selection.active, url);
                            }
                        });
                    }
                });
                writeStream.write(pngData);
                writeStream.close();
            }
        }
        catch (error) {
            vscode.window.showErrorMessage(error.message);
        }
    });
    context.subscriptions.push(pasteImageFromClipboardDisposable);
}
exports.pasteImageFromClipboardActivate = pasteImageFromClipboardActivate;
//# sourceMappingURL=pasteImageFromClipboard.js.map