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
var moment = require('moment');
const xml2js = require('xml2js');
class RpcXmlDeserialize {
    /**
     * 反序列化结果为Boolean
     * @param data
     */
    deserializeBoolean(data) {
        return __awaiter(this, void 0, void 0, function* () {
            let result = yield this.deserializeObject(data);
            return result;
        });
    }
    /**
     * 反序列化结果为String
     * @param data
     */
    deserializeString(data) {
        return __awaiter(this, void 0, void 0, function* () {
            let result = yield this.deserializeObject(data);
            return result;
        });
    }
    /**
    * 反序列化结果为Number
    * @param data
    */
    deserializeNumber(data) {
        return __awaiter(this, void 0, void 0, function* () {
            let result = yield this.deserializeObject(data);
            return result;
        });
    }
    /**
     * 反序列化结果为BlogInfoStruct
     * @param data
     */
    deserializeBlogInfoStruct(data) {
        return __awaiter(this, void 0, void 0, function* () {
            let result = yield this.deserializeObject(data);
            return result[0];
        });
    }
    /**
     * 反序列化结果为Array<CategoryInfoStruct>
     * @param data
     */
    deserializeCategoryInfoStructArray(data) {
        return __awaiter(this, void 0, void 0, function* () {
            let result = yield this.deserializeObject(data);
            return result;
        });
    }
    /**
     * 反序列化结果为PostStruct
     * @param data
     */
    deserializePostStruct(data) {
        return __awaiter(this, void 0, void 0, function* () {
            let result = yield this.deserializeObject(data);
            return result;
        });
    }
    /**
     * 反序列化结果为Array<PostStruct>
     * @param data
     */
    deserializePostStructArray(data) {
        return __awaiter(this, void 0, void 0, function* () {
            let result = yield this.deserializeObject(data);
            return result;
        });
    }
    /**
     * 反序列化结果为UrlDataStruct
     * @param data
     */
    deserializeUrlDataStruct(data) {
        return __awaiter(this, void 0, void 0, function* () {
            let result = yield this.deserializeObject(data);
            return result;
        });
    }
    /**
     * 获取值
     * @param obj
     */
    getValueData(obj) {
        for (let name in obj) {
            switch (name) {
                case 'array':
                    return this.getArrayValueData(obj[name]);
                case 'struct':
                    return this.getStructValueData(obj[name]);
                case 'i4':
                    return +obj[name][0];
                case 'boolean':
                    return obj[name][0] !== '0';
                case 'dateTime.iso8601':
                    return new Date(moment(obj[name][0], 'YYYYMMDDThh:mm:ss'));
                default:
                    return obj[name][0];
            }
        }
    }
    /**
     * 获取值为array
     * @param arrayObj
     */
    getArrayValueData(arrayObj) {
        let array = new Array();
        arrayObj[0].data[0].value.forEach((element) => {
            let data = this.getValueData(element);
            array.push(data);
        });
        return array;
    }
    /**
    * 获取值为struct
    * @param structObj
    */
    getStructValueData(structObj) {
        let struct = {};
        if (structObj[0].member) {
            structObj[0].member.forEach((element) => {
                let name = element.name[0];
                let data = this.getValueData(element.value[0]);
                struct[name] = data;
            });
        }
        return struct;
    }
    /**
     * 反序列化xml，提取参数，如果错误抛出异常
     * @param data
     */
    deserializeObject(data) {
        return __awaiter(this, void 0, void 0, function* () {
            let parser = new xml2js.Parser();
            let result = yield parser.parseStringPromise(data);
            if (result.methodResponse.params) {
                let value = result.methodResponse.params[0].param[0].value[0];
                return this.getValueData(value);
            }
            let faultString = this.faultString(result.methodResponse.fault);
            throw new Error(`请求MetaWeblog错误:${faultString}`);
        });
    }
    faultString(fault) {
        let value = fault[0].value[0];
        return this.getValueData(value).faultString;
    }
}
exports.RpcXmlDeserialize = RpcXmlDeserialize;
//# sourceMappingURL=rpc-xml-deserialize.js.map