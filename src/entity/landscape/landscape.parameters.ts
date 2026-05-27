import { ObjectParametersType } from '../../modules/rest/decorators/object-parameters-type.js';
import { ObjectField } from '../../modules/rest/decorators/object-field.js';

@ObjectParametersType()
export class LandscapeParameters {
	@ObjectField({ nullable: true, description: 'Ignore genre entries with no ENAO coordinate match' })
	ignoreUnknownGenres?: boolean;

	@ObjectField({ nullable: true, description: 'Include only artists that have at least one album' })
	artistsWithAlbumsOnly?: boolean;

	@ObjectField({ nullable: true, description: 'Exclude artists that have no computed noise position (all genres unpositioned)', min: 0 })
	ignoreUnpositionedArtists?: boolean;

	@ObjectField({ nullable: true, description: 'Minimum track count for a genre to be included', min: 0 })
	minGenreTrackCount?: number;

	@ObjectField({ nullable: true, description: 'Minimum artist count for a genre to be included', min: 0 })
	minGenreArtistCount?: number;

	@ObjectField({ nullable: true, description: 'Minimum track count for an artist to be included', min: 0 })
	minArtistTrackCount?: number;
}
