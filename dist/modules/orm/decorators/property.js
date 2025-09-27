import { findType } from '../helpers/find-type.js';
import { metadataStorage } from '../metadata/metadata-storage.js';
import { getTypeDecoratorParameters } from '../helpers/decorators.js';
import { SymbolKeysNotSupportedError } from 'type-graphql';
export function Property(returnTypeFunctionOrOptions, maybeOptions) {
    return (prototype, propertyKey, _) => {
        if (typeof propertyKey === 'symbol') {
            throw new SymbolKeysNotSupportedError();
        }
        const { options, returnTypeFunc } = getTypeDecoratorParameters(returnTypeFunctionOrOptions, maybeOptions);
        const opt = options;
        const { getType, typeOptions } = findType({
            metadataKey: 'design:type',
            prototype,
            propertyKey,
            returnTypeFunc,
            typeOptions: opt
        });
        metadataStorage().fields.push({
            name: propertyKey,
            getType,
            typeOptions,
            target: prototype.constructor
        });
    };
}
//# sourceMappingURL=property.js.map