import {ObjField, ResultType} from '../../modules/rest/decorators';
import {JAMAPI_VERSION} from '../../modules/engine/rest/version';

@ResultType()
export class Ping {
	@ObjField({description: 'Jam Api Version', example: JAMAPI_VERSION})
	version!: string;
}
