import {JamParameters} from '../../model/jam-rest-params';
import {Jam} from '../../model/jam-rest-data';
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
		albumCount: artist.albumIDs.length,
		albumTypes: artist.albumTypes,
		albumIDs: includes.artistAlbumIDs ? artist.albumIDs : undefined,
		trackIDs: includes.artistTracksIDs ? artist.trackIDs : undefined,
		trackCount: artist.trackIDs.length,
		created: artist.created,
		musicbrainz: mbz
	};
}
