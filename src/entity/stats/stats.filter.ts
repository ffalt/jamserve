import {ObjField, ObjParamsType} from '../../modules/rest/index.js';

@ObjParamsType()
export class StatsFilter {
	@ObjField({nullable: true, description: 'filter stats by Root Id', isID: true})
	rootID?: string;
}
