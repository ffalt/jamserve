import { ObjParamsType } from '../../modules/rest/decorators/ObjParamsType.js';
import { ObjField } from '../../modules/rest/decorators/ObjField.js';

@ObjParamsType()
export class IncludesNowPlayingArgs {
	@ObjField({ nullable: true, description: 'include track Id on now playing entries', defaultValue: false, example: false })
	nowPlayingIncTrackIDs?: boolean;

	@ObjField({ nullable: true, description: 'include tracks on now playing entries', defaultValue: false, example: false })
	nowPlayingIncTracks?: boolean;

	@ObjField({ nullable: true, description: 'include track Id on now playing entries', defaultValue: false, example: false })
	nowPlayingIncEpisodeIDs?: boolean;

	@ObjField({ nullable: true, description: 'include tracks on now playing entries', defaultValue: false, example: false })
	nowPlayingIncEpisodes?: boolean;
}
