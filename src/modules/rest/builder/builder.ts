import {getMetadataStorage} from '../metadata';

export function buildRestMeta(): void {
	// controllers.forEach((controller: any) => {
	// 	new controller();
	// });
	const metadata = getMetadataStorage();
	metadata.build();
}
