"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getClientZip = exports.getCustomParameterTemplate = exports.callDescription = exports.getCallParamType = exports.getResultType = exports.buildParts = exports.buildTemplate = exports.wrapLong = exports.buildCallSections = exports.buildPartService = exports.buildServiceParts = void 0;
const metadata_1 = require("../metadata");
const mustache_1 = __importDefault(require("mustache"));
const fs_extra_1 = __importDefault(require("fs-extra"));
const archiver_1 = __importDefault(require("archiver"));
const path_1 = __importDefault(require("path"));
function generateClientCalls(call, method, generateRequestClientCalls, generateBinaryClientCalls, generateUploadClientCalls) {
    const name = call.methodName.replace(/\//g, '_');
    const upload = call.params.find(o => o.kind === 'arg' && o.mode === 'file');
    const paramType = getCallParamType(call);
    if (upload) {
        return generateUploadClientCalls(call, name, paramType, upload);
    }
    if (call.binary) {
        return generateBinaryClientCalls(call, name, paramType);
    }
    return generateRequestClientCalls(call, name, paramType, method);
}
async function buildServiceParts(generateRequestClientCalls, generateBinaryClientCalls, generateUploadClientCalls, buildPartService) {
    const metadata = metadata_1.getMetadataStorage();
    const sections = {};
    buildCallSections(metadata.gets, 'get', sections, (call, method) => generateClientCalls(call, method, generateRequestClientCalls, generateBinaryClientCalls, generateUploadClientCalls));
    buildCallSections(metadata.posts, 'post', sections, (call, method) => generateClientCalls(call, method, generateRequestClientCalls, generateBinaryClientCalls, generateUploadClientCalls));
    const keys = Object.keys(sections).filter(key => !['Auth', 'Base'].includes(key));
    const parts = [];
    for (const key of keys) {
        const part = key[0].toUpperCase() + key.slice(1);
        parts.push({ name: key.toLowerCase(), part, content: await buildPartService(key, part, sections[key]) });
    }
    return parts;
}
exports.buildServiceParts = buildServiceParts;
async function buildPartService(template, key, part, calls) {
    const list = calls.map(call => {
        return { ...call, name: call.name.replace(key + '_', ''), paramsType: wrapLong(call.paramsType) };
    });
    const withHttpEvent = !!calls.find(c => c.resultType.includes('HttpEvent'));
    const withJam = !!calls.find(c => c.resultType.includes('Jam.'));
    const withJamParam = !!calls.find(c => c.paramsType.includes('JamParameter'));
    return buildTemplate(template, { list, part, withHttpEvent, withJam, withJamParam });
}
exports.buildPartService = buildPartService;
function buildCallSections(calls, method, sections, generateClientCalls) {
    for (const call of calls) {
        const tag = call.controllerClassMetadata.name.replace('Controller', '');
        sections[tag] = (sections[tag] || []).concat(generateClientCalls(call, method));
    }
}
exports.buildCallSections = buildCallSections;
function wrapLong(s) {
    if (s && s.length > 140) {
        return s.split('&').map(s => s.trim()).join(' &\n\t');
    }
    return s;
}
exports.wrapLong = wrapLong;
async function buildTemplate(template, data = {}) {
    return mustache_1.default.render((await fs_extra_1.default.readFile(template)).toString(), data);
}
exports.buildTemplate = buildTemplate;
async function buildParts(template, serviceParts) {
    const list = serviceParts
        .sort((a, b) => a.name.localeCompare(b.name));
    list.forEach((p, i) => {
        p.isLast = i === list.length - 1;
    });
    return buildTemplate(template, { list });
}
exports.buildParts = buildParts;
function getResultType(call) {
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
                const fObjectType = metadata.resultType(type);
                resultType = fObjectType?.name ? ('Jam.' + fObjectType?.name) : 'any';
            }
        }
        if (call.returnTypeOptions?.array) {
            resultType = 'Array<' + resultType + '>';
        }
    }
    return resultType;
}
exports.getResultType = getResultType;
function getCallParamArgType(param, metadata) {
    const type = param.getType();
    let typeString;
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
            typeString = fObjectType?.name ? ('JamParameter.' + fObjectType?.name) : 'any';
        }
    }
    if (param.typeOptions.array) {
        typeString = 'Array<' + typeString + '>';
    }
    return typeString;
}
function getCallParamArgsType(param, metadata) {
    const type = param.getType();
    const fObjectType = metadata.argumentTypes.find(it => it.target === type);
    let typeString = fObjectType?.name ? ('JamParameters.' + fObjectType?.name) : 'any';
    if (param.typeOptions.array) {
        typeString = 'Array<' + typeString + '>';
    }
    return typeString;
}
function getCallParamType(call) {
    const metadata = metadata_1.getMetadataStorage();
    const types = [];
    if (call.params.filter(p => ['args', 'arg'].includes(p.kind)).length > 1) {
        types.push('JamParameters.' + call.controllerClassMetadata?.name.replace('Controller', '') + call.methodName[0].toUpperCase() + call.methodName.slice(1) + 'Args');
    }
    else {
        for (const param of call.params) {
            if (param.kind === 'arg' && param.mode !== 'file') {
                types.push(getCallParamArgType(param, metadata));
            }
            else if (param.kind === 'args') {
                types.push(getCallParamArgsType(param, metadata));
            }
        }
    }
    return types.join(' & ');
}
exports.getCallParamType = getCallParamType;
function callDescription(call) {
    const roles = call.controllerClassMetadata?.roles || call.roles || [];
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
            pipe: (res) => {
                const archive = archiver_1.default('zip', { zlib: { level: 9 } });
                archive.on('error', err => {
                    throw err;
                });
                res.contentType('zip');
                res.type('application/zip');
                res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
                res.on('finish', () => {
                });
                for (const entry of list) {
                    archive.append(entry.content, { name: entry.name });
                }
                for (const entry of models) {
                    archive.append(fs_extra_1.default.createReadStream(path_1.default.resolve(`./static/models/${entry}`)), { name: `model/${entry}` });
                }
                archive.pipe(res);
                archive.finalize().catch(e => {
                    console.error(e);
                });
            }
        }
    };
}
exports.getClientZip = getClientZip;
//# sourceMappingURL=clients.js.map