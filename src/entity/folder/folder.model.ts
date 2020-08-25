import {Base, Page} from '../base/base.model';
import {AlbumType, FolderType} from '../../types/enums';
import {TrackBase} from '../track/track.model';
import {ExtendedInfo} from '../metadata/metadata.model';
import {ObjField, ResultType} from '../../modules/rest/decorators';
import {examples} from '../../modules/engine/rest/example.consts';
import {Artwork} from '../artwork/artwork.model';
import {FolderHealthHint} from '../health/health.model';

@ResultType({description: 'Folder Meta Information'})
export class FolderTag {
	@ObjField({nullable: true, description: 'Album Name', example: 'California'})
	album?: string;
	@ObjField(() => AlbumType, {nullable: true, description: 'Album Type', example: AlbumType.album})
	albumType?: AlbumType;
	@ObjField({nullable: true, description: 'Artist Name', example: 'Mr. Bungle'})
	artist?: string;
	@ObjField({nullable: true, description: 'Artist Sort Name', example: 'Mr. Bungle'})
	artistSort?: string;
	@ObjField(() => [String], {nullable: true, description: 'Genres', example: ['Rock']})
	genres?: Array<string>;
	@ObjField({nullable: true, description: 'Year', example: 1999})
	year?: number;
	@ObjField({nullable: true, description: 'MusicBrainz Artist Id', example: examples.mbArtistID})
	mbArtistID?: string;
	@ObjField({nullable: true, description: 'MusicBrainz Release Id', example: examples.mbReleaseID})
	mbReleaseID?: string;
	@ObjField({nullable: true, description: 'MusicBrainz Release Group Id', example: examples.mbReleaseGroupID})
	mbReleaseGroupID?: string;
}

@ResultType({description: 'Folder Parent Information'})
export class FolderParent {
	@ObjField({description: 'ID', isID: true})
	id!: string;
	@ObjField({description: 'Name', example: 'Awesome'})
	name!: string;
}

@ResultType({description: 'Folder'})
export class FolderBase extends Base {
	@ObjField({nullable: true, description: 'Title', example: 'Awesome'})
	title?: string;
	@ObjField(() => FolderType, {description: 'Album Type', example: FolderType.multialbum})
	type!: FolderType;
	@ObjField({description: 'Level in Root', example: 3})
	level!: number;
	@ObjField({nullable: true, description: 'Parent Folder Id', isID: true})
	parentID?: string;
	@ObjField({nullable: true, description: 'Number of Tracks', min: 0, example: 5})
	trackCount?: number;
	@ObjField({nullable: true, description: 'Number of Folders', min: 0, example: 5})
	folderCount?: number;
	@ObjField({nullable: true, description: 'Number of Artworks', min: 0, example: 5})
	artworkCount?: number;
	@ObjField(() => FolderTag, {nullable: true, description: 'Folder Meta Information'})
	tag?: FolderTag;
	@ObjField(() => [String], {nullable: true, description: 'List of Track Ids', isID: true})
	trackIDs?: Array<string>;
	@ObjField(() => [String], {nullable: true, description: 'List of Folder Ids', isID: true})
	folderIDs?: Array<string>;
	@ObjField(() => [String], {nullable: true, description: 'List of Artwork Ids', isID: true})
	artworkIDs?: Array<string>;
	@ObjField(() => ExtendedInfo, {nullable: true, description: 'Metadata for the Folder (via External Service)'})
	info?: ExtendedInfo;
	@ObjField(() => [FolderParent], {nullable: true, description: 'List of Parent Folders up to Root'})
	parents?: Array<FolderParent>;
}

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
