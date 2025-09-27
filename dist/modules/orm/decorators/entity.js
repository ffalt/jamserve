import { metadataStorage } from '../metadata/metadata-storage.js';
import { getNameDecoratorParameters } from '../helpers/decorators.js';
export function Entity(nameOrOptions, maybeOptions) {
    const { name, options } = getNameDecoratorParameters(nameOrOptions, maybeOptions);
    return target => {
        metadataStorage().entities.push({
            name: name ?? target.name,
            target,
            fields: [],
            isAbstract: options.isAbstract
        });
    };
}
//# sourceMappingURL=entity.js.map