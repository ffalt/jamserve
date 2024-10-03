import { ReflectMetadataMissingError } from 'type-graphql';

export function ensureReflectMetadataExists(): void {
	if (typeof Reflect !== 'object' ||
		typeof Reflect.decorate !== 'function' ||
		typeof Reflect.metadata !== 'function') {
		throw new ReflectMetadataMissingError();
	}
}
