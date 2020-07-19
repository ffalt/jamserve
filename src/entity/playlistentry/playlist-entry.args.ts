import {ObjField, ObjParamsType} from '../../modules/rest/decorators';
import {PlaylistEntryOrderFields} from '../../types/enums';
import {OrderByArgs} from '../base/base.args';
import {Field, InputType} from 'type-graphql';

@InputType()
@ObjParamsType()
export class PlaylistEntryOrderArgs extends OrderByArgs {
	@ObjField(() => PlaylistEntryOrderFields, {nullable: true, description: 'order by field'})
	@Field(() => PlaylistEntryOrderFields, {nullable: true})
	orderBy?: PlaylistEntryOrderFields;
}

@InputType()
export class PlaylistEntryOrderArgsQL extends PlaylistEntryOrderArgs {
}
