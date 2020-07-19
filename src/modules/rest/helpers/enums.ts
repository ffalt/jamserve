export function getEnumValuesMap<T extends object>(enumObject: T): any {
	const enumKeys = Object.keys(enumObject).filter(key => isNaN(parseInt(key, 10)));
	return enumKeys.reduce<any>((map, key) => {
		map[key] = enumObject[key as keyof T];
		return map;
	}, {});
}
export function getEnumReverseValuesMap<T extends object>(enumObject: T): any {
	const enumKeys = Object.keys(enumObject).filter(key => isNaN(parseInt(key, 10)));
	return enumKeys.reduce<any>((map, key) => {
		map[enumObject[key as keyof T]] = key;
		return map;
	}, {});
}
