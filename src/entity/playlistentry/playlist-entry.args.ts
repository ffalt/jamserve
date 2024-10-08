import { PlaylistEntryOrderFields } from '../../types/enums.js';
import { OrderByArgs } from '../base/base.args.js';
import { Field, ID, InputType } from 'type-graphql';
import { ObjParamsType } from '../../modules/rest/decorators/ObjParamsType.js';
import { ObjField } from '../../modules/rest/decorators/ObjField.js';

@InputType()
@ObjParamsType()
export class PlaylistEntryOrderArgs extends OrderByArgs {
	@ObjField(() => PlaylistEntryOrderFields, { nullable: true, description: 'order by field' })
	@Field(() => PlaylistEntryOrderFields, { nullable: true })
	orderBy?: PlaylistEntryOrderFields;
}

@InputType()
export class PlaylistEntryOrderArgsQL extends PlaylistEntryOrderArgs {
}

@ObjParamsType()
@InputType()
export class PlaylistEntryFilterArgs {
	@Field(() => [ID], { nullable: true })
	@ObjField(() => [String], { nullable: true, description: 'filter by Playlist Ids', isID: true })
	playlistIDs?: Array<string>;
}
