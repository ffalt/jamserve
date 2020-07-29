"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerRelation = void 0;
const findType_1 = require("./findType");
const metadata_1 = require("../metadata");
const type_graphql_1 = require("type-graphql");
function registerRelation(prototype, propertyKey, returnTypeFunc, opt) {
    if (typeof propertyKey === 'symbol') {
        throw new type_graphql_1.SymbolKeysNotSupportedError();
    }
    const { getType, typeOptions } = findType_1.findType({
        metadataKey: 'design:type',
        prototype,
        propertyKey,
        returnTypeFunc,
        typeOptions: opt,
    });
    metadata_1.getMetadataStorage().collectPropertyMetadata({
        name: propertyKey,
        getType,
        typeOptions,
        isRelation: true,
        target: prototype.constructor
    });
}
exports.registerRelation = registerRelation;
//# sourceMappingURL=relation-register.js.map