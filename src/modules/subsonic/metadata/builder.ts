import { getMetadataStorage } from './getMetadataStorage.js';

export function buildSubsonicMeta(): void {
	const metadata = getMetadataStorage();
	metadata.build();
}
