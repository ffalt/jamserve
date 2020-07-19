"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Ctx = void 0;
const metadata_1 = require("../metadata");
const type_graphql_1 = require("type-graphql");
function Ctx(propertyName) {
    return (prototype, propertyKey, parameterIndex) => {
        if (typeof propertyKey === 'symbol') {
            throw new type_graphql_1.SymbolKeysNotSupportedError();
        }
        metadata_1.getMetadataStorage().collectHandlerParamMetadata({
            kind: 'context',
            target: prototype.constructor,
            methodName: propertyKey,
            index: parameterIndex,
            propertyName,
        });
    };
}
exports.Ctx = Ctx;
//# sourceMappingURL=Ctx.js.map