import { ResultType } from '../../modules/rest/decorators/result-type.js';
import { ObjectField } from '../../modules/rest/decorators/object-field.js';

@ResultType({ description: 'Library Stats by Album Type' })
export class StatsAlbumTypes {
	@ObjectField({ description: 'Number of Type Album', min: 0, example: 10 })
	album!: number;

	@ObjectField({ description: 'Number of Various Artists Type Compilation', min: 0, example: 9 })
	compilation!: number;

	@ObjectField({ description: 'Number of Single Artists Type Compilation', min: 0, example: 8 })
	artistCompilation!: number;

	@ObjectField({ description: 'Number of Type Live', min: 0, example: 7 })
	live!: number;

	@ObjectField({ description: 'Number of Type Audiobooks', min: 0, example: 6 })
	audiobook!: number;

	@ObjectField({ description: 'Number of Type Soundtracks', min: 0, example: 5 })
	soundtrack!: number;

	@ObjectField({ description: 'Number of Type Series', min: 0, example: 4 })
	series!: number;

	@ObjectField({ description: 'Number of Type Bootlegs', min: 0, example: 3 })
	bootleg!: number;

	@ObjectField({ description: 'Number of Type EPs', min: 0, example: 2 })
	ep!: number;

	@ObjectField({ description: 'Number of Type Singles', min: 0, example: 1 })
	single!: number;

	@ObjectField({ description: 'Number of Type Unknown', min: 0, example: 0 })
	unknown!: number;
}

@ResultType({ description: 'Library Stats' })
export class Stats {
	@ObjectField({ nullable: true, description: 'Root ID', isID: true })
	rootID?: string;

	@ObjectField({ description: 'Number of Tracks', min: 0, example: 555 })
	track!: number;

	@ObjectField({ description: 'Number of Folders', min: 0, example: 55 })
	folder!: number;

	@ObjectField({ description: 'Number of Series', min: 0, example: 5 })
	series!: number;

	@ObjectField({ description: 'Number of Artists', min: 0, example: 5 })
	artist!: number;

	@ObjectField({ description: 'Detailed Artists Stats' })
	artistTypes!: StatsAlbumTypes;

	@ObjectField({ description: 'Number of Albums', min: 0, example: 5 })
	album!: number;

	@ObjectField({ description: 'Detailed Album Stats' })
	albumTypes!: StatsAlbumTypes;
}

@ResultType({ description: 'User Detail Stats' })
export class UserDetailStats {
	@ObjectField({ description: 'Number of Tracks', min: 0, example: 555 })
	track!: number;

	@ObjectField({ description: 'Number of Folders', min: 0, example: 55 })
	folder!: number;

	@ObjectField({ description: 'Number of Series', min: 0, example: 5 })
	series!: number;

	@ObjectField({ description: 'Number of Artist', min: 0, example: 5 })
	artist!: number;

	@ObjectField({ description: 'Detailed Artists Stats' })
	artistTypes!: StatsAlbumTypes;

	@ObjectField({ description: 'Number of Albums', min: 0, example: 5 })
	album!: number;

	@ObjectField({ description: 'Detailed Album Stats' })
	albumTypes!: StatsAlbumTypes;
}

@ResultType({ description: 'User Stats' })
export class UserStats {
	@ObjectField({ description: 'Number of Playlists', min: 0, example: 55 })
	playlist!: number;

	@ObjectField({ description: 'Number of Bookmarks', min: 0, example: 55 })
	bookmark!: number;

	@ObjectField({ description: 'Detailed User Favorites Stats' })
	favorite!: UserDetailStats;

	@ObjectField({ description: 'Detailed User Played Stats' })
	played!: UserDetailStats;
}
