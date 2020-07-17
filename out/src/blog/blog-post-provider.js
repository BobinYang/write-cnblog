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
const path = require("path");
const blog_file_1 = require("./blog-file");
const shared_1 = require("./shared");
const blog_config_1 = require("./blog-config");
class BlogPostProvider {
    constructor() {
        this._onDidChangeTreeData = new vscode.EventEmitter();
        this.onDidChangeTreeData = this._onDidChangeTreeData.event;
    }
    refresh() {
        return __awaiter(this, void 0, void 0, function* () {
            this._onDidChangeTreeData.fire();
        });
    }
    initialize(context) {
        this.context = context;
    }
    getTreeItem(element) {
        if (element.type === BlogPostItemType.post) {
            element.collapsibleState = element.postBaseInfo.categories ?
                vscode.TreeItemCollapsibleState.Collapsed :
                vscode.TreeItemCollapsibleState.None;
        }
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
        if (element &&
            element.postBaseInfo &&
            element.postBaseInfo.categories) {
            return element.postBaseInfo.categories.map(c => {
                return {
                    type: BlogPostItemType.category,
                    label: c,
                    postBaseInfo: element.postBaseInfo,
                    contextValue: "Category"
                };
            });
        }
        return blog_file_1.blogFile.readPosts().sort((a, b) => {
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
        }).map((postBaseInfo) => {
            return {
                type: BlogPostItemType.post,
                label: postBaseInfo.title,
                description: postBaseInfo.postId.toString(),
                postBaseInfo: postBaseInfo,
                contextValue: this.getContextValue(postBaseInfo),
                command: {
                    command: 'writeCnblog.openPost', title: "打开文章", arguments: [vscode.Uri.file(postBaseInfo.fsPath)]
                },
                iconPath: this.getIcon(postBaseInfo.state)
            };
        });
    }
    getContextValue(postBaseInfo) {
        if (postBaseInfo.state === shared_1.PostState.M) {
            return 'BlogPostItem-diff';
        }
        else if (postBaseInfo.state === shared_1.PostState.U) {
            return 'BlogPostItem-create';
        }
        return 'BlogPostItem';
    }
    getIcon(state) {
        if (this.context === undefined) {
            throw new Error("context需要初始化");
        }
        switch (state) {
            case shared_1.PostState.U:
                return this.context.asAbsolutePath(path.join('resources', 'U.svg'));
            case shared_1.PostState.M:
                return this.context.asAbsolutePath(path.join('resources', 'M.svg'));
            case shared_1.PostState.D:
                return this.context.asAbsolutePath(path.join('resources', 'D.svg'));
            default:
                return undefined;
        }
    }
}
exports.BlogPostProvider = BlogPostProvider;
exports.blogPostProvider = new BlogPostProvider();
class BlogPostItem extends vscode.TreeItem {
}
exports.BlogPostItem = BlogPostItem;
var BlogPostItemType;
(function (BlogPostItemType) {
    BlogPostItemType[BlogPostItemType["post"] = 0] = "post";
    BlogPostItemType[BlogPostItemType["category"] = 1] = "category";
})(BlogPostItemType = exports.BlogPostItemType || (exports.BlogPostItemType = {}));
//# sourceMappingURL=blog-post-provider.js.map