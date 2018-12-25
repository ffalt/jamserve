import {JamParameters} from '../../model/jam-rest-params-0.1.0';
import {Jam} from '../../model/jam-rest-data-0.1.0';
import {Album} from './album.model';
import {MetaInfo} from '../../modules/audio/metadata.model';

export function formatAlbumInfo(info: MetaInfo): Jam.AlbumInfo {
	return {
		description: info.album.description,
		lastFmUrl: info.album.url,
		releases: info.album.releases,
		smallImageUrl: info.album.image && info.album.image.small ? info.album.image.small : undefined,
		mediumImageUrl: info.album.image && info.album.image.medium ? info.album.image.medium : undefined,
		largeImageUrl: info.album.image && info.album.image.large ? info.album.image.large : undefined
	};
}

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
		created: album.created,
		artist: album.artist,
		artistID: album.artistID,
		trackCount: album.trackIDs.length,
		tag: {
			genre: album.genre,
			year: album.year,
			duration: album.duration,
			created: album.created,
			musicbrainz: mbz
		},
		trackIDs: includes.albumTrackIDs ? album.trackIDs : undefined,
	};
}
