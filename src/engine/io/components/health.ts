import path from 'path';
import {FolderType} from '../../../types';
import {Jam} from '../../../model/jam-rest-data-0.1.0';
import {replaceFileSystemChars} from '../../../utils/fs-utils';
import {Folder, FolderTag} from '../../folder/folder.model';

interface ProblemCheck {
	name: string;
	check: (folder: Folder) => Promise<boolean>;
}


function getNiceFolderName(tag: FolderTag): string {
	const year = tag.year ? tag.year.toString() : '';
	const s = (year.length > 0 ? '[' + year + '] ' : '') + replaceFileSystemChars(tag.album || '', '_');
	return s.trim();
}

const ProblemDefs: { [id: string]: ProblemCheck; } = {
	FOLDER_TAG_MISSING: {
		name: 'Missing TAG',
		check: async (folder) => {
			return !folder.tag;
		}
	},
	FOLDER_TAG_VALUES_MISSING: {
		name: 'Missing Tag Values (album, artist, year)',
		check: async (folder) => {
			return folder.tag &&
				(
					(folder.tag.type === FolderType.album) ||
					(folder.tag.type === FolderType.multialbum)
				) &&
				(
					(!folder.tag.album) || (!folder.tag.artist) || (!folder.tag.year)
				);
		}
	},
	ALBUM_IMAGE_MISSING: {
		name: 'Missing album image',
		check: async (folder) => {
			return !!folder.tag &&
				((folder.tag.type === FolderType.album) || (folder.tag.type === FolderType.multialbum))
				&& !folder.tag.image;
		}
	},
	ALBUM_IMAGE_NAME_NONCONFORM: {
		name: 'Album Image Name is not cover.[ext]',
		check: async (folder) => {
			return !!folder.tag &&
				(
					(folder.tag.type === FolderType.album) ||
					(folder.tag.type === FolderType.multialbum)
				)
				&& !!folder.tag.image &&
				folder.tag.image.indexOf('cover.') !== 0;
		}

	},
	ALBUM_NAME_NONCONFORM: {
		name: 'Album folder name is not "[Year] Album-Name"',
		check: async (folder) => {
			if (folder.tag && (folder.tag.type === FolderType.album) &&
				(folder.tag.album) && (folder.tag.year) && (folder.tag.year > 0)) {
				const name = path.basename(folder.path).trim().replace(/[_:!?\/ ]/g, '').toLowerCase();
				const nicename = getNiceFolderName(folder.tag).replace(/[_:!?\/ ]/g, '').toLowerCase();
				return name.localeCompare(nicename) !== 0;
			}
			return false;
		}

	},
	ALBUM_GENRE_MISSING: {
		name: 'Album genre is missing',
		check: async (folder) => {
			return (folder.tag && (!folder.tag.genre || folder.tag.genre.length === 0));
		}

	},
	ALBUM_ID_MISSING: {
		name: 'Missing musicbrainz album id',
		check: async (folder) => {
			return folder.tag && (
				(folder.tag.type === FolderType.album) ||
				(folder.tag.type === FolderType.multialbum)
			) && !folder.tag.mbAlbumID;
		}
	},
	ARTIST_IMAGE_NAME_NONCONFORM: {
		name: 'Artist Image Name is not artist.[ext]',
		check: async (folder) => {
			return (!!folder.tag) &&
				(
					(folder.tag.type === FolderType.artist) ||
					(folder.tag.type === FolderType.multiartist)
				) && (!!folder.tag.image) && folder.tag.image.indexOf('artist.') !== 0;
		}

	},
	ARTIST_IMAGE_MISSING: {
		name: 'Missing artist image',
		check: async (folder) => {
			return !!folder.tag && (
					(folder.tag.type === FolderType.artist) ||
					(folder.tag.type === FolderType.multiartist)
				)
				&& !folder.tag.image;
		}
	}
};

export async function getFolderProblems(node: Folder): Promise<Array<Jam.FolderProblem>> {
	const probs: Array<Jam.FolderProblem> = [];
	const keys = Object.keys(ProblemDefs);
	for (const key of keys) {
		if (ProblemDefs[key].check) {
			const match = await ProblemDefs[key].check(node);
			if (match) {
				probs.push({id: key, name: ProblemDefs[key].name});
			}
		}
	}
	return probs;
}
