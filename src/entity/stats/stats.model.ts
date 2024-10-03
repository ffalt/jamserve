import {ResultType} from '../../modules/rest/decorators/ResultType.js';
import {ObjField} from '../../modules/rest/decorators/ObjField.js';

@ResultType({ description: 'Library Stats by Album Type' })
export class StatsAlbumTypes {
	@ObjField({ description: 'Number of Type Album', min: 0, example: 10 })
	album!: number;

	@ObjField({ description: 'Number of Various Artists Type Compilation', min: 0, example: 9 })
	compilation!: number;

	@ObjField({ description: 'Number of Single Artists Type Compilation', min: 0, example: 8 })
	artistCompilation!: number;

	@ObjField({ description: 'Number of Type Live', min: 0, example: 7 })
	live!: number;

	@ObjField({ description: 'Number of Type Audiobooks', min: 0, example: 6 })
	audiobook!: number;

	@ObjField({ description: 'Number of Type Soundtracks', min: 0, example: 5 })
	soundtrack!: number;

	@ObjField({ description: 'Number of Type Series', min: 0, example: 4 })
	series!: number;

	@ObjField({ description: 'Number of Type Bootlegs', min: 0, example: 3 })
	bootleg!: number;

	@ObjField({ description: 'Number of Type EPs', min: 0, example: 2 })
	ep!: number;

	@ObjField({ description: 'Number of Type Singles', min: 0, example: 1 })
	single!: number;

	@ObjField({ description: 'Number of Type Unknown', min: 0, example: 0 })
	unknown!: number;
}

@ResultType({ description: 'Library Stats' })
export class Stats {
	@ObjField({ nullable: true, description: 'Root ID', isID: true })
	rootID?: string;

	@ObjField({ description: 'Number of Tracks', min: 0, example: 555 })
	track!: number;

	@ObjField({ description: 'Number of Folders', min: 0, example: 55 })
	folder!: number;

	@ObjField({ description: 'Number of Series', min: 0, example: 5 })
	series!: number;

	@ObjField({ description: 'Number of Artists', min: 0, example: 5 })
	artist!: number;

	@ObjField({ description: 'Detailed Artists Stats' })
	artistTypes!: StatsAlbumTypes;

	@ObjField({ description: 'Number of Albums', min: 0, example: 5 })
	album!: number;

	@ObjField({ description: 'Detailed Album Stats' })
	albumTypes!: StatsAlbumTypes;
}

@ResultType({ description: 'User Detail Stats' })
export class UserDetailStats {
	@ObjField({ description: 'Number of Tracks', min: 0, example: 555 })
	track!: number;

	@ObjField({ description: 'Number of Folders', min: 0, example: 55 })
	folder!: number;

	@ObjField({ description: 'Number of Series', min: 0, example: 5 })
	series!: number;

	@ObjField({ description: 'Number of Artist', min: 0, example: 5 })
	artist!: number;

	@ObjField({ description: 'Detailed Artists Stats' })
	artistTypes!: StatsAlbumTypes;

	@ObjField({ description: 'Number of Albums', min: 0, example: 5 })
	album!: number;

	@ObjField({ description: 'Detailed Album Stats' })
	albumTypes!: StatsAlbumTypes;
}

@ResultType({ description: 'User Stats' })
export class UserStats {
	@ObjField({ description: 'Number of Playlists', min: 0, example: 55 })
	playlist!: number;

	@ObjField({ description: 'Number of Bookmarks', min: 0, example: 55 })
	bookmark!: number;

	@ObjField({ description: 'Detailed User Favorites Stats' })
	favorite!: UserDetailStats;

	@ObjField({ description: 'Detailed User Played Stats' })
	played!: UserDetailStats;
}
