import { ObjectParametersType } from '../../modules/rest/decorators/object-parameters-type.js';
import { ObjectField } from '../../modules/rest/decorators/object-field.js';

@ObjectParametersType()
export class IncludesNowPlayingParameters {
	@ObjectField({ nullable: true, description: 'include track Id on now playing entries', defaultValue: false, example: false })
	nowPlayingIncTrackIDs?: boolean;

	@ObjectField({ nullable: true, description: 'include tracks on now playing entries', defaultValue: false, example: false })
	nowPlayingIncTracks?: boolean;

	@ObjectField({ nullable: true, description: 'include track Id on now playing entries', defaultValue: false, example: false })
	nowPlayingIncEpisodeIDs?: boolean;

	@ObjectField({ nullable: true, description: 'include tracks on now playing entries', defaultValue: false, example: false })
	nowPlayingIncEpisodes?: boolean;
}
