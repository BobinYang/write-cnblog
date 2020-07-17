"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
const fs = require("fs");
const rimraf = require("rimraf");
const shared_1 = require("./shared");
const constants_1 = require("../constants");
const blog_workspace_1 = require("./blog-workspace");
class BlogPostFile {
    constructor(postIndexInfo) {
        this.postIndexInfo = postIndexInfo;
    }
    /**
     * 本地文章存储文件夹
     */
    get folderPath() {
        return blog_workspace_1.blogWorkspace.folderPath;
    }
    /**
     * 远端文章存储文件夹
     */
    get remoteFolderPath() {
        return blog_workspace_1.blogWorkspace.remoteFolderPath;
    }
    /**
     * 本地某一个文章路径
     */
    get postPath() {
        return path.join(this.folderPath, `${this.postIndexInfo.title}.${this.postIndexInfo.id}${constants_1.fileExt}`);
    }
    /**
     * 远端某一个文章路径
     */
    get remotePostPath() {
        if (!this.postIndexInfo.remoteTitle) {
            return undefined;
        }
        return path.join(this.remoteFolderPath, `${this.postIndexInfo.remoteTitle}.${this.postIndexInfo.id}${constants_1.fileExt}`);
    }
    /**
     * 获取索引信息
     */
    getPostIndexInfo() {
        return this.postIndexInfo;
    }
    /**
     * 创建新文章
     * @param title
     */
    create(title) {
        this.postIndexInfo.title = title;
        fs.writeFileSync(this.postPath, "");
    }
    delete() {
        rimraf.sync(this.postPath);
    }
    /**
     * 修改新名称
     * @param newTitle
     */
    rename(newTitle) {
        let oldPath = this.postPath;
        this.postIndexInfo.title = newTitle;
        fs.renameSync(oldPath, this.postPath);
    }
    /**
     * 文章是否为新建
     */
    isNew() {
        return !this.postIndexInfo.remoteTitle &&
            !this.postIndexInfo.postid;
    }
    /**
     * 文章文件是否存在
     */
    exists() {
        return fs.existsSync(this.postPath);
    }
    /**
    * 文章是否有修改
    */
    isPostModify() {
        if (!this.remotePostPath || this.postIndexInfo.title === "") {
            return false;
        }
        let postIndexInfo = this.postIndexInfo;
        if (postIndexInfo.remoteTitle !== postIndexInfo.title) {
            return true;
        }
        return fs.readFileSync(this.postPath, { encoding: 'utf8' }) !==
            fs.readFileSync(this.remotePostPath, { encoding: 'utf8' });
    }
    /**
     * 文章状态
     */
    postState() {
        if (!this.exists()) {
            return shared_1.PostState.D;
        }
        else if (this.isNew()) {
            return shared_1.PostState.U;
        }
        else if (this.isPostModify()) {
            return shared_1.PostState.M;
        }
        return shared_1.PostState.R;
    }
    /**
     * 更新本地文章
     * @param title
     * @param description
     */
    updatePost(title, description) {
        if (this.postIndexInfo.title !== title &&
            !this.isPostModify()) {
            if (fs.existsSync(this.postPath)) {
                rimraf.sync(this.postPath);
            }
            this.postIndexInfo.title = title;
        }
        if (!fs.existsSync(this.postPath)) {
            fs.writeFileSync(this.postPath, description);
        }
    }
    /**
     * 更新远端文章
     * @param title
     * @param description
     */
    updateRemotePost(title, description) {
        if (this.postIndexInfo.remoteTitle !== title) {
            if (this.remotePostPath) {
                if (fs.existsSync(this.remotePostPath)) {
                    rimraf.sync(this.remotePostPath);
                }
            }
            this.postIndexInfo.remoteTitle = title;
        }
        if (this.remotePostPath) {
            fs.writeFileSync(this.remotePostPath, description);
        }
    }
    /**
     * 更新类别目录
     * @param categories
     */
    updateCategories(categories) {
        this.postIndexInfo.categories = categories;
    }
    /**
     * 读取文章详情
     */
    description() {
        return fs.readFileSync(this.postPath, { encoding: 'utf8' });
    }
}
exports.BlogPostFile = BlogPostFile;
//# sourceMappingURL=blog-post-file.js.map