import {JAMAPI_VERSION} from '../../modules/engine/rest/version.js';
import {ResultType} from '../../modules/rest/decorators/ResultType.js';
import {ObjField} from '../../modules/rest/decorators/ObjField.js';

@ResultType()
export class Ping {
	@ObjField({description: 'Jam Api Version', example: JAMAPI_VERSION})
	version!: string;
}
