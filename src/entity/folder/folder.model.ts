import { Page } from '../base/base.model.js';
import { TrackBase } from '../track/track.model.js';
import { Artwork } from '../artwork/artwork.model.js';
import { FolderHealthHint } from '../health/health.model.js';
import { FolderBase } from './folder-base.model.js';
import { ResultType } from '../../modules/rest/decorators/result-type.js';
import { ObjectField } from '../../modules/rest/decorators/object-field.js';

@ResultType({ description: 'Folder with tracks' })
export class Folder extends FolderBase {
	@ObjectField(() => [TrackBase], { nullable: true, description: 'List of Tracks' })
	tracks?: Array<TrackBase>;

	@ObjectField(() => [FolderBase], { nullable: true, description: 'List of Folders' })
	folders?: Array<FolderBase>;

	@ObjectField(() => [Artwork], { nullable: true, description: 'List of Artwork Images' })
	artworks?: Array<Artwork>;

	@ObjectField(() => [FolderBase], { nullable: true, description: 'List of similar Folders (via Exteernal Service)' })
	similar?: Array<Folder>;
}

@ResultType({ description: 'Folder Page' })
export class FolderPage extends Page {
	@ObjectField(() => [Folder], { description: 'List of Folders' })
	items!: Array<Folder>;
}

@ResultType({ description: 'Folder Index Entry' })
export class FolderIndexEntry {
	@ObjectField({ description: 'ID', isID: true })
	id!: string;

	@ObjectField({ description: 'Name', example: 'The Mars Volta' })
	name!: string;

	@ObjectField({ description: 'Track Count', min: 0, example: 5 })
	trackCount!: number;
}

@ResultType({ description: 'Folder Index Group' })
export class FolderIndexGroup {
	@ObjectField({ description: 'Folder Group Name', example: 'M' })
	name!: string;

	@ObjectField(() => [FolderIndexEntry])
	items!: Array<FolderIndexEntry>;
}

@ResultType({ description: 'Folder Index' })
export class FolderIndex {
	@ObjectField({ description: 'Last Change Timestamp' })
	lastModified!: number;

	@ObjectField(() => [FolderIndexGroup], { description: 'Folder Index Groups' })
	groups!: Array<FolderIndexGroup>;
}

@ResultType({ description: 'Folder Health' })
export class FolderHealth {
	@ObjectField(() => Folder, { description: 'Folder' })
	folder!: Folder;

	@ObjectField(() => [FolderHealthHint], { description: 'List of Health Hints' })
	health!: Array<FolderHealthHint>;
}
