import {ObjParamsType} from '../../modules/rest/decorators/ObjParamsType.js';
import {ObjField} from '../../modules/rest/decorators/ObjField.js';

@ObjParamsType()
export class StatsFilter {
	@ObjField({ nullable: true, description: 'filter stats by Root Id', isID: true })
	rootID?: string;
}
