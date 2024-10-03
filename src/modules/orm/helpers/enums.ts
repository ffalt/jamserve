import { EnumConfig } from '../definitions/types.js';
import { getMetadataStorage } from '../metadata/getMetadataStorage.js';

export function registerEnumType<T extends object>(enumObj: T, enumConfig: EnumConfig): void {
	getMetadataStorage().enums.push({
		enumObj,
		name: enumConfig.name,
		description: enumConfig.description
	});
}
