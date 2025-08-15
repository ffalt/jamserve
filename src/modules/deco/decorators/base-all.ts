import { MethodOptions, ReturnTypeFunction } from '../definitions/types.js';
import { getMethodMetadata } from '../helpers/method-metadata.js';
import { getTypeDecoratorParameters } from '../helpers/decorators.js';
import { MetadataStorage } from '../definitions/metadata-storage.js';

export function BaseAll(
	metadata: MetadataStorage,
	defaultFormat: string,
	routeOrReturnTypeFunctionOrOptions?: string | ReturnTypeFunction | MethodOptions,
	returnTypeFunctionOrOptions?: ReturnTypeFunction | MethodOptions,
	maybeOptions?: MethodOptions
): MethodDecorator {
	let route: string | undefined = undefined;
	if (typeof routeOrReturnTypeFunctionOrOptions === 'string') {
		route = routeOrReturnTypeFunctionOrOptions;
	} else {
		maybeOptions = returnTypeFunctionOrOptions as MethodOptions;
		returnTypeFunctionOrOptions = routeOrReturnTypeFunctionOrOptions;
		route = undefined;
	}
	const { options, returnTypeFunc } = getTypeDecoratorParameters(returnTypeFunctionOrOptions, maybeOptions);
	return (prototype, methodName) => {
		const mmd = getMethodMetadata(prototype, methodName, defaultFormat, route, returnTypeFunc, options);
		metadata.all.push(mmd);
	};
}
