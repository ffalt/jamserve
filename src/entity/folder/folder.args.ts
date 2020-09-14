import {ObjField, ObjParamsType} from '../../modules/rest/decorators';
import {AlbumType, FolderOrderFields, FolderType, ListType} from '../../types/enums';
import {ArgsType, Field, Float, ID, InputType, Int} from 'type-graphql';
import {FilterArgs, OrderByArgs, PaginatedFilterArgs} from '../base/base.args';
import {examples} from '../../modules/engine/rest/example.consts';

@ObjParamsType()
export class IncludesFolderArgs {
	@ObjField({nullable: true, description: 'include tag on folder(s)', defaultValue: false, example: false})
	folderIncTag?: boolean;
	@ObjField({nullable: true, description: 'include state (fav,rate) on folder(s)', defaultValue: false, example: false})
	folderIncState?: boolean;
	@ObjField({nullable: true, description: 'include child folder count on folder(s)', defaultValue: false, example: false})
	folderIncChildFolderCount?: boolean;
	@ObjField({nullable: true, description: 'include track count on folder(s)', defaultValue: false, example: false})
	folderIncTrackCount?: boolean;
	@ObjField({nullable: true, description: 'include artwork count on folder(s)', defaultValue: false, example: false})
	folderIncArtworkCount?: boolean;
	@ObjField({nullable: true, description: 'include a list of all parent folder ids/names on folder(s)', defaultValue: false, example: false})
	folderIncParents?: boolean;
	@ObjField({nullable: true, description: 'include extended meta data on folder(s)', defaultValue: false, example: false})
	folderIncInfo?: boolean;
	@ObjField({nullable: true, description: 'include similar folders list on folder(s) - only for folders of type artist', defaultValue: false, example: false})
	folderIncSimilar?: boolean;
	@ObjField({nullable: true, description: 'include artwork images Ids on folder(s)', defaultValue: false, example: false})
	folderIncArtworkIDs?: boolean;
	@ObjField({nullable: true, description: 'include track Ids on folder(s)', defaultValue: false, example: false})
	folderIncTrackIDs?: boolean;
	@ObjField({nullable: true, description: 'include children folder Ids on folder(s)', defaultValue: false, example: false})
	folderIncFolderIDs?: boolean;
}

@ObjParamsType()
export class IncludesFolderChildrenArgs {
	@ObjField({nullable: true, description: 'include artwork images list on folder(s)', defaultValue: false, example: false})
	folderIncArtworks?: boolean;
	@ObjField({nullable: true, description: 'include tracks and sub folders on folder(s)', defaultValue: false, example: false})
	folderIncChildren?: boolean;
	@ObjField({nullable: true, description: 'include child folders on folder(s)', defaultValue: false, example: false})
	folderIncFolders?: boolean;
	@ObjField({nullable: true, description: 'include tracks on folder(s)', defaultValue: false, example: false})
	folderIncTracks?: boolean;

	@ObjField({nullable: true, description: 'include tag on child folder(s)', defaultValue: false, example: false})
	folderChildIncTag?: boolean;
	@ObjField({nullable: true, description: 'include state (fav,rate) on child folder(s)', defaultValue: false, example: false})
	folderChildIncState?: boolean;
	@ObjField({nullable: true, description: 'include child folder count on child folder(s)', defaultValue: false, example: false})
	folderChildIncChildFolderCount?: boolean;
	@ObjField({nullable: true, description: 'include track count on child folder(s)', defaultValue: false, example: false})
	folderChildIncTrackCount?: boolean;
	@ObjField({nullable: true, description: 'include artwork count on child folder(s)', defaultValue: false, example: false})
	folderChildIncArtworkCount?: boolean;
	@ObjField({nullable: true, description: 'include a list of all parent folder ids/names on child folder(s)', defaultValue: false, example: false})
	folderChildIncParents?: boolean;
	@ObjField({nullable: true, description: 'include extended meta data on child folder(s)', defaultValue: false, example: false})
	folderChildIncInfo?: boolean;
	@ObjField({nullable: true, description: 'include similar folders list on child folder(s) - only for folders of type artist', defaultValue: false, example: false})
	folderChildIncSimilar?: boolean;
	@ObjField({nullable: true, description: 'include artwork images Ids on child folder(s)', defaultValue: false, example: false})
	folderChildIncArtworkIDs?: boolean;
	@ObjField({nullable: true, description: 'include track Ids on child folder(s)', defaultValue: false, example: false})
	folderChildIncTrackIDs?: boolean;
	@ObjField({nullable: true, description: 'include children folder Ids on child folder(s)', defaultValue: false, example: false})
	folderChildIncFolderIDs?: boolean;
}

@ObjParamsType()
export class FolderCreateArgs {
	@ObjField({description: 'Parent Folder Id', isID: true})
	id!: string;
	@ObjField({description: 'New Folder Name', example: 'Collection'})
	name!: string;
}

@ObjParamsType()
export class FolderRenameArgs {
	@ObjField({description: 'Folder Id', isID: true})
	id!: string;
	@ObjField({description: 'New Folder Name', example: 'Collection'})
	name!: string;
}

@ObjParamsType()
export class FolderMoveArgs {
	@ObjField(() => [String], {description: 'Folder Ids', isID: true})
	ids!: Array<string>;
	@ObjField({description: 'Destination Parent Folder Id', isID: true})
	newParentID!: string;
}

@InputType()
@ObjParamsType()
export class FolderFilterArgs {
	@Field(() => String, {nullable: true})
	@ObjField({nullable: true, description: 'filter by Search Query', example: 'awesome'})
	query?: string;

	@Field(() => String, {nullable: true})
	@ObjField({nullable: true, description: 'filter by Name', example: 'Awesome Collection'})
	name?: string;

	@Field(() => [ID], {nullable: true})
	@ObjField(() => [String], {nullable: true, description: 'filter by Folder Ids', isID: true})
	ids?: Array<string>;

	@Field(() => Float, {nullable: true})
	@ObjField({nullable: true, description: 'filter by Creation timestamp', min: 0, example: examples.timestamp})
	since?: number;

	@Field(() => [ID], {nullable: true})
	@ObjField(() => [String], {nullable: true, description: 'filter by Folder Parent Ids', isID: true})
	parentIDs?: Array<string>;

	@Field(() => ID, {nullable: true})
	@ObjField({nullable: true, description: 'filter if folder is in folder id (or its child folders)', isID: true})
	childOfID?: string;

	@Field(() => Int, {nullable: true})
	@ObjField({nullable: true, description: 'filter by Folder Tree Level', min: 0, example: 4})
	level?: number;

	@Field(() => [AlbumType], {nullable: true})
	@ObjField(() => [AlbumType], {nullable: true, description: 'filter by Album Types', example: [AlbumType.live]})
	albumTypes?: Array<AlbumType>;

	@Field(() => [FolderType], {nullable: true})
	@ObjField(() => [FolderType], {nullable: true, description: 'filter by Folder Types', example: [FolderType.collection]})
	folderTypes?: Array<FolderType>;

	@Field(() => [String], {nullable: true})
	@ObjField(() => [String], {nullable: true, description: 'filter by Genres', example: examples.genres})
	genres?: Array<string>;

	@Field(() => String, {nullable: true})
	@ObjField(() => [String], {nullable: true, description: 'filter by Album Name', example: ['The Awesome Album']})
	album?: string;

	@Field(() => String, {nullable: true})
	@ObjField(() => [String], {nullable: true, description: 'filter by Artist Name', example: ['The Awesome Artist']})
	artist?: string;

	@Field(() => String, {nullable: true})
	@ObjField(() => [String], {nullable: true, description: 'filter by Artist Sort Name', example: ['Awesome Artist, The']})
	artistSort?: string;

	@Field(() => String, {nullable: true})
	@ObjField(() => [String], {nullable: true, description: 'filter by Title', example: 'Awesome Folder'})
	title?: string;

	@Field(() => Int, {nullable: true})
	@ObjField({nullable: true, description: 'filter by since year', min: 0, example: examples.year})
	fromYear?: number;

	@Field(() => Int, {nullable: true})
	@ObjField({nullable: true, description: 'filter by until year', min: 0, example: examples.year})
	toYear?: number;

	@Field(() => [String], {nullable: true})
	@ObjField(() => [String], {nullable: true, description: 'filter by MusicBrainz Release Ids', example: [examples.mbReleaseID]})
	mbReleaseIDs?: Array<string>;

	@Field(() => [String], {nullable: true})
	@ObjField(() => [String], {nullable: true, description: 'filter by MusicBrainz Release Group Ids', example: [examples.mbReleaseGroupID]})
	mbReleaseGroupIDs?: Array<string>;

	@Field(() => [String], {nullable: true})
	@ObjField(() => [String], {nullable: true, description: 'filter by MusicBrainz Album Type', example: ['album']})
	mbAlbumTypes?: Array<string>;

	@Field(() => [String], {nullable: true})
	@ObjField(() => [String], {nullable: true, description: 'filter by MusicBrainz Artist Ids', example: [examples.mbArtistID]})
	mbArtistIDs?: Array<string>;

	@Field(() => [ID], {nullable: true})
	@ObjField(() => [String], {nullable: true, description: 'filter by Artwork Ids', isID: true})
	artworksIDs?: Array<string>;

	@Field(() => [ID], {nullable: true})
	@ObjField(() => [String], {nullable: true, description: 'filter by Root Ids', isID: true})
	rootIDs?: Array<string>;

	@Field(() => [ID], {nullable: true})
	@ObjField(() => [String], {nullable: true, description: 'filter by Track Ids', isID: true})
	trackIDs?: Array<string>;

	@Field(() => [ID], {nullable: true})
	@ObjField(() => [String], {nullable: true, description: 'filter by Album Ids', isID: true})
	albumIDs?: Array<string>;

	@Field(() => [ID], {nullable: true})
	@ObjField(() => [String], {nullable: true, description: 'filter by Artist Ids', isID: true})
	artistIDs?: Array<string>;

	@Field(() => [ID], {nullable: true})
	@ObjField(() => [String], {nullable: true, description: 'filter by Series Ids', isID: true})
	seriesIDs?: Array<string>;
}

@InputType()
export class FolderFilterArgsQL extends FolderFilterArgs {
}

@InputType()
@ObjParamsType()
export class FolderOrderArgs extends OrderByArgs {
	@Field(() => FolderOrderFields, {nullable: true})
	@ObjField(() => FolderOrderFields, {nullable: true, description: 'order by field'})
	orderBy?: FolderOrderFields;
}

@InputType()
export class FolderOrderArgsQL extends FolderOrderArgs {
}

@ArgsType()
export class FolderIndexArgs extends FilterArgs(FolderFilterArgsQL) {
}

@ArgsType()
export class FolderPageArgsQL extends PaginatedFilterArgs(FolderFilterArgsQL, FolderOrderArgsQL) {
}

@ArgsType()
export class FoldersArgsQL extends FolderPageArgsQL {
	@Field(() => ListType, {nullable: true})
	list?: ListType;
	@Field(() => String, {nullable: true})
	seed?: string;
}
