import { TrackBase } from '../track/track.model.js';
import { examples } from '../../modules/engine/rest/example.consts.js';
import { EpisodeBase } from '../episode/episode.model.js';
import { Page } from '../base/base.model.js';
import { ResultType } from '../../modules/rest/decorators/ResultType.js';
import { ObjField } from '../../modules/rest/decorators/ObjField.js';

@ResultType({ description: 'Bookmark Base' })
export class BookmarkBase {
	@ObjField({ description: 'ID', isID: true })
	id!: string;

	@ObjField({ description: 'Track Id', isID: true })
	trackID?: string;

	@ObjField({ description: 'Episode Id', isID: true })
	episodeID?: string;

	@ObjField({ description: 'Position in Audio', isID: true })
	position!: number;

	@ObjField({ description: 'Comment', example: 'awesome!' })
	comment?: string;

	@ObjField({ description: 'Created Timestamp', min: 0, example: examples.timestamp })
	created!: number;

	@ObjField({ description: 'Changed Timestamp', min: 0, example: examples.timestamp })
	changed!: number;
}

@ResultType({ description: 'Bookmark' })
export class Bookmark extends BookmarkBase {
	@ObjField(() => TrackBase, { nullable: true, description: 'The bookmarked Track' })
	track?: TrackBase;

	@ObjField(() => EpisodeBase, { nullable: true, description: 'The bookmarked Episode' })
	episode?: EpisodeBase;
}

@ResultType({ description: 'Bookmark Page' })
export class BookmarkPage extends Page {
	@ObjField(() => Bookmark, { description: 'List of Bookmark' })
	items!: Array<Bookmark>;
}
