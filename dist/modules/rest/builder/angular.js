import { JAMAPI_URL_VERSION, JAMAPI_VERSION } from '../../engine/rest/version.js';
import { buildTSEnums, buildTSParameterTypes, buildTSResultTypes } from './typescript.js';
import { buildParts, buildPartService, buildServiceParts, buildTemplate, callDescription, getClientZip, getCustomParameterTemplate, getResultType } from './clients.js';
function generateUploadClientCalls(call, name, paramType, upload) {
    return [{
            name,
            paramsType: '',
            paramName: `params: ${paramType}, file: File`,
            resultType: 'Observable<HttpEvent<any>>',
            baseFuncResultType: '',
            baseFunc: 'upload',
            tick: '\'',
            baseFuncParameters: `${paramType ? 'params' : '{}'}, '${upload.name}', file`,
            apiPath: (call.controllerClassMetadata?.route || '') + (call.route || ''),
            description: callDescription(call),
            sync: true
        }];
}
function generateUrlClientCall(call, name, paramsType) {
    let route = (call.route || '');
    let validate = undefined;
    if (call.customPathParameters) {
        const { validateCode, paramRoute } = getCustomParameterTemplate(call.customPathParameters, call, `return ''`);
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
        apiPath: (call.controllerClassMetadata?.route || '') + route,
        description: callDescription(call),
        sync: true
    };
}
function generateBinClientCall(call, name, paramsType) {
    let route = (call.route || '');
    let validate = undefined;
    if (call.customPathParameters) {
        const { validateCode, paramRoute } = getCustomParameterTemplate(call.customPathParameters, call, `throw new Error('Invalid Parameter')`);
        validate = validateCode;
        route = paramRoute;
    }
    return {
        name: `${name}Binary`,
        paramName: 'params',
        paramsType: paramsType || '{}',
        resultType: '{ buffer: ArrayBuffer; contentType: string }',
        baseFuncResultType: '',
        baseFunc: 'binary',
        baseFuncParameters: !call.customPathParameters ? 'params' : '{}',
        tick: call.customPathParameters ? '`' : '\'',
        validate,
        apiPath: (call.controllerClassMetadata?.route || '') + route,
        description: callDescription(call)
    };
}
function generateBinaryClientCalls(call, name, paramType) {
    return [generateUrlClientCall(call, name, paramType), generateBinClientCall(call, name, paramType)];
}
function generateRequestClientCalls(call, name, paramType, method) {
    const resultType = getResultType(call);
    return [{
            name,
            paramName: paramType ? 'params' : '',
            paramsType: paramType || '',
            resultType: resultType ? resultType : 'void',
            baseFuncResultType: resultType === 'string' ? '' : resultType || '',
            tick: call.customPathParameters ? '`' : '\'',
            baseFunc: resultType ?
                (method === 'post' ? 'requestPostData' : (resultType === 'string' ? 'requestString' : 'requestData')) :
                (method === 'post' ? 'requestPostDataOK' : 'requestOK'),
            baseFuncParameters: paramType ? 'params' : '{}',
            apiPath: (call.controllerClassMetadata?.route || '') + (call.route || ''),
            description: callDescription(call)
        }];
}
export async function buildAngularClientList() {
    const parts = await buildServiceParts(generateRequestClientCalls, generateBinaryClientCalls, generateUploadClientCalls, (key, part, calls) => buildPartService('./static/templates/client/jam.part.service.ts.template', key, part, calls));
    return parts.map(part => ({ name: `services/jam.${part.name}.service.ts`, content: part.content })).concat(...[
        { name: `jam.service.ts`, content: await buildParts('./static/templates/client/jam.service.ts.template', parts) },
        { name: `jam.module.ts`, content: await buildParts('./static/templates/client/jam.module.ts.template', parts) },
        { name: `jam.auth.service.ts`, content: await buildTemplate('./static/templates/client/jam.auth.service.ts.template', { apiPrefix: `/jam/${JAMAPI_URL_VERSION}`, version: JAMAPI_VERSION }) },
        { name: `jam.base.service.ts`, content: await buildTemplate('./static/templates/client/jam.base.service.ts.template') },
        { name: `jam.http.service.ts`, content: await buildTemplate('./static/templates/client/jam.http.service.ts.template') },
        { name: `jam.configuration.ts`, content: await buildTemplate('./static/templates/client/jam.configuration.ts.template') },
        { name: `index.ts`, content: await buildTemplate('./static/templates/client/index.ts.template') },
        { name: 'model/jam-rest-data.ts', content: buildTSResultTypes() },
        { name: 'model/jam-rest-params.ts', content: buildTSParameterTypes() },
        { name: 'model/jam-enums.ts', content: buildTSEnums() }
    ]);
}
export async function buildAngularClientZip() {
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
    return getClientZip(`angular-client-${JAMAPI_VERSION}.zip`, list, models);
}
//# sourceMappingURL=angular.js.map