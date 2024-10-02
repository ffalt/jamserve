import { DecoratorTypeOptions, FieldOptions, ReturnTypeFunc, ValidateOptions } from '../definitions/types.js';
import { getMetadataStorage } from '../metadata/getMetadataStorage.js';
import { getTypeDecoratorParams } from '../helpers/decorators.js';
import { getParamInfo } from '../helpers/params.js';
import { SymbolKeysNotSupportedError } from 'type-graphql';

export type BodyParamOptions = DecoratorTypeOptions & ValidateOptions & FieldOptions;

export function BodyParam(name: string, options?: BodyParamOptions): ParameterDecorator;
export function BodyParam(name: string, returnTypeFunc: ReturnTypeFunc, options?: BodyParamOptions): ParameterDecorator;
export function BodyParam(name: string, returnTypeFuncOrOptions?: ReturnTypeFunc | BodyParamOptions, maybeOptions?: BodyParamOptions): ParameterDecorator {
	return (prototype, propertyKey, parameterIndex): void => {
		if (typeof propertyKey === 'symbol' || propertyKey === undefined) {
			throw new SymbolKeysNotSupportedError();
		}
		const { options, returnTypeFunc } = getTypeDecoratorParams(returnTypeFuncOrOptions, maybeOptions);
		getMetadataStorage().collectHandlerParamMetadata({
			kind: 'arg',
			name,
			mode: 'body',
			propertyName: String(propertyKey),
			description: (options as BodyParamOptions).description,
			example: (options as BodyParamOptions).example,
			deprecationReason: (options as BodyParamOptions).deprecationReason,
			...getParamInfo({ prototype, propertyKey: propertyKey as string, parameterIndex, returnTypeFunc, options })
		});
	};
}
