import { getMetadataStorage } from '../metadata/getMetadataStorage.js';
import { BaseObjField } from '../../deco/decorators/ObjField.js';
export function SubsonicObjField(returnTypeFuncOrOptions, maybeOptions) {
    return BaseObjField(getMetadataStorage(), returnTypeFuncOrOptions, maybeOptions);
}
//# sourceMappingURL=SubsonicObjField.js.map