import { ObjField, ResultType } from '../../modules/rest/index.js';
import { JAMAPI_VERSION } from '../../modules/engine/rest/version.js';

@ResultType()
export class Ping {
	@ObjField({ description: 'Jam Api Version', example: JAMAPI_VERSION })
	version!: string;
}
