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
const savePost_1 = require("./savePost");
function publishPostActivate(context) {
    let publishPostDisposable = vscode.commands.registerCommand('writeCnblog.publishPost', (blogPostItem) => __awaiter(this, void 0, void 0, function* () {
        if (blogPostItem.postBaseInfo) {
            try {
                yield savePost_1.pushPost(blogPostItem.postBaseInfo.id, true);
                vscode.window.showInformationMessage("发布文章成功");
            }
            catch (error) {
                vscode.window.showErrorMessage(error.message);
            }
        }
    }));
    context.subscriptions.push(publishPostDisposable);
}
exports.publishPostActivate = publishPostActivate;
//# sourceMappingURL=publishPost.js.map