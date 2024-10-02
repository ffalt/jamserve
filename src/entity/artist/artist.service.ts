import { Inject, InRequestScope } from 'typescript-ioc';
import { Artist } from './artist.js';
import { MUSICBRAINZ_VARIOUS_ARTISTS_ID } from '../../types/consts.js';
import { Folder } from '../folder/folder.js';
import { ApiBinaryResult } from '../../modules/rest/index.js';
import { FolderService } from '../folder/folder.service.js';
import { FolderType } from '../../types/enums.js';
import { Orm } from '../../modules/engine/services/orm.service.js';

@InRequestScope
export class ArtistService {
	@Inject
	private folderService!: FolderService;

	canHaveArtistImage(artist: Artist): boolean {
		return (artist.albumTypes.length > 0 && artist.mbArtistID !== MUSICBRAINZ_VARIOUS_ARTISTS_ID);
	}

	async getArtistFolder(orm: Orm, artist: Artist): Promise<Folder | undefined> {
		return orm.Folder.findOneFilter({ artistIDs: [artist.id], folderTypes: [FolderType.artist] });
	}

	async getImage(orm: Orm, artist: Artist, size?: number, format?: string): Promise<ApiBinaryResult | undefined> {
		if (this.canHaveArtistImage(artist)) {
			const folder = await this.getArtistFolder(orm, artist);
			if (folder) {
				return this.folderService.getImage(orm, folder, size, format);
			}
		}
		return;
	}
}
