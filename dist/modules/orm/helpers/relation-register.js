import { findType } from './find-type.js';
import { metadataStorage } from '../metadata/metadata-storage.js';
import { SymbolKeysNotSupportedError } from 'type-graphql';
export function registerRelation(prototype, propertyKey, returnTypeFunction, opt) {
    if (typeof propertyKey === 'symbol') {
        throw new SymbolKeysNotSupportedError();
    }
    const { getType, typeOptions } = findType({
        metadataKey: 'design:type',
        prototype,
        propertyKey,
        returnTypeFunc: returnTypeFunction,
        typeOptions: opt
    });
    metadataStorage().fields.push({
        name: propertyKey,
        getType,
        typeOptions,
        isRelation: true,
        target: prototype.constructor
    });
}
//# sourceMappingURL=relation-register.js.map