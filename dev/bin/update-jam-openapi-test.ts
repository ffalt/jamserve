import fse from 'fs-extra';
import Mustache from 'mustache';
import path from 'path';
import {OpenAPIObject} from '../../src/model/openapi-spec';
import {ApiCalls, getJamApiCalls} from '../lib/api-calls';
import {MockRequests, RequestMock, RequestMocks} from '../lib/mock-requests';
import {run} from '../lib/run';

interface MustacheDataSection {
	title: string;
	subsections: Array<MustacheDataSubSection>;
}

interface MustacheDataSubSection {
	title: string;
	tests: Array<{ title: string; content: string }>;
}

interface MustacheDataTest {
	title: string;
	content: string;
}

function parameterDataToString(data: any): string {
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

class TestGenerator {

	static async generateFailGetRequestTest(mock: RequestMock, apiPath: string): Promise<MustacheDataTest | undefined> {
		if (mock.params !== undefined) {
			const split = apiPath.split('/');
			let p = split[1];
			Object.keys(mock.params).forEach(key => {
				p = p.replace(`{${key}}`, encodeURIComponent(mock.params[key]));
			});
			if (p.length === 0) {
				// without any path parameter it's not a 400, it's a 404
				return undefined;
			}
			return {title: mock.message.replace(/'/g, '"'), content: `await get('${split[0]}/${p}', {}, 400);`};
		}
		return {title: mock.message.replace(/'/g, '"'), content: `await get('${apiPath}', ${parameterDataToString(mock.data)}, 400);`};
	}

	static async generateFailNoRightsRequestTest(mock: RequestMock, apiPath: string, operation: string): Promise<MustacheDataTest> {
		if (operation === 'get') {
			if (mock.params !== undefined) {
				let p = apiPath;
				Object.keys(mock.params).forEach(key => {
					p = p.replace(`{${key}}`, encodeURIComponent(mock.params[key]));
				});
				return {title: 'should respond with 401 Unauth', content: `await getNoRights('${p}', {}, 401);`};
			}
			return {title: 'should respond with 401 Unauth', content: `await getNoRights('${apiPath}', ${parameterDataToString(mock.data)}, 401);`};
		}
		let postQuery = '{}';
		if (mock.data && Object.keys(mock.data).length > 0) {
			postQuery = `${parameterDataToString(mock.data)}`;
		}
		return {title: 'should respond with 401 Unauth', content: `await postNoRights('${apiPath}', ${postQuery}, {}, 401);`};
	}

	static async generateFailUauthRequestTest(mock: RequestMock, apiPath: string, operation: string): Promise<MustacheDataTest> {
		if (operation === 'get') {
			if (mock.params !== undefined) {
				let p = apiPath;
				Object.keys(mock.params).forEach(key => {
					p = p.replace(`{${key}}`, encodeURIComponent(mock.params[key]));
				});
				return {title: 'should respond with 401 Unauth', content: `await getNotLoggedIn('${p}', {}, 401);`};
			}
			return {title: 'should respond with 401 Unauth', content: `await getNotLoggedIn('${apiPath}', ${parameterDataToString(mock.data)}, 401);`};
		}
		const postQuery = (mock.data && Object.keys(mock.data).length > 0) ? parameterDataToString(mock.data) : '{}';
		return {title: 'should respond with 401 Unauth', content: `await postNotLoggedIn('${apiPath}', ${postQuery}, {}, 401);`};
	}

	static async generateFailTest(mock: RequestMock, apiPath: string, operation: string): Promise<MustacheDataTest | undefined> {
		return TestGenerator.generateFailGetRequestTest(mock, apiPath);
	}

	static async generateTestsByPathOperation(apiPath: string, operation: string, mocks: RequestMocks, apicalls: ApiCalls, openapi: OpenAPIObject): Promise<Array<MustacheDataSubSection>> {
		const sections: Array<MustacheDataSubSection> = [];
		const requests = mocks[apiPath][operation];
		const valid = requests.filter(r => r.valid);
		if (valid.length > 0 && (!openapi.paths['/' + apiPath][operation].security || openapi.paths['/' + apiPath][operation].security.length > 0)) {
			const noLogInFailSection: MustacheDataSubSection = {
				title: 'should fail without login',
				tests: [await TestGenerator.generateFailUauthRequestTest(valid[0], apiPath, operation)]
			};
			sections.push(noLogInFailSection);
			const call = apicalls.calls.find(c => c.name === apiPath);
			if (call && call.roles.length > 0) {
				const noNoRightsFailSection: MustacheDataSubSection = {
					title: 'should fail without required rights',
					tests: [await TestGenerator.generateFailNoRightsRequestTest(valid[0], apiPath, operation)]
				};
				sections.push(noNoRightsFailSection);
			}
		}
		const invalid = requests.filter(r => !r.valid);
		const invalidSection: MustacheDataSubSection = {title: 'should respond with 400 invalid/missing parameter', tests: []};
		for (const mock of invalid) {
			const test = await TestGenerator.generateFailTest(mock, apiPath, operation);
			if (test) {
				invalidSection.tests.push(test);
			}
		}
		if (invalidSection.tests.length > 0) {
			sections.push(invalidSection);
		}
		return sections;
	}

	static async generateTestsByPath(apiPath: string, mocks: RequestMocks, apicalls: ApiCalls, openapi: OpenAPIObject): Promise<Array<MustacheDataSubSection>> {
		let subsections: Array<MustacheDataSubSection> = [];
		for (const operation in mocks[apiPath]) {
			if (mocks[apiPath].hasOwnProperty(operation)) {
				subsections = subsections.concat(await TestGenerator.generateTestsByPathOperation(apiPath, operation, mocks, apicalls, openapi));
			}
		}
		return subsections;
	}

	static async generateTests(mocks: RequestMocks, apicalls: ApiCalls, openapi: OpenAPIObject): Promise<Array<MustacheDataSection>> {
		const sections: Array<MustacheDataSection> = [];
		for (const apiPath in mocks) {
			if (mocks.hasOwnProperty(apiPath)) {
				const section: MustacheDataSection = {title: apiPath, subsections: await TestGenerator.generateTestsByPath(apiPath, mocks, apicalls, openapi)};
				if (section.subsections.length > 0) {
					sections.push(section);
				}
			}
		}
		return sections;
	}

}

async function build(): Promise<string> {
	const basePath = path.resolve('../../src/model/');
	const destFile = path.resolve('../../src/api/server.test.ts');
	const openapi: OpenAPIObject = await fse.readJSON(path.join(basePath, 'jam-openapi.json'));
	const apiCalls: ApiCalls = await getJamApiCalls(basePath);
	const mocks = await MockRequests.generateRequestMocks(openapi);
	const sections = await TestGenerator.generateTests(mocks, apiCalls, openapi);
	const template = Mustache.render((await fse.readFile('../templates/server.test.ts.template')).toString(),
		{sections, version: apiCalls.version, apiPrefix: apiCalls.apiPrefix});
	await fse.writeFile(destFile, template);
	return destFile;
}

run(build);
