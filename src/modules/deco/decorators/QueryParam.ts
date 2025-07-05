import { DecoratorTypeOptions, FieldOptions, ReturnTypeFunc, ValidateOptions } from '../definitions/types.js';
import { getTypeDecoratorParams } from '../helpers/decorators.js';
import { getParamInfo } from '../helpers/params.js';
import { SymbolKeysNotSupportedError } from 'type-graphql';
import { MetadataStorage } from '../definitions/metadata-storage.js';

export type QueryParamOptions = DecoratorTypeOptions & ValidateOptions & FieldOptions;

export function BaseQueryParam(
	metadata: MetadataStorage,
	name: string,
	returnTypeFuncOrOptions?: ReturnTypeFunc | QueryParamOptions,
	maybeOptions?: QueryParamOptions
): ParameterDecorator {
	return (prototype, propertyKey, parameterIndex) => {
		if (typeof propertyKey === 'symbol' || propertyKey === undefined) {
			throw new SymbolKeysNotSupportedError();
		}
		const { options, returnTypeFunc } = getTypeDecoratorParams(
			returnTypeFuncOrOptions,
			maybeOptions
		);
		metadata.params.push({
			kind: 'arg',
			name,
			mode: 'query',
			propertyName: String(propertyKey),
			isID: (options as QueryParamOptions).isID,
			description: (options as QueryParamOptions).description,
			example: (options as QueryParamOptions).example,
			deprecationReason: (options as QueryParamOptions).deprecationReason,
			...getParamInfo({ prototype, propertyKey: propertyKey, parameterIndex, returnTypeFunc, options })
		});
	};
}
