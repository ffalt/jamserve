import { getMetadataStorage } from '../metadata/getMetadataStorage.js';
import { SymbolKeysNotSupportedError } from 'type-graphql';
import { ORM_ID } from '../definitions/orm-types.js';
export function PrimaryKey() {
    return (prototype, propertyKey, _) => {
        if (typeof propertyKey === 'symbol') {
            throw new SymbolKeysNotSupportedError();
        }
        const opt = { primaryKey: true };
        getMetadataStorage().collectPropertyMetadata({
            name: propertyKey,
            getType: () => ORM_ID,
            isRelation: false,
            typeOptions: opt,
            target: prototype.constructor
        });
    };
}
//# sourceMappingURL=PrimaryKey.js.map