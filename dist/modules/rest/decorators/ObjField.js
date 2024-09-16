import { findType } from '../helpers/findType.js';
import { getMetadataStorage } from '../metadata/getMetadataStorage.js';
import { getTypeDecoratorParams } from '../helpers/decorators.js';
import { SymbolKeysNotSupportedError } from 'type-graphql';
export function ObjField(returnTypeFuncOrOptions, maybeOptions) {
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
        getMetadataStorage().collectClassFieldMetadata({
            name: propertyKey,
            schemaName: opt.name || propertyKey,
            getType,
            typeOptions,
            target: prototype.constructor,
            description: opt.description,
            deprecationReason: opt.deprecationReason
        });
    };
}
//# sourceMappingURL=ObjField.js.map