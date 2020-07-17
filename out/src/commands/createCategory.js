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
const blog_categories_provider_1 = require("../blog/blog-categories-provider");
const blog_operate_1 = require("../blog/blog-operate");
function createCategoryActivate(context) {
    let createCategoryDisposable = vscode.commands.registerCommand('writeCnblog.createCategory', () => {
        vscode.window.showInputBox({ prompt: "输入分类名称" }).then((categorie) => __awaiter(this, void 0, void 0, function* () {
            if (categorie) {
                try {
                    yield blog_operate_1.blogOperate.newCategory(categorie);
                    yield blog_categories_provider_1.blogCategoriesProvider.refresh();
                }
                catch (error) {
                    vscode.window.showErrorMessage(error.message);
                }
            }
        }));
    });
    context.subscriptions.push(createCategoryDisposable);
}
exports.createCategoryActivate = createCategoryActivate;
//# sourceMappingURL=createCategory.js.map