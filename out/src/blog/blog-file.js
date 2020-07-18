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
const fs = require("fs");
const path = require("path");
const constants_1 = require("../constants");
const blog_post_file_1 = require("./blog-post-file");
const blog_workspace_1 = require("./blog-workspace");
const post_image_replace_1 = require("./post-image-replace");
class BlogFile {
    constructor() {
        this._postIndexs = new Array();
    }
    /**
     * 工作空间目录
     */
    get folderPath() {
        return blog_workspace_1.blogWorkspace.folderPath;
    }
    /**
     * 索引路径
     */
    get indexPath() {
        return path.join(this.folderPath, constants_1.blogDirName, constants_1.blogIndexName);
    }
    /**
     * 索引Id
     */
    get indexId() {
        return this.postIndexs.length === 0 ?
            1 : this.postIndexs[this.postIndexs.length - 1].id + 1;
    }
    /**
     * 读取文章索引
     * @param folderPath
     */
    get postIndexs() {
        if (this._postIndexs.length === 0) {
            let indexPath = this.indexPath;
            if (fs.existsSync(indexPath)) {
                let context = fs.readFileSync(indexPath, { encoding: 'utf8' });
                this._postIndexs = JSON.parse(context);
            }
        }
        return this._postIndexs;
    }
    /**
     * 保存索引
     * @param folderPath
     * @param postIndexs
     */
    set postIndexs(postIndexs) {
        this._postIndexs = postIndexs;
        this.savePostIndexs();
    }
    /**
     * 持久化文章索引
     */
    savePostIndexs() {
        fs.writeFileSync(this.indexPath, JSON.stringify(this.postIndexs));
    }
    /**
     * 索引里面是否存在标题为title
     * @param postIndexs
     * @param title
     */
    hasIndexByTitle(title) {
        return this.postIndexs.findIndex(p => p.title === title) !== -1;
    }
    /**
     * 更新或者添加索引
     * @param postIndex
     */
    updateOrAddPostIndex(postIndex) {
        let oldPostIndex = this.postIndexs.find(p => p.postid === postIndex.postid);

        if (oldPostIndex && postIndex.postid) {
            postIndex.id = oldPostIndex.id;
            if (oldPostIndex.title === oldPostIndex.remoteTitle) { //不相等不要覆盖
                oldPostIndex.title = postIndex.title;
            }
            oldPostIndex.remoteTitle = postIndex.remoteTitle;
            oldPostIndex.categories = postIndex.categories;
            oldPostIndex.link = postIndex.link;
            oldPostIndex.permalink = postIndex.permalink;
            oldPostIndex.dateCreated = postIndex.dateCreated;
        }
        else {
            postIndex.id = this.indexId;
            this.postIndexs.push(postIndex);
        }
        this.savePostIndexs();
        return postIndex;
    }
    updataOrAddIndex(postIndex) {
        let oldPostIndex = this.postIndexs.find(p => p.id === postIndex.id);
        if (oldPostIndex) {
            oldPostIndex.postid = postIndex.postid;
            oldPostIndex.title = postIndex.title;
            oldPostIndex.remoteTitle = postIndex.remoteTitle;
            oldPostIndex.categories = postIndex.categories;
            oldPostIndex.link = postIndex.link;
            oldPostIndex.permalink = postIndex.permalink;
            oldPostIndex.dateCreated = postIndex.dateCreated;
        }
        else {
            this.postIndexs.push(postIndex);
        }
        this.savePostIndexs();
    }
    /**
     * 根据文章文件填补索引
     * @param postIndexs
     */
    fillPostIndex() {
        this.readPostFiles()
            .filter(postFile => !this.hasIndexByTitle(postFile.title))
            .forEach(postFile => {
            this.updateOrAddPostIndex({
                id: 0,
                postid: 0,
                title: postFile.title,
                dateCreated:new Date()
            });
        });
    }
    /**
     * 读取文章索引的内容，并合并文件信息
     */
    postBaseInfosByIndex() {
        return this.postIndexs.map(postIndex => {
            let blogPostFile = new blog_post_file_1.BlogPostFile(postIndex);
            let postBaseInfo = {
                id: postIndex.id,
                postId: postIndex.postid,
                title: postIndex.title,
                remoteTitle: postIndex.remoteTitle,
                categories: postIndex.categories,
                link: postIndex.link,
                permalink: postIndex.permalink,
                state: blogPostFile.postState(),
                fsPath: blogPostFile.postPath,
                remotePath: blogPostFile.remotePostPath,
                dateCreated:postIndex.dateCreated
            };
            return postBaseInfo;
        });
    }
    /**
     * 获取文章的文件列表
     * @param folderPath
     */
    readPostFiles() {
        let folderPath = this.folderPath;
        let postFiles = new Array();
        const children = fs.readdirSync(folderPath);
        for (let i = 0; i < children.length; i++) {
            const child = children[i];
            const filePath = path.join(folderPath, child);
            const stat = fs.statSync(filePath);
            if (stat.isFile()) {
                let lastIndex = child.lastIndexOf('.');
                let childSub = child.substring(0, lastIndex);
                lastIndex = childSub.lastIndexOf('.');
                postFiles.push({
                    title: childSub.substring(0, lastIndex),
                    fsPath: filePath
                });
            }
        }
        return postFiles;
    }
    /**
     * 读取本地的文章列表
     */
    readPosts() {
        let postBaseInfos = new Array();
        if (blog_workspace_1.blogWorkspace.hasWorkspace) {
            this.fillPostIndex();
            postBaseInfos.push(...this.postBaseInfosByIndex());
        }
        return postBaseInfos;
    }
    /**
     * 更新多个文章到本地
     * @param posts
     */
    pullPosts(posts) {
        return __awaiter(this, void 0, void 0, function* () {
            if (yield blog_workspace_1.blogWorkspace.tryCreateBlogWorkspace()) {
                for (let index = 0; index < posts.length; index++) {
                    yield this.pullPost(posts[index]);
                }
            }
        });
    }
    /**
     * 根据postid创建一个BlogPostFile
     * @param postId
     */
    createBlogPostFileByPostId(postId) {
        let postIndex = this.postIndexs.find(p => p.postid === postId.toString());
        if (!postIndex || !postId) {
            postIndex = { id: this.indexId, postid: postId, title: "",dateCreated:new Date()};
        }
        return new blog_post_file_1.BlogPostFile(postIndex);
    }
    /**
     * 根据id创建一个BlogPostFile
     * @param id
     */
    createBlogPostFileById(id) {
        let postIndex = this.postIndexs.find(p => p.id === id);
        if (!postIndex) {
            throw new Error("该文章不存在");
        }
        return new blog_post_file_1.BlogPostFile(postIndex);
    }
    /**
     * 更新一个文章到本地
     * @param post
     */
    pullPost(post) {
        return __awaiter(this, void 0, void 0, function* () {

            let blogPostFile = this.createBlogPostFileByPostId(post.postid);

            let description = yield post_image_replace_1.postImageReplace.toLocal(post.description);

            blogPostFile.updatePost(post.title, description);

            blogPostFile.updateRemotePost(post.title, description);

            blogPostFile.updateCategories(post.categories);

            let postIndex = Object.assign({}, blogPostFile.getPostIndexInfo(), { link: post.link, permalink: post.permalink,dateCreated:post.dateCreated });

            this.updataOrAddIndex(postIndex);

        });
    }
    /**
     * 新建一个文章
     * @param title
     */
    createPost(title) {
        if (this.hasIndexByTitle(title)) {
            throw new Error("不能相同标题");
        }
        let blogPostFile = this.createBlogPostFileByPostId("");
        blogPostFile.create(title);
        this.updataOrAddIndex(blogPostFile.getPostIndexInfo());
    }
    /**
   * 重命名标题
   * @param postBaseInfo
   * @param newTitle
   */
    renameTitle(postBaseInfo, newTitle) {
        if (this.hasIndexByTitle(newTitle)) {
            throw new Error("不能相同标题");
        }
        let blogPostFile = this.createBlogPostFileById(postBaseInfo.id);
        blogPostFile.rename(newTitle);
        this.updataOrAddIndex(blogPostFile.getPostIndexInfo());
        return blogPostFile.postPath;
    }
    /**
     * 查找文章
     * @param id
     */
    getPost(id) {
        return __awaiter(this, void 0, void 0, function* () {
            let blogPostFile = this.createBlogPostFileById(id);
            let postIndex = blogPostFile.getPostIndexInfo();
            let description = yield post_image_replace_1.postImageReplace.toRemote(blogPostFile.description());
            let categories = postIndex.categories ? postIndex.categories : [];
            if (!categories.includes("[Markdown]")) {
                categories.push("[Markdown]");
            }
            let post = {
                postid: postIndex.postid,
                title: postIndex.title,
                description: description,
                dateCreated:postIndex.dateCreated,
                categories: categories
            };
            return post;
        });
    }
    /**
     *
     * @param postId
     * @param id
     */
    updatePostId(postId, id) {
        let postIndex = this.postIndexs.find(p => p.id === id);
        if (postIndex) {
            postIndex.postid = postId;
            this.updataOrAddIndex(postIndex);
        }
    }
    /**
     * 删除文章
     * @param postBaseInfo
     */
    deletePost(postBaseInfo) {
        let index = this.postIndexs.findIndex(p => p.id === postBaseInfo.id);
        if (index !== -1) {
            let blogPostFile = new blog_post_file_1.BlogPostFile(this.postIndexs[index]);
            blogPostFile.delete();
            this.postIndexs.splice(index, 1);
            this.savePostIndexs();
        }
    }
    /**
     * 添加一个或者多个分类
     * @param id
     * @param categories
     */
    addCategories(id, categories) {
        let postIndex = this.postIndexs.find(p => p.id === id);
        if (postIndex) {
            if (postIndex.categories) {
                postIndex.categories.push(...categories);
            }
            else {
                postIndex.categories = categories;
            }
            this.updataOrAddIndex(postIndex);
        }
    }
    /**
     * 删除一个分类
     * @param id
     * @param category
     */
    removeCategory(id, category) {
        let postIndex = this.postIndexs.find(p => p.id === id);
        if (postIndex) {
            if (postIndex.categories) {
                let index = postIndex.categories.indexOf(category);
                postIndex.categories.splice(index, 1);
                this.updataOrAddIndex(postIndex);
            }
        }
    }
}
exports.BlogFile = BlogFile;
exports.blogFile = new BlogFile();
//# sourceMappingURL=blog-file.js.map