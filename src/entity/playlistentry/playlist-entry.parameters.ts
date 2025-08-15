import { PlaylistEntryOrderFields } from '../../types/enums.js';
import { OrderByParameters } from '../base/base.parameters.js';
import { Field, ID, InputType } from 'type-graphql';
import { ObjectParametersType } from '../../modules/rest/decorators/object-parameters-type.js';
import { ObjectField } from '../../modules/rest/decorators/object-field.js';

@InputType()
@ObjectParametersType()
export class PlaylistEntryOrderParameters extends OrderByParameters {
	@ObjectField(() => PlaylistEntryOrderFields, { nullable: true, description: 'order by field' })
	@Field(() => PlaylistEntryOrderFields, { nullable: true })
	orderBy?: PlaylistEntryOrderFields;
}

@InputType()
export class PlaylistEntryOrderParametersQL extends PlaylistEntryOrderParameters {
}

@ObjectParametersType()
@InputType()
export class PlaylistEntryFilterParameters {
	@Field(() => [ID], { nullable: true })
	@ObjectField(() => [String], { nullable: true, description: 'filter by Playlist Ids', isID: true })
	playlistIDs?: Array<string>;
}
