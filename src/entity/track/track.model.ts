import { MediaBase } from '../tag/tag.model.js';
import { TrackHealthHint } from '../health/health.model.js';
import { Page } from '../base/base.model.js';
import { ResultType } from '../../modules/rest/decorators/result-type.js';
import { ObjectField } from '../../modules/rest/decorators/object-field.js';

@ResultType({ description: 'Track Base' })
export class TrackBase extends MediaBase {
	@ObjectField({ description: 'Parent Folder Id', isID: true })
	parentID!: string;
}

@ResultType({ description: 'Track' })
export class Track extends TrackBase {
}

@ResultType({ description: 'Tracks Page' })
export class TrackPage extends Page {
	@ObjectField(() => Track, { description: 'List of Tracks' })
	items!: Array<Track>;
}

@ResultType({ description: 'Track Health' })
export class TrackHealth {
	@ObjectField(() => TrackBase, { description: 'Track' })
	track!: TrackBase;

	@ObjectField(() => [TrackHealthHint], { description: 'List of Health Hints' })
	health!: Array<TrackHealthHint>;
}

@ResultType({ description: 'Track Lyrics (via External Service or Audio Tag)' })
export class TrackLyrics {
	@ObjectField({
		nullable: true,
		description: 'Lyrics',
		example: 'I got a letter from the government\nThe other day\nI opened and read it\nIt said they were suckers\n They wanted me for their army or whatever\n Picture me given’ a damn, I said never.'
	})
	lyrics?: string;

	@ObjectField({
		nullable: true,
		description: 'Synced Lyrics',
		example: '[00:00.10]I got a letter from the government\n[00:02.30]The other day\n[00:04.50]I opened and read it\n[00:06.20]It said they were suckers\n[00:08.10] They wanted me for their army or whatever\n[00:10.40] Picture me given’ a damn, I said never.'
	})
	syncedLyrics?: string;

	@ObjectField({ nullable: true, description: 'Language of the the lyrics' })
	language?: string;

	@ObjectField({ nullable: true, description: 'Audio Tag or External Service' })
	source?: string;
}
