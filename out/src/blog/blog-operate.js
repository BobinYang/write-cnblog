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
const blog_config_1 = require("./blog-config");
const rpc_client_1 = require("../rpc/rpc-client");
class BlogOperate {
    get rpcClient() {
        if (this._rpcClient) {
            return this._rpcClient;
        }
        let rpcUrl = this.config.rpcUrl();
        if (rpcUrl) {
            this._rpcClient = new rpc_client_1.RpcClient(rpcUrl);
            return this._rpcClient;
        }
        throw new Error("请配置MetaWeblog访问地址");
    }
    get config() {
        return blog_config_1.blogConfig;
    }
    get blogId() {
        let blogId = this.config.blogId;
        if (!blogId) {
            throw new Error("请配博客Id");
        }
        return blogId;
    }
    /**
    * 从配置文件里面获取用户名和密码
    */
    userInfo() {
        return __awaiter(this, void 0, void 0, function* () {
            let userName = this.config.userName();
            if (!userName) {
                throw new Error("请配置用户名");
            }
            let password = yield this.config.password();
            if (!password) {
                throw new Error("请配置密码");
            }
            return {
                username: userName,
                password: password
            };
        });
    }
    /**
     * 获取博客的信息
     * @param rpcUrl
     * @param userInfo
     */
    blogInfo(rpcUrl, userInfo) {
        return __awaiter(this, void 0, void 0, function* () {
            let rpcClient = new rpc_client_1.RpcClient(rpcUrl);
            return yield rpcClient.getUsersBlogs(Object.assign({ appKey: blog_config_1.AppKey }, userInfo));
        });
    }
    /**
     * 获取最近文章
     * @param numberOfPosts 总共要获取多少
     */
    getRecentPosts(numberOfPosts) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.rpcClient.getRecentPosts(Object.assign({ blogid: this.blogId }, yield this.userInfo(), { numberOfPosts: 2000}));
        });
    }
    /**
     * 发布新文章
     * @param post
     * @param publish true为发布文章，false为保存草稿
     */
    newPos(post, publish) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.rpcClient.newPost(Object.assign({ blogid: this.blogId }, yield this.userInfo(), { post: post, publish: publish }));
        });
    }
    /**
     * 获取文章内容
     * @param postId
     */
    getPost(postId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.rpcClient.getPost(Object.assign({ postid: postId }, yield this.userInfo()));
        });
    }
    /**
     * 更新文章
     * @param post
     * @param publish true为发布文章，false为保存草稿
     */
    editPost(post, publish) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.rpcClient.editPost(Object.assign({ postid: post.postid }, yield this.userInfo(), { post: post, publish: publish }));
        });
    }
    /**
     * 删除文章
     * @param post
     * @param publish true为发布文章，false为保存草稿
     */
    deletePost(postid, publish) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.rpcClient.deletePost(Object.assign({ appKey: blog_config_1.AppKey, postid: postid }, yield this.userInfo(), { publish: publish }));
        });
    }
    /**
     * 获取分类目录列表
     */
    getCategories() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.rpcClient.getCategories(Object.assign({ blogid: this.blogId }, yield this.userInfo()));
        });
    }
    /**
     * 新建分类
     * @param categoryName
     */
    newCategory(categoryName) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.rpcClient.newCategory(Object.assign({ blog_id: this.blogId }, yield this.userInfo(), { category: {
                    name: categoryName,
                    parent_id: 0,
                    slug: "[随笔分类]"
                } }));
        });
    }
    /**
     * 上传图片，并返回图片地址
     * @param bits
     * @param type
     * @param name
     */
    newMediaObject(bits, type, name) {
        return __awaiter(this, void 0, void 0, function* () {
            let urlData = yield this.rpcClient.newMediaObject(Object.assign({ blogid: this.blogId }, yield this.userInfo(), { file: {
                    name: name,
                    type: type,
                    bits: bits
                } }));
            return urlData.url;
        });
    }
}
exports.BlogOperate = BlogOperate;
exports.blogOperate = new BlogOperate();
//# sourceMappingURL=blog-operate.js.map