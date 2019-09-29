import {Chance} from 'chance';
import {ParameterObject, SchemaObject} from '../../src/model/openapi-spec';

const chance = new Chance();

export class ValidData {

	static generateValidDataByParameter(param: ParameterObject): { name: string, data: any } {
		return {name: param.name, data: ValidData.generateValidDataSchema(param.schema as SchemaObject)};
	}

	static generateValidStringData(schema: SchemaObject): any {
		if (schema.enum) {
			return schema.enum[chance.integer({min: 0, max: schema.enum.length - 1})];
		}
		return chance.string();
	}

	static generateValidIntegerData(schema: SchemaObject): any {
		return chance.integer({min: schema.minimum !== undefined ? schema.minimum : 1, max: schema.maximum !== undefined ? schema.maximum - 1 : 100});
	}

	static generateValidNumberData(schema: SchemaObject): any {
		return chance.floating({min: schema.minimum !== undefined ? schema.minimum : 1, max: schema.maximum !== undefined ? schema.maximum - 1 : 100, fixed: 2});
	}

	static generateValidBooleanData(schema: SchemaObject): any {
		return chance.bool();
	}

	static generateValidArrayData(schema: SchemaObject): any {
		if (!schema.items) {
			return [];
		}
		return [
			ValidData.generateValidDataSchema(schema.items as SchemaObject),
			ValidData.generateValidDataSchema(schema.items as SchemaObject)
		];
	}

	static generateValidDataSchema(schema: SchemaObject): any {
		switch (schema.type) {
			case 'integer':
				return ValidData.generateValidIntegerData(schema);
			case 'number':
				return ValidData.generateValidNumberData(schema);
			case 'string':
				return ValidData.generateValidStringData(schema);
			case 'boolean':
				return ValidData.generateValidBooleanData(schema);
			case 'array':
				return ValidData.generateValidArrayData(schema);
			default:
				console.error(`TODO: mock valid data for type ${schema.type} ${JSON.stringify(schema)}`);
				return [];
		}
	}

}

export class InvalidData {

	static generateInvalidDataByParameter(param: ParameterObject): Array<{ name: string, data: any, invalid?: string }> {
		return InvalidData.generateInvalidDataBySchema(param.schema as SchemaObject).map(o => ({...o, name: param.name}));
	}

	static generateInvalidIntegerData(schema: SchemaObject): Array<{ data: any, invalid: string }> {
		const result: Array<{ data: any, invalid: string }> = [];
		result.push({data: chance.string(), invalid: 'string'});
		result.push({data: '', invalid: 'empty string'});
		result.push({data: true, invalid: 'boolean'});
		let num = 0;
		while (Number.isInteger(num)) {
			num = chance.floating({min: schema.minimum || 1, max: schema.maximum || 100, fixed: 2});
		}
		result.push({data: num, invalid: 'float'});
		if (schema.minimum !== undefined) {
			result.push({data: schema.minimum - 1, invalid: `less than minimum ${schema.minimum}`});
		}
		if (schema.maximum !== undefined) {
			result.push({data: schema.maximum + 1, invalid: `more than minimum ${schema.maximum}`});
		}
		return result;
	}

	static generateInvalidNumberData(schema: SchemaObject): Array<{ data: any, invalid: string }> {
		const result: Array<{ data: any, invalid: string }> = [];
		result.push({data: chance.string(), invalid: 'string'});
		result.push({data: '', invalid: 'empty string'});
		result.push({data: true, invalid: 'boolean'});
		if (schema.minimum !== undefined) {
			result.push({data: schema.minimum - 1, invalid: `less than minimum ${schema.minimum}`});
		}
		if (schema.maximum !== undefined) {
			result.push({data: schema.maximum + 1, invalid: `more than minimum ${schema.maximum}`});
		}
		return result;
	}

	static generateInvalidStringData(schema: SchemaObject): Array<{ data: any, invalid: string }> {
		const result: Array<{ data: any, invalid: string }> = [];
		if (schema.default === undefined) { // if the default value available, these parameter are always valid to omit
			result.push({data: '', invalid: 'empty string'});
		}
		if (schema.enum) {
			result.push({data: 'invalid', invalid: 'invalid enum'});
		}
		return result;
	}

	static generateInvalidBooleanData(schema: SchemaObject): Array<{ data: any, invalid: string }> {
		const result: Array<{ data: any, invalid: string }> = [];
		result.push({data: '', invalid: 'empty string'});
		result.push({data: chance.string(), invalid: 'string'});
		result.push({data: chance.integer() + 2, invalid: 'integer > 1'});
		result.push({data: -(chance.integer() + 1), invalid: 'integer < 0'});
		return result;
	}

	static generateInvalidArrayData(schema: SchemaObject): Array<{ data: any, invalid: string }> {
		const result: Array<{ data: any, invalid: string }> = [];
		result.push({data: null, invalid: 'null'});
		const array = [ValidData.generateValidDataSchema(schema.items as SchemaObject).data];
		const invalids = InvalidData.generateInvalidDataBySchema(schema.items as SchemaObject);
		for (const invalid of invalids) {
			result.push({data: array.concat([invalid.data]), invalid: invalid.invalid});
		}
		return result;
	}

	static generateInvalidDataBySchema(schema: SchemaObject): Array<{ data: any, invalid: string }> {
		switch (schema.type) {
			case 'integer':
				return InvalidData.generateInvalidIntegerData(schema);
			case 'number':
				return InvalidData.generateInvalidNumberData(schema);
			case 'string':
				return InvalidData.generateInvalidStringData(schema);
			case 'boolean':
				return InvalidData.generateInvalidBooleanData(schema);
			case 'array':
				return InvalidData.generateInvalidArrayData(schema);
			default:
				console.error(`TODO: mock invalid data for type ${schema.type} ${JSON.stringify(schema)}`);
				return [];
		}
	}

}
