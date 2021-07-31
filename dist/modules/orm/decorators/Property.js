import { findType } from '../helpers/findType';
import { getMetadataStorage } from '../metadata';
import { getTypeDecoratorParams } from '../helpers/decorators';
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
            typeOptions: opt,
        });
        getMetadataStorage().collectPropertyMetadata({
            name: propertyKey,
            getType,
            typeOptions,
            target: prototype.constructor
        });
    };
}
//# sourceMappingURL=Property.js.map