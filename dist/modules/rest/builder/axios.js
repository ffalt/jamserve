"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildAxiosClientZip = exports.buildAxiosClientList = void 0;
const version_1 = require("../../engine/rest/version");
const typescript_1 = require("./typescript");
const clients_1 = require("./clients");
function generateUploadClientCalls(call, name, paramType, upload) {
    var _a;
    return [{
            name,
            paramsType: '',
            paramName: `params: ${paramType}, file: any, onUploadProgress: (progressEvent: any) => void`,
            resultType: 'void',
            baseFuncResultType: '',
            baseFunc: 'upload',
            baseFuncParameters: `${paramType ? 'params' : '{}'}, '${upload.name}', file, onUploadProgress`,
            tick: '\'',
            apiPath: (((_a = call.controllerClassMetadata) === null || _a === void 0 ? void 0 : _a.route) || '') + (call.route || ''),
            description: clients_1.callDescription(call)
        }];
}
function generateUrlClientCall(call, name, paramsType) {
    var _a;
    let route = (call.route || '');
    let validate = undefined;
    let baseParam = 'params';
    if (call.customPathParameters) {
        const { validateCode, paramRoute } = clients_1.getCustomParameterTemplate(call.customPathParameters, call, `return ''`);
        validate = validateCode;
        route = paramRoute;
        baseParam = '{}';
    }
    return {
        name: `${name}Url`,
        paramName: 'params',
        paramsType: (paramsType || '{}') + ', forDom: boolean',
        resultType: 'string',
        baseFuncResultType: '',
        baseFunc: 'buildRequestUrl',
        baseFuncParameters: baseParam + ', forDom',
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
    let baseParam = 'params';
    if (call.customPathParameters) {
        const { validateCode, paramRoute } = clients_1.getCustomParameterTemplate(call.customPathParameters, call, `throw new Error('Invalid Parameter')`);
        validate = validateCode;
        route = paramRoute;
        baseParam = '{}';
    }
    return {
        name: `${name}Binary`,
        paramName: 'params',
        paramsType: paramsType || '{}',
        resultType: '{buffer: ArrayBuffer; contentType: string}',
        baseFuncResultType: '',
        baseFunc: 'binary',
        baseFuncParameters: baseParam,
        tick: call.customPathParameters ? '`' : '\'',
        validate,
        apiPath: (((_a = call.controllerClassMetadata) === null || _a === void 0 ? void 0 : _a.route) || '') + route,
        description: clients_1.callDescription(call)
    };
}
function generateBinaryClientCalls(call, name, paramType) {
    return [generateUrlClientCall(call, name, paramType), generateBinClientCall(call, name, paramType)];
}
function generateRequestClientCalls(call, name, paramType, method) {
    var _a;
    const resultType = clients_1.getResultType(call);
    return [{
            name,
            paramName: paramType ? 'params' : '',
            paramsType: paramType || '',
            resultType: resultType ? resultType : 'void',
            baseFuncResultType: resultType || '',
            baseFunc: resultType
                ? (method === 'post' ? 'requestPostData' : 'requestData')
                : (method === 'post' ? 'requestPostDataOK' : 'requestOK'),
            baseFuncParameters: paramType ? 'params' : '{}',
            tick: call.customPathParameters ? '`' : '\'',
            apiPath: (((_a = call.controllerClassMetadata) === null || _a === void 0 ? void 0 : _a.route) || '') + (call.route || ''),
            description: clients_1.callDescription(call)
        }];
}
async function buildAxiosClientList() {
    const parts = await clients_1.buildServiceParts(generateRequestClientCalls, generateBinaryClientCalls, generateUploadClientCalls, (key, part, calls) => clients_1.buildPartService('./static/templates/client-axios/jam.part.service.ts.template', key, part, calls));
    return parts.map(part => ({ name: `services/jam.${part.name}.service.ts`, content: part.content }))
        .concat([
        { name: 'jam.service.ts', content: await clients_1.buildParts('./static/templates/client-axios/jam.service.ts.template', parts) },
        { name: `jam.base.service.ts`, content: await clients_1.buildTemplate('./static/templates/client-axios/jam.base.service.ts.template') },
        { name: `jam.http.service.ts`, content: await clients_1.buildTemplate('./static/templates/client-axios/jam.http.service.ts.template') },
        { name: `jam.configuration.ts`, content: await clients_1.buildTemplate('./static/templates/client-axios/jam.configuration.ts.template') },
        { name: `index.ts`, content: await clients_1.buildTemplate('./static/templates/client-axios/index.ts.template') },
        { name: `jam.auth.service.ts`, content: await clients_1.buildTemplate('./static/templates/client-axios/jam.auth.service.ts.template', { apiPrefix: `/jam/${version_1.JAMAPI_URL_VERSION}`, version: version_1.JAMAPI_VERSION }) },
        { name: 'model/jam-rest-data.ts', content: typescript_1.buildTSResultTypes() },
        { name: 'model/jam-rest-params.ts', content: typescript_1.buildTSParameterTypes() },
        { name: 'model/jam-enums.ts', content: typescript_1.buildTSEnums() }
    ]);
}
exports.buildAxiosClientList = buildAxiosClientList;
async function buildAxiosClientZip() {
    const list = await buildAxiosClientList();
    const models = [
        'acousticbrainz-rest-data.ts',
        'acoustid-rest-data.ts',
        'coverartarchive-rest-data.ts',
        'lastfm-rest-data.ts',
        'musicbrainz-rest-data.ts',
        'lyricsovh-rest-data.ts',
        'id3v2-frames.ts',
        'wikidata-rest-data.ts',
        'jam-auth.ts'
    ];
    return clients_1.getClientZip(`axios-client-${version_1.JAMAPI_VERSION}.zip`, list, models);
}
exports.buildAxiosClientZip = buildAxiosClientZip;
//# sourceMappingURL=axios.js.map