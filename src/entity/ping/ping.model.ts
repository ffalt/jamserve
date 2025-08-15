import { JAMAPI_VERSION } from '../../modules/engine/rest/version.js';
import { ResultType } from '../../modules/rest/decorators/result-type.js';
import { ObjectField } from '../../modules/rest/decorators/object-field.js';

@ResultType()
export class Ping {
	@ObjectField({ description: 'Jam Api Version', example: JAMAPI_VERSION })
	version!: string;
}
