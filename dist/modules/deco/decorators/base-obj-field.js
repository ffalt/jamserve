import { findType } from '../helpers/find-type.js';
import { getTypeDecoratorParameters } from '../helpers/decorators.js';
import { SymbolKeysNotSupportedError } from 'type-graphql';
export function BaseObjField(metadata, returnTypeFunctionOrOptions, maybeOptions) {
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
        metadata.fields.push({
            name: propertyKey,
            schemaName: opt.name ?? propertyKey,
            getType,
            typeOptions,
            target: prototype.constructor,
            description: opt.description,
            deprecationReason: opt.deprecationReason
        });
    };
}
//# sourceMappingURL=base-obj-field.js.map