import { ArtworkImageType, ListType } from '../../types/enums.js';
import { ArgsType, Field, ID, InputType, Int } from 'type-graphql';
import { DefaultOrderParameters, PaginatedFilterParameters } from '../base/base.parameters.js';
import { examples } from '../../modules/engine/rest/example.consts.js';
import { ObjectParametersType } from '../../modules/rest/decorators/object-parameters-type.js';
import { ObjectField } from '../../modules/rest/decorators/object-field.js';

@ObjectParametersType()
export class IncludesArtworkParameters {
	@ObjectField({ nullable: true, description: 'include state (fav,rate) on artwork(s)', defaultValue: false, example: false })
	artworkIncState?: boolean;
}

@ObjectParametersType()
export class IncludesArtworkChildrenParameters {
	@ObjectField({ nullable: true, description: 'include folder on artwork(s)', defaultValue: false, example: false })
	artworkIncFolder?: boolean;
}

@ObjectParametersType()
export class ArtworkNewUploadParameters {
	@ObjectField({ description: 'Folder Id', isID: true })
	folderID!: string;

	@ObjectField(() => [ArtworkImageType], { description: 'Types of the image' })
	types!: Array<ArtworkImageType>;
}

@ObjectParametersType()
export class ArtworkNewParameters extends ArtworkNewUploadParameters {
	@ObjectField({ description: 'URL of an image' })
	url!: string;
}

@ObjectParametersType()
export class ArtworkRenameParameters {
	@ObjectField({ description: 'Artwork Id' })
	id!: string;

	@ObjectField({ description: 'New Image Filename' })
	newName!: string;
}

@InputType()
@ObjectParametersType()
export class ArtworkOrderParameters extends DefaultOrderParameters {
}

@InputType()
export class ArtworkOrderParametersQL extends ArtworkOrderParameters {
}

@ObjectParametersType()
@InputType()
export class ArtworkFilterParameters {
	@Field(() => String, { nullable: true })
	@ObjectField({ nullable: true, description: 'filter by Search Query', example: 'cover' })
	query?: string;

	@Field(() => String, { nullable: true })
	@ObjectField({ nullable: true, description: 'filter by Artist Name', example: 'Cover.png' })
	name?: string;

	@Field(() => [ID], { nullable: true })
	@ObjectField(() => [String], { nullable: true, description: 'filter by Artwork Ids', isID: true })
	ids?: Array<string>;

	@Field(() => [String], { nullable: true })
	@ObjectField(() => [String], { nullable: true, description: 'filter by Artwork Image Formats', example: ['png'] })
	formats?: Array<string>;

	@Field(() => [ID], { nullable: true })
	@ObjectField(() => [String], { nullable: true, description: 'filter by Folder Ids', isID: true })
	folderIDs?: Array<string>;

	@Field(() => ID, { nullable: true })
	@ObjectField({ nullable: true, description: 'filter if artwork is in folder id (or its child folders)', isID: true })
	childOfID?: string;

	@Field(() => [ArtworkImageType!], { nullable: true })
	@ObjectField(() => [ArtworkImageType], { nullable: true, description: 'filter by Artwork Image Types', example: ArtworkImageType.front })
	types?: Array<ArtworkImageType>;

	@Field(() => Int, { nullable: true })
	@ObjectField({ nullable: true, description: 'filter by Creation timestamp', min: 0, example: examples.timestamp })
	since?: number;

	@Field(() => Int, { nullable: true })
	@ObjectField({ nullable: true, description: 'filter by since size', min: 0, example: 100 })
	sizeFrom?: number;

	@Field(() => Int, { nullable: true })
	@ObjectField({ nullable: true, description: 'filter by until size', min: 0, example: 200 })
	sizeTo?: number;

	@Field(() => Int, { nullable: true })
	@ObjectField({ nullable: true, description: 'filter by since width', min: 0, example: 100 })
	widthFrom?: number;

	@Field(() => Int, { nullable: true })
	@ObjectField({ nullable: true, description: 'filter by until width', min: 0, example: 200 })
	widthTo?: number;

	@Field(() => Int, { nullable: true })
	@ObjectField({ nullable: true, description: 'filter by since height', min: 0, example: 100 })
	heightFrom?: number;

	@Field(() => Int, { nullable: true })
	@ObjectField({ nullable: true, description: 'filter by until height', min: 0, example: 200 })
	heightTo?: number;
}

@InputType()
export class ArtworkFilterParametersQL extends ArtworkFilterParameters {
}

@ArgsType()
export class ArtworkPageParametersQL extends PaginatedFilterParameters(ArtworkFilterParametersQL, ArtworkOrderParametersQL) {
}

@ArgsType()
export class ArtworksParametersQL extends ArtworkPageParametersQL {
	@Field(() => ListType, { nullable: true })
	list?: ListType;

	@Field(() => String, { nullable: true })
	seed?: string;
}
