import { getMetadataStorage } from '../metadata/getMetadataStorage.js';
export function buildRestMeta() {
    const metadata = getMetadataStorage();
    metadata.build();
}
//# sourceMappingURL=builder.js.map