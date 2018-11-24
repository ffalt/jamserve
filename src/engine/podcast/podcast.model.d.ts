import {DBObject} from '../base/base.model';
import {Subsonic} from '../../model/subsonic-rest-data-1.16.0';

export interface Podcast extends DBObject {
	url: string;
	created: number;
	lastCheck: number;
	status: Subsonic.PodcastStatus;
	errorMessage?: string;
	tag?: PodcastTag;
}

export interface PodcastTag {
	title: string;
	status: Subsonic.PodcastStatus;
	link: string;
	author: string;
	description: string;
	generator: string;
	image: string;
	categories: Array<string>;
}
