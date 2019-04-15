import {RuleResult} from './rule.model';
import {Folder, FolderTag} from '../../objects/folder/folder.model';
import {FolderType, FolderTypesAlbum} from '../../model/jam-types';
import path from 'path';
import {replaceFolderSystemChars} from '../../utils/fs-utils';
import {Jam} from '../../model/jam-rest-data';
import {Root} from '../../objects/root/root.model';

export abstract class FolderRule {

	protected constructor(public id: string, public name: string) {

	}

	abstract run(folder: Folder, parents: Array<Folder>, root: Root): Promise<RuleResult | undefined>;
}

export class FolderAlbumTagsRule extends FolderRule {

	constructor() {
		super('folder.album.tags.exists', 'Album folder values are missing');
	}

	async run(folder: Folder): Promise<RuleResult | undefined> {
		if (FolderTypesAlbum.indexOf(folder.tag.type) >= 0) {
			const missing = [];
			if (!folder.tag.album) {
				missing.push('album');
			}
			if (!folder.tag.artist) {
				missing.push('artist');
			}
			if (!folder.tag.year) {
				missing.push('year');
			}
			if (!folder.tag.genre) {
				missing.push('genre');
			}
			if (!folder.tag.albumTrackCount) {
				missing.push('album total track count');
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

}

export class FolderAlbumMusicBrainzRule extends FolderRule {

	constructor() {
		super('folder.album.mbid.exists', 'Album folder musicbrainz id are missing');
	}

	async run(folder: Folder): Promise<RuleResult | undefined> {
		if (FolderTypesAlbum.indexOf(folder.tag.type) >= 0) {
			const missing = [];
			if (!folder.tag.mbAlbumID) {
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

}

export class FolderAlbumCompleteRule extends FolderRule {

	constructor() {
		super('folder.album.tracks.complete', 'Album folder seems to be incomplete');
	}

	async run(folder: Folder): Promise<RuleResult | undefined> {
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
}

export class FolderAlbumNameRule extends FolderRule {

	constructor() {
		super('folder.album.name.conform', 'Album folder name is not conform');
	}

	getNiceOtherFolderName(tag: FolderTag): string {
		let name = (tag.album || '')
			.replace(/[!?]/g, '')
			.replace(/< >/g, ' - ')
			.replace(/<>/g, ' - ')
			.replace(/[\//]/g, '-')
			.replace(/\.\.\./g, '…')
			.replace(/  /g, ' ')
			.trim();
		name = replaceFolderSystemChars(name, '_');
		return name.trim();
	}

	getNiceAlbumFolderName(tag: FolderTag): string {
		const year = tag.year ? tag.year.toString() : '';
		let name = (tag.album || '')
			.replace(/[!?]/g, '')
			.replace(/< >/g, ' - ')
			.replace(/<>/g, ' - ')
			.replace(/[\//]/g, '-')
			.replace(/\.\.\./g, '…')
			.replace(/  /g, ' ')
			.trim();
		name = replaceFolderSystemChars(name, '_');
		const s = (year.length > 0 ? '[' + replaceFolderSystemChars(year, '_') + '] ' : '') + name;
		return s.trim();
	}

	checkArtistAlbumFolderName(folder: Folder): RuleResult | undefined {
		if ((folder.tag.album) && (folder.tag.year) && (folder.tag.year > 0)) {
			const nameSlug = path.basename(folder.path).trim().replace(/[_:!?\/ ]/g, '').toLowerCase();
			const nicename = this.getNiceAlbumFolderName(folder.tag);
			const nicenameSlug = nicename.replace(/[_:!?\/ ]/g, '').toLowerCase();
			if (nameSlug.localeCompare(nicenameSlug) !== 0) {
				return {details: [{reason: 'not equal', actual: path.basename(folder.path), expected: nicename}]};
			}
		}
	}

	checkOtherFolderName(folder: Folder): RuleResult | undefined {
		if ((folder.tag.album)) {
			const nameSlug = path.basename(folder.path).trim().replace(/[_:!?\/ ]/g, '').toLowerCase();
			const nicename = this.getNiceOtherFolderName(folder.tag);
			const nicenameSlug = nicename.replace(/[_:!?\/ ]/g, '').toLowerCase();
			if (nameSlug.localeCompare(nicenameSlug) !== 0) {
				return {details: [{reason: 'not equal', actual: path.basename(folder.path), expected: nicename}]};
			}
		}
	}

	checkName(folder: Folder, parents: Array<Folder>): RuleResult | undefined {
		const hasArtist = parents.find(p => p.tag.type === FolderType.artist);
		if (hasArtist) {
			return this.checkArtistAlbumFolderName(folder);
		} else {
			return this.checkOtherFolderName(folder);
		}
	}

	async run(folder: Folder, parents: Array<Folder>, root: Root): Promise<RuleResult | undefined> {
		if (folder.tag.type === FolderType.album) {
			return this.checkName(folder, parents);
		} else if ((folder.tag.type === FolderType.multialbum) && (folder.tag.trackCount === 0)) {
			return this.checkName(folder, parents);
		}
	}

}

export class FolderAlbumImageRule extends FolderRule {

	constructor() {
		super('folder.album.image.exists', 'Album folder image is missing');
	}

	async run(folder: Folder): Promise<RuleResult | undefined> {
		if (!folder.tag.image) {
			if (folder.tag.type === FolderType.album) {
				return {};
			}
			if (folder.tag.type === FolderType.multialbum && folder.tag.folderCount > 0) {
				return {};
			}
		}
	}

}

export class FolderArtistImageRule extends FolderRule {

	constructor() {
		super('folder.artist.image.exists', 'Artist folder image is missing');
	}

	async run(folder: Folder): Promise<RuleResult | undefined> {
		if ((folder.tag.type === FolderType.artist) && (!folder.tag.image)) {
			return {};
		}
	}

}

export class FolderArtistNameRule extends FolderRule {

	constructor() {
		super('folder.artist.name.conform', 'Artist folder name is not conform');
	}

	checkName(folder: Folder): RuleResult | undefined {
		if (folder.tag.artist) {
			const nameSlug = path.basename(folder.path).trim().replace(/[_:!?\/ ]/g, '').toLowerCase();
			const artistName = replaceFolderSystemChars(folder.tag.artist, '_');
			const artistNameSlug = artistName.replace(/[_:!?\/ ]/g, '').toLowerCase();
			if (nameSlug.localeCompare(artistNameSlug) !== 0) {
				return {details: [{reason: 'not equal', actual: path.basename(folder.path), expected: artistName}]};
			}
		}
	}

	async run(folder: Folder): Promise<RuleResult | undefined> {
		if (folder.tag.type === FolderType.artist) {
			return this.checkName(folder);
		}
	}

}

export class FolderRulesChecker {
	rules: Array<FolderRule> = [];

	constructor() {
		this.rules.push(new FolderAlbumTagsRule());
		this.rules.push(new FolderAlbumMusicBrainzRule());
		this.rules.push(new FolderAlbumNameRule());
		this.rules.push(new FolderAlbumCompleteRule());
		this.rules.push(new FolderAlbumImageRule());
		this.rules.push(new FolderArtistImageRule());
		this.rules.push(new FolderArtistNameRule());
	}

	async run(folder: Folder, parents: Array<Folder>, root: Root): Promise<Array<Jam.HealthHint>> {
		const result: Array<Jam.HealthHint> = [];
		for (const rule of this.rules) {
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
