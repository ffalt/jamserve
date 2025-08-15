import { MetadataStorage } from '../definitions/metadata-storage.js';

export function BaseObjectParametersType(metadata: MetadataStorage): ClassDecorator {
	return target => {
		metadata.parameterTypes.push({
			name: target.name,
			target,
			fields: []
		});
	};
}
