import {ObjField, ObjParamsType} from '../../modules/rest/index.js';

@ObjParamsType()
export class IncludesNowPlayingArgs {
	@ObjField({nullable: true, description: 'include track Id on now playing entries', defaultValue: false, example: false})
	nowPlayingIncTrackIDs?: boolean;
	@ObjField({nullable: true, description: 'include tracks on now playing entries', defaultValue: false, example: false})
	nowPlayingIncTracks?: boolean;
	@ObjField({nullable: true, description: 'include track Id on now playing entries', defaultValue: false, example: false})
	nowPlayingIncEpisodeIDs?: boolean;
	@ObjField({nullable: true, description: 'include tracks on now playing entries', defaultValue: false, example: false})
	nowPlayingIncEpisodes?: boolean;
}
