import { getMetadataStorage } from '../metadata/getMetadataStorage.js';

export function buildRestMeta(): void {
	const metadata = getMetadataStorage();
	metadata.build();
}
