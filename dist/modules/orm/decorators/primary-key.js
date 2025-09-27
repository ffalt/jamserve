import { metadataStorage } from '../metadata/metadata-storage.js';
import { SymbolKeysNotSupportedError } from 'type-graphql';
import { ORM_ID } from '../definitions/orm-types.js';
const defaultType = () => ORM_ID;
export function PrimaryKey(type) {
    return (prototype, propertyKey, _) => {
        if (typeof propertyKey === 'symbol') {
            throw new SymbolKeysNotSupportedError();
        }
        const opt = { primaryKey: true };
        metadataStorage().fields.push({
            name: propertyKey,
            getType: type ?? defaultType,
            isRelation: false,
            typeOptions: opt,
            target: prototype.constructor
        });
    };
}
//# sourceMappingURL=primary-key.js.map