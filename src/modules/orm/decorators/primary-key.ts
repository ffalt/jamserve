import { metadataStorage } from '../metadata/metadata-storage.js';
import { MethodAndPropertyDecorator, PrimaryFieldOptions } from '../definitions/types.js';
import { SymbolKeysNotSupportedError } from 'type-graphql';
import { ORM_ID } from '../definitions/orm-types.js';
import { TypeValueThunk } from '../../deco/definitions/types.js';

const defaultType = () => ORM_ID;

export function PrimaryKey(type?: TypeValueThunk): MethodAndPropertyDecorator;
export function PrimaryKey(type?: TypeValueThunk): MethodDecorator | PropertyDecorator {
	return (prototype, propertyKey, _) => {
		if (typeof propertyKey === 'symbol') {
			throw new SymbolKeysNotSupportedError();
		}
		const opt: PrimaryFieldOptions = { primaryKey: true };
		metadataStorage().fields.push({
			name: propertyKey,
			getType: type ?? defaultType,
			isRelation: false,
			typeOptions: opt,
			target: prototype.constructor
		});
	};
}
