import { Field, Float, ID, Int, ObjectType } from 'type-graphql';
import { ResultType } from '../../modules/rest/decorators/result-type.js';
import { ObjectField } from '../../modules/rest/decorators/object-field.js';

@ObjectType()
@ResultType({ description: 'Landscape Genre Node' })
export class LandscapeGenreNode {
	@Field(() => ID)
	@ObjectField({ description: 'ID', isID: true })
	id!: string;

	@Field(() => String)
	@ObjectField({ description: 'Name' })
	name!: string;

	@Field(() => Int)
	@ObjectField({ description: 'Track Count', min: 0 })
	trackCount!: number;

	@Field(() => Int)
	@ObjectField({ description: 'Artist Count', min: 0 })
	artistCount!: number;

	@Field(() => Int)
	@ObjectField({ description: 'Album Count', min: 0 })
	albumCount!: number;

	@Field(() => Float, { nullable: true, description: 'ENAO X coordinate (0=left/organic, 1=right/mechanical)' })
	@ObjectField({ nullable: true, description: 'ENAO X coordinate (0=left/organic, 1=right/mechanical)' })
	noiseX?: number;

	@Field(() => Float, { nullable: true, description: 'ENAO Y coordinate (0=top/atmospheric, 1=bottom/energetic)' })
	@ObjectField({ nullable: true, description: 'ENAO Y coordinate (0=top/atmospheric, 1=bottom/energetic)' })
	noiseY?: number;
}

@ObjectType()
@ResultType({ description: 'Landscape Artist Node' })
export class LandscapeArtistNode {
	@Field(() => ID)
	@ObjectField({ description: 'ID', isID: true })
	id!: string;

	@Field(() => String)
	@ObjectField({ description: 'Name' })
	name!: string;

	@Field(() => Int)
	@ObjectField({ description: 'Album Count', min: 0 })
	albumCount!: number;

	@Field(() => Int)
	@ObjectField({ description: 'Track Count', min: 0 })
	trackCount!: number;

	@Field(() => [ID], { description: 'Genre IDs this artist belongs to' })
	@ObjectField(() => [String], { description: 'Genre IDs this artist belongs to', isID: true })
	genreIDs!: Array<string>;

	@Field(() => Float, { nullable: true, description: 'Computed X position (centroid of genre noise coords + jitter)' })
	@ObjectField({ nullable: true, description: 'Computed X position (centroid of genre noise coords + jitter)' })
	noiseX?: number;

	@Field(() => Float, { nullable: true, description: 'Computed Y position (centroid of genre noise coords + jitter)' })
	@ObjectField({ nullable: true, description: 'Computed Y position (centroid of genre noise coords + jitter)' })
	noiseY?: number;
}

@ObjectType()
@ResultType({ description: 'Music Collection Landscape Data' })
export class LandscapeData {
	@Field(() => [LandscapeGenreNode], { description: 'All genres as scatter plot nodes' })
	@ObjectField(() => [LandscapeGenreNode], { description: 'All genres as scatter plot nodes' })
	genres!: Array<LandscapeGenreNode>;

	@Field(() => [LandscapeArtistNode], { description: 'All artists as scatter plot dots' })
	@ObjectField(() => [LandscapeArtistNode], { description: 'All artists as scatter plot dots' })
	artists!: Array<LandscapeArtistNode>;

	@Field(() => Float, { description: 'Fraction of genres matched to ENAO coordinate data (0-1)' })
	@ObjectField({ description: 'Fraction of genres matched to ENAO coordinate data (0-1)' })
	noiseMatchRate!: number;
}
