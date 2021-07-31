import { getMetadataStorage } from '../metadata/getMetadataStorage';
import { getNameDecoratorParams } from '../helpers/decorators';
export function Entity(nameOrOptions, maybeOptions) {
    const { name, options } = getNameDecoratorParams(nameOrOptions, maybeOptions);
    return target => {
        getMetadataStorage().collectEntityMetadata({
            name: name || target.name,
            target,
            fields: [],
            isAbstract: options.isAbstract
        });
    };
}
//# sourceMappingURL=Entity.js.map