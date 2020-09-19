"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildAngularClientZip = exports.buildAngularClientList = void 0;
const metadata_1 = require("../metadata");
const version_1 = require("../../engine/rest/version");
const typescript_1 = require("./typescript");
const clients_1 = require("./clients");
function generateUploadClientCalls(call, name, paramType, upload) {
    var _a;
    return [{
            name,
            paramsType: '',
            paramName: `params: ${paramType}, file: File`,
            resultType: 'Observable<HttpEvent<any>>',
            baseFuncResultType: '',
            baseFunc: 'upload',
            tick: '\'',
            baseFuncParameters: `${paramType ? 'params' : '{}'}, '${upload.name}', file`,
            apiPath: (((_a = call.controllerClassMetadata) === null || _a === void 0 ? void 0 : _a.route) || '') + (call.route || ''),
            description: clients_1.callDescription(call),
            sync: true
        }];
}
function generateUrlClientCall(call, name, paramsType) {
    var _a;
    let route = (call.route || '');
    let validate = undefined;
    if (call.customPathParameters) {
        const { validateCode, paramRoute } = clients_1.getCustomParameterTemplate(call.customPathParameters, call, `return ''`);
        validate = validateCode;
        route = paramRoute;
    }
    return {
        name: `${name}Url`,
        paramName: 'params',
        paramsType: paramsType || '{}',
        resultType: 'string',
        baseFuncResultType: '',
        baseFunc: 'buildRequestUrl',
        baseFuncParameters: !call.customPathParameters ? 'params' : '{}',
        tick: call.customPathParameters ? '`' : '\'',
        validate,
        apiPath: (((_a = call.controllerClassMetadata) === null || _a === void 0 ? void 0 : _a.route) || '') + route,
        description: clients_1.callDescription(call),
        sync: true
    };
}
function generateBinClientCall(call, name, paramsType) {
    var _a;
    let route = (call.route || '');
    let validate = undefined;
    if (call.customPathParameters) {
        const { validateCode, paramRoute } = clients_1.getCustomParameterTemplate(call.customPathParameters, call, `throw new Error('Invalid Parameter')`);
        validate = validateCode;
        route = paramRoute;
    }
    return {
        name: `${name}Binary`,
        paramName: 'params',
        paramsType: paramsType || '{}',
        resultType: 'ArrayBuffer',
        baseFuncResultType: '',
        baseFunc: 'binary',
        baseFuncParameters: !call.customPathParameters ? 'params' : '{}',
        tick: call.customPathParameters ? '`' : '\'',
        validate,
        apiPath: (((_a = call.controllerClassMetadata) === null || _a === void 0 ? void 0 : _a.route) || '') + route,
        description: clients_1.callDescription(call)
    };
}
function generateBinaryClientCalls(call, name, paramType) {
    return [
        generateUrlClientCall(call, name, paramType),
        generateBinClientCall(call, name, paramType)
    ];
}
function generateRequestClientCalls(call, name, paramType, method) {
    var _a;
    const resultType = clients_1.getResultType(call);
    return [{
            name,
            paramName: paramType ? 'params' : '',
            paramsType: paramType || '',
            resultType: resultType ? resultType : 'void',
            baseFuncResultType: resultType === 'string' ? '' : resultType || '',
            tick: call.customPathParameters ? '`' : '\'',
            baseFunc: resultType
                ? (method === 'post' ? 'requestPostData' : (resultType === 'string' ? 'requestString' : 'requestData'))
                : (method === 'post' ? 'requestPostDataOK' : 'requestOK'),
            baseFuncParameters: paramType ? 'params' : '{}',
            apiPath: (((_a = call.controllerClassMetadata) === null || _a === void 0 ? void 0 : _a.route) || '') + (call.route || ''),
            description: clients_1.callDescription(call)
        }];
}
function generateClientCalls(call, method) {
    const name = call.methodName.replace(/\//g, '_');
    const upload = call.params.find(o => o.kind === 'arg' && o.mode === 'file');
    const paramType = clients_1.getCallParamType(call);
    if (upload) {
        return generateUploadClientCalls(call, name, paramType, upload);
    }
    if (call.binary) {
        return generateBinaryClientCalls(call, name, paramType);
    }
    return generateRequestClientCalls(call, name, paramType, method);
}
async function writePartService(key, part, calls) {
    const l = calls.map(call => {
        return { ...call, name: call.name.replace(key + '_', ''), paramsType: call.paramsType };
    });
    const withHttpEvent = !!calls.find(c => c.resultType.includes('HttpEvent'));
    const withJam = !!calls.find(c => c.resultType.includes('Jam.'));
    const withJamParam = !!calls.find(c => c.paramsType.includes('JamParameter'));
    return clients_1.writeTemplate(`services/jam.${key.toLowerCase()}.service.ts`, './static/templates/client/jam.part.service.ts.template', { list: l, part, withHttpEvent, withJam, withJamParam });
}
async function buildAngularClientList() {
    const metadata = metadata_1.getMetadataStorage();
    const sections = {};
    for (const call of metadata.gets) {
        const ctrl = call.controllerClassMetadata;
        const tag = ctrl.name.replace('Controller', '');
        sections[tag] = (sections[tag] || []).concat(generateClientCalls(call, 'get'));
    }
    for (const call of metadata.posts) {
        const ctrl = call.controllerClassMetadata;
        const tag = ctrl.name.replace('Controller', '');
        sections[tag] = (sections[tag] || []).concat(generateClientCalls(call, 'post'));
    }
    const keys = Object.keys(sections);
    const parts = [];
    const list = [];
    for (const key of keys) {
        const part = key[0].toUpperCase() + key.slice(1);
        if (key !== 'Auth' && key !== 'Base') {
            parts.push({ name: key.toLowerCase(), part });
            list.push(await writePartService(key, part, sections[key]));
        }
    }
    list.push(await clients_1.writeParts(`jam.service.ts`, './static/templates/client/jam.service.ts.template', parts));
    list.push(await clients_1.writeParts(`jam.module.ts`, './static/templates/client/jam.module.ts.template', parts));
    list.push(await clients_1.writeTemplate(`jam.base.service.ts`, './static/templates/client/jam.base.service.ts.template', {}));
    list.push(await clients_1.writeTemplate(`jam.http.service.ts`, './static/templates/client/jam.http.service.ts.template', {}));
    list.push(await clients_1.writeTemplate(`jam.configuration.ts`, './static/templates/client/jam.configuration.ts.template', {}));
    list.push(await clients_1.writeTemplate(`index.ts`, './static/templates/client/index.ts.template', {}));
    list.push(await clients_1.writeTemplate(`jam.auth.service.ts`, './static/templates/client/jam.auth.service.ts.template', { apiPrefix: `/jam/${version_1.JAMAPI_URL_VERSION}`, version: version_1.JAMAPI_VERSION }));
    list.push({ name: 'model/jam-rest-data.ts', content: typescript_1.buildTSResultTypes() });
    list.push({ name: 'model/jam-rest-params.ts', content: typescript_1.buildTSParameterTypes() });
    list.push({ name: 'model/jam-enums.ts', content: typescript_1.buildTSEnums() });
    return list;
}
exports.buildAngularClientList = buildAngularClientList;
async function buildAngularClientZip() {
    const list = await buildAngularClientList();
    const models = [
        'acousticbrainz-rest-data.ts',
        'acoustid-rest-data.ts',
        'coverartarchive-rest-data.ts',
        'lastfm-rest-data.ts',
        'musicbrainz-rest-data.ts',
        'lyricsovh-rest-data.ts',
        'id3v2-frames.ts',
        'wikidata-rest-data.ts'
    ];
    return clients_1.getClientZip(`angular-client-${version_1.JAMAPI_VERSION}.zip`, list, models);
}
exports.buildAngularClientZip = buildAngularClientZip;
//# sourceMappingURL=angular.js.map