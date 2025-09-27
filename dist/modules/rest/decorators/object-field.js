import { metadataStorage } from '../metadata/metadata-storage.js';
import { BaseObjField } from '../../deco/decorators/base-obj-field.js';
export function ObjectField(returnTypeFunctionOrOptions, maybeOptions) {
    return BaseObjField(metadataStorage(), returnTypeFunctionOrOptions, maybeOptions);
}
//# sourceMappingURL=object-field.js.map