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
const blog_config_1 = require("../blog/blog-config");
const blog_categories_provider_1 = require("../blog/blog-categories-provider");
const blog_operate_1 = require("../blog/blog-operate");
function setConfigActivate(context) {
    let setConfigDisposable = vscode.commands.registerCommand('writeCnblog.setConfig', () => __awaiter(this, void 0, void 0, function* () {
        let rpcUrl = yield vscode.window.showInputBox({
            prompt: "MetaWeblog访问地址",
            value: blog_config_1.blogConfig.rpcUrl()
        });
        if (!rpcUrl) {
            return;
        }
        let userName = yield vscode.window.showInputBox({
            prompt: "用户名",
            value: blog_config_1.blogConfig.userName()
        });
        if (!userName) {
            return;
        }
        let password = yield vscode.window.showInputBox({
            prompt: "密码",
            password: true
        });
        if (!password) {
            return;
        }
        try {
            let blogInfo = yield blog_operate_1.blogOperate.blogInfo(rpcUrl, {
                username: userName,
                password: password
            });
            yield blog_config_1.blogConfig.setBlogId(blogInfo.blogid);
            yield blog_config_1.blogConfig.setRpcUrl(rpcUrl);
            yield blog_config_1.blogConfig.setUserName(userName);
            yield blog_config_1.blogConfig.setPassword(password);
            vscode.window.showInformationMessage("配置成功");
            blog_post_provider_1.blogPostProvider.refresh();
            blog_categories_provider_1.blogCategoriesProvider.refresh();
        }
        catch (error) {
            vscode.window.showErrorMessage(error.message);
        }
    }));
    context.subscriptions.push(setConfigDisposable);
}
exports.setConfigActivate = setConfigActivate;
//# sourceMappingURL=setConfig.js.map