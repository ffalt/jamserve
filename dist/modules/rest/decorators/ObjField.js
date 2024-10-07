import { getMetadataStorage } from '../metadata/getMetadataStorage.js';
import { BaseObjField } from '../../deco/decorators/ObjField.js';
export function ObjField(returnTypeFuncOrOptions, maybeOptions) {
    return BaseObjField(getMetadataStorage(), returnTypeFuncOrOptions, maybeOptions);
}
//# sourceMappingURL=ObjField.js.map