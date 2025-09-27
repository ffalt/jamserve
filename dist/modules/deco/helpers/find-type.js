import { NoExplicitTypeError } from 'type-graphql';
import { bannedTypes } from '../definitions/types.js';
export function findType({ metadataKey, prototype, propertyKey, returnTypeFunc, typeOptions = {}, parameterIndex }) {
    const options = { ...typeOptions };
    const reflectedType = Reflect.getMetadata(metadataKey, prototype, propertyKey);
    const metadataDesignType = metadataKey === 'design:paramtypes' ?
        reflectedType[parameterIndex ?? -1] :
        reflectedType;
    if (!returnTypeFunc &&
        (!metadataDesignType || (bannedTypes.includes(metadataDesignType)))) {
        throw new NoExplicitTypeError(prototype.constructor.name, propertyKey, parameterIndex);
    }
    if (metadataDesignType === Array) {
        options.array = true;
    }
    if (returnTypeFunc) {
        const getType = () => {
            const returnType = returnTypeFunc();
            if (Array.isArray(returnType)) {
                options.array = true;
                return returnType.at(0);
            }
            return returnType;
        };
        return {
            getType,
            typeOptions: options
        };
    }
    if (metadataDesignType) {
        return {
            getType: () => metadataDesignType,
            typeOptions: options
        };
    }
    throw new NoExplicitTypeError(prototype.constructor.name, propertyKey, parameterIndex);
}
//# sourceMappingURL=find-type.js.map