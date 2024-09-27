import {ArtworkImageType, ListType} from '../../types/enums.js';
import {ArgsType, Field, Float, ID, InputType, Int} from 'type-graphql';
import {DefaultOrderArgs, PaginatedFilterArgs} from '../base/base.args.js';
import {examples} from '../../modules/engine/rest/example.consts.js';
import {ObjParamsType} from '../../modules/rest/decorators/ObjParamsType.js';
import {ObjField} from '../../modules/rest/decorators/ObjField.js';

@ObjParamsType()
export class IncludesArtworkArgs {
	@ObjField({nullable: true, description: 'include state (fav,rate) on artwork(s)', defaultValue: false, example: false})
	artworkIncState?: boolean;
}

@ObjParamsType()
export class IncludesArtworkChildrenArgs {
	@ObjField({nullable: true, description: 'include folder on artwork(s)', defaultValue: false, example: false})
	artworkIncFolder?: boolean;
}

@ObjParamsType()
export class ArtworkNewUploadArgs {
	@ObjField({description: 'Folder Id', isID: true})
	folderID!: string;
	@ObjField(() => [ArtworkImageType], {description: 'Types of the image'})
	types!: Array<ArtworkImageType>;
}

@ObjParamsType()
export class ArtworkNewArgs extends ArtworkNewUploadArgs {
	@ObjField({description: 'URL of an image'})
	url!: string;
}

@ObjParamsType()
export class ArtworkRenameArgs {
	@ObjField({description: 'Artwork Id'})
	id!: string;
	@ObjField({description: 'New Image Filename'})
	newName!: string;
}

@InputType()
@ObjParamsType()
export class ArtworkOrderArgs extends DefaultOrderArgs {
}

@InputType()
export class ArtworkOrderArgsQL extends ArtworkOrderArgs {
}

@ObjParamsType()
@InputType()
export class ArtworkFilterArgs {
	@Field(() => String, {nullable: true})
	@ObjField({nullable: true, description: 'filter by Search Query', example: 'cover'})
	query?: string;

	@Field(() => String, {nullable: true})
	@ObjField({nullable: true, description: 'filter by Artist Name', example: 'Cover.png'})
	name?: string;

	@Field(() => [ID], {nullable: true})
	@ObjField(() => [String], {nullable: true, description: 'filter by Artwork Ids', isID: true})
	ids?: Array<string>;

	@Field(() => [String], {nullable: true})
	@ObjField(() => [String], {nullable: true, description: 'filter by Artwork Image Formats', example: ['png']})
	formats?: Array<string>;

	@Field(() => [ID], {nullable: true})
	@ObjField(() => [String], {nullable: true, description: 'filter by Folder Ids', isID: true})
	folderIDs?: Array<string>;

	@Field(() => ID, {nullable: true})
	@ObjField({nullable: true, description: 'filter if artwork is in folder id (or its child folders)', isID: true})
	childOfID?: string;

	@Field(() => [ArtworkImageType!], {nullable: true})
	@ObjField(() => [ArtworkImageType], {nullable: true, description: 'filter by Artwork Image Types', example: ArtworkImageType.front})
	types?: Array<ArtworkImageType>;

	@Field(() => Float, {nullable: true})
	@ObjField({nullable: true, description: 'filter by Creation timestamp', min: 0, example: examples.timestamp})
	since?: number;

	@Field(() => Int, {nullable: true})
	@ObjField({nullable: true, description: 'filter by since size', min: 0, example: 100})
	sizeFrom?: number;

	@Field(() => Int, {nullable: true})
	@ObjField({nullable: true, description: 'filter by until size', min: 0, example: 200})
	sizeTo?: number;

	@Field(() => Int, {nullable: true})
	@ObjField({nullable: true, description: 'filter by since width', min: 0, example: 100})
	widthFrom?: number;

	@Field(() => Int, {nullable: true})
	@ObjField({nullable: true, description: 'filter by until width', min: 0, example: 200})
	widthTo?: number;

	@Field(() => Int, {nullable: true})
	@ObjField({nullable: true, description: 'filter by since height', min: 0, example: 100})
	heightFrom?: number;

	@Field(() => Int, {nullable: true})
	@ObjField({nullable: true, description: 'filter by until height', min: 0, example: 200})
	heightTo?: number;
}

@InputType()
export class ArtworkFilterArgsQL extends ArtworkFilterArgs {
}

@ArgsType()
export class ArtworkPageArgsQL extends PaginatedFilterArgs(ArtworkFilterArgsQL, ArtworkOrderArgsQL) {
}

@ArgsType()
export class ArtworksArgsQL extends ArtworkPageArgsQL {
	@Field(() => ListType, {nullable: true})
	list?: ListType;
	@Field(() => String, {nullable: true})
	seed?: string;
}
