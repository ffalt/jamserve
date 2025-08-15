import { EnumConfig } from '../definitions/types.js';
import { EnumMetadata } from '../definitions/enum-metadata.js';

export function getEnumReverseValuesMap<T extends object>(enumObject: T): Record<string, keyof T> {
	const enumKeys = Object.keys(enumObject).filter(key => Number.isNaN(Number.parseInt(key, 10)));
	const map: Record<string, keyof T> = {} as Record<string, keyof T>;
	for (const key of enumKeys) {
		const value = String(enumObject[key as keyof T] as unknown);
		map[value] = key as keyof T;
	}
	return map;
}

export function registerEnumType<T extends object>(enumObj: T, enumConfig: EnumConfig, enums: Array<EnumMetadata>): void {
	enums.push({
		enumObj,
		name: enumConfig.name,
		description: enumConfig.description
	});
}
