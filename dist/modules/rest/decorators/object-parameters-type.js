import { metadataStorage } from '../metadata/metadata-storage.js';
import { BaseObjectParametersType } from '../../deco/decorators/base-object-parameters-type.js';
export function ObjectParametersType() {
    return BaseObjectParametersType(metadataStorage());
}
//# sourceMappingURL=object-parameters-type.js.map