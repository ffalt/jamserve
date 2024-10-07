import { NoExplicitTypeError } from 'type-graphql';
import { bannedTypes } from '../definitions/types.js';
import { getMetadataStorage } from '../metadata/getMetadataStorage.js';
export function findType({ metadataKey, prototype, propertyKey, returnTypeFunc, typeOptions = {}, parameterIndex }) {
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
        (!metadataDesignType || (metadataDesignType && bannedTypes.includes(metadataDesignType)))) {
        throw new NoExplicitTypeError(prototype.constructor.name, propertyKey, parameterIndex);
    }
    if (metadataDesignType === Array) {
        options.array = true;
    }
    if (returnTypeFunc) {
        const getType = () => {
            let r = returnTypeFunc();
            if (typeof r === 'string') {
                const fStringResolvedObjectType = getMetadataStorage().entities.find(it => it.target.name === r);
                r = fStringResolvedObjectType.target;
            }
            if (Array.isArray(r)) {
                options.array = true;
                return r[0];
            }
            return r;
        };
        return {
            getType,
            typeOptions: options
        };
    }
    else if (metadataDesignType) {
        return {
            getType: () => metadataDesignType,
            typeOptions: options
        };
    }
    else {
        throw new NoExplicitTypeError(prototype.constructor.name, propertyKey, parameterIndex);
    }
}
//# sourceMappingURL=findType.js.map