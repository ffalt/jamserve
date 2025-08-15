import { Base } from '../base/base.model.js';
import { AlbumType, FolderType } from '../../types/enums.js';
import { GenreBase } from '../genre/genre.model.js';
import { ExtendedInfo } from '../metadata/metadata.model.js';
import { examples } from '../../modules/engine/rest/example.consts.js';
import { ResultType } from '../../modules/rest/decorators/result-type.js';
import { ObjectField } from '../../modules/rest/decorators/object-field.js';

@ResultType({ description: 'Folder Meta Information' })
export class FolderTag {
	@ObjectField({ nullable: true, description: 'Album Name', example: 'California' })
	album?: string;

	@ObjectField(() => AlbumType, { nullable: true, description: 'Album Type', example: AlbumType.album })
	albumType?: AlbumType;

	@ObjectField({ nullable: true, description: 'Artist Name', example: 'Mr. Bungle' })
	artist?: string;

	@ObjectField({ nullable: true, description: 'Artist Sort Name', example: 'Mr. Bungle' })
	artistSort?: string;

	@ObjectField(() => [String], { nullable: true, description: 'Genres', example: examples.genres })
	genres?: Array<string>;

	@ObjectField({ nullable: true, description: 'Year', example: 1999 })
	year?: number;

	@ObjectField({ nullable: true, description: 'MusicBrainz Artist Id', example: examples.mbArtistID })
	mbArtistID?: string;

	@ObjectField({ nullable: true, description: 'MusicBrainz Release Id', example: examples.mbReleaseID })
	mbReleaseID?: string;

	@ObjectField({ nullable: true, description: 'MusicBrainz Release Group Id', example: examples.mbReleaseGroupID })
	mbReleaseGroupID?: string;
}

@ResultType({ description: 'Folder Parent Information' })
export class FolderParent {
	@ObjectField({ description: 'ID', isID: true })
	id!: string;

	@ObjectField({ description: 'Name', example: 'Awesome' })
	name!: string;
}

@ResultType({ description: 'Folder' })
export class FolderBase extends Base {
	@ObjectField({ nullable: true, description: 'Title', example: 'Awesome' })
	title?: string;

	@ObjectField(() => FolderType, { description: 'Album Type', example: FolderType.multialbum })
	type!: FolderType;

	@ObjectField({ description: 'Level in Root', example: 3 })
	level!: number;

	@ObjectField({ nullable: true, description: 'Parent Folder Id', isID: true })
	parentID?: string;

	@ObjectField({ nullable: true, description: 'Number of Tracks', min: 0, example: 5 })
	trackCount?: number;

	@ObjectField({ nullable: true, description: 'Number of Folders', min: 0, example: 5 })
	folderCount?: number;

	@ObjectField({ nullable: true, description: 'Number of Artworks', min: 0, example: 5 })
	artworkCount?: number;

	@ObjectField(() => [GenreBase], { nullable: true, description: 'Genres' })
	genres?: Array<GenreBase>;

	@ObjectField(() => FolderTag, { nullable: true, description: 'Folder Meta Information' })
	tag?: FolderTag;

	@ObjectField(() => [String], { nullable: true, description: 'List of Track Ids', isID: true })
	trackIDs?: Array<string>;

	@ObjectField(() => [String], { nullable: true, description: 'List of Folder Ids', isID: true })
	folderIDs?: Array<string>;

	@ObjectField(() => [String], { nullable: true, description: 'List of Artwork Ids', isID: true })
	artworkIDs?: Array<string>;

	@ObjectField(() => ExtendedInfo, { nullable: true, description: 'Metadata for the Folder (via External Service)' })
	info?: ExtendedInfo;

	@ObjectField(() => [FolderParent], { nullable: true, description: 'List of Parent Folders up to Root' })
	parents?: Array<FolderParent>;
}
