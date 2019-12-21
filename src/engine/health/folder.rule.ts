/* tslint:disable:max-classes-per-file */
import path from 'path';

import {Jam} from '../../model/jam-rest-data';
import {AlbumTypesArtistMusic, FolderHealthID, FolderType, FolderTypesAlbum} from '../../model/jam-types';
import {fileSuffix, replaceFolderSystemChars} from '../../utils/fs-utils';
import {Folder, FolderTag} from '../folder/folder.model';
import {getFolderDisplayImage} from '../folder/folder.service';
import {Root} from '../root/root.model';
import {RuleResult} from './rule.model';

interface FolderRuleInfo {
	id: string;
	name: string;

	run(folder: Folder, parents: Array<Folder>, root: Root): Promise<RuleResult | undefined>;
}

const folderRules: Array<FolderRuleInfo> = [
	{
		id: FolderHealthID.albumTagsExists,
		name: 'Album folder values are missing',
		run: async (folder, parents, root) => {
			if (FolderTypesAlbum.includes(folder.tag.type)) {
				const missing = [];
				if (!folder.tag.album) {
					missing.push('album');
				}
				if (!folder.tag.artist) {
					missing.push('artist');
				}
				if (!folder.tag.genres || folder.tag.genres.length === 0) {
					missing.push('genre');
				}
				if (!folder.tag.albumTrackCount) {
					missing.push('album total track count');
				}
				if (folder.tag.albumType !== undefined && AlbumTypesArtistMusic.includes(folder.tag.albumType)) {
					if (!folder.tag.year) {
						missing.push('year');
					}
				}
				if (missing.length > 0) {
					return {
						details: missing.map(m => {
							return {reason: 'value empty', expected: m};
						})
					};
				}
			}
		}
	},
	{
		id: FolderHealthID.albumMBIDExists,
		name: 'Album folder musicbrainz id are missing',
		run: async (folder, parents, root) => {
			if (FolderTypesAlbum.includes(folder.tag.type)) {
				const missing = [];
				if (!folder.tag.mbReleaseID) {
					missing.push('musicbrainz album id');
				} else {
					if (!folder.tag.mbAlbumType) {
						missing.push('musicbrainz album type');
					}
				}
				if (missing.length > 0) {
					return {
						details: missing.map(m => {
							return {reason: 'value empty', expected: m};
						})
					};
				}
			}
		}
	},
	{
		id: FolderHealthID.albumTracksComplete,
		name: 'Album folder seems to be incomplete',
		run: async (folder, parents, root) => {
			if (
				(folder.tag.type === FolderType.album) &&
				(folder.tag.albumTrackCount) && (folder.tag.albumTrackCount !== folder.tag.trackCount)
			) {
				return {
					details: [
						{reason: 'not equal', expected: folder.tag.albumTrackCount.toString(), actual: folder.tag.trackCount.toString()}
					]
				};
			}
		}
	},
	{
		id: FolderHealthID.albumNameConform,
		name: 'Album folder name is not conform',
		run: async (folder, parents, root) => {

			function getNiceOtherFolderName(tag: FolderTag): string {
				let name = (tag.album || '')
					.replace(/[!?]/g, '')
					.replace(/< >/g, ' - ')
					.replace(/<>/g, ' - ')
					.replace(/[\/]/g, '-')
					.replace(/\.\.\./g, '…')
					.replace(/  /g, ' ')
					.trim();
				name = replaceFolderSystemChars(name, '_');
				return name.trim();
			}

			function getNiceAlbumFolderName(tag: FolderTag): string {
				const year = tag.year ? tag.year.toString() : '';
				let name = (tag.album || '')
					.replace(/[!?]/g, '')
					.replace(/< >/g, ' - ')
					.replace(/<>/g, ' - ')
					.replace(/[\/]/g, '-')
					.replace(/\.\.\./g, '…')
					.replace(/  /g, ' ')
					.trim();
				name = replaceFolderSystemChars(name, '_');
				const s = (year.length > 0 ? `[${replaceFolderSystemChars(year, '_')}] ` : '') + name;
				return s.trim();
			}

			function slug(folderPath: string): string {
				return path.basename(folderPath).trim().replace(/[_:!?\/ ]/g, '').toLowerCase();
			}

			function niceSlug(nicename: string): string {
				return nicename.replace(/[_:!?\/ ]/g, '').toLowerCase();
			}

			function checkNiceName(nicename: string): RuleResult | undefined {
				const nameSlug = slug(folder.path);
				const nicenameSlug = niceSlug(nicename);
				if (nameSlug.localeCompare(nicenameSlug) !== 0) {
					return {details: [{reason: 'not equal', actual: path.basename(folder.path), expected: nicename}]};
				}
			}

			if ((folder.tag.type === FolderType.album) ||
				((folder.tag.type === FolderType.multialbum) && (folder.tag.trackCount === 0))
			) {
				const hasArtist = parents.find(p => p.tag.type === FolderType.artist);
				if (hasArtist) {
					if ((folder.tag.album) && (folder.tag.year) && (folder.tag.year > 0)) {
						return checkNiceName(getNiceAlbumFolderName(folder.tag));
					}
				}
				if ((folder.tag.album)) {
					return checkNiceName(getNiceOtherFolderName(folder.tag));
				}
			}
		}
	},
	{
		id: FolderHealthID.albumImageExists,
		name: 'Album folder image is missing',
		run: async (folder, parents, root) => {
			if ((folder.tag.type === FolderType.album) || (folder.tag.type === FolderType.multialbum && folder.tag.folderCount > 0)) {
				const artwork = await getFolderDisplayImage(folder);
				if (!artwork) {
					return {};
				}
			}
		}
	},
	{
		id: FolderHealthID.albumImageValid,
		name: 'Album folder image is invalid',
		run: async (folder, parents, root) => {
			if ((folder.tag.type === FolderType.album) || (folder.tag.type === FolderType.multialbum && folder.tag.folderCount > 0)) {
				const artwork = await getFolderDisplayImage(folder);
				if (artwork && (!artwork.image || artwork.image.format === 'invalid')) {
					return {details: [{reason: 'Broken or unsupported File Format'}]};
				}
				if (artwork && artwork.image) {
					let actual = fileSuffix(artwork.name);
					if (actual === 'jpg') {
						actual = 'jpeg';
					}
					const expected = artwork.image.format;
					if (actual !== expected) {
						return {details: [{reason: 'Wrong File Extension', actual, expected}]};
					}
				}
			}
		}
	},
	{
		id: FolderHealthID.albumImageQuality,
		name: 'Album folder image is of low quality',
		run: async (folder, parents, root) => {
			if ((folder.tag.type === FolderType.album) || (folder.tag.type === FolderType.multialbum && folder.tag.folderCount > 0)) {
				const artwork = await getFolderDisplayImage(folder);
				if (artwork && artwork.image) {
					if (artwork.image.height && artwork.image.width && (artwork.image.height < 300 || artwork.image.width < 300)) {
						return {details: [{reason: 'Image is too small', actual: `${artwork.image.width} x ${artwork.image.height}`, expected: '>=300 x >=300'}]};
					}
				}
			}
		}
	},
	{
		id: FolderHealthID.artistImageExists,
		name: 'Artist folder image is missing',
		run: async (folder, parents, root) => {
			if (folder.tag.type === FolderType.artist) {
				const artwork = await getFolderDisplayImage(folder);
				if (!artwork) {
					return {};
				}
			}
		}
	},
	{
		id: FolderHealthID.artistImageValid,
		name: 'Artist folder image is invalid',
		run: async (folder, parents, root) => {
			if (folder.tag.type === FolderType.artist) {
				const artwork = await getFolderDisplayImage(folder);
				if (artwork && (!artwork.image || artwork.image.format === 'invalid')) {
					return {details: [{reason: 'Broken or unsupported File Format'}]};
				}
				if (artwork && artwork.image) {
					let actual = fileSuffix(artwork.name);
					if (actual === 'jpg') {
						actual = 'jpeg';
					}
					const expected = artwork.image.format;
					if (actual !== expected) {
						return {details: [{reason: 'Wrong File Extension', actual, expected}]};
					}
				}
			}
		}
	},
	{
		id: FolderHealthID.artistNameConform,
		name: 'Artist folder name is not conform',
		run: async (folder, parents, root) => {
			if (folder.tag.type === FolderType.artist && folder.tag.artist) {
				const nameSlug = path.basename(folder.path).trim().replace(/[_:!?\/ ]/g, '').toLowerCase();
				const artistName = replaceFolderSystemChars(folder.tag.artist, '_');
				const artistNameSlug = artistName.replace(/[_:!?\/ ]/g, '').toLowerCase();
				if (nameSlug.localeCompare(artistNameSlug) !== 0) {
					return {details: [{reason: 'not equal', actual: path.basename(folder.path), expected: artistName}]};
				}
			}
		}
	}
];

export class FolderRulesChecker {

	async run(folder: Folder, parents: Array<Folder>, root: Root): Promise<Array<Jam.HealthHint>> {
		const result: Array<Jam.HealthHint> = [];
		for (const rule of folderRules) {
			const match = await rule.run(folder, parents, root);
			if (match) {
				result.push({
					id: rule.id,
					name: rule.name,
					details: match.details
				});
			}
		}
		return result;
	}

}
