import {getMetadataStorage} from '../metadata';

export function buildRestMeta(controllers: any[]): void {
	controllers.forEach((controller: any) => {
		new controller();
	});
	const metadata = getMetadataStorage()
	metadata.build();
}
