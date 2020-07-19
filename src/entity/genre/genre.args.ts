import {ObjField, ObjParamsType} from '../../modules/rest/decorators';

@ObjParamsType()
export class GenreFilterArgs {
	@ObjField({nullable: true, description: 'filter genre by Root Id', isID: true})
	rootID?: string;
}
