import { ObjField, ResultType } from '../../modules/rest/index.js';
import { MediaBase } from '../tag/tag.model.js';
import { TrackHealthHint } from '../health/health.model.js';
import { Page } from '../base/base.model.js';

@ResultType({ description: 'Track Base' })
export class TrackBase extends MediaBase {
	@ObjField({ description: 'Parent Folder Id', isID: true })
	parentID!: string;
}

@ResultType({ description: 'Track' })
export class Track extends TrackBase {
}

@ResultType({ description: 'Tracks Page' })
export class TrackPage extends Page {
	@ObjField(() => Track, { description: 'List of Tracks' })
	items!: Array<Track>;
}

@ResultType({ description: 'Track Health' })
export class TrackHealth {
	@ObjField(() => TrackBase, { description: 'Track' })
	track!: TrackBase;

	@ObjField(() => [TrackHealthHint], { description: 'List of Health Hints' })
	health!: Array<TrackHealthHint>;
}

@ResultType({ description: 'Track Lyrics (via External Service or Audio Tag)' })
export class TrackLyrics {
	@ObjField({
		nullable: true,
		description: 'Lyrics',
		example: 'I got a letter from the government\nThe other day\nI opened and read it\nIt said they were suckers\n They wanted me for their army or whatever\n Picture me given’ a damn, I said never.'
	})
	lyrics?: string;

	@ObjField({ nullable: true, description: 'Audio Tag or External Service' })
	source?: string;
}
