import { ReflectMetadataMissingError } from 'type-graphql';
export function ensureReflectMetadataExists() {
    if (typeof Reflect !== 'object' ||
        typeof Reflect.decorate !== 'function' ||
        typeof Reflect.metadata !== 'function') {
        throw new ReflectMetadataMissingError();
    }
}
//# sourceMappingURL=reflect.js.map