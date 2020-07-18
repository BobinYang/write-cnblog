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
const dateFormat = function (d, formatStr) {
    d = new Date(d);
    var str = formatStr;
    var Week = ['日', '一', '二', '三', '四', '五', '六'];

    str = str.replace(/yyyy|YYYY/, d.getFullYear());
    str = str.replace(/yy|YY/, (d.getYear() % 100) > 9 ? (d.getYear() % 100).toString() : '0' + (d.getYear() % 100));

    str = str.replace(/MM/, d.getMonth() > 9 ? d.getMonth().toString() : '0' + d.getMonth());
    str = str.replace(/M/g, d.getMonth());

    str = str.replace(/w|W/g, Week[d.getDay()]);
    str = str.replace(/dd|DD/, d.getDate() > 9 ? d.getDate().toString() : '0' + d.getDate());
    str = str.replace(/d|D/g, d.getDate());

    str = str.replace(/hh|HH/, d.getHours() > 9 ? d.getHours().toString() : '0' + d.getHours());

    str = str.replace(/h|H/g, d.getHours());
    str = str.replace(/mm/, d.getMinutes() > 9 ? d.getMinutes().toString() : '0' + d.getMinutes());
    str = str.replace(/m/g, d.getMinutes());
    str = str.replace(/ss|SS/, d.getSeconds() > 9 ? d.getSeconds().toString() : '0' + d.getSeconds());

    str = str.replace(/s|S/g, d.getSeconds());
    return str;
}
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
                if (a.dateCreated && b.dateCreated) {
                    return b.dateCreated - a.dateCreated;
                }
                else if (a.dateCreated && !b.dateCreated) {
                    return -1;
                }
                else if (!a.dateCreated && !b.dateCreated) {
                    return 1;
                }
                return 0;
            }
            return a.state - b.state;
        }).map((postBaseInfo, i) => {
            return {
                type: BlogPostItemType.post,
                label: (i + 1) + "、" + postBaseInfo.title,
                description: postBaseInfo.postId.toString() + " 日期：" + dateFormat(postBaseInfo.dateCreated, 'yyyy-MM-dd hh:mm:ss'),
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