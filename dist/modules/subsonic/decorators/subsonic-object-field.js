import { metadataStorage } from '../metadata/metadata-storage.js';
import { BaseObjField } from '../../deco/decorators/base-obj-field.js';
export function SubsonicObjectField(returnTypeFunctionOrOptions, maybeOptions) {
    return BaseObjField(metadataStorage(), returnTypeFunctionOrOptions, maybeOptions);
}
//# sourceMappingURL=subsonic-object-field.js.map