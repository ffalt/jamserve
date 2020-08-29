"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ObjField = void 0;
const findType_1 = require("../helpers/findType");
const metadata_1 = require("../metadata");
const decorators_1 = require("../helpers/decorators");
const type_graphql_1 = require("type-graphql");
function ObjField(returnTypeFuncOrOptions, maybeOptions) {
    return (prototype, propertyKey, _) => {
        if (typeof propertyKey === 'symbol') {
            throw new type_graphql_1.SymbolKeysNotSupportedError();
        }
        const { options, returnTypeFunc } = decorators_1.getTypeDecoratorParams(returnTypeFuncOrOptions, maybeOptions);
        const opt = options;
        const { getType, typeOptions } = findType_1.findType({
            metadataKey: 'design:type',
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
    };
}
exports.ObjField = ObjField;
//# sourceMappingURL=ObjField.js.map