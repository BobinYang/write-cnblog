'use strict';
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
const util = require("./runtimeManager/common");
const diffPost_1 = require("./commands/diffPost");
const openPost_1 = require("./commands/openPost");
const getRecentPosts_1 = require("./commands/getRecentPosts");
const createPost_1 = require("./commands/createPost");
const savePost_1 = require("./commands/savePost");
const publishPost_1 = require("./commands/publishPost");
const pullPost_1 = require("./commands/pullPost");
const blog_post_provider_1 = require("./blog/blog-post-provider");
const renameTitle_1 = require("./commands/renameTitle");
const deletePost_1 = require("./commands/deletePost");
const blog_categories_provider_1 = require("./blog/blog-categories-provider");
const refreshCategories_1 = require("./commands/refreshCategories");
const createCategory_1 = require("./commands/createCategory");
const selectCategory_1 = require("./commands/selectCategory");
const removeCategory_1 = require("./commands/removeCategory");
const setConfig_1 = require("./commands/setConfig");
const pasteImageFromClipboard_1 = require("./commands/pasteImageFromClipboard");
const seeLink_1 = require("./commands/seeLink");
const logger_1 = require("./runtimeManager/logger");
const ExtensionDownloader_1 = require("./runtimeManager/ExtensionDownloader");
function activate(context) {
    return __awaiter(this, void 0, void 0, function* () {
        blog_post_provider_1.blogPostProvider.initialize(context);
        vscode.window.createTreeView('blogPostExplorer', { treeDataProvider: blog_post_provider_1.blogPostProvider });
        vscode.window.createTreeView('blogCategoriesExplorer', { treeDataProvider: blog_categories_provider_1.blogCategoriesProvider });
        setConfig_1.setConfigActivate(context);
        createPost_1.createPostActivate(context);
        seeLink_1.seeLinkActivate(context);
        getRecentPosts_1.getRecentPostsActivate(context);
        openPost_1.openPostActivate(context);
        diffPost_1.diffPostActivate(context);
        savePost_1.savePostActivate(context);
        publishPost_1.publishPostActivate(context);
        pullPost_1.pullPostActivate(context);
        renameTitle_1.renameTitleActivate(context);
        deletePost_1.deletePostActivate(context);
        refreshCategories_1.refreshCategoriesActivate(context);
        createCategory_1.createCategoryActivate(context);
        selectCategory_1.selectCategoryActivate(context);
        removeCategory_1.removeCategoryActivate(context);
        try {
            pasteImageFromClipboard_1.pasteImageFromClipboardActivate(context);
        }
        catch (error) {
            const logger = new logger_1.Logger();
            const extensionId = 'caipeiyu.write-cnblog';
            const extension = vscode.extensions.getExtension(extensionId);
            util.setExtensionPath(context.extensionPath);
            if (yield ensureRuntimeDependencies(extension, logger)) {
                pasteImageFromClipboard_1.pasteImageFromClipboardActivate(context);
            }
            else {
                vscode.window.showInformationMessage("下载依赖失败，剪切板贴图不可用");
            }
        }
    });
}
exports.activate = activate;
function deactivate() {
}
exports.deactivate = deactivate;
function ensureRuntimeDependencies(extension, logger) {
    return util.installFileExists(util.InstallFileType.Lock)
        .then((exists) => {
        if (!extension) {
            return false;
        }
        if (!exists) {
            const downloader = new ExtensionDownloader_1.ExtensionDownloader(logger, extension.packageJSON);
            return downloader.installRuntimeDependencies();
        }
        else {
            return true;
        }
    });
}
//# sourceMappingURL=extension.js.map