import {Inject, Singleton} from 'typescript-ioc';
import {Artist} from './artist';
import {MUSICBRAINZ_VARIOUS_ARTISTS_ID} from '../../types/consts';
import {Folder} from '../folder/folder';
import {ApiBinaryResult} from '../../modules/rest/builder/express-responder';
import {FolderService} from '../folder/folder.service';
import {FolderType} from '../../types/enums';

@Singleton
export class ArtistService {
	@Inject
	private folderService!: FolderService;

	canHaveArtistImage(artist: Artist): boolean {
		return (artist.albumTypes.length > 0 && artist.mbArtistID !== MUSICBRAINZ_VARIOUS_ARTISTS_ID);
	}

	async getArtistFolder(artist: Artist): Promise<Folder | undefined> {
		let p = await this.folderService.orm.Folder.findOneFilter({artistIDs: [artist.id]});
		while (p) {
			if (p.folderType === FolderType.artist) {
				return p;
			}
			await this.folderService.orm.Folder.populate(p, 'parent');
			p = p.parent;
		}
	}

	async getImage(artist: Artist, size?: number, format?: string): Promise<ApiBinaryResult | undefined> {
		if (this.canHaveArtistImage(artist)) {
			const folder = await this.getArtistFolder(artist);
			if (folder) {
				return this.folderService.getImage(folder, size, format);
			}
		}
	}

}
