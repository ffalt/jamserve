import {getMetadataStorage} from '../metadata';

export function buildRestMeta(): void {
	const metadata = getMetadataStorage();
	metadata.build();
}
