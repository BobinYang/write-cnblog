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
const keytar = require('keytar');
exports.AppKey = "cnblogWriteVsCode";
class BlogConfig {
    /**
     * 获取根配置
     */
    get config() {
        return vscode.workspace.getConfiguration('writeCnblog');
    }
    get blogId() {
        return this.config.get('blogId');
    }
    setBlogId(value) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.config.update('blogId', value, true);
        });
    }
    userName() {
        return this.config.get('userName');
    }
    setUserName(value) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.config.update('userName', value, true);
        });
    }
    password() {
        return __awaiter(this, void 0, void 0, function* () {
            let rpcUrl = this.rpcUrl();
            let userName = this.userName();
            return yield keytar.getPassword(rpcUrl, userName);
        });
    }
    setPassword(value) {
        return __awaiter(this, void 0, void 0, function* () {
            let rpcUrl = this.rpcUrl();
            let userName = this.userName();
            yield keytar.setPassword(rpcUrl, userName, value);
        });
    }
    rpcUrl() {
        return this.config.get('rpcUrl');
    }
    setRpcUrl(value) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.config.update('rpcUrl', value, true);
        });
    }
    blogWorkspace() {
        return this.config.get('blogWorkspace');
    }
    setBlogWorkspace(value) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.config.update('blogWorkspace', value, true);
        });
    }
    recentPostCount() {
        return this.config.get('recentPostCount');
    }
    setrecentPostCount(value) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.config.update('recentPostCount', value, true);
        });
    }
}
exports.BlogConfig = BlogConfig;
exports.blogConfig = new BlogConfig();
//# sourceMappingURL=blog-config.js.map