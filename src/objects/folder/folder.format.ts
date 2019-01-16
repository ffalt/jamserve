import {JamParameters} from '../../model/jam-rest-params';
import {Jam} from '../../model/jam-rest-data';
import path from 'path';
import {FolderType} from '../../model/jam-types';
import {MetaInfo} from '../../modules/audio/metadata.model';
import {Folder} from './folder.model';

export function formatArtistFolderInfo(info: MetaInfo): Jam.ArtistFolderInfo {
	return {
		description: info.artist.description,
		lastFmUrl: info.album.url,
		smallImageUrl: info.album.image && info.album.image.small ? info.album.image.small : undefined,
		mediumImageUrl: info.album.image && info.album.image.medium ? info.album.image.medium : undefined,
		largeImageUrl: info.album.image && info.album.image.large ? info.album.image.large : undefined
	};
}

export function formatAlbumFolderInfo(info: MetaInfo): Jam.AlbumFolderInfo {
	return {
		description: info.album.description,
		lastFmUrl: info.album.url,
		releases: info.album.releases,
		smallImageUrl: info.album.image && info.album.image.small ? info.album.image.small : undefined,
		mediumImageUrl: info.album.image && info.album.image.medium ? info.album.image.medium : undefined,
		largeImageUrl: info.album.image && info.album.image.large ? info.album.image.large : undefined
	};
}

function formatFolderTag(folder: Folder): Jam.FolderTag {
	let mbz: any = {
		artistID: folder.tag.mbArtistID,
		albumID: folder.tag.mbAlbumID
	};
	if (!Object.keys(mbz).find(key => !!mbz[key])) {
		mbz = undefined;
	}
	return {
		artist: folder.tag.artist,
		artistSort: folder.tag.artistSort,
		album: folder.tag.album,
		albumType: folder.tag.albumType,
		genre: folder.tag.genre,
		year: folder.tag.year,
		musicbrainz: mbz
	};
}

export function formatFolder(folder: Folder, includes: JamParameters.IncludesFolder): Jam.Folder {
	includes = includes || {};
	return {
		id: folder.id,
		level: folder.tag ? folder.tag.level : -1,
		parentID: folder.parentID,
		name: path.basename(folder.path),
		created: folder.stat.created,
		trackCount: includes.folderCounts ? folder.tag.trackCount : undefined,
		folderCount: includes.folderCounts ? folder.tag.folderCount : undefined,
		type: <Jam.FolderType>((folder.tag.type !== undefined) ? (FolderType[folder.tag.type] || 'unknown') : 'unknown'),
		tag: includes.folderTag ? formatFolderTag(folder) : undefined
	};
}
