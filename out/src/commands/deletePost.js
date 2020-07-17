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
const blog_post_provider_1 = require("../blog/blog-post-provider");
const blog_file_1 = require("../blog/blog-file");
const blog_operate_1 = require("../blog/blog-operate");
function deletePostActivate(context) {
    let deletePostDisposable = vscode.commands.registerCommand('writeCnblog.deletePost', (blogPostItem) => {
        vscode.window
            .showWarningMessage(`是否删除${blogPostItem.label}`, '删除', '取消')
            .then((selection) => __awaiter(this, void 0, void 0, function* () {
            try {
                if (selection === '删除' && blogPostItem.postBaseInfo) {
                    blog_file_1.blogFile.deletePost(blogPostItem.postBaseInfo);
                    let postId = blogPostItem.postBaseInfo.postId;
                    if (postId) {
                        yield blog_operate_1.blogOperate.deletePost(postId, false);
                    }
                }
            }
            catch (error) {
                vscode.window.showErrorMessage(error.message);
            }
            finally {
                blog_post_provider_1.blogPostProvider.refresh();
            }
        }));
    });
    context.subscriptions.push(deletePostDisposable);
}
exports.deletePostActivate = deletePostActivate;
//# sourceMappingURL=deletePost.js.map