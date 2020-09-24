export interface GpodderPodcast {
	url: string;
	title: string;
	author: string;
	description: string;
	subscribers: number;
	subscribers_last_week: number;
	logo_url: string;
	scaled_logo_url: string;
	website: string;
	mygpo_link: string;
}

export interface GpodderTag {
	title: string;
	tag: string;
	usage: number;
}
