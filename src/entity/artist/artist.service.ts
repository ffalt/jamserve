import {Inject, InRequestScope} from 'typescript-ioc';
import {Artist} from './artist';
import {MUSICBRAINZ_VARIOUS_ARTISTS_ID} from '../../types/consts';
import {Folder} from '../folder/folder';
import {ApiBinaryResult} from '../../modules/rest';
import {FolderService} from '../folder/folder.service';
import {FolderType} from '../../types/enums';
import {Orm} from '../../modules/engine/services/orm.service';

@InRequestScope
export class ArtistService {
	@Inject
	private folderService!: FolderService;

	canHaveArtistImage(artist: Artist): boolean {
		return (artist.albumTypes.length > 0 && artist.mbArtistID !== MUSICBRAINZ_VARIOUS_ARTISTS_ID);
	}

	async getArtistFolder(orm: Orm, artist: Artist): Promise<Folder | undefined> {
		let p = await orm.Folder.findOneFilter({artistIDs: [artist.id]});
		while (p) {
			if (p.folderType === FolderType.artist) {
				return p;
			}
			p = await p.parent.get();
		}
		return;
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
