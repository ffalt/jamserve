import { ResultType } from '../../modules/rest/decorators/result-type.js';
import { ObjectField } from '../../modules/rest/decorators/object-field.js';

@ResultType({ description: 'Landscape Genre Node' })
export class LandscapeGenreNode {
	@ObjectField({ description: 'ID', isID: true })
	id!: string;

	@ObjectField({ description: 'Name' })
	name!: string;

	@ObjectField({ description: 'Track Count', min: 0 })
	trackCount!: number;

	@ObjectField({ description: 'Artist Count', min: 0 })
	artistCount!: number;

	@ObjectField({ description: 'Album Count', min: 0 })
	albumCount!: number;

	@ObjectField({ nullable: true, description: 'ENAO X coordinate (0=left/organic, 1=right/mechanical)' })
	noiseX?: number;

	@ObjectField({ nullable: true, description: 'ENAO Y coordinate (0=top/atmospheric, 1=bottom/energetic)' })
	noiseY?: number;
}

@ResultType({ description: 'Landscape Artist Node' })
export class LandscapeArtistNode {
	@ObjectField({ description: 'ID', isID: true })
	id!: string;

	@ObjectField({ description: 'Name' })
	name!: string;

	@ObjectField({ description: 'Album Count', min: 0 })
	albumCount!: number;

	@ObjectField({ description: 'Track Count', min: 0 })
	trackCount!: number;

	@ObjectField(() => [String], { description: 'Genre IDs this artist belongs to', isID: true })
	genreIDs!: Array<string>;

	@ObjectField({ nullable: true, description: 'Computed X position (centroid of genre noise coords + jitter)' })
	noiseX?: number;

	@ObjectField({ nullable: true, description: 'Computed Y position (centroid of genre noise coords + jitter)' })
	noiseY?: number;
}

@ResultType({ description: 'Music Collection Landscape Data' })
export class LandscapeData {
	@ObjectField(() => [LandscapeGenreNode], { description: 'All genres as scatter plot nodes' })
	genres!: Array<LandscapeGenreNode>;

	@ObjectField(() => [LandscapeArtistNode], { description: 'All artists as scatter plot dots' })
	artists!: Array<LandscapeArtistNode>;

	@ObjectField({ description: 'Fraction of genres matched to ENAO coordinate data (0-1)' })
	noiseMatchRate!: number;
}
