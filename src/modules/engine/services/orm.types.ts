import {EntityProperty, Platform, Type, ValidationError} from 'mikro-orm';

export class OrmJsonType extends Type {

	convertToDatabaseValue(value: any, _: Platform): any {
		if (!value) {
			return;
		}
		return JSON.stringify(value);
	}

	convertToJSValue(value: any, _: Platform): any {
		if (!value) {
			return;
		}
		// console.log('convert', value);
		if (typeof value === 'string') {
			return JSON.parse(value);
		} else {
			return value;
		}
	}

	getColumnType(prop: EntityProperty, _: Platform): string {
		return `text`;
	}

}

export class EnumArray extends Type {
	convertToDatabaseValue(value: any): string {
		if (value === null) return value;

		if (value.length) {
			return `{${value.join(',')}}`;
		}

		throw ValidationError.invalidType(EnumArray, value, 'JS');
	}

	toJSON(value: any): any {
		return value;
	}

	getColumnType(): string {
		return 'text[]';
	}
}

export class OrmStringListType extends Type {
	convertToDatabaseValue(value: Array<string> | undefined, _: Platform): string {
		// console.log('convertToDatabaseValue', value);
		if (!value || value.length === 0) {
			return '';
		}
		return `|${value.join('|')}|`;
	}

	convertToJSValue(value: string | Array<string> | undefined, _: Platform): any {
		// console.log('convertToJSValue', value);
		if (!value || value.length === 0) {
			return [];
		}
		if (typeof value === 'string') {
			return value.split('|').filter(s => s.length > 0);
		} else {
			return value;
		}
	}


	toJSON(value: any): any {
		// console.log('toJSON', value);
		return value;
	}

	getColumnType(_: EntityProperty, __: Platform): string {
		return 'text';
	}

}
/*
export class BlobEntityType extends Type {
	convertToDatabaseValue(value: any): any {
		return value;
	}

	convertToJSValue(value: any): any {
		return Buffer.from(value);
	}

	getColumnType(): string {
		return 'blob';
	}
}
*/
