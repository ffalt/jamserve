import { findType } from './findType';
import { getMetadataStorage } from '../metadata';
import { SymbolKeysNotSupportedError } from 'type-graphql';
export function registerRelation(prototype, propertyKey, returnTypeFunc, opt) {
    if (typeof propertyKey === 'symbol') {
        throw new SymbolKeysNotSupportedError();
    }
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
        isRelation: true,
        target: prototype.constructor
    });
}
//# sourceMappingURL=relation-register.js.map