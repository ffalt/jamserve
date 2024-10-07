import { getMetadataStorage } from '../metadata/getMetadataStorage.js';
import { SymbolKeysNotSupportedError } from 'type-graphql';
import { ORM_ID } from '../definitions/orm-types.js';
export function PrimaryKey(type) {
    return (prototype, propertyKey, _) => {
        if (typeof propertyKey === 'symbol') {
            throw new SymbolKeysNotSupportedError();
        }
        const opt = { primaryKey: true };
        const deaultType = () => ORM_ID;
        getMetadataStorage().fields.push({
            name: propertyKey,
            getType: type || deaultType,
            isRelation: false,
            typeOptions: opt,
            target: prototype.constructor
        });
    };
}
//# sourceMappingURL=PrimaryKey.js.map