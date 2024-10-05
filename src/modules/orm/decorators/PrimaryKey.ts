import { getMetadataStorage } from '../metadata/getMetadataStorage.js';
import { MethodAndPropDecorator, PrimaryFieldOptions } from '../definitions/types.js';
import { SymbolKeysNotSupportedError } from 'type-graphql';
import { ORM_ID } from '../definitions/orm-types.js';
import { TypeValueThunk } from '../../deco/definitions/types.js';

export function PrimaryKey(type?: TypeValueThunk): MethodAndPropDecorator;
export function PrimaryKey(type?: TypeValueThunk): MethodDecorator | PropertyDecorator {
	return (prototype, propertyKey, _) => {
		if (typeof propertyKey === 'symbol') {
			throw new SymbolKeysNotSupportedError();
		}
		const opt: PrimaryFieldOptions = { primaryKey: true };
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
