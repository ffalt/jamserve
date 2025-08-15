import { Base, Page } from '../base/base.model.js';
import { examples } from '../../modules/engine/rest/example.consts.js';
import { MediaBase } from '../tag/tag.model.js';
import { ResultType } from '../../modules/rest/decorators/result-type.js';
import { ObjectField } from '../../modules/rest/decorators/object-field.js';

@ResultType({ description: 'Playlist' })
export class PlaylistBase extends Base {
	@ObjectField({ description: 'Owner User Id', isID: true })
	userID!: string;

	@ObjectField({ description: 'Owner User Name', isID: true })
	userName!: string;

	@ObjectField({ description: 'Playlist is public?', example: false })
	isPublic!: boolean;

	@ObjectField({ nullable: true, description: 'Comment', example: 'Awesome!' })
	comment?: string;

	@ObjectField({ description: 'Playlist Created Timestamp', min: 0, example: examples.timestamp })
	declare created: number;

	@ObjectField({ description: 'Playlist Changed Timestamp', min: 0, example: examples.timestamp })
	changed!: number;

	@ObjectField({ description: 'Playlist duration', min: 0, example: 12_345 })
	duration!: number;

	@ObjectField({ description: 'Number of Entries', min: 0, example: 5 })
	entriesCount!: number;

	@ObjectField(() => [String], { description: 'List of Media Base IDs', isID: true })
	entriesIDs?: Array<string>;
}

@ResultType({ description: 'Playlist' })
export class Playlist extends PlaylistBase {
	@ObjectField(() => [MediaBase], { nullable: true, description: 'List of Media Base Entries' })
	entries?: Array<MediaBase>;
}

@ResultType({ description: 'Album Playlist' })
export class PlaylistPage extends Page {
	@ObjectField(() => Playlist, { description: 'List of Playlists' })
	items!: Array<Playlist>;
}

@ResultType({ description: 'Playlist Index Entry' })
export class PlaylistIndexEntry {
	@ObjectField({ description: 'ID', isID: true })
	id!: string;

	@ObjectField({ description: 'Name', example: 'Awesome Playlist' })
	name!: string;

	@ObjectField({ description: 'Entry Count', min: 0, example: 5 })
	entryCount!: number;
}

@ResultType({ description: 'Playlist Index Group' })
export class PlaylistIndexGroup {
	@ObjectField({ description: 'Playlist Group Name', example: 'A' })
	name!: string;

	@ObjectField(() => [PlaylistIndexEntry])
	items!: Array<PlaylistIndexEntry>;
}

@ResultType({ description: 'Playlist Index' })
export class PlaylistIndex {
	@ObjectField({ description: 'Last Change Timestamp' })
	lastModified!: number;

	@ObjectField(() => [PlaylistIndexGroup], { description: 'Playlist Index Groups' })
	groups!: Array<PlaylistIndexGroup>;
}
