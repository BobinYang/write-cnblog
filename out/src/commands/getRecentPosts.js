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
const blog_operate_1 = require("../blog/blog-operate");
const blog_file_1 = require("../blog/blog-file");
const blog_post_provider_1 = require("../blog/blog-post-provider");
const blog_config_1 = require("../blog/blog-config");
function getRecentPostsActivate(context) {
    let getRecentPostsDisposable = vscode.commands.registerCommand('writeCnblog.getRecentPosts', () => {
        vscode.window.withProgress({
            location: vscode.ProgressLocation.Window,
            title: "获取最近文章!",
            cancellable: true
        }, (progress, token) => __awaiter(this, void 0, void 0, function* () {
            token.onCancellationRequested(() => {
                console.log("User canceled the long running operation");
            });
            try {
                let recentPostCount = blog_config_1.blogConfig.recentPostCount();
                if (!recentPostCount) {
                    recentPostCount = 100;
                }
                progress.report({ increment: 0 });
                progress.report({ increment: 10, message: "下载文章内容..." });
                let posts = yield blog_operate_1.blogOperate.getRecentPosts(recentPostCount);
                progress.report({ increment: 40, message: "下载图片和写入文章..." });
                yield blog_file_1.blogFile.pullPosts(posts);
                progress.report({ increment: 50, message: "下载完成" });
            }
            catch (error) {
                vscode.window.showErrorMessage(error.message);
            }
            var p = new Promise(resolve => {
                blog_post_provider_1.blogPostProvider.refresh();
                resolve();
            });
            return p;
        })).then(r => {
            vscode.window.showInformationMessage("下载文章完成！");
        });
    });
    context.subscriptions.push(getRecentPostsDisposable);
}
exports.getRecentPostsActivate = getRecentPostsActivate;
//# sourceMappingURL=getRecentPosts.js.map