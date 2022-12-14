// CoverArtArchive API Version 1.0
/* eslint-disable @typescript-eslint/naming-convention */

export declare namespace CoverArtArchive {

	export interface Response {
		'images': Array<Image>;
		'release'?: string;
	}

	// https://musicbrainz.org/doc/Cover_Art/Types
	export type ImageTypes = 'Front' | 'Back' | 'Booklet' | 'Medium' | 'Tray' | 'Obi' | 'Spine' | 'Track' | 'Liner' | 'Sticker' | 'Poster' | 'Watermark' | 'Raw' | 'Unedited' | 'Other';

	export interface Image {
		'types': Array<ImageTypes>;
		'front': boolean;
		'back': boolean;
		'edit': number;
		'image': string;
		'comment': string;
		'approved': boolean;
		'id': string;
		'thumbnails': {
			'250': string;
			'500': string;
			'1200': string;
			'small': string;
			'large': string;
		};
	}

}
