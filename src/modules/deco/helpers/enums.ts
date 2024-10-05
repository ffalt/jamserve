import { EnumConfig } from '../definitions/types.js';
import { EnumMetadata } from '../definitions/enum-metadata.js';

export function getEnumReverseValuesMap<T extends object>(enumObject: T): any {
	const enumKeys = Object.keys(enumObject).filter(key => isNaN(parseInt(key, 10)));
	return enumKeys.reduce<any>((map, key) => {
		map[enumObject[key as keyof T]] = key;
		return map;
	}, {});
}

export function registerEnumType<T extends object>(enumObj: T, enumConfig: EnumConfig, enums: EnumMetadata[]): void {
	enums.push({
		enumObj,
		name: enumConfig.name,
		description: enumConfig.description
	});
}
