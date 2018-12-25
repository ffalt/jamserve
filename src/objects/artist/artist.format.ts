import {JamParameters} from '../../model/jam-rest-params-0.1.0';
import {Jam} from '../../model/jam-rest-data-0.1.0';
import {MetaInfo} from '../../modules/audio/metadata.model';
import {Artist} from './artist.model';

export function formatArtistInfo(info: MetaInfo): Jam.ArtistInfo {
	return {
		description: info.artist.description,
		lastFmUrl: info.album.url,
		smallImageUrl: info.album.image && info.album.image.small ? info.album.image.small : undefined,
		mediumImageUrl: info.album.image && info.album.image.medium ? info.album.image.medium : undefined,
		largeImageUrl: info.album.image && info.album.image.large ? info.album.image.large : undefined
	};
}

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
		albumIDs: includes.artistAlbumIDs ? artist.albumIDs : undefined,
		trackIDs: includes.artistTracksIDs ? artist.trackIDs : undefined,
		trackCount: artist.trackIDs.length,
		created: artist.created,
		musicbrainz: mbz
	};
}
