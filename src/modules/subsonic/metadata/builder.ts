import { metadataStorage } from './metadata-storage.js';

export function buildSubsonicMeta(): void {
	const metadata = metadataStorage();
	metadata.build();
}
