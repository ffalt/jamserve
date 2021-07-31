import { getMetadataStorage } from "../metadata/getMetadataStorage";
import { getNameDecoratorParams } from "../helpers/decorators";
export function ResultType(nameOrOptions, maybeOptions) {
    const { name, options } = getNameDecoratorParams(nameOrOptions, maybeOptions);
    const interfaceClasses = options.implements && [].concat(options.implements);
    return target => {
        getMetadataStorage().collectResultMetadata({
            name: name || target.name,
            target,
            fields: [],
            description: options.description,
            interfaceClasses,
            isAbstract: options.isAbstract
        });
    };
}
//# sourceMappingURL=ResultType.js.map