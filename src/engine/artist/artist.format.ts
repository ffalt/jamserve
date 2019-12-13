import {Jam} from '../../model/jam-rest-data';
import {JamParameters} from '../../model/jam-rest-params';
import {Artist} from './artist.model';

export function formatArtist(artist: Artist, includes: JamParameters.IncludesArtist): Jam.Artist {
	let mbz: any = {
		artistID: artist.mbArtistID
	};
	if (!Object.keys(mbz).find(key => !!mbz[key])) {
		mbz = undefined;
	}
	return {
		id: artist.id,
		name: artist.name,
		albumTypes: artist.albumTypes,
		trackIDs: includes.artistTrackIDs ? artist.trackIDs : undefined,
		albumIDs: includes.artistAlbumIDs ? artist.albumIDs : undefined,
		seriesIDs: includes.artistSeries ? artist.seriesIDs : undefined,
		albumCount: artist.albumIDs.length,
		seriesCount: artist.seriesIDs ? artist.seriesIDs.length : 0,
		trackCount: artist.trackIDs.length,
		created: artist.created,
		musicbrainz: mbz
	};
}
