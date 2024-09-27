import {ControllerOptions} from '../definitions/types.js';
import {MetadataStorage} from '../definitions/metadata-storage.js';

function extractClassName(target: Function): string {
	const s = target.toString().split(' ');
	return s[1];
}

export function BaseController(metadata: MetadataStorage,
						   route: string, options?: ControllerOptions): ClassDecorator {
	return (target): void => {
		metadata.controllerClasses.push({
			target,
			route,
			name: extractClassName(target),
			description: options?.description,
			roles: options?.roles,
			tags: options?.tags,
			abstract: options?.abstract,
			deprecationReason: options?.deprecationReason
		});
	};
}
