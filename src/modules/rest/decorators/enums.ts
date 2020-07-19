import {EnumConfig} from './types';
import {getMetadataStorage} from '../metadata';

export function registerEnumType<T extends object>(enumObj: T, enumConfig: EnumConfig): void {
	getMetadataStorage().collectEnumMetadata({
		enumObj,
		name: enumConfig.name,
		description: enumConfig.description,
	});
}
