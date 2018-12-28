import {IApiBinaryResult} from '../../typings';
import {DBObjectType, FolderType} from '../../model/jam-types';
import path from 'path';
import {ImageModule} from '../../modules/image/image.module';
import {Folder} from '../../objects/folder/folder.model';
import {Track} from '../../objects/track/track.model';
import {User} from '../../objects/user/user.model';
import {Album} from '../../objects/album/album.model';
import {Artist} from '../../objects/artist/artist.model';
import {DBObject} from '../../objects/base/base.model';
import {Episode} from '../../objects/episode/episode.model';
import {Playlist} from '../../objects/playlist/playlist.model';
import {Podcast} from '../../objects/podcast/podcast.model';
import {FolderService} from '../../objects/folder/folder.service';
import {TrackService} from '../../objects/track/track.service';
import {ArtistService} from '../../objects/artist/artist.service';
import {AlbumService} from '../../objects/album/album.service';
import {UserService} from '../../objects/user/user.service';

export class ImageService {

	constructor(private imageModule: ImageModule, private trackService: TrackService,
				private folderService: FolderService, private artistService: ArtistService,
				private albumService: AlbumService, private userService: UserService) {
	}

	async getObjImage(o: DBObject, size?: number, format?: string): Promise<IApiBinaryResult> {
		let result: IApiBinaryResult | undefined;
		switch (o.type) {
			case DBObjectType.track:
				const track = <Track>o;
				result = await this.trackService.getTrackImage(track, size, format);
				break;
			case DBObjectType.folder:
				const folder = <Folder>o;
				result = await this.folderService.getFolderImage(folder, size, format);
				break;
			case DBObjectType.artist:
				const artist = <Artist>o;
				result = await this.artistService.getArtistImage(artist, size, format);
				break;
			case DBObjectType.album:
				const album = <Album>o;
				result = await this.albumService.getAlbumImage(album, size, format);
				break;
			case DBObjectType.user:
				const user = <User>o;
				result = await this.userService.getUserImage(user, size, format);
				break;
			default:
				break;
		}
		if (!result) {
			return this.paintImage(o, size, format);
		} else {
			return result;
		}
	}

	async paintImage(obj: DBObject, size?: number, format?: string): Promise<IApiBinaryResult> {
		const getCoverArtText = (o: DBObject): string => {
			switch (o.type) {
				case DBObjectType.track:
					const track = <Track>o;
					return track.tag && track.tag.title ? track.tag.title : path.basename(track.path);
				case DBObjectType.folder:
					const folder = <Folder>o;
					let result: string | undefined;
					if (folder.tag) {
						if (folder.tag.type === FolderType.artist) {
							result = folder.tag.artist;
						} else if ([FolderType.multialbum, FolderType.album].indexOf(folder.tag.type) >= 0) {
							result = folder.tag.album;
						}
					}
					if (!result || result.length === 0) {
						result = path.basename(folder.path);
					}
					return result;
				case DBObjectType.episode:
					const episode: Episode = <Episode>o;
					let text: string | undefined = episode.tag ? episode.tag.title : undefined;
					if (!text && episode.path) {
						text = path.basename(episode.path);
					}
					if (!text) {
						text = 'podcast';
					}
					return text;
				case DBObjectType.playlist:
					const playlist: Playlist = <Playlist>o;
					return playlist.name;
				case DBObjectType.podcast:
					const podcast: Podcast = <Podcast>o;
					return podcast.tag ? podcast.tag.title : podcast.url;
				case DBObjectType.album:
					const album: Album = <Album>o;
					return album.name;
				case DBObjectType.artist:
					const artist: Artist = <Artist>o;
					return artist.name;
				case DBObjectType.user:
					const user: User = <User>o;
					return user.name;
				default:
					return DBObjectType[o.type];
			}
		};
		const s = getCoverArtText(obj);
		return this.imageModule.paint(s, size || 128, format);
	}

}
