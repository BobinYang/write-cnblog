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
const mkdirp = require("mkdirp");
const constants_1 = require("../constants");
const blog_workspace_1 = require("./blog-workspace");
const blog_operate_1 = require("./blog-operate");
const request = require('request');
const regexp = /!\[(.*?)\]\((.*?)\)/g;
const urlRegexp = /(?<=\()[\S]+(?=\))/g;
const httpRegexp = /(http|https):\/\/([\w.]+\/?)\S*/g;
/**
 * 替换文章中的图片。
 * 远程地址替换成本地地址
 * 本地地址替换为远端地址
 */
class PostImageReplace {
    /**
     * 博客工作目录
     */
    get folderPath() {
        return blog_workspace_1.blogWorkspace.folderPath;
    }
    /**
     * 本地地址转换为网络地址
     * @param post
     */
    toRemote(post) {
        return __awaiter(this, void 0, void 0, function* () {
            let images = post.match(regexp);
            if (!images) {
                return post;
            }
            let newPost = post;
            let imageIndexs = this.readIndex();
            for (let index = 0; index < images.length; index++) {
                const image = images[index];
                let urls = image.match(urlRegexp);
                if (urls) {
                    let imageUrl = urls[0];
                    if (imageUrl.match(httpRegexp)) {
                        continue;
                    }
                    let imageIndex = imageIndexs.find(ii => ii.local === imageUrl);
                    let remotePath = imageIndex ? imageIndex.remote : yield this.imageUpload(imageUrl);
                    if (remotePath) {
                        newPost = newPost.replace(image, image.replace(imageUrl, remotePath));
                        if (!imageIndex) {
                            imageIndexs.push({ local: imageUrl, remote: remotePath });
                        }
                    }
                }
            }
            this.saveIndex(imageIndexs);
            return newPost;
        });
    }
    /**
     * 提交请求
     * @param fileName
     */
    imageUpload(fileName) {
        return __awaiter(this, void 0, void 0, function* () {
            let imagePath = path.join(this.folderPath, fileName);
            if (fs.existsSync(imagePath)) {
                let imageData = fs.readFileSync(imagePath);
                let extname = path.extname(imagePath);
                let name = path.basename(imagePath);
                let type = `image/${extname.substr(1, extname.length - 1)}`;
                return yield blog_operate_1.blogOperate.newMediaObject(imageData, type, name);
            }
            return undefined;
        });
    }
    /**
     * 图片远端地址转换本地地址
     * @param post
     */
    toLocal(post) {
        return __awaiter(this, void 0, void 0, function* () {
            let images = post.match(regexp);
            if (!images) {
                return post;
            }
            let newPost = post;
            let imageIndexs = this.readIndex();
            for (let index = 0; index < images.length; index++) {
                const image = images[index];
                let urls = image.match(urlRegexp);
                if (urls) {
                    let imageUrl = urls[0];
                    let imageIndex = imageIndexs.find(ii => ii.remote === imageUrl);
                    let localPath = imageIndex ? imageIndex.local : yield this.imageDown(imageUrl);
                    newPost = newPost.replace(image, image.replace(imageUrl, localPath));
                    if (!imageIndex) {
                        imageIndexs.push({ local: localPath, remote: imageUrl });
                    }
                }
            }
            this.saveIndex(imageIndexs);
            return newPost;
        });
    }
    /**
    * 提交请求
    * @param url
    */
    imageDown(url) {
        return new Promise((resolve, reject) => {
            let extName = path.extname(url);
            mkdirp.sync(path.join(this.folderPath, constants_1.imageDirName));
            let imagePath = path.join(constants_1.imageDirName, `${Date.now().toString()}${extName}`);
            request.get(url)
                .pipe(fs.createWriteStream(path.join(this.folderPath, imagePath)))
                .on('finish', function () {
                resolve(imagePath);
            }).on('error', function (error) {
                reject(error);
            });
        });
    }
    /**
     * 读取图片索引
     */
    readIndex() {
        let indexPath = path.join(this.folderPath, constants_1.blogDirName, constants_1.imageIndexName);
        if (fs.existsSync(indexPath)) {
            let context = fs.readFileSync(indexPath, { encoding: 'utf8' });
            let imageFiles = this.readImageFiles();
            let imageIndexs = JSON.parse(context);
            return imageIndexs.filter(ii => imageFiles.includes(ii.local));
        }
        return new Array();
    }
    /**
     * 保存文件索引
     * @param imageIndexs
     */
    saveIndex(imageIndexs) {
        let indexPath = path.join(this.folderPath, constants_1.blogDirName, constants_1.imageIndexName);
        fs.writeFileSync(indexPath, JSON.stringify(imageIndexs));
    }
    /**
     * 获取本地图片路径
     * @param uri
     */
    readImageFiles() {
        let imageDir = path.join(this.folderPath, constants_1.imageDirName);
        if (!fs.existsSync(imageDir)) {
            return new Array();
        }
        let postFiles = new Array();
        const children = fs.readdirSync(imageDir);
        for (let i = 0; i < children.length; i++) {
            const child = children[i];
            const filePath = path.join(imageDir, child);
            const stat = fs.statSync(filePath);
            if (stat.isFile()) {
                postFiles.push(path.join(constants_1.imageDirName, child));
            }
        }
        return postFiles;
    }
}
exports.PostImageReplace = PostImageReplace;
exports.postImageReplace = new PostImageReplace();
//# sourceMappingURL=post-image-replace.js.map