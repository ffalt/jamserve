"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findType = void 0;
const type_graphql_1 = require("type-graphql");
const types_1 = require("../decorators/types");
function findType({ metadataKey, prototype, propertyKey, returnTypeFunc, typeOptions = {}, parameterIndex }) {
    const options = { ...typeOptions };
    let metadataDesignType;
    const reflectedType = Reflect.getMetadata(metadataKey, prototype, propertyKey);
    if (metadataKey === 'design:paramtypes') {
        metadataDesignType = reflectedType[parameterIndex];
    }
    else {
        metadataDesignType = reflectedType;
    }
    if (!returnTypeFunc &&
        (!metadataDesignType || (metadataDesignType && types_1.bannedTypes.includes(metadataDesignType)))) {
        throw new type_graphql_1.NoExplicitTypeError(prototype.constructor.name, propertyKey, parameterIndex);
    }
    if (metadataDesignType === Array) {
        options.array = true;
    }
    if (returnTypeFunc) {
        const getType = () => {
            if (Array.isArray(returnTypeFunc())) {
                options.array = true;
                return returnTypeFunc()[0];
            }
            return returnTypeFunc();
        };
        return {
            getType,
            typeOptions: options,
        };
    }
    else if (metadataDesignType) {
        return {
            getType: () => metadataDesignType,
            typeOptions: options,
        };
    }
    else {
        throw new type_graphql_1.NoExplicitTypeError(prototype.constructor.name, propertyKey, parameterIndex);
    }
}
exports.findType = findType;
//# sourceMappingURL=findType.js.map