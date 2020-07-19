"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getParamInfo = void 0;
const findType_1 = require("./findType");
const type_graphql_1 = require("type-graphql");
function getParamInfo({ prototype, propertyKey, parameterIndex, returnTypeFunc, options = {}, }) {
    if (typeof propertyKey === "symbol") {
        throw new type_graphql_1.SymbolKeysNotSupportedError();
    }
    const { getType, typeOptions } = findType_1.findType({
        metadataKey: "design:paramtypes",
        prototype,
        propertyKey,
        parameterIndex,
        returnTypeFunc,
        typeOptions: options,
    });
    return {
        target: prototype.constructor,
        methodName: propertyKey,
        index: parameterIndex,
        getType,
        typeOptions,
        validate: options.validate,
    };
}
exports.getParamInfo = getParamInfo;
//# sourceMappingURL=params.js.map