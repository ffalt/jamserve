import {it} from 'mocha';
import {JamApi} from '../../api/jam/api';
import * as dataSchema from '../../model/jam-rest-data.schema.json';
import {jsonValidator, validateJSON} from '../../utils/validate-json';
import {testEngines} from '../engine.spec';
import {JSONSchemaDefinition} from '../../model/json-schema.spec';

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
		return Promise.reject(Error(JSON.stringify(result.errors)));
	}
}

export function testController(opts: {}, setup: (jam: JamApi) => Promise<void>, tests: (jam: JamApi) => void, cleanup?: () => Promise<void>): void {
	let jam: JamApi;
	testEngines(opts, async (testEngine) => {
		jam = new JamApi(testEngine.engine);
		await setup(jam);
	}, () => {
		tests(jam);
	}, async () => {
		if (cleanup) {
			await cleanup();
		}
	});
}
