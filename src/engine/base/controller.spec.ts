import {JamApi} from '../../api/jam/api';
import * as dataSchema from '../../model/jam-rest-data.schema.json';
import {jsonValidator, validateJSON} from '../../utils/validate-json';
import {testEngines} from '../engine.spec';
import {JSONSchemaDefinition} from '../../model/json-schema.spec';
import {mockUserName} from '../user/user.mock';
import {User} from '../user/user.model';

export async function validateJamResponse(name: string, data: any, isArray?: boolean): Promise<void> {
	let def: JSONSchemaDefinition;
	let testData: any;
	if (isArray) {
		def = {
			type: 'object',
			properties: {
				list: {
					type: 'array',
					items: {
						$ref: '#/definitions/' + name
					}
				}
			},
			definitions: dataSchema.definitions
		};
		testData = {list: data};
	} else {
		testData = data;
		def = {...(dataSchema.definitions as any)[name]};
		def.definitions = {...dataSchema.definitions};
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
