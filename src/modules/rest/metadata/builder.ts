import { metadataStorage } from './metadata-storage.js';

export function buildRestMeta(): void {
	const metadata = metadataStorage();
	metadata.build();
}
