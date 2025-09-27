import { NoExplicitTypeError } from 'type-graphql';
import { bannedTypes } from '../definitions/types.js';
import { metadataStorage } from '../metadata/metadata-storage.js';
export function findType({ metadataKey, prototype, propertyKey, returnTypeFunc, typeOptions = {}, parameterIndex }) {
    const options = { ...typeOptions };
    const reflectedType = Reflect.getMetadata(metadataKey, prototype, propertyKey);
    const metadataDesignType = metadataKey === 'design:paramtypes' ?
        reflectedType[parameterIndex ?? 0] :
        reflectedType;
    if (!returnTypeFunc &&
        (!metadataDesignType || bannedTypes.includes(metadataDesignType))) {
        throw new NoExplicitTypeError(prototype.constructor.name, propertyKey, parameterIndex);
    }
    if (metadataDesignType === Array) {
        options.array = true;
    }
    if (returnTypeFunc) {
        const getType = () => {
            let r = returnTypeFunc();
            if (typeof r === 'string') {
                const fStringResolvedObjectType = metadataStorage().entityInfoByTargetName(r);
                if (!fStringResolvedObjectType) {
                    throw new Error(`Target type ${r} not found.`);
                }
                r = fStringResolvedObjectType.target;
            }
            if (Array.isArray(r)) {
                const value = r.at(0);
                if (value) {
                    options.array = true;
                    return value;
                }
            }
            return r;
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