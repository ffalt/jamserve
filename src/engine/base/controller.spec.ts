import refParser from 'json-schema-ref-parser';
import {JamApi} from '../../api/jam/api';
import JamOpenApi from '../../model/jam-openapi.json';
import {JSONSchemaDefinition} from '../../model/json-schema.spec';
import {OpenAPIObject} from '../../model/openapi-spec';
import {jsonValidator, validateJSON} from '../../utils/validate-json';
import {testEngines} from '../engine.spec';
import {mockUserName} from '../user/user.mock';
import {User} from '../user/user.model';

// let JamOpenApiDeref: OpenAPIObject;

export async function validateJamResponse(name: string, data: any, isArray?: boolean): Promise<void> {
	// if (!JamOpenApiDeref) {
	// 	JamOpenApiDeref = (await refParser.dereference(JamOpenApi)) as any;
	// }
	if (!JamOpenApi.components) {
		throw new Error('Invalid Open Api Spec');
	}
	const schemas = JamOpenApi.components.schemas;

	let def: any;
	let testData: any;
	if (isArray) {
		def = {
			type: 'object',
			properties: {
				list: {
					type: 'array',
					items: {
						$ref: '#/components/schemas/' + name
					}
				}
			},
			components: {schemas}
		};
		testData = {list: data};
	} else {
		testData = data;
		def = {...(schemas as any)[name]};
		def.components = {schemas};
	}
	const validator = jsonValidator(def);
	const result = await validateJSON(testData, validator);
	if (result.errors.length > 0) {
		return Promise.reject(Error(JSON.stringify({name, errors: result.errors})));
	}
}

export function testController(opts: {}, setup: (jam: JamApi, user: User) => Promise<void>, tests: (jam: JamApi) => void, cleanup?: () => Promise<void>): void {
	let jam: JamApi;
	testEngines(opts, async (testEngine) => {
		jam = new JamApi(testEngine.engine);
		const user = await jam.engine.userService.getByName(mockUserName) as User;
		if (!user) {
			return Promise.reject(Error('Invalid Test Setup'));
		}
		await setup(jam, user);
	}, () => {
		tests(jam);
	}, async () => {
		if (cleanup) {
			await cleanup();
		}
	});
}
