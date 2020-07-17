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
const path = require("path");
const mkdirp = require("mkdirp");
const constants_1 = require("../constants");
const blog_config_1 = require("./blog-config");
class BlogWorkspace {
    get workspaceFolder() {
        return blog_config_1.blogConfig.blogWorkspace();
    }
    setWorkspaceFolder(fsPath) {
        return __awaiter(this, void 0, void 0, function* () {
            yield blog_config_1.blogConfig.setBlogWorkspace(fsPath);
        });
    }
    /**
     * 判断是否为文章的工作目录
     * @param fsPath
     */
    isBlogDirectory(fsPath) {
        const children = fs.readdirSync(fsPath);
        for (let i = 0; i < children.length; i++) {
            const child = children[i];
            const stat = fs.statSync(path.join(fsPath, child));
            if (stat.isDirectory() && child === constants_1.blogDirName) {
                return true;
            }
        }
        return false;
    }
    /**
     * 选择工作目录
     */
    selectWorkspace() {
        return __awaiter(this, void 0, void 0, function* () {
            let uris = yield vscode.window.showOpenDialog({
                canSelectFolders: true,
                canSelectFiles: false,
                canSelectMany: false
            });
            if (uris) {
                return uris[0].fsPath;
            }
            return undefined;
        });
    }
    /**
     * 是否有选择一个工作空间
     */
    get hasWorkspace() {
        if (this.workspaceFolder) {
            return this.isBlogDirectory(this.workspaceFolder);
        }
        return false;
    }
    /**
    * 本地文章存储文件夹
    */
    get folderPath() {
        if (!this.workspaceFolder) {
            throw new Error("请先选择一个工作空间");
        }
        return this.workspaceFolder;
    }
    /**
     * 远端文章存储文件夹
     */
    get remoteFolderPath() {
        return path.join(this.folderPath, constants_1.blogDirName, constants_1.remotePostDirName);
    }
    /**
     * 尝试创建一个博客工作目录
     */
    tryCreateBlogWorkspace() {
        return __awaiter(this, void 0, void 0, function* () {
            let workspaceFolder = this.workspaceFolder;
            let folder = workspaceFolder ? workspaceFolder : yield this.selectWorkspace();
            if (!folder) {
                return false;
            }
            yield this.setWorkspaceFolder(folder);
            if (this.isBlogDirectory(folder)) {
                return true;
            }
            mkdirp.sync(this.folderPath);
            mkdirp.sync(this.remoteFolderPath);
            return true;
        });
    }
}
exports.BlogWorkspace = BlogWorkspace;
exports.blogWorkspace = new BlogWorkspace();
//# sourceMappingURL=blog-workspace.js.map