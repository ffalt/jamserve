import { getMetadataStorage } from '../metadata/getMetadataStorage.js';
import { BaseUpload } from '../../deco/decorators/Upload.js';
export function Upload(name, returnTypeFuncOrOptions, maybeOptions) {
    return BaseUpload(getMetadataStorage(), name, returnTypeFuncOrOptions, maybeOptions);
}
//# sourceMappingURL=Upload.js.map