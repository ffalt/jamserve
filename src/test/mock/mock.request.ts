import {Chance} from 'chance';
import {OpenAPIObject, OperationObject, ParameterObject, SchemaObject} from '../../modules/rest/builder/openapi-helpers.js';
import refParser from '@apidevtools/json-schema-ref-parser';
import {v4} from 'uuid';

const chance = new Chance();

export class ValidData {

	static generateValidDataByParameter(param: ParameterObject): { name: string; data: any } {
		return {name: param.name, data: ValidData.generateValidDataSchema(param.schema as SchemaObject)};
	}

	static generateValidStringData(schema: SchemaObject): any {
		if (schema.format === 'uuid') {
			return v4();
		}
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

	static generateValidBooleanData(_: SchemaObject): any {
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

	static generateInvalidDataByParameter(param: ParameterObject): Array<{ name: string; data: any; invalid?: string }> {
		const schema = param.schema as SchemaObject;
		return InvalidData.generateInvalidDataBySchema(schema, false, !!schema.required)
			.map(o => ({...o, name: param.name}));
	}

	static generateInvalidIntegerData(schema: SchemaObject): Array<{ data: any; invalid: string }> {
		const result: Array<{ data: any; invalid: string }> = [];
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

	static generateInvalidNumberData(schema: SchemaObject): Array<{ data: any; invalid: string }> {
		const result: Array<{ data: any; invalid: string }> = [];
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

	static generateInvalidStringData(schema: SchemaObject, isField: boolean, required: boolean): Array<{ data: any; invalid: string }> {
		const result: Array<{ data: any; invalid: string }> = [];
		if (schema.default === undefined && isField && required) { // if the default value available, these parameter are always valid to omit
			result.push({data: '', invalid: 'empty string'});
		}
		if (schema.enum) {
			result.push({data: 'invalid', invalid: 'invalid enum'});
		}
		return result;
	}

	static generateInvalidBooleanData(_: SchemaObject): Array<{ data: any; invalid: string }> {
		const result: Array<{ data: any; invalid: string }> = [];
		result.push({data: '', invalid: 'empty string'});
		result.push({data: chance.string(), invalid: 'string'});
		result.push({data: chance.integer() + 2, invalid: 'integer > 1'});
		result.push({data: -(chance.integer() + 1), invalid: 'integer < 0'});
		return result;
	}

	static generateInvalidArrayData(schema: SchemaObject, isField: boolean): Array<{ data: any; invalid: string }> {
		const result: Array<{ data: any; invalid: string }> = [];
		if (schema.required && isField) {
			result.push({data: null, invalid: 'null'});
		}
		const array = [ValidData.generateValidDataSchema(schema.items as SchemaObject).data];
		const invalids = InvalidData.generateInvalidDataBySchema(schema.items as SchemaObject, isField, !!schema.required);
		for (const invalid of invalids) {
			result.push({data: array.concat([invalid.data]), invalid: invalid.invalid});
		}
		return result;
	}

	static generateInvalidDataBySchema(schema: SchemaObject, isField: boolean, required: boolean): Array<{ data: any; invalid: string }> {
		switch (schema.type) {
			case 'integer':
				return InvalidData.generateInvalidIntegerData(schema);
			case 'number':
				return InvalidData.generateInvalidNumberData(schema);
			case 'string':
				return InvalidData.generateInvalidStringData(schema, isField, required);
			case 'boolean':
				return InvalidData.generateInvalidBooleanData(schema);
			case 'array':
				return InvalidData.generateInvalidArrayData(schema, isField);
			default:
				console.error(`TODO: mock invalid data for type ${schema.type} ${JSON.stringify(schema)}`);
				return [];
		}
	}

}

function combineData(list: Array<{ name: string; data: any }>): any {
	const result: any = {};
	for (const entry of list) {
		result[entry.name] = entry.data;
	}
	return result;
}

export interface RequestMock {
	apiName: string;
	roles: Array<string>;
	params?: any;
	data: any;
	method: string;
	message: string;
	valid: boolean;
	expect: number;
	property?: string;
}

export class MockRequests {

	static generateValidRequestMock(apiName: string, method: string, roles: Array<string>, params: Array<ParameterObject>, property?: string): RequestMock {
		const queryData = combineData(params.filter(p => p.in === 'query').map(ValidData.generateValidDataByParameter));
		const pathData = combineData(params.filter(p => p.in === 'path').map(ValidData.generateValidDataByParameter));
		return {
			apiName,
			method,
			roles,
			valid: true,
			expect: 200,
			message: `should respond with 200 ok: ${params.map(p => p.name).join(',')}`,
			property,
			data: queryData,
			params: Object.keys(pathData).length > 0 ? pathData : undefined
		};
	}

	static generateInvalidRequestMocks(apiName: string, method: string, isQuery: boolean, roles: Array<string>, params: Array<ParameterObject>, property: ParameterObject): Array<RequestMock> {
		const invalids = InvalidData.generateInvalidDataByParameter(property);
		return invalids.map(invalid => {
			const data = combineData(params.map(p => p === property ? invalid : ValidData.generateValidDataByParameter(p)));
			return {
				apiName,
				method,
				roles,
				valid: false,
				expect: isQuery ? 422 : ((data[property.name] === '') ? 400 : 422),
				message: `"${property.name}" set to "${invalid.invalid}"`,
				property: property.name,
				data
			};
		});
	}

	static async generateRequestMock(apiName: string, method: string, op: OperationObject): Promise<Array<RequestMock>> {
		let mocks: Array<RequestMock> = [];
		const sec = (op.security || [])[0];
		let roles: Array<string> = [];
		if (sec) {
			roles = (sec[Object.keys(sec)[0]]) || [];
		}
		const parameters: Array<ParameterObject> = (op.parameters || []) as Array<ParameterObject>;
		const queryParameters = parameters.filter(p => p.in === 'query');
		const pathParameters = parameters.filter(p => p.in === 'path');
		if (queryParameters.length > 0) {
			mocks = this.generateQueryParameterMocks(queryParameters, mocks, apiName, method, roles);
		} else if (pathParameters.length === 0) {
			mocks.push(MockRequests.generateValidRequestMock(apiName, method, roles, []));
		}
		if (pathParameters.length > 0) {
			mocks = this.generatePathParameterMocks(pathParameters, mocks, apiName, method, roles);
		}
		return mocks;
	}

	private static generatePathParameterMocks(pathParameters: ParameterObject[], mocks: Array<RequestMock>, apiName: string, method: string, roles: Array<string>) {
		const minRequired: Array<ParameterObject> = pathParameters.filter(p => p.required);
		const optional: Array<ParameterObject> = pathParameters.filter(p => !p.required);
		mocks.push(MockRequests.generateValidRequestMock(apiName, method, roles, minRequired));
		for (const item of optional) {
			mocks.push(MockRequests.generateValidRequestMock(apiName, method, roles, minRequired.concat([item]), item.name));
		}
		if (pathParameters.length !== minRequired.length) {
			mocks.push(MockRequests.generateValidRequestMock(apiName, method, roles, pathParameters));
		}
		for (const item of minRequired) {
			const paramMocks = MockRequests.generateInvalidRequestMocks(apiName, method, false, roles, minRequired, item);
			paramMocks.forEach(p => {
				p.params = p.data;
				p.data = undefined;
			});
			mocks = mocks.concat(paramMocks);
		}
		for (const item of optional) {
			const paramMocks = MockRequests.generateInvalidRequestMocks(apiName, method, false, roles, minRequired.concat([item]), item);
			paramMocks.forEach(p => {
				p.params = p.data;
				p.data = undefined;
			});
			mocks = mocks.concat(paramMocks);
		}
		return mocks;
	}

	private static generateQueryParameterMocks(queryParameters: ParameterObject[], mocks: Array<RequestMock>, apiName: string, method: string, roles: Array<string>) {
		const minRequired: Array<ParameterObject> = queryParameters.filter(p => p.required);
		const optional: Array<ParameterObject> = queryParameters.filter(p => !p.required);
		mocks.push(MockRequests.generateValidRequestMock(apiName, method, roles, minRequired));
		for (const item of optional) {
			mocks.push(MockRequests.generateValidRequestMock(apiName, method, roles, minRequired.concat([item]), item.name));
		}
		mocks.push(MockRequests.generateValidRequestMock(apiName, method, roles, queryParameters));
		for (const item of minRequired) {
			mocks = mocks.concat(MockRequests.generateInvalidRequestMocks(apiName, method, true, roles, minRequired, item));
		}
		for (const item of optional) {
			mocks = mocks.concat(MockRequests.generateInvalidRequestMocks(apiName, method, true, roles, minRequired.concat([item]), item));
		}
		return mocks;
	}

	static async generateRequestMocks(spec: OpenAPIObject): Promise<Array<RequestMock>> {
		const derefSpec = (await refParser.dereference(spec)) as OpenAPIObject;
		let requestMocks: Array<RequestMock> = [];
		const paths = Object.keys(derefSpec.paths);
		for (const apiPath of paths) {
			const api = apiPath.slice(1);
			const operations = Object.keys(derefSpec.paths[apiPath]);
			for (const operation of operations) {
				const path = derefSpec.paths[apiPath];
				requestMocks = requestMocks.concat(await MockRequests.generateRequestMock(api, operation, (path as any)[operation] as OperationObject));
			}
		}
		return requestMocks;
	}
}
