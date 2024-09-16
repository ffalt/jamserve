import {Page} from '../base/base.model.js';
import {TrackBase} from '../track/track.model.js';
import {ObjField, ResultType} from '../../modules/rest/index.js';
import {Artwork} from '../artwork/artwork.model.js';
import {FolderHealthHint} from '../health/health.model.js';
import {FolderBase} from './folder-base.model.js';

@ResultType({description: 'Folder with tracks'})
export class Folder extends FolderBase {
	@ObjField(() => [TrackBase], {nullable: true, description: 'List of Tracks'})
	tracks?: Array<TrackBase>;
	@ObjField(() => [FolderBase], {nullable: true, description: 'List of Folders'})
	folders?: Array<FolderBase>;
	@ObjField(() => [Artwork], {nullable: true, description: 'List of Artwork Images'})
	artworks?: Array<Artwork>;
	@ObjField(() => [FolderBase], {nullable: true, description: 'List of similar Folders (via Exteernal Service)'})
	similar?: Array<Folder>;
}

@ResultType({description: 'Folder Page'})
export class FolderPage extends Page {
	@ObjField(() => [Folder], {description: 'List of Folders'})
	items!: Array<Folder>;
}

@ResultType({description: 'Folder Index Entry'})
export class FolderIndexEntry {
	@ObjField({description: 'ID', isID: true})
	id!: string;
	@ObjField({description: 'Name', example: 'The Mars Volta'})
	name!: string;
	@ObjField({description: 'Track Count', min: 0, example: 5})
	trackCount!: number;
}

@ResultType({description: 'Folder Index Group'})
export class FolderIndexGroup {
	@ObjField({description: 'Folder Group Name', example: 'M'})
	name!: string;
	@ObjField(() => [FolderIndexEntry])
	items!: Array<FolderIndexEntry>;
}

@ResultType({description: 'Folder Index'})
export class FolderIndex {
	@ObjField({description: 'Last Change Timestamp'})
	lastModified!: number;
	@ObjField(() => [FolderIndexGroup], {description: 'Folder Index Groups'})
	groups!: Array<FolderIndexGroup>;
}

@ResultType({description: 'Folder Health'})
export class FolderHealth {
	@ObjField(() => Folder, {description: 'Folder'})
	folder!: Folder;
	@ObjField(() => [FolderHealthHint], {description: 'List of Health Hints'})
	health!: Array<FolderHealthHint>;
}
