"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMethodMetadata = void 0;
const findType_1 = require("./findType");
const type_graphql_1 = require("type-graphql");
function getMethodMetadata(prototype, propertyKey, route, returnTypeFunc, options = {}) {
    if (typeof propertyKey === 'symbol') {
        throw new type_graphql_1.SymbolKeysNotSupportedError();
    }
    const methodName = propertyKey;
    let getReturnType = undefined;
    let returnTypeOptions = undefined;
    if (returnTypeFunc) {
        const { getType, typeOptions } = findType_1.findType({
            metadataKey: 'design:returntype',
            prototype,
            propertyKey,
            returnTypeFunc,
            typeOptions: options,
        });
        getReturnType = getType;
        returnTypeOptions = typeOptions;
    }
    return {
        methodName,
        route,
        getReturnType,
        returnTypeOptions,
        params: [],
        schemaName: options.name || methodName,
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
exports.getMethodMetadata = getMethodMetadata;
//# sourceMappingURL=method-metadata.js.map