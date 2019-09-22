import {Chance} from 'chance';
import fse from 'fs-extra';
import refParser from 'json-schema-ref-parser';
import Mustache from 'mustache';
import path from 'path';
import {OpenAPIObject, OperationObject, ParameterObject, SchemaObject} from '../../src/model/openapi-spec';
import {ApiCalls, getJamApiCalls, run} from './utils';

const chance = new Chance();

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

function generateValidDataSchema(schema: SchemaObject): any {
	const type = schema.type ? schema.type : 'null';
	if (type === 'string') {
		if (schema.enum) {
			return schema.enum[chance.integer({min: 0, max: schema.enum.length - 1})];
		}
		return chance.string();
	}
	if (type === 'number') {
		return chance.floating({min: schema.minimum !== undefined ? schema.minimum : 1, max: schema.maximum !== undefined ? schema.maximum - 1 : 100, fixed: 2});
	}
	if (type === 'integer') {
		return chance.integer({min: schema.minimum !== undefined ? schema.minimum : 1, max: schema.maximum !== undefined ? schema.maximum - 1 : 100});
	}
	if (type === 'boolean') {
		return chance.bool();
	}
	if (type === 'array' && schema.items) {
		return [
			generateValidDataSchema(schema.items as SchemaObject),
			generateValidDataSchema(schema.items as SchemaObject)
		];
	}
	throw Error(`TODO: Implement valid value for type ${type} ${JSON.stringify(schema)}`);
}

function generateValidDataByParameter(param: ParameterObject): { name: string, data: any } {
	return {name: param.name, data: generateValidDataSchema(param.schema as SchemaObject)};
}

function generateInvalidDataBySchema(schema: SchemaObject): Array<{ data: any, invalid: string }> {
	const result: Array<{ data: any, invalid: string }> = [];
	const type = schema.type;
	if (type === 'integer') {
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
	} else if (type === 'number') {
		result.push({data: chance.string(), invalid: 'string'});
		result.push({data: '', invalid: 'empty string'});
		result.push({data: true, invalid: 'boolean'});
		if (schema.minimum !== undefined) {
			result.push({data: schema.minimum - 1, invalid: `less than minimum ${schema.minimum}`});
		}
		if (schema.maximum !== undefined) {
			result.push({data: schema.maximum + 1, invalid: `more than minimum ${schema.maximum}`});
		}
	} else if (type === 'string') {
		if (schema.default === undefined) { // if the default value available, these parameter are always valid to omit
			result.push({data: '', invalid: 'empty string'});
		}
		if (schema.enum) {
			result.push({data: 'invalid', invalid: 'invalid enum'});
		}
	} else if (type === 'boolean') {
		result.push({data: '', invalid: 'empty string'});
		result.push({data: chance.string(), invalid: 'string'});
		result.push({data: chance.integer() + 2, invalid: 'integer > 1'});
		result.push({data: -(chance.integer() + 1), invalid: 'integer < 0'});
	} else if (type === 'array') {
		result.push({data: null, invalid: 'null'});
		const array = [generateValidDataSchema(schema.items as SchemaObject).data];
		const invalids = generateInvalidDataBySchema(schema.items as SchemaObject);
		for (const invalid of invalids) {
			result.push({data: array.concat([invalid.data]), invalid: invalid.invalid});
		}
	} else {
		console.error(`TODO: mock invalid data for type ${type} ${JSON.stringify(schema)}`);
	}
	return result;
}

function generateInvalidDataByParameter(param: ParameterObject): Array<{ name: string, data: any, invalid?: string }> {
	return generateInvalidDataBySchema(param.schema as SchemaObject).map(o => ({...o, name: param.name}));
}

function combineData(list: Array<{ name: string, data: any }>): any {
	const result: any = {};
	for (const entry of list) {
		result[entry.name] = entry.data;
	}
	return result;
}

function generateValidRequestMock(params: Array<ParameterObject>, property?: string): RequestMock {
	const queryData = combineData(params.filter(p => p.in === 'query').map(generateValidDataByParameter));
	const pathData = combineData(params.filter(p => p.in === 'path').map(generateValidDataByParameter));
	return {
		valid: true,
		message: `should respond with 200 ok: ${params.map(p => p.name).join(',')}`,
		property,
		data: queryData,
		params: Object.keys(pathData).length > 0 ? pathData : undefined
	};
}

function generateInvalidRequestMocks(params: Array<ParameterObject>, property: ParameterObject): Array<RequestMock> {
	const invalids = generateInvalidDataByParameter(property);
	return invalids.map(invalid => {
		const data = combineData(params.map(p => p === property ? invalid : generateValidDataByParameter(p)));
		return {
			valid: false,
			message: `"${property.name}" set to "${invalid.invalid}"`,
			property: property.name,
			data
		};
	});
}

async function generateRequestMock(op: OperationObject): Promise<Array<RequestMock>> {
	let mocks: Array<RequestMock> = [];
	const parameters: Array<ParameterObject> = (op.parameters || []) as Array<ParameterObject>;

	const queryParameters = parameters.filter(p => p.in === 'query');
	const pathParameters = parameters.filter(p => p.in === 'path');
	if (queryParameters.length > 0) {
		const minRequired: Array<ParameterObject> = queryParameters.filter(p => p.required);
		const optional: Array<ParameterObject> = queryParameters.filter(p => !p.required);
		mocks.push(generateValidRequestMock(minRequired));
		for (const item of optional) {
			mocks.push(generateValidRequestMock(minRequired.concat([item]), item.name));
		}
		mocks.push(generateValidRequestMock(queryParameters));
		for (const item of minRequired) {
			mocks = mocks.concat(generateInvalidRequestMocks(minRequired, item));
		}
		for (const item of optional) {
			mocks = mocks.concat(generateInvalidRequestMocks(minRequired.concat([item]), item));
		}
	} else if (pathParameters.length === 0) {
		mocks.push(generateValidRequestMock([]));
	}
	if (pathParameters.length > 0) {
		const minRequired: Array<ParameterObject> = pathParameters.filter(p => p.required);
		const optional: Array<ParameterObject> = pathParameters.filter(p => !p.required);
		mocks.push(generateValidRequestMock(minRequired));
		for (const item of optional) {
			mocks.push(generateValidRequestMock(minRequired.concat([item]), item.name));
		}
		if (pathParameters.length !== minRequired.length) {
			mocks.push(generateValidRequestMock(pathParameters));
		}
		for (const item of minRequired) {
			const paramMocks = generateInvalidRequestMocks(minRequired, item);
			paramMocks.forEach(p => {
				p.params = p.data;
				p.data = undefined;
			});
			mocks = mocks.concat(paramMocks);
		}
		for (const item of optional) {
			const paramMocks = generateInvalidRequestMocks(minRequired.concat([item]), item);
			paramMocks.forEach(p => {
				p.params = p.data;
				p.data = undefined;
			});
			mocks = mocks.concat(paramMocks);
		}
	}
	return mocks;
}

function formatData(data: any): string {
	return `{${Object.keys(data).map(key => {
		if (data[key] === undefined || data[key] === null) {
			return `${key}: null`;
		}
		if (Array.isArray(data[key])) {
			return `${key}: [${data[key].map((v: any) => {
				if (v === undefined || v === null) {
					return 'null';
				}
				return JSON.stringify(v).replace(/"/g, '\'');
			}).join(', ')}]`;
		}
		return `${key}: ${JSON.stringify(data[key]).replace(/"/g, '\'')}`;
	}).join(', ')}}`;
}

// async function generateSuccessGetRequestTest(mock: RequestMock, apiPath: string): Promise<string> {
// 	if (mock.params !== undefined) {
// 		let p = apiPath;
// 		Object.keys(mock.params).forEach(key => {
// 			p = p.replace(`{${key}}`, mock.params[key]);
// 		});
// 		return `				it('${mock.message.replace(/'/g, '"')}', async () => {
// 					return get('/api/v1${p}').expect(200);
// 				});`;
// 	}
//
// 	return `				it('${mock.message.replace(/'/g, '"')}', async () => {
// 					return get('/api/v1${apiPath}').query(${formatData(mock.data)}).expect(200);
// 				});`;
// }

async function generateFailGetRequestTest(mock: RequestMock, apiPath: string): Promise<MustacheDataTest | undefined> {
	if (mock.params !== undefined) {
		let p = apiPath;
		Object.keys(mock.params).forEach(key => {
			p = p.replace(`{${key}}`, encodeURIComponent(mock.params[key]));
		});
		if (p.length === 0) {
			// without any path parameter it's not a 400, it's a 404
			return undefined;
		}
		return {title: mock.message.replace(/'/g, '"'), content: `await get('${p}', {}, 400);`};
	}
	return {title: mock.message.replace(/'/g, '"'), content: `await get('${apiPath}', ${formatData(mock.data)}, 400);`};
}

async function generateFailNoRightsRequestTest(mock: RequestMock, apiPath: string, operation: string): Promise<MustacheDataTest> {
	if (operation === 'get') {
		if (mock.params !== undefined) {
			let p = apiPath;
			Object.keys(mock.params).forEach(key => {
				p = p.replace(`{${key}}`, encodeURIComponent(mock.params[key]));
			});
			return {title: 'should respond with 401 Unauth', content: `await getNoRights('${p}', {}, 401);`};
		}
		return {title: 'should respond with 401 Unauth', content: `await getNoRights('${apiPath}', ${formatData(mock.data)}, 401);`};
	}
	let postQuery = '{}';
	if (mock.data && Object.keys(mock.data).length > 0) {
		postQuery = `${formatData(mock.data)}`;
	}
	return {title: 'should respond with 401 Unauth', content: `await postNoRights('${apiPath}', ${postQuery}, {}, 401);`};
}

async function generateFailUauthRequestTest(mock: RequestMock, apiPath: string, operation: string): Promise<MustacheDataTest> {
	if (operation === 'get') {
		if (mock.params !== undefined) {
			let p = apiPath;
			Object.keys(mock.params).forEach(key => {
				p = p.replace(`{${key}}`, encodeURIComponent(mock.params[key]));
			});
			return {title: 'should respond with 401 Unauth', content: `await getNotLoggedIn('${p}', {}, 401);`};
		}
		return {title: 'should respond with 401 Unauth', content: `await getNotLoggedIn('${apiPath}', ${formatData(mock.data)}, 401);`};
	}
	const postQuery = (mock.data && Object.keys(mock.data).length > 0) ? formatData(mock.data) : '{}';
	return {title: 'should respond with 401 Unauth', content: `await postNotLoggedIn('${apiPath}', ${postQuery}, {}, 401);`};
}

async function generateFailTest(mock: RequestMock, apiPath: string, operation: string): Promise<MustacheDataTest | undefined> {
	return generateFailGetRequestTest(mock, apiPath);
}

async function generateRequestMocks(spec: OpenAPIObject): Promise<RequestMocks> {
	const derefSpec = (await refParser.dereference(spec)) as OpenAPIObject;
	const requestMocks: RequestMocks = {};
	for (const apiPath in derefSpec.paths) {
		if (derefSpec.paths.hasOwnProperty(apiPath)) {
			const api = apiPath.slice(1);
			requestMocks[api] = {};
			for (const operation in derefSpec.paths[apiPath]) {
				if (derefSpec.paths[apiPath].hasOwnProperty(operation)) {
					requestMocks[api][operation] = await generateRequestMock(derefSpec.paths[apiPath][operation] as OperationObject);
				}
			}
		}
	}
	return requestMocks;
}

interface MustacheData {
	sections: Array<MustacheDataSection>;
}

interface MustacheDataSection {
	title: string;
	subsections: Array<MustacheDataSubSection>;
}

interface MustacheDataSubSection {
	title: string;
	tests: Array<{ title: string, content: string }>;
}

interface MustacheDataTest {
	title: string;
	content: string;
}

async function generateTestsByPath(apiPath: string, operation: string, mocks: RequestMocks, apicalls: ApiCalls, openapi: OpenAPIObject): Promise<Array<MustacheDataSubSection>> {
	const sections: Array<MustacheDataSubSection> = [];
	const requests = mocks[apiPath][operation];
	const valid = requests.filter(r => r.valid);
	// const validSection: MustacheDataSubSection = {title: 'should complete request', tests: []};
	// for (const mock of valid) {
	// validSection.tests.push(await generateValidTest(mock, apiPath, operation));
	// }
	// if (validSection.tests.length > 0) {
	// 	sections.push(validSection);
	// }
	if (valid.length > 0 && (!openapi.paths['/' + apiPath][operation].security || openapi.paths['/' + apiPath][operation].security.length > 0)) {
		const noLogInFailSection: MustacheDataSubSection = {title: 'should fail without login', tests: [await generateFailUauthRequestTest(valid[0], apiPath, operation)]};
		sections.push(noLogInFailSection);
		const call = apicalls.calls.find(c => c.name === apiPath);
		if (call && call.roles.length > 0) {
			const noNoRightsFailSection: MustacheDataSubSection = {title: 'should fail without required rights', tests: [await generateFailNoRightsRequestTest(valid[0], apiPath, operation)]};
			// console.log(noNoRightsFailSection);
			sections.push(noNoRightsFailSection);
		}
	}
	const invalid = requests.filter(r => !r.valid);
	const invalidSection: MustacheDataSubSection = {title: 'should respond with 400 invalid/missing parameter', tests: []};
	for (const mock of invalid) {
		const test = await generateFailTest(mock, apiPath, operation);
		if (test) {
			invalidSection.tests.push(test);
		}
	}
	if (invalidSection.tests.length > 0) {
		sections.push(invalidSection);
	}
	return sections;
}

async function generateTests(mocks: RequestMocks, apicalls: ApiCalls, openapi: OpenAPIObject): Promise<Array<MustacheDataSection>> {
	const sections: Array<MustacheDataSection> = [];
	for (const apiPath in mocks) {
		if (mocks.hasOwnProperty(apiPath)) {
			const section: MustacheDataSection = {title: apiPath, subsections: []};
			for (const operation in mocks[apiPath]) {
				if (mocks[apiPath].hasOwnProperty(operation)) {
					section.subsections = await generateTestsByPath(apiPath, operation, mocks, apicalls, openapi);
				}
			}
			if (section.subsections.length > 0) {
				sections.push(section);
			}
		}
	}
	return sections;
}

async function build(): Promise<string> {
	const basePath = path.resolve('../../src/model/');
	const destfile = path.resolve('../../src/api/server.test.ts');
	const openapi: OpenAPIObject = await fse.readJSON(path.join(basePath, 'jam-openapi.json'));
	const apicalls: ApiCalls = await getJamApiCalls(basePath);
	const mocks = await generateRequestMocks(openapi);
	const sections = await generateTests(mocks, apicalls, openapi);
	// await fse.writeFile(destfile + '.json', JSON.stringify(mocks));
	const template = Mustache.render((await fse.readFile('../templates/server.test.ts.template')).toString(), {sections, version: apicalls.version, apiPrefix: apicalls.apiPrefix});
	await fse.writeFile(destfile, template);
	return destfile;
}

run(build);
