import { NoExplicitTypeError } from 'type-graphql';
import { bannedTypes, ReturnTypeFunc, TypeOptions, TypeValue, TypeValueThunk } from '../definitions/types.js';

export type MetadataKey = 'design:type' | 'design:returntype' | 'design:paramtypes';

export interface TypeInfo {
	getType: TypeValueThunk;
	typeOptions: TypeOptions;
}

export interface GetTypeParams {
	metadataKey: MetadataKey;
	prototype: object;
	propertyKey: string;
	returnTypeFunc?: ReturnTypeFunc;
	typeOptions?: TypeOptions;
	parameterIndex?: number;
}

export function findType({ metadataKey, prototype, propertyKey, returnTypeFunc, typeOptions = {}, parameterIndex }: GetTypeParams): TypeInfo {
	const options: TypeOptions = { ...typeOptions };
	let metadataDesignType: Function | undefined;
	const reflectedType: Function[] | Function | undefined = Reflect.getMetadata(metadataKey, prototype, propertyKey);
	if (metadataKey === 'design:paramtypes') {
		metadataDesignType = (reflectedType as Function[])[parameterIndex!];
	} else {
		metadataDesignType = reflectedType as Function | undefined;
	}

	if (
		!returnTypeFunc &&
		(!metadataDesignType || (metadataDesignType && bannedTypes.includes(metadataDesignType)))
	) {
		throw new NoExplicitTypeError(prototype.constructor.name, propertyKey, parameterIndex);
	}
	if (metadataDesignType === Array) {
		options.array = true;
	}

	if (returnTypeFunc) {
		const getType = (): TypeValueThunk => {
			if (Array.isArray(returnTypeFunc())) {
				options.array = true;
				return (returnTypeFunc() as [TypeValue])[0] as TypeValueThunk;
			}
			return returnTypeFunc() as TypeValueThunk;
		};
		return {
			getType,
			typeOptions: options
		};
	} else if (metadataDesignType) {
		return {
			getType: () => metadataDesignType!,
			typeOptions: options
		};
	} else {
		throw new NoExplicitTypeError(prototype.constructor.name, propertyKey, parameterIndex);
	}
}
