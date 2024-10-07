import { findType } from '../helpers/findType.js';
import { getMetadataStorage } from '../metadata/getMetadataStorage.js';
import { getTypeDecoratorParams } from '../helpers/decorators.js';
import { SymbolKeysNotSupportedError } from 'type-graphql';
export function Property(returnTypeFuncOrOptions, maybeOptions) {
    return (prototype, propertyKey, _) => {
        if (typeof propertyKey === 'symbol') {
            throw new SymbolKeysNotSupportedError();
        }
        const { options, returnTypeFunc } = getTypeDecoratorParams(returnTypeFuncOrOptions, maybeOptions);
        const opt = options;
        const { getType, typeOptions } = findType({
            metadataKey: 'design:type',
            prototype,
            propertyKey,
            returnTypeFunc,
            typeOptions: opt
        });
        getMetadataStorage().fields.push({
            name: propertyKey,
            getType,
            typeOptions,
            target: prototype.constructor
        });
    };
}
//# sourceMappingURL=Property.js.map