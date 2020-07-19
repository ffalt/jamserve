"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CurrentUser = void 0;
const metadata_1 = require("../metadata");
const type_graphql_1 = require("type-graphql");
function CurrentUser() {
    return (prototype, propertyKey, parameterIndex) => {
        if (typeof propertyKey === 'symbol') {
            throw new type_graphql_1.SymbolKeysNotSupportedError();
        }
        metadata_1.getMetadataStorage().collectHandlerParamMetadata({
            kind: 'context',
            target: prototype.constructor,
            methodName: propertyKey,
            index: parameterIndex,
            propertyName: 'user'
        });
    };
}
exports.CurrentUser = CurrentUser;
//# sourceMappingURL=CurrentUser.js.map