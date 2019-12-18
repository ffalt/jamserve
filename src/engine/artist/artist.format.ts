import {Jam} from '../../model/jam-rest-data';
import {JamParameters} from '../../model/jam-rest-params';
import {Artist} from './artist.model';

export function formatArtist(artist: Artist, includes: JamParameters.IncludesArtist): Jam.Artist {
	return {
		id: artist.id,
		name: artist.name,
		genres: artist.genres,
		albumTypes: artist.albumTypes,
		mbArtistID: artist.mbArtistID,
		trackIDs: includes.artistTrackIDs ? artist.trackIDs : undefined,
		albumIDs: includes.artistAlbumIDs ? artist.albumIDs : undefined,
		seriesIDs: includes.artistSeries ? artist.seriesIDs : undefined,
		albumCount: artist.albumIDs.length,
		seriesCount: artist.seriesIDs ? artist.seriesIDs.length : 0,
		trackCount: artist.trackIDs.length,
		created: artist.created
	};
}
