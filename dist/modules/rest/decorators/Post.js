import { getMetadataStorage } from '../metadata/getMetadataStorage.js';
import { BasePost } from '../../deco/decorators/Post.js';
export function Post(route, returnTypeFuncOrOptions, maybeOptions) {
    return BasePost(getMetadataStorage(), route, returnTypeFuncOrOptions, maybeOptions);
}
//# sourceMappingURL=Post.js.map