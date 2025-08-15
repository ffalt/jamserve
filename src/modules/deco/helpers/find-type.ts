import { NoExplicitTypeError } from 'type-graphql';
import { bannedTypes, ReturnTypeFunction, TypeOptions, TypeValueThunk } from '../definitions/types.js';

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
	const reflectedType: Array<Function> | Function | undefined = Reflect.getMetadata(metadataKey, prototype, propertyKey);
	const metadataDesignType = metadataKey === 'design:paramtypes' ?
		(reflectedType as Array<Function>)[parameterIndex ?? -1] :
		reflectedType as Function | undefined;

	if (
		!returnTypeFunc &&
		(!metadataDesignType || (bannedTypes.includes(metadataDesignType)))
	) {
		throw new NoExplicitTypeError(prototype.constructor.name, propertyKey, parameterIndex);
	}
	if (metadataDesignType === Array) {
		options.array = true;
	}

	if (returnTypeFunc) {
		const getType = (): TypeValueThunk => {
			const returnType = returnTypeFunc();
			if (Array.isArray(returnType)) {
				options.array = true;
				return returnType.at(0) as TypeValueThunk;
			}
			return returnType as TypeValueThunk;
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
