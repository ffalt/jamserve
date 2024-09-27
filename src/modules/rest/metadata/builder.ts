import {getMetadataStorage} from './getMetadataStorage.js';

export function buildRestMeta(): void {
	const metadata = getMetadataStorage();
	metadata.build();
}
