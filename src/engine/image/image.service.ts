import path from 'path';
import {DBObjectType} from '../../db/db.types';
import {FolderType} from '../../model/jam-types';
import {ImageModule} from '../../modules/image/image.module';
import {ApiBinaryResult} from '../../typings';
import {Album} from '../album/album.model';
import {AlbumService} from '../album/album.service';
import {Artist} from '../artist/artist.model';
import {ArtistService} from '../artist/artist.service';
import {DBObject} from '../base/base.model';
import {Episode} from '../episode/episode.model';
import {Folder} from '../folder/folder.model';
import {FolderService} from '../folder/folder.service';
import {Playlist} from '../playlist/playlist.model';
import {Podcast} from '../podcast/podcast.model';
import {PodcastService} from '../podcast/podcast.service';
import {Root} from '../root/root.model';
import {Track} from '../track/track.model';
import {TrackService} from '../track/track.service';
import {User} from '../user/user.model';
import {UserService} from '../user/user.service';

export class ImageService {

	constructor(
		private imageModule: ImageModule, private trackService: TrackService,
		private folderService: FolderService, private artistService: ArtistService,
		private albumService: AlbumService, private userService: UserService,
		private podcastService: PodcastService) {
	}

	async getObjImage(o: DBObject, size?: number, format?: string): Promise<ApiBinaryResult> {
		let result: ApiBinaryResult | undefined;
		switch (o.type) {
			case DBObjectType.track:
				const track = o as Track;
				result = await this.trackService.getTrackImage(track, size, format);
				break;
			case DBObjectType.folder:
				const folder = o as Folder;
				result = await this.folderService.getFolderImage(folder, size, format);
				break;
			case DBObjectType.artist:
				const artist = o as Artist;
				result = await this.artistService.getArtistImage(artist, size, format);
				break;
			case DBObjectType.album:
				const album = o as Album;
				result = await this.albumService.getAlbumImage(album, size, format);
				break;
			case DBObjectType.user:
				const user = o as User;
				result = await this.userService.getUserImage(user, size, format);
				break;
			case DBObjectType.podcast:
				const podcast = o as Podcast;
				result = await this.podcastService.getPodcastImage(podcast, size, format);
				break;
			case DBObjectType.root:
				const root = o as Root;
				const rfolder = await this.folderService.folderStore.searchOne({rootID: root.id, level: 0});
				if (rfolder) {
					result = await this.folderService.getFolderImage(rfolder, size, format);
				}
				break;
			default:
				break;
		}
		if (!result) {
			return this.paintImage(o, size, format);
		}
		return result;
	}

	async paintImage(obj: DBObject, size?: number, format?: string): Promise<ApiBinaryResult> {
		const getCoverArtText = (o: DBObject): string => {
			switch (o.type) {
				case DBObjectType.track:
					const track = o as Track;
					return track.tag && track.tag.title ? track.tag.title : path.basename(track.path);
				case DBObjectType.folder:
					const folder = o as Folder;
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
					const episode: Episode = o as Episode;
					let text: string | undefined = episode.tag ? episode.tag.title : undefined;
					if (!text && episode.path) {
						text = path.basename(episode.path);
					}
					if (!text) {
						text = 'podcast';
					}
					return text;
				case DBObjectType.playlist:
					const playlist: Playlist = o as Playlist;
					return playlist.name;
				case DBObjectType.podcast:
					const podcast: Podcast = o as Podcast;
					return podcast.tag ? podcast.tag.title : podcast.url;
				case DBObjectType.album:
					const album: Album = o as Album;
					return album.name;
				case DBObjectType.artist:
					const artist: Artist = o as Artist;
					return artist.name;
				case DBObjectType.user:
					const user: User = o as User;
					return user.name;
				default:
					return DBObjectType[o.type];
			}
		};
		const s = getCoverArtText(obj);
		return this.imageModule.paint(s, size || 128, format);
	}

}
