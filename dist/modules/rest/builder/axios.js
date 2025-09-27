import { JAMAPI_URL_VERSION, JAMAPI_VERSION } from '../../engine/rest/version.js';
import { buildTSEnums, buildTSParameterTypes, buildTSResultTypes } from './typescript.js';
import { buildParts, buildPartService, buildServiceParts, buildTemplate, callDescription, getClientZip, getCustomParameterTemplate, getResultType } from './clients.js';
function generateUploadClientCalls(call, name, parameterType, upload) {
    return [{
            name,
            paramsType: '',
            paramName: `params: ${parameterType}, file: any, onUploadProgress: (progressEvent: any) => void`,
            resultType: 'void',
            baseFuncResultType: '',
            baseFunc: 'upload',
            baseFuncParameters: `${parameterType ? 'params' : '{}'}, '${upload.name}', file, onUploadProgress`,
            tick: '\'',
            apiPath: (call.controllerClassMetadata?.route ?? '') + (call.route ?? ''),
            description: callDescription(call)
        }];
}
function generateUrlClientCall(call, name, parametersType) {
    let route = (call.route ?? '');
    let validate = undefined;
    let baseParameter = 'params';
    if (call.customPathParameters) {
        const { validateCode, paramRoute } = getCustomParameterTemplate(call.customPathParameters, call, `return ''`);
        validate = validateCode;
        route = paramRoute;
        baseParameter = '{}';
    }
    return {
        name: `${name}Url`,
        paramName: 'params',
        paramsType: `${parametersType ?? '{}'}, forDom: boolean`,
        resultType: 'string',
        baseFuncResultType: '',
        baseFunc: 'buildRequestUrl',
        baseFuncParameters: `${baseParameter}, forDom`,
        tick: call.customPathParameters ? '`' : '\'',
        validate,
        apiPath: (call.controllerClassMetadata?.route ?? '') + route,
        description: callDescription(call),
        sync: true
    };
}
function generateBinClientCall(call, name, parametersType) {
    let route = call.route ?? '';
    let validate = undefined;
    let baseParameter = 'params';
    if (call.customPathParameters) {
        const { validateCode, paramRoute } = getCustomParameterTemplate(call.customPathParameters, call, `throw new Error('Invalid Parameter')`);
        validate = validateCode;
        route = paramRoute;
        baseParameter = '{}';
    }
    return {
        name: `${name}Binary`,
        paramName: 'params',
        paramsType: parametersType ?? '{}',
        resultType: '{ buffer: ArrayBuffer; contentType: string }',
        baseFuncResultType: '',
        baseFunc: 'binary',
        baseFuncParameters: baseParameter,
        tick: call.customPathParameters ? '`' : '\'',
        validate,
        apiPath: (call.controllerClassMetadata?.route ?? '') + route,
        description: callDescription(call)
    };
}
function generateBinaryClientCalls(call, name, parameterType) {
    return [generateUrlClientCall(call, name, parameterType), generateBinClientCall(call, name, parameterType)];
}
function generateRequestClientCalls(call, name, parameterType, method) {
    const resultType = getResultType(call);
    let baseFunction;
    if (resultType) {
        baseFunction = method === 'post' ? 'requestPostData' : 'requestData';
    }
    else {
        baseFunction = method === 'post' ? 'requestPostDataOK' : 'requestOK';
    }
    return [{
            name,
            paramName: parameterType ? 'params' : '',
            paramsType: parameterType ?? '',
            resultType: resultType ?? 'void',
            baseFuncResultType: resultType ?? '',
            baseFunc: baseFunction,
            baseFuncParameters: parameterType ? 'params' : '{}',
            tick: call.customPathParameters ? '`' : '\'',
            apiPath: (call.controllerClassMetadata?.route ?? '') + (call.route ?? ''),
            description: callDescription(call)
        }];
}
export async function buildAxiosClientList() {
    const parts = await buildServiceParts(generateRequestClientCalls, generateBinaryClientCalls, generateUploadClientCalls, (key, part, calls) => buildPartService('./static/templates/client-axios/jam.part.service.ts.template', key, part, calls));
    const list = parts.map(part => ({ name: `services/jam.${part.name}.service.ts`, content: part.content }));
    return [...list,
        { name: 'jam.service.ts', content: await buildParts('./static/templates/client-axios/jam.service.ts.template', parts) },
        { name: 'jam.base.service.ts', content: await buildTemplate('./static/templates/client-axios/jam.base.service.ts.template') },
        { name: 'jam.http.service.ts', content: await buildTemplate('./static/templates/client-axios/jam.http.service.ts.template') },
        { name: 'jam.configuration.ts', content: await buildTemplate('./static/templates/client-axios/jam.configuration.ts.template') },
        { name: 'index.ts', content: await buildTemplate('./static/templates/client-axios/index.ts.template') },
        { name: 'jam.auth.service.ts', content: await buildTemplate('./static/templates/client-axios/jam.auth.service.ts.template', { apiPrefix: `/jam/${JAMAPI_URL_VERSION}`, version: JAMAPI_VERSION }) },
        { name: 'model/jam-rest-data.ts', content: buildTSResultTypes() },
        { name: 'model/jam-rest-params.ts', content: buildTSParameterTypes() },
        { name: 'model/jam-enums.ts', content: buildTSEnums() }
    ];
}
export async function buildAxiosClientZip() {
    const list = await buildAxiosClientList();
    const models = [
        'acousticbrainz-rest-data.ts',
        'acoustid-rest-data.ts',
        'coverartarchive-rest-data.ts',
        'lastfm-rest-data.ts',
        'musicbrainz-rest-data.ts',
        'lyricsovh-rest-data.ts',
        'wikidata-rest-data.ts',
        'jam-auth.ts'
    ];
    return getClientZip(`axios-client-${JAMAPI_VERSION}.zip`, list, models);
}
//# sourceMappingURL=axios.js.map