"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ObjField = void 0;
const findType_1 = require("../helpers/findType");
const metadata_1 = require("../metadata");
const decorators_1 = require("../helpers/decorators");
const type_graphql_1 = require("type-graphql");
function ObjField(returnTypeFuncOrOptions, maybeOptions) {
    return (prototype, propertyKey, descriptor) => {
        if (typeof propertyKey === 'symbol') {
            throw new type_graphql_1.SymbolKeysNotSupportedError();
        }
        const { options, returnTypeFunc } = decorators_1.getTypeDecoratorParams(returnTypeFuncOrOptions, maybeOptions);
        const opt = options;
        const isResolver = Boolean(descriptor);
        const isResolverMethod = Boolean(descriptor && descriptor.value);
        const { getType, typeOptions } = findType_1.findType({
            metadataKey: isResolverMethod ? 'design:returntype' : 'design:type',
            prototype,
            propertyKey,
            returnTypeFunc,
            typeOptions: opt,
        });
        metadata_1.getMetadataStorage().collectClassFieldMetadata({
            name: propertyKey,
            schemaName: opt.name || propertyKey,
            getType,
            typeOptions,
            target: prototype.constructor,
            description: opt.description,
            deprecationReason: opt.deprecationReason
        });
        if (isResolver) {
            metadata_1.getMetadataStorage().collectFieldResolverMetadata({
                kind: 'internal',
                methodName: propertyKey,
                schemaName: opt.name || propertyKey,
                target: prototype.constructor
            });
        }
    };
}
exports.ObjField = ObjField;
//# sourceMappingURL=ObjField.js.map