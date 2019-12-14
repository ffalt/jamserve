import {Jam} from '../../model/jam-rest-data';
import {JamParameters} from '../../model/jam-rest-params';
import {Album} from './album.model';

export function formatAlbum(album: Album, includes: JamParameters.IncludesAlbum): Jam.Album {
	let mbz: any = {
		artistID: album.mbArtistID,
		albumID: album.mbAlbumID
	};
	if (!Object.keys(mbz).find(key => !!mbz[key])) {
		mbz = undefined;
	}
	return {
		id: album.id,
		name: album.name,
		albumType: album.albumType,
		created: album.created,
		artist: album.artist,
		artistID: album.artistID,
		series: album.series,
		seriesID: album.seriesID,
		seriesNr: album.seriesNr,
		trackCount: album.trackIDs.length,
		tag: includes.albumTag ? {
			genre: album.genre,
			year: album.year,
			duration: album.duration,
			musicbrainz: mbz
		} : undefined,
		trackIDs: includes.albumTrackIDs ? album.trackIDs : undefined
	};
}
