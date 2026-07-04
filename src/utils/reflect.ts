import { ReflectMetadataMissingError } from 'type-graphql';

export function ensureReflectMetadataExists(): void {
	if (typeof Reflect !== 'object' ||
		// eslint-disable-next-line unicorn/no-nonstandard-builtin-properties
		typeof Reflect.decorate !== 'function' ||
		// eslint-disable-next-line unicorn/no-nonstandard-builtin-properties
		typeof Reflect.metadata !== 'function') {
		throw new ReflectMetadataMissingError();
	}
}
