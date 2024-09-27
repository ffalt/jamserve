import {DecoratorTypeOptions, FieldOptions, ReturnTypeFunc, ValidateOptions} from '../definitions/types.js';
import {getTypeDecoratorParams} from '../helpers/decorators.js';
import {getParamInfo} from '../helpers/params.js';
import {SymbolKeysNotSupportedError} from 'type-graphql';
import {MetadataStorage} from '../definitions/metadata-storage.js';

export type PathParamOptions = DecoratorTypeOptions & ValidateOptions & FieldOptions;

export function BasePathParam(
	metadata: MetadataStorage,
	name: string,
	returnTypeFuncOrOptions?: ReturnTypeFunc | PathParamOptions,
	maybeOptions?: PathParamOptions,
): ParameterDecorator {
	return (prototype, propertyKey, parameterIndex) => {
		if (typeof propertyKey === 'symbol' || propertyKey === undefined) {
			throw new SymbolKeysNotSupportedError();
		}
		const {options, returnTypeFunc} = getTypeDecoratorParams(
			returnTypeFuncOrOptions,
			maybeOptions,
		);
		metadata.params.push({
			kind: 'arg',
			name,
			mode: 'path',
			propertyName: String(propertyKey),
			description: (options as PathParamOptions).description,
			example: (options as PathParamOptions).example,
			deprecationReason: (options as PathParamOptions).deprecationReason,
			...getParamInfo({prototype, propertyKey: propertyKey as string, parameterIndex, returnTypeFunc, options}),
		});
	};
}

