import { NoExplicitTypeError } from 'type-graphql';
import { bannedTypes, ReturnTypeFunction, TypeOptions, TypeValueThunk } from '../definitions/types.js';
import { metadataStorage } from '../metadata/metadata-storage.js';

export type MetadataKey = 'design:type' | 'design:returntype' | 'design:paramtypes';

export interface TypeInfo {
	getType: TypeValueThunk;
	typeOptions: TypeOptions;
}

export interface FindTypeParameters {
	metadataKey: MetadataKey;
	prototype: object;
	propertyKey: string;
	returnTypeFunc?: ReturnTypeFunction;
	typeOptions?: TypeOptions;
	parameterIndex?: number;
}

export function findType({ metadataKey, prototype, propertyKey, returnTypeFunc, typeOptions = {}, parameterIndex }: FindTypeParameters): TypeInfo {
	const options: TypeOptions = { ...typeOptions };
	const reflectedType: Array<Function> | Function | undefined = Reflect.getMetadata(
		metadataKey,
		prototype,
		propertyKey
	);
	const metadataDesignType = metadataKey === 'design:paramtypes' ?
		(reflectedType as Array<Function>)[parameterIndex ?? 0] :
		reflectedType as Function | undefined;

	if (
		!returnTypeFunc &&
		(!metadataDesignType || bannedTypes.includes(metadataDesignType))
	) {
		throw new NoExplicitTypeError(prototype.constructor.name, propertyKey, parameterIndex);
	}
	if (metadataDesignType === Array) {
		options.array = true;
	}

	if (returnTypeFunc) {
		const getType = (): TypeValueThunk => {
			let r = returnTypeFunc();
			if (typeof r === 'string') {
				const fStringResolvedObjectType = metadataStorage().entityInfoByTargetName(r);
				if (!fStringResolvedObjectType) {
					throw new Error(`Target type ${r} not found.`);
				}
				r = fStringResolvedObjectType.target;
			}
			if (Array.isArray(r)) {
				const value = (r as Array<TypeValueThunk>).at(0);
				if (value) {
					options.array = true;
					return value;
				}
			}
			return r as TypeValueThunk;
		};
		return {
			getType,
			typeOptions: options
		};
	}
	if (metadataDesignType) {
		return {
			getType: () => metadataDesignType,
			typeOptions: options
		};
	}
	throw new NoExplicitTypeError(prototype.constructor.name, propertyKey, parameterIndex);
}
