import { MethodOptions, ReturnTypeFunction } from '../definitions/types.js';
import { getMethodMetadata } from '../helpers/method-metadata.js';
import { getTypeDecoratorParameters } from '../helpers/decorators.js';
import { MetadataStorage } from '../definitions/metadata-storage.js';

export function BaseGet(
	metadata: MetadataStorage,
	routeOrReturnTypeFunctionOrOptions?: string | ReturnTypeFunction | MethodOptions,
	returnTypeFunctionOrOptions?: ReturnTypeFunction | MethodOptions,
	maybeOptions?: MethodOptions
): MethodDecorator {
	let route: string | undefined = undefined;
	if (typeof routeOrReturnTypeFunctionOrOptions === 'string') {
		route = routeOrReturnTypeFunctionOrOptions;
	} else {
		maybeOptions = returnTypeFunctionOrOptions as any;
		returnTypeFunctionOrOptions = routeOrReturnTypeFunctionOrOptions as any;
		route = undefined;
	}
	const { options, returnTypeFunc } = getTypeDecoratorParameters(returnTypeFunctionOrOptions, maybeOptions);
	return (prototype, methodName) => {
		const mmd = getMethodMetadata(prototype, methodName, 'json', route, returnTypeFunc, options);
		metadata.gets.push(mmd);
	};
}
