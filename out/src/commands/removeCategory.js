"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
const blog_post_provider_1 = require("../blog/blog-post-provider");
const blog_file_1 = require("../blog/blog-file");
function removeCategoryActivate(context) {
    let removeCategoryDisposable = vscode.commands.registerCommand('writeCnblog.removeCategory', (blogPostItem) => {
        let id = blogPostItem.postBaseInfo.id;
        if (id && blogPostItem.label) {
            try {
                blog_file_1.blogFile.removeCategory(id, blogPostItem.label);
                vscode.window.showInformationMessage("移除成功");
                blog_post_provider_1.blogPostProvider.refresh();
            }
            catch (error) {
                vscode.window.showErrorMessage(error.message);
            }
        }
    });
    context.subscriptions.push(removeCategoryDisposable);
}
exports.removeCategoryActivate = removeCategoryActivate;
//# sourceMappingURL=removeCategory.js.map