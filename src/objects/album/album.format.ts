import {JamParameters} from '../../model/jam-rest-params';
import {Jam} from '../../model/jam-rest-data';
import {Album} from './album.model';
import {MetaInfo} from '../metadata/metadata.model';

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
		albumType: album.albumType,
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
