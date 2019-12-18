import {Jam} from '../../model/jam-rest-data';
import {JamParameters} from '../../model/jam-rest-params';
import {Album} from './album.model';

export function formatAlbum(album: Album, includes: JamParameters.IncludesAlbum): Jam.Album {
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
		genres: album.genres,
		year: album.year,
		duration: album.duration,
		mbArtistID: album.mbArtistID,
		mbReleaseID: album.mbReleaseID,
		trackIDs: includes.albumTrackIDs ? album.trackIDs : undefined
	};
}
