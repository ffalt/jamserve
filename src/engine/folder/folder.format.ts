import path from 'path';
import {Jam} from '../../model/jam-rest-data';
import {JamParameters} from '../../model/jam-rest-params';
import {ArtworkImageType, cUnknownAlbum, cUnknownArtist, FolderType, FolderTypesAlbum} from '../../model/jam-types';
import {Artwork, Folder} from './folder.model';

export function formatFolderArtwork(artwork: Artwork): Jam.ArtworkImage {
	return {
		id: artwork.id,
		name: artwork.name,
		types: artwork.types,
		format: artwork.image ? artwork.image.format : undefined,
		height: artwork.image ? artwork.image.height : undefined,
		width: artwork.image ? artwork.image.width : undefined,
		size: artwork.stat.size
	};
}

export function formatFolderArtworks(folder: Folder): Array<Jam.ArtworkImage> {
	if (!folder.tag.artworks) {
		return [];
	}
	return folder.tag.artworks.map(artwork => formatFolderArtwork(artwork));
}

function formatFolderTag(folder: Folder): Jam.FolderTag {
	const isAlbum = FolderTypesAlbum.includes(folder.tag.type);
	const isArtist = folder.tag.type === FolderType.artist;
	let mbz: Jam.FolderMBTag | undefined = {
		artistID: isArtist || isAlbum ? folder.tag.mbArtistID : undefined,
		releaseID: isAlbum ? folder.tag.mbAlbumID : undefined,
		releaseGroupID: isAlbum ? folder.tag.mbReleaseGroupID : undefined
	};
	if (!Object.keys(mbz).find(key => !!(mbz as any)[key])) {
		mbz = undefined;
	}
	return {
		artist: isAlbum || isArtist ? (folder.tag.artist || cUnknownArtist) : undefined,
		artistSort: isAlbum || isArtist ? folder.tag.artistSort : undefined,
		album: isAlbum ? (folder.tag.album || cUnknownAlbum) : undefined,
		albumType: isAlbum ? folder.tag.albumType : undefined,
		genre: folder.tag.genre,
		year: isAlbum ? folder.tag.year : undefined,
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
		type: ((folder.tag.type !== undefined) ? (FolderType[folder.tag.type] || 'unknown') : 'unknown') as Jam.FolderType,
		tag: includes.folderTag ? formatFolderTag(folder) : undefined,
		artworks: includes.folderArtworks ? formatFolderArtworks(folder) : undefined
	};
}

export function artWorkImageNameToType(name: string): Array<ArtworkImageType> {
	const lname = name.toLowerCase();
	const types: Array<ArtworkImageType> = [];
	for (const t in ArtworkImageType) {
		if (!Number(t) && lname.includes(t)) {
			types.push(t as ArtworkImageType);
		}
	}
	if ((!types.includes(ArtworkImageType.front)) && (lname.includes('cover') || lname.includes('folder'))) {
		types.push(ArtworkImageType.front);
	}
	if (types.length === 0) {
		types.push(ArtworkImageType.other);
	}
	types.sort((a, b) => a.localeCompare(b));
	return types;
}
