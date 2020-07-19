import {ObjField, ObjParamsType} from '../../modules/rest/decorators';

@ObjParamsType()
export class StatsFilter {
	@ObjField({nullable: true, description: 'filter stats by Root Id', isID: true})
	rootID?: string;
}
