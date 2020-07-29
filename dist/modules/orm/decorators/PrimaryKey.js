"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrimaryKey = void 0;
const metadata_1 = require("../metadata");
const type_graphql_1 = require("type-graphql");
const orm_types_1 = require("../definitions/orm-types");
function PrimaryKey() {
    return (prototype, propertyKey, descriptor) => {
        if (typeof propertyKey === 'symbol') {
            throw new type_graphql_1.SymbolKeysNotSupportedError();
        }
        const opt = { primaryKey: true };
        metadata_1.getMetadataStorage().collectPropertyMetadata({
            name: propertyKey,
            getType: () => orm_types_1.ORM_ID,
            isRelation: false,
            typeOptions: opt,
            target: prototype.constructor
        });
    };
}
exports.PrimaryKey = PrimaryKey;
//# sourceMappingURL=PrimaryKey.js.map