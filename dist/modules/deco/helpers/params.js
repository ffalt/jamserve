import { findType } from './findType.js';
import { SymbolKeysNotSupportedError } from 'type-graphql';
export function getParamInfo({ prototype, propertyKey, parameterIndex, returnTypeFunc, options = {} }) {
    if (typeof propertyKey === 'symbol' || propertyKey === undefined) {
        throw new SymbolKeysNotSupportedError();
    }
    const { getType, typeOptions } = findType({
        metadataKey: 'design:paramtypes',
        prototype,
        propertyKey: propertyKey,
        parameterIndex,
        returnTypeFunc,
        typeOptions: options
    });
    return {
        target: prototype.constructor,
        methodName: propertyKey,
        index: parameterIndex,
        getType,
        typeOptions,
        validate: options.validate
    };
}
//# sourceMappingURL=params.js.map