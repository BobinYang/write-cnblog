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
const blog_categories_provider_1 = require("../blog/blog-categories-provider");
const blog_file_1 = require("../blog/blog-file");
function selectCategoryActivate(context) {
    let selectCategoryDisposable = vscode.commands.registerCommand('writeCnblog.selectCategory', (blogPostItem) => {
        vscode.window.showQuickPick(getCategories(blogPostItem), {
            canPickMany: true
        }).then(selects => {
            if (selects && selects.length > 0) {
                let id = blogPostItem.postBaseInfo.id;
                if (id) {
                    try {
                        blog_file_1.blogFile.addCategories(id, selects);
                        vscode.window.showInformationMessage("添加完成");
                        blog_post_provider_1.blogPostProvider.refresh();
                    }
                    catch (error) {
                        vscode.window.showErrorMessage(error.message);
                    }
                }
            }
        });
    });
    context.subscriptions.push(selectCategoryDisposable);
}
exports.selectCategoryActivate = selectCategoryActivate;
function getCategories(blogPostItem) {
    return __awaiter(this, void 0, void 0, function* () {
        let categories = yield blog_categories_provider_1.blogCategoriesProvider.getCategories();
        return categories.filter(c => {
            let postCategories = blogPostItem.postBaseInfo.categories;
            if (postCategories) {
                return !postCategories.includes(c);
            }
            return true;
        });
    });
}
//# sourceMappingURL=selectCategory.js.map