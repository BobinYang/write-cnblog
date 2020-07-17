"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
const blog_post_provider_1 = require("../blog/blog-post-provider");
const blog_file_1 = require("../blog/blog-file");
function createPostActivate(context) {
    let createPostDisposable = vscode.commands.registerCommand('writeCnblog.createPost', () => {
        vscode.window.showInputBox().then(title => {
            if (title) {
                try {
                    blog_file_1.blogFile.createPost(title);
                    blog_post_provider_1.blogPostProvider.refresh();
                }
                catch (error) {
                    vscode.window.showErrorMessage(error.message);
                }
            }
        });
    });
    context.subscriptions.push(createPostDisposable);
}
exports.createPostActivate = createPostActivate;
//# sourceMappingURL=createPost.js.map