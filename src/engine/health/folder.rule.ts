import {Rule, RuleResult} from './rule.model';
import {Folder, FolderTag} from '../../objects/folder/folder.model';
import {FolderType, FolderTypesAlbum} from '../../model/jam-types';
import path from 'path';
import {replaceFolderSystemChars} from '../../utils/fs-utils';
import {Jam} from '../../model/jam-rest-data';

export abstract class FolderRule implements Rule<Folder> {

	protected constructor(public id: string, public name: string) {

	}

	abstract run(folder: Folder): Promise<RuleResult | undefined>;
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
			if (!folder.tag.mbAlbumID) {
				missing.push('musicbrainz album id');
			}
			if (missing.length > 0) {
				return {details: missing.join(',')};
			}
		}
	}

}

export class FolderAlbumNameRule extends FolderRule {

	constructor() {
		super('folder.album.name.conform', 'Album folder name is not conform');
	}

	getNiceFolderName(tag: FolderTag): string {
		const year = tag.year ? tag.year.toString() : '';
		const s = (year.length > 0 ? '[' + replaceFolderSystemChars(year, '_') + '] ' : '') + replaceFolderSystemChars(tag.album || '', '_');
		return s.trim();
	}

	checkName(folder: Folder): RuleResult | undefined {
		if ((folder.tag.album) && (folder.tag.year) && (folder.tag.year > 0)) {
			const nameSlug = path.basename(folder.path).trim().replace(/[_:!?\/ ]/g, '').toLowerCase();
			const nicename = this.getNiceFolderName(folder.tag);
			const nicenameSlug = nicename.replace(/[_:!?\/ ]/g, '').toLowerCase();
			if (nameSlug.localeCompare(nicenameSlug) !== 0) {
				return {details: nicename};
			}
		}
	}

	async run(folder: Folder): Promise<RuleResult | undefined> {
		if (folder.tag.type === FolderType.album) {
			return this.checkName(folder);
		} else if ((folder.tag.type === FolderType.multialbum) && (folder.tag.trackCount === 0)) {
			return this.checkName(folder);
		}
	}

}

export class FolderAlbumImageRule extends FolderRule {

	constructor() {
		super('folder.album.image.exists', 'Album folder image is missing');
	}

	async run(folder: Folder): Promise<RuleResult | undefined> {
		if ((FolderTypesAlbum.indexOf(folder.tag.type) >= 0) && (!folder.tag.image)) {
			return {};
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
				return {details: artistName};
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
		this.rules.push(new FolderAlbumNameRule());
		this.rules.push(new FolderAlbumImageRule());
		this.rules.push(new FolderArtistImageRule());
		this.rules.push(new FolderArtistNameRule());
	}

	async run(folder: Folder): Promise<Array<Jam.Problem>> {
		const result: Array<Jam.Problem> = [];
		for (const rule of this.rules) {
			const match = await rule.run(folder);
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
