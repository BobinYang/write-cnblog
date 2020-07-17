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
const blog_operate_1 = require("./blog-operate");
const blog_config_1 = require("./blog-config");
class BlogCategoriesProvider {
    constructor() {
        this._onDidChangeTreeData = new vscode.EventEmitter();
        this.onDidChangeTreeData = this._onDidChangeTreeData.event;
    }
    getCategories() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.categories) {
                this.categories = yield blog_operate_1.blogOperate.getCategories();
            }
            return this.categories.map(c => c.title);
        });
    }
    refresh() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                this.categories = yield blog_operate_1.blogOperate.getCategories();
                this._onDidChangeTreeData.fire();
            }
            catch (error) {
                vscode.window.showErrorMessage(error.message);
            }
        });
    }
    getTreeItem(element) {
        return element;
    }
    getChildren(element) {
        if (!blog_config_1.blogConfig.blogId) {
            return [{
                    label: "配置用户信息",
                    command: {
                        command: 'writeCnblog.setConfig',
                        title: "配置用户信息"
                    }
                }];
        }
        if (this.categories) {
            return this.categories.map(c => {
                return {
                    id: c.categoryid,
                    label: c.title,
                    description: c.categoryid
                };
            });
        }
        else {
            this.refresh();
        }
        return [];
    }
}
exports.BlogCategoriesProvider = BlogCategoriesProvider;
exports.blogCategoriesProvider = new BlogCategoriesProvider();
//# sourceMappingURL=blog-categories-provider.js.map