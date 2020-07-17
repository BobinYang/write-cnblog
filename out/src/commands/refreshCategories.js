"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
const blog_categories_provider_1 = require("../blog/blog-categories-provider");
function refreshCategoriesActivate(context) {
    let refreshCategoriesDisposable = vscode.commands.registerCommand('writeCnblog.refreshCategories', () => {
        blog_categories_provider_1.blogCategoriesProvider.refresh();
    });
    context.subscriptions.push(refreshCategoriesDisposable);
}
exports.refreshCategoriesActivate = refreshCategoriesActivate;
//# sourceMappingURL=refreshCategories.js.map