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
const blog_operate_1 = require("../blog/blog-operate");
const blog_post_provider_1 = require("../blog/blog-post-provider");
const blog_file_1 = require("../blog/blog-file");
function savePostActivate(context) {
    let savePostDisposable = vscode.commands.registerCommand('writeCnblog.savePost', (blogPostItem) => __awaiter(this, void 0, void 0, function* () {
        if (blogPostItem.postBaseInfo) {
            try {
                yield pushPost(blogPostItem.postBaseInfo.id, false);
                vscode.window.showInformationMessage("保存草稿成功");
            }
            catch (error) {
                vscode.window.showErrorMessage(error.message);
            }
        }
    }));
    context.subscriptions.push(savePostDisposable);
}
exports.savePostActivate = savePostActivate;
function pushPost(id, publish) {
    return __awaiter(this, void 0, void 0, function* () {
        let post = yield blog_file_1.blogFile.getPost(id);
        if (post.postid) {
            yield blog_operate_1.blogOperate.editPost(post, publish);
        }
        else {
            let postId = yield blog_operate_1.blogOperate.newPos(post, publish);
            blog_file_1.blogFile.updatePostId(postId, id);
            post.postid = postId;
        }
        let updatePost = yield blog_operate_1.blogOperate.getPost(post.postid);
        yield blog_file_1.blogFile.pullPost(updatePost);
        blog_post_provider_1.blogPostProvider.refresh();
    });
}
exports.pushPost = pushPost;
//# sourceMappingURL=savePost.js.map