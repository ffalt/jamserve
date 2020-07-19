"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getClientZip = exports.getCustomParameterTemplate = exports.callDescription = exports.getCallParamType = exports.getResultType = exports.writeParts = exports.writeTemplate = exports.wrapLong = void 0;
const metadata_1 = require("../metadata");
const mustache_1 = __importDefault(require("mustache"));
const fs_extra_1 = __importDefault(require("fs-extra"));
const archiver_1 = __importDefault(require("archiver"));
const path_1 = __importDefault(require("path"));
function wrapLong(s) {
    if (s && s.length > 140) {
        return s.split('&').map(s => s.trim()).join(' &\n\t');
    }
    return s;
}
exports.wrapLong = wrapLong;
async function writeTemplate(name, template, data) {
    return {
        name,
        content: mustache_1.default.render((await fs_extra_1.default.readFile(template)).toString(), data)
    };
}
exports.writeTemplate = writeTemplate;
async function writeParts(name, template, serviceParts) {
    const list = serviceParts
        .sort((a, b) => a.name.localeCompare(b.name));
    list.forEach((p, i) => {
        p.isLast = i === list.length - 1;
    });
    return writeTemplate(name, template, { list });
}
exports.writeParts = writeParts;
function getResultType(call) {
    var _a;
    const metadata = metadata_1.getMetadataStorage();
    let resultType;
    if (call.getReturnType) {
        const type = call.getReturnType();
        if (type === String) {
            resultType = 'string';
        }
        else if (type === Number) {
            resultType = 'string';
        }
        else if (type === Boolean) {
            resultType = 'boolean';
        }
        else {
            const enumInfo = metadata.enums.find(e => e.enumObj === type);
            if (enumInfo) {
                resultType = enumInfo.name;
            }
            else {
                const fObjectType = metadata.resultTypes.find(it => it.target === type);
                resultType = (fObjectType === null || fObjectType === void 0 ? void 0 : fObjectType.name) ? ('Jam.' + (fObjectType === null || fObjectType === void 0 ? void 0 : fObjectType.name)) : 'any';
            }
        }
        if ((_a = call.returnTypeOptions) === null || _a === void 0 ? void 0 : _a.array) {
            resultType = 'Array<' + resultType + '>';
        }
    }
    return resultType;
}
exports.getResultType = getResultType;
function getCallParamType(call) {
    var _a;
    const metadata = metadata_1.getMetadataStorage();
    const types = [];
    if (call.params.filter(p => ['args', 'arg'].includes(p.kind)).length > 1) {
        types.push('JamParameters.' + ((_a = call.controllerClassMetadata) === null || _a === void 0 ? void 0 : _a.name.replace('Controller', '')) + call.methodName[0].toUpperCase() + call.methodName.slice(1) + 'Args');
    }
    else {
        for (const param of call.params) {
            if (param.kind === 'arg' && param.mode !== 'file') {
                const type = param.getType();
                let typeString = '';
                const optional = param.typeOptions.nullable ? '?' : '';
                if (param.name === 'id') {
                    typeString = param.typeOptions.nullable ? 'JamParameters.MaybeID' : 'JamParameters.ID';
                }
                else if (type === Boolean) {
                    typeString = `{${param.name}${optional}: boolean}`;
                }
                else if (type === Number) {
                    typeString = `{${param.name}${optional}: number}`;
                }
                else if (type === String) {
                    typeString = `{${param.name}${optional}: string}`;
                }
                else {
                    const enumInfo = metadata.enums.find(e => e.enumObj === type);
                    if (enumInfo) {
                        typeString = `{${param.name}${optional}: ${enumInfo.name}`;
                    }
                    else {
                        const fObjectType = metadata.argumentTypes.find(it => it.target === type);
                        typeString = (fObjectType === null || fObjectType === void 0 ? void 0 : fObjectType.name) ? ('JamParameter.' + (fObjectType === null || fObjectType === void 0 ? void 0 : fObjectType.name)) : 'any';
                    }
                }
                if (param.typeOptions.array) {
                    typeString = 'Array<' + typeString + '>';
                }
                types.push(typeString);
            }
            else if (param.kind === 'args') {
                const type = param.getType();
                const fObjectType = metadata.argumentTypes.find(it => it.target === type);
                let typeString = (fObjectType === null || fObjectType === void 0 ? void 0 : fObjectType.name) ? ('JamParameters.' + (fObjectType === null || fObjectType === void 0 ? void 0 : fObjectType.name)) : 'any';
                if (param.typeOptions.array) {
                    typeString = 'Array<' + typeString + '>';
                }
                types.push(typeString);
            }
        }
    }
    return types.join(' & ');
}
exports.getCallParamType = getCallParamType;
function callDescription(call) {
    var _a;
    const roles = ((_a = call.controllerClassMetadata) === null || _a === void 0 ? void 0 : _a.roles) || call.roles || [];
    const result = (call.description || '') + (roles && roles.length > 0 ? ` // Rights needed: ${roles.join(',')}` : '');
    return result.trim();
}
exports.callDescription = callDescription;
function getCustomParameterTemplate(customPathParameters, call, result) {
    const routeParts = [];
    const validateNames = [];
    customPathParameters.groups.forEach(g => {
        const hasOptionalAlias = !!(call.aliasRoutes || []).find(alias => alias.hideParameters.includes(g.name));
        if (hasOptionalAlias) {
            routeParts.push('${params.' + g.name + ' ? ' + '`' + (g.prefix || '') + '${params.' + g.name + '}` : \'\'}');
        }
        else {
            validateNames.push(g.name);
            routeParts.push((g.prefix || '') + '${params.' + g.name + '}');
        }
    });
    const validateCode = 'if (' + validateNames.map(s => '!params.' + s).join(' && ') + ') { ' + result + '; }';
    return { paramRoute: `/${routeParts.join('')}`, validateCode };
}
exports.getCustomParameterTemplate = getCustomParameterTemplate;
async function getClientZip(filename, list, models) {
    return {
        pipe: {
            pipe: (stream) => {
                const archive = archiver_1.default('zip', { zlib: { level: 9 } });
                archive.on('error', err => {
                    throw err;
                });
                stream.contentType('zip');
                stream.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
                stream.on('finish', () => {
                });
                for (const entry of list) {
                    archive.append(entry.content, { name: entry.name });
                }
                for (const entry of models) {
                    archive.append(fs_extra_1.default.createReadStream(path_1.default.resolve(`./static/models/${entry}`)), { name: `model/${entry}` });
                }
                archive.pipe(stream);
                archive.finalize().catch(e => {
                    console.error(e);
                });
            }
        }
    };
}
exports.getClientZip = getClientZip;
//# sourceMappingURL=clients.js.map