import { TrackBase } from '../track/track.model.js';
import { examples } from '../../modules/engine/rest/example.consts.js';
import { EpisodeBase } from '../episode/episode.model.js';
import { Page } from '../base/base.model.js';
import { ResultType } from '../../modules/rest/decorators/result-type.js';
import { ObjectField } from '../../modules/rest/decorators/object-field.js';

@ResultType({ description: 'Bookmark Base' })
export class BookmarkBase {
	@ObjectField({ description: 'ID', isID: true })
	id!: string;

	@ObjectField({ description: 'Track Id', isID: true })
	trackID?: string;

	@ObjectField({ description: 'Episode Id', isID: true })
	episodeID?: string;

	@ObjectField({ description: 'Position in Audio', isID: true })
	position!: number;

	@ObjectField({ description: 'Comment', example: 'awesome!' })
	comment?: string;

	@ObjectField({ description: 'Created Timestamp', min: 0, example: examples.timestamp })
	created!: number;

	@ObjectField({ description: 'Changed Timestamp', min: 0, example: examples.timestamp })
	changed!: number;
}

@ResultType({ description: 'Bookmark' })
export class Bookmark extends BookmarkBase {
	@ObjectField(() => TrackBase, { nullable: true, description: 'The bookmarked Track' })
	track?: TrackBase;

	@ObjectField(() => EpisodeBase, { nullable: true, description: 'The bookmarked Episode' })
	episode?: EpisodeBase;
}

@ResultType({ description: 'Bookmark Page' })
export class BookmarkPage extends Page {
	@ObjectField(() => Bookmark, { description: 'List of Bookmark' })
	items!: Array<Bookmark>;
}
