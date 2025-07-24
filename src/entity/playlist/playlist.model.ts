import { Base, Page } from '../base/base.model.js';
import { examples } from '../../modules/engine/rest/example.consts.js';
import { MediaBase } from '../tag/tag.model.js';
import { ResultType } from '../../modules/rest/decorators/ResultType.js';
import { ObjField } from '../../modules/rest/decorators/ObjField.js';

@ResultType({ description: 'Playlist' })
export class PlaylistBase extends Base {
	@ObjField({ description: 'Owner User Id', isID: true })
	userID!: string;

	@ObjField({ description: 'Owner User Name', isID: true })
	userName!: string;

	@ObjField({ description: 'Playlist is public?', example: false })
	isPublic!: boolean;

	@ObjField({ nullable: true, description: 'Comment', example: 'Awesome!' })
	comment?: string;

	@ObjField({ description: 'Playlist Created Timestamp', min: 0, example: examples.timestamp })
	declare created: number;

	@ObjField({ description: 'Playlist Changed Timestamp', min: 0, example: examples.timestamp })
	changed!: number;

	@ObjField({ description: 'Playlist duration', min: 0, example: 12_345 })
	duration!: number;

	@ObjField({ description: 'Number of Entries', min: 0, example: 5 })
	entriesCount!: number;

	@ObjField(() => [String], { description: 'List of Media Base IDs', isID: true })
	entriesIDs?: Array<string>;
}

@ResultType({ description: 'Playlist' })
export class Playlist extends PlaylistBase {
	@ObjField(() => [MediaBase], { nullable: true, description: 'List of Media Base Entries' })
	entries?: Array<MediaBase>;
}

@ResultType({ description: 'Album Playlist' })
export class PlaylistPage extends Page {
	@ObjField(() => Playlist, { description: 'List of Playlists' })
	items!: Array<Playlist>;
}

@ResultType({ description: 'Playlist Index Entry' })
export class PlaylistIndexEntry {
	@ObjField({ description: 'ID', isID: true })
	id!: string;

	@ObjField({ description: 'Name', example: 'Awesome Playlist' })
	name!: string;

	@ObjField({ description: 'Entry Count', min: 0, example: 5 })
	entryCount!: number;
}

@ResultType({ description: 'Playlist Index Group' })
export class PlaylistIndexGroup {
	@ObjField({ description: 'Playlist Group Name', example: 'A' })
	name!: string;

	@ObjField(() => [PlaylistIndexEntry])
	items!: Array<PlaylistIndexEntry>;
}

@ResultType({ description: 'Playlist Index' })
export class PlaylistIndex {
	@ObjField({ description: 'Last Change Timestamp' })
	lastModified!: number;

	@ObjField(() => [PlaylistIndexGroup], { description: 'Playlist Index Groups' })
	groups!: Array<PlaylistIndexGroup>;
}
