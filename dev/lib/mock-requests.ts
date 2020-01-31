import refParser from 'json-schema-ref-parser';
import {OpenAPIObject, OperationObject, ParameterObject} from '../../src/model/openapi-spec';
import {InvalidData, ValidData} from './mock-data';

function combineData(list: Array<{ name: string, data: any }>): any {
	const result: any = {};
	for (const entry of list) {
		result[entry.name] = entry.data;
	}
	return result;
}

export interface RequestMocks {
	[apiName: string]: {
		[method: string]: Array<RequestMock>;
	};
}

export interface RequestMock {
	params?: any;
	data: any;
	message: string;
	valid: boolean;
	property?: string;
}

export class MockRequests {

	static generateValidRequestMock(params: Array<ParameterObject>, property?: string): RequestMock {
		const queryData = combineData(params.filter(p => p.in === 'query').map(ValidData.generateValidDataByParameter));
		const pathData = combineData(params.filter(p => p.in === 'path').map(ValidData.generateValidDataByParameter));
		return {
			valid: true,
			message: `should respond with 200 ok: ${params.map(p => p.name).join(',')}`,
			property,
			data: queryData,
			params: Object.keys(pathData).length > 0 ? pathData : undefined
		};
	}

	static generateInvalidRequestMocks(params: Array<ParameterObject>, property: ParameterObject): Array<RequestMock> {
		const invalids = InvalidData.generateInvalidDataByParameter(property);
		return invalids.map(invalid => {
			const data = combineData(params.map(p => p === property ? invalid : ValidData.generateValidDataByParameter(p)));
			return {
				valid: false,
				message: `"${property.name}" set to "${invalid.invalid}"`,
				property: property.name,
				data
			};
		});
	}

	static async generateRequestMock(op: OperationObject): Promise<Array<RequestMock>> {
		let mocks: Array<RequestMock> = [];
		const parameters: Array<ParameterObject> = (op.parameters || []) as Array<ParameterObject>;
		const queryParameters = parameters.filter(p => p.in === 'query');
		const pathParameters = parameters.filter(p => p.in === 'path');
		if (queryParameters.length > 0) {
			const minRequired: Array<ParameterObject> = queryParameters.filter(p => p.required);
			const optional: Array<ParameterObject> = queryParameters.filter(p => !p.required);
			mocks.push(MockRequests.generateValidRequestMock(minRequired));
			for (const item of optional) {
				mocks.push(MockRequests.generateValidRequestMock(minRequired.concat([item]), item.name));
			}
			mocks.push(MockRequests.generateValidRequestMock(queryParameters));
			for (const item of minRequired) {
				mocks = mocks.concat(MockRequests.generateInvalidRequestMocks(minRequired, item));
			}
			for (const item of optional) {
				mocks = mocks.concat(MockRequests.generateInvalidRequestMocks(minRequired.concat([item]), item));
			}
		} else if (pathParameters.length === 0) {
			mocks.push(MockRequests.generateValidRequestMock([]));
		}
		if (pathParameters.length > 0) {
			const minRequired: Array<ParameterObject> = pathParameters.filter(p => p.required);
			const optional: Array<ParameterObject> = pathParameters.filter(p => !p.required);
			mocks.push(MockRequests.generateValidRequestMock(minRequired));
			for (const item of optional) {
				mocks.push(MockRequests.generateValidRequestMock(minRequired.concat([item]), item.name));
			}
			if (pathParameters.length !== minRequired.length) {
				mocks.push(MockRequests.generateValidRequestMock(pathParameters));
			}
			for (const item of minRequired) {
				const paramMocks = MockRequests.generateInvalidRequestMocks(minRequired, item);
				paramMocks.forEach(p => {
					p.params = p.data;
					p.data = undefined;
				});
				mocks = mocks.concat(paramMocks);
			}
			for (const item of optional) {
				const paramMocks = MockRequests.generateInvalidRequestMocks(minRequired.concat([item]), item);
				paramMocks.forEach(p => {
					p.params = p.data;
					p.data = undefined;
				});
				mocks = mocks.concat(paramMocks);
			}
		}
		return mocks;
	}

	static async generateRequestMocks(spec: OpenAPIObject): Promise<RequestMocks> {
		const derefSpec = (await refParser.dereference(spec)) as OpenAPIObject;
		const requestMocks: RequestMocks = {};
		for (const apiPath in Object.keys(derefSpec.paths)) {
			const api = apiPath.slice(1);
			requestMocks[api] = {};
			if (derefSpec.paths[apiPath]) {
				for (const operation in Object.keys(derefSpec.paths[apiPath])) {
					requestMocks[api][operation] = await MockRequests.generateRequestMock(derefSpec.paths[apiPath][operation] as OperationObject);
				}
			}
		}
		return requestMocks;
	}
}
