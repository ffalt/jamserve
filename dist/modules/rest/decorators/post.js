import { metadataStorage } from '../metadata/metadata-storage.js';
import { BasePost } from '../../deco/decorators/base-post.js';
export function Post(route, returnTypeFunctionOrOptions, maybeOptions) {
    return BasePost(metadataStorage(), route, returnTypeFunctionOrOptions, maybeOptions);
}
//# sourceMappingURL=post.js.map