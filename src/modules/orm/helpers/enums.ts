import { EnumConfig } from '../definitions/types.js';
import { metadataStorage } from '../metadata/metadata-storage.js';

export function registerEnumType<T extends object>(enumObj: T, enumConfig: EnumConfig): void {
	metadataStorage().enums.push({
		enumObj,
		name: enumConfig.name,
		description: enumConfig.description
	});
}
