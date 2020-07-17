"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class RpcXmlSerialize {
    serialize(value) {
        let doc = new Array();
        doc.push('<methodCall>');
        doc.push(`<methodName>${value.methodName}</methodName>`);
        if (value.params) {
            doc.push('<params>');
            for (let key in value.params) {
                if (value.params.hasOwnProperty(key)) {
                    let element = value.params[key];
                    if (element !== null && element !== undefined) {
                        doc.push('<param><value>');
                        doc.push(this.paramBuild(element));
                        doc.push('</value></param>');
                    }
                }
            }
            doc.push('</params>');
        }
        doc.push('</methodCall>');
        return doc.join('');
    }
    /**
     * 构建参数序列化
     * @param param
     */
    paramBuild(param) {
        switch (param.constructor.name) {
            case 'Array':
                return this.arrayBuild(param);
            case 'Object':
                return this.objectBuild(param);
            case 'Number':
                return this.numberBuild(param);
            case 'string':
                return this.stringBuild(param);
            case 'Buffer':
                return this.bufferBuild(param);
            case 'Date':
                return this.dateBuild(param);
            case 'Boolean':
                return this.booleanBuild(param);
            default:
                return this.stringBuild(param);
        }
    }
    /**
     * 构建数组类型参数序列化
     * @param param
     */
    arrayBuild(param) {
        let paramDoc = new Array();
        paramDoc.push('<array><data>');
        for (let i = 0, len = param.length; i < len; i++) {
            if (param[i] !== null && param[i] !== undefined) {
                paramDoc.push('<value>');
                paramDoc.push(this.paramBuild(param[i]));
                paramDoc.push('</value>');
            }
        }
        paramDoc.push('</data></array>');
        return paramDoc.join('');
    }
    /**
     * 构建对象类型参数序列化
     * @param param
     */
    objectBuild(param) {
        let paramDoc = new Array();
        paramDoc.push('<struct>');
        for (let key in param) {
            if (param.hasOwnProperty(key)) {
                let element = param[key];
                if (element !== null && element !== undefined) {
                    paramDoc.push('<member>');
                    paramDoc.push(`<name>${key}</name>`);
                    paramDoc.push('<value>');
                    paramDoc.push(this.paramBuild(element));
                    paramDoc.push('</value>');
                    paramDoc.push('</member>');
                }
            }
        }
        paramDoc.push('</struct>');
        return paramDoc.join('');
    }
    /**
     * 构建Number类型参数序列化
     * @param param
     */
    numberBuild(param) {
        return `<i4>${param}</i4>`;
    }
    /**
     * 构建String类型参数序列化
     * @param param
     */
    stringBuild(param) {
        return `<string>${this.escape(param)}</string>`;
    }
    escape(s) {
        return String(s)
            .replace(/&(?!\w+;)/g, '&amp;')
            .replace(/@/g, '&#64;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;');
    }
    /**
     * 构建Buffer类型参数序列化
     * @param param
     */
    bufferBuild(param) {
        return `<base64>${param.toString('base64')}</base64>`;
    }
    /**
     * 构建Date类型参数序列化
     * @param param
     */
    dateBuild(param) {
        return `<dateTime.iso8601>${param.toISOString()}</dateTime.iso8601>`;
    }
    /**
    * 构建boolean类型参数序列化
    * @param param
    */
    booleanBuild(param) {
        return `<boolean>${param ? '1' : '0'}</boolean>`;
    }
}
exports.RpcXmlSerialize = RpcXmlSerialize;
//# sourceMappingURL=rpc-xml-serialize.js.map