import { findType } from './find-type.js';
import { SymbolKeysNotSupportedError } from 'type-graphql';
export function getMethodMetadata(prototype, propertyKey, defaultReturnTypeFormat, route, returnTypeFunction, options = {}) {
    if (typeof propertyKey === 'symbol') {
        throw new SymbolKeysNotSupportedError();
    }
    const methodName = propertyKey;
    let getReturnType = undefined;
    let returnTypeOptions = undefined;
    if (returnTypeFunction) {
        const { getType, typeOptions } = findType({
            metadataKey: 'design:returntype',
            prototype,
            propertyKey,
            returnTypeFunc: returnTypeFunction,
            typeOptions: options
        });
        getReturnType = getType;
        returnTypeOptions = typeOptions;
    }
    return {
        methodName,
        route,
        getReturnType,
        returnTypeOptions,
        parameters: [],
        defaultReturnTypeFormat,
        schemaName: options.name ?? methodName,
        target: prototype.constructor,
        description: options.description,
        summary: options.summary,
        roles: options.roles,
        customPathParameters: options.customPathParameters,
        aliasRoutes: options.aliasRoutes,
        binary: options.binary,
        responseStringMimeTypes: options.responseStringMimeTypes,
        example: options.example,
        tags: options.tags,
        deprecationReason: options.deprecationReason
    };
}
//# sourceMappingURL=method-metadata.js.map