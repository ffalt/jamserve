import {DBObject} from '../base/base.model';
import {Subsonic} from '../../model/subsonic-rest-data-1.16.0';
import {TrackMedia, TrackTag} from '../track/track.model';

export interface Episode extends DBObject {
	podcastID: string;
	status: Subsonic.PodcastStatus;
	error?: string;
	path?: string;
	link?: string;
	summary: string;
	date: number;
	name: string;
	guid?: string;
	author?: string;
	chapters?: Array<PodcastEpisodeChapter>;
	enclosures: Array<PodcastEpisodeEnclosure>;
	stat?: {
		created: number;
		modified: number;
		size: number;
	};
	tag?: TrackTag;
	media?: TrackMedia;
}

export interface PodcastEpisodeChapter {
	start: number;
	title: string;
}

export interface PodcastEpisodeEnclosure {
	url: string;
	type: string;
	length: number;
}
