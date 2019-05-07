import {PodcastStatus} from '../../model/jam-types';
import {DBObject} from '../base/base.model';

export interface Podcast extends DBObject {
	url: string;
	created: number;
	lastCheck: number;
	status: PodcastStatus;
	image?: string;
	errorMessage?: string;
	tag?: PodcastTag;
}

export interface PodcastTag {
	title: string;
	link: string;
	author: string;
	description: string;
	generator: string;
	image: string;
	categories: Array<string>;
}
