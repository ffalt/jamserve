import {getMetadataStorage} from '../metadata';
import {ControllerOptions} from '../definitions/types';

function extractClassName(target: Function): string {
	const s = target.toString().split(' ');
	return s[1];
}

export function Controller(route: string, options?: ControllerOptions): ClassDecorator {
	return (target): void => {
		getMetadataStorage().collectControllerClassMetadata({
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
