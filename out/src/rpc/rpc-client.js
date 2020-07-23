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
const rpc_xml_serialize_1 = require("./rpc-xml-serialize");
const rpc_xml_deserialize_1 = require("./rpc-xml-deserialize");
const request = require('request');
class RpcClient {
    constructor(rpc_url) {
        this.rpc_url = rpc_url;
        this.rpcXmlSerialize = new rpc_xml_serialize_1.RpcXmlSerialize();
        this.rpcXmlDeserialize = new rpc_xml_deserialize_1.RpcXmlDeserialize();
    }
    /**
     * blogger.deletePost
     * 删除一个文章
     * @param param
     */
    deletePost(param) {
        return __awaiter(this, void 0, void 0, function* () {
            let data = this.rpcXmlSerialize.serialize({
                methodName: 'blogger.deletePost',
                params: param
            });
            let result = yield this.postRequest(data);
            return yield this.rpcXmlDeserialize.deserializeBoolean(result);
        });
    }
    /**
     * blogger.getUsersBlogs
     * 获取用户的博客信息,返回BlogInfoStruct
     * @param param
     */
    getUsersBlogs(param) {
        return __awaiter(this, void 0, void 0, function* () {
            let data = this.rpcXmlSerialize.serialize({
                methodName: 'blogger.getUsersBlogs',
                params: param
            });
            let result = yield this.postRequest(data);
            return yield this.rpcXmlDeserialize.deserializeBlogInfoStruct(result);
        });
    }
    /**
     * metaWeblog.editPost
     * 更新现有的博客文章
     * @param param
     */
    editPost(param) {
        return __awaiter(this, void 0, void 0, function* () {
            fs.writeFileSync("D:\log.txt", "文章更新请求序列化前"+param.toString() + "\r\n", { 'flag': 'a' });
            let data = this.rpcXmlSerialize.serialize({
                methodName: 'metaWeblog.editPost',
                params: param
            });
            fs.writeFileSync("D:\log.txt", "文章更新请求序列化后"+data + "\r\n", { 'flag': 'a' });
            let result = yield this.postRequest(data);
            return yield this.rpcXmlDeserialize.deserializeBoolean(result);
        });
    }
    /**
    * metaWeblog.getCategories
    * 获取文章的有效类别列表
    * @param param
    */
    getCategories(param) {
        return __awaiter(this, void 0, void 0, function* () {
            let data = this.rpcXmlSerialize.serialize({
                methodName: 'metaWeblog.getCategories',
                params: param
            });
            let result = yield this.postRequest(data);
            return yield this.rpcXmlDeserialize.deserializeCategoryInfoStructArray(result);
        });
    }
    /**
    * metaWeblog.getPost
    * 获取现有文章
    * @param param
    */
    getPost(param) {
        return __awaiter(this, void 0, void 0, function* () {
            let data = this.rpcXmlSerialize.serialize({
                methodName: 'metaWeblog.getPost',
                params: param
            });
            let result = yield this.postRequest(data);
            fs.writeFileSync("D:\log.txt", "获取现有文章后"+result.toString() + "\r\n", { 'flag': 'a' });
            return yield this.rpcXmlDeserialize.deserializePostStruct(result);
        });
    }
    /**
    * metaWeblog.getRecentPosts
    * 获取最近帖子
    * @param param
    */
    getRecentPosts(param) {
        return __awaiter(this, void 0, void 0, function* () {
            let data = this.rpcXmlSerialize.serialize({
                methodName: 'metaWeblog.getRecentPosts',
                params: param
            });
            let result = yield this.postRequest(data);
            return yield this.rpcXmlDeserialize.deserializePostStructArray(result);
        });
    }
    /**
    * metaWeblog.newMediaObject
    * 上传文件到指定博客
    * @param param
    */
    newMediaObject(param) {
        return __awaiter(this, void 0, void 0, function* () {
            let data = this.rpcXmlSerialize.serialize({
                methodName: 'metaWeblog.newMediaObject',
                params: param
            });
            let result = yield this.postRequest(data);
            return yield this.rpcXmlDeserialize.deserializeUrlDataStruct(result);
        });
    }
    /**
    * metaWeblog.newPost
    * 新建文章到指定博客
    * @param param
    */
    newPost(param) {
        return __awaiter(this, void 0, void 0, function* () {
            let data = this.rpcXmlSerialize.serialize({
                methodName: 'metaWeblog.newPost',
                params: param
            });
            let result = yield this.postRequest(data);
            return yield this.rpcXmlDeserialize.deserializeString(result);
        });
    }
    /**
    * wp.newCategory
    * 新建目录到指定博客
    * @param param
    */
    newCategory(param) {
        return __awaiter(this, void 0, void 0, function* () {
            let data = this.rpcXmlSerialize.serialize({
                methodName: 'wp.newCategory',
                params: param
            });
            let result = yield this.postRequest(data);
            return yield this.rpcXmlDeserialize.deserializeNumber(result);
        });
    }
    /**
     * 提交请求
     * @param xml
     */
    postRequest(xml) {
        let options = {
            url: this.rpc_url,
            headers: '{Content-Type:application/xml}',
            method: 'post',
            body: xml
        };
        return new Promise((resolve, reject) => {
            request(options, function (error, response, body) {
                if (error) {
                    reject(error);
                }
                else {
                    resolve(body);
                }
            });
        });
    }
}
exports.RpcClient = RpcClient;
//# sourceMappingURL=rpc-client.js.map