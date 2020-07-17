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
const fs = require("fs");
const blog_operate_1 = require("../blog/blog-operate");
const blog_file_1 = require("../blog/blog-file");
const blog_post_provider_1 = require("../blog/blog-post-provider");
const blog_config_1 = require("../blog/blog-config");
const savePost_1 = require("./savePost");
const shared_1 = require("../blog/shared");
function publicEditedPostsActivate(context) {
    let publicEditedPostsDisposable = vscode.commands.registerCommand('writeCnblog.publicEditedPosts', () => {
        vscode.window.withProgress({
            location: vscode.ProgressLocation.Window,
            title: "批量发布文章!",
            cancellable: true
        }, (progress, token) => __awaiter(this, void 0, void 0, function* () {
            token.onCancellationRequested(() => {
                console.log("User canceled the long running operation");
            });
            try {
                progress.report({ increment: 0 });
                progress.report({ increment: 10, message: "批量发布文章内容..." });
                let posts = yield blog_file_1.blogFile.readPosts().sort((a, b) => {
                    if (a.state === b.state) {
                        if (a.postId && b.postId) {
                            return b.postId - a.postId;
                        }
                        else if (a.postId && !b.postId) {
                            return -1;
                        }
                        else if (!a.postId && !b.postId) {
                            return 1;
                        }
                        return 0;
                    }
                    return a.state - b.state;
                });
                progress.report({ increment: 40, message: "正在读取本地文章..." });
                let count = 0;
                fs.unlink("D:\log.txt", function () {
                    vscode.window.showInformationMessage("日志已删除，重写中！");
                });
                for (let index = 0; index < posts.length; index++) {
                    if (posts[index].state == shared_1.PostState.M) {
                        try {
                            yield savePost_1.pushPost(posts[index].id, true);
                            fs.writeFileSync("D:\log.txt", (Array(3).join("0") + (count++)).slice(-3) + " ： 成功：" + posts[index].title + "\r\n", { 'flag': 'a' });
                        }
                        catch (error) {
                            fs.writeFileSync("D:\log.txt", (Array(3).join("0") + (count++)).slice(-3) + " ： 出错：" + posts[index].title + "," + error.toString() + "\r\n", { 'flag': 'a' });
                            continue;
                        }
                    }
                }
                progress.report({ increment: 50, message: "发布完成" });
            } catch (error) {
                vscode.window.showErrorMessage(error.message);
            }
            var p = new Promise(resolve => {
                blog_post_provider_1.blogPostProvider.refresh();
                resolve();
            });
            return p;
        })).then(r => {
            vscode.window.showInformationMessage("发布文章完成！");
        });
    });
    context.subscriptions.push(publicEditedPostsDisposable);
}
exports.publicEditedPostsActivate = publicEditedPostsActivate;
//# sourceMappingURL=publicEditedPosts.js.map
