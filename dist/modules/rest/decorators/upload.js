import { metadataStorage } from '../metadata/metadata-storage.js';
import { BaseUpload } from '../../deco/decorators/base-upload.js';
export function Upload(name, returnTypeFunctionOrOptions, maybeOptions) {
    return BaseUpload(metadataStorage(), name, returnTypeFunctionOrOptions, maybeOptions);
}
//# sourceMappingURL=upload.js.map