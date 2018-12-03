import {IApiBinaryResult} from '../../typings';
import {DBObjectType, FolderType, FolderTypeImageName} from '../../types';
import path from 'path';
import {ImageModule} from '../io/components/imageModule';
import {Store} from '../store';
import {Config} from '../../config';
import {fileDeleteIfExists} from '../../utils/fs-utils';
import {Folder} from '../../objects/folder/folder.model';
import {Track} from '../../objects/track/track.model';
import {User} from '../../objects/user/user.model';
import {Album} from '../../objects/album/album.model';
import {Artist} from '../../objects/artist/artist.model';
import {DBObject} from '../../objects/base/base.model';
import {Episode} from '../../objects/episode/episode.model';
import {Playlist} from '../../objects/playlist/playlist.model';
import {Podcast} from '../../objects/podcast/podcast.model';
import fse from 'fs-extra';
import {FolderStore} from '../../objects/folder/folder.store';
import {TrackStore} from '../../objects/track/track.store';

export class ImageService {
	private images: ImageModule;

	constructor(public imageCachePath: string, public userAvatarPath: string, private folderStore: FolderStore, private trackStore: TrackStore) {
		this.images = new ImageModule(imageCachePath);
	}

	async getFolderImage(folder: Folder, size?: number, format?: string): Promise<IApiBinaryResult | undefined> {
		await this.checkFolderInfoImage(folder);
		if (!folder.tag.image) {
			return;
		}
		return await this.images.get(folder.id, path.join(folder.path, folder.tag.image), size, format);
	}

	async checkFolderInfoImage(folder: Folder): Promise<void> {
		if (folder.tag.image) {
			return;
		}
		if (folder.info && folder.info.album.image && folder.info.album.image.large) {
			await this.downloadFolderImage(folder, folder.info.album.image.large);
		} else if (folder.info && folder.info.artist.image && folder.info.artist.image.large) {
			await this.downloadFolderImage(folder, folder.info.artist.image.large);
		}
	}

	async setFolderImage(folder: Folder, filename: string): Promise<void> {
		const destFileName = FolderTypeImageName[folder.tag.type] + path.extname(filename);
		const destName = path.join(folder.path, destFileName);
		await fileDeleteIfExists(destName);
		await fse.copy(filename, destName);
		folder.tag.image = destFileName;
		await this.folderStore.replace(folder);
	}

	async downloadFolderImage(folder: Folder, imageUrl: string): Promise<void> {
		folder.tag.image = await this.images.storeImage(folder.path, FolderTypeImageName[folder.tag.type], imageUrl);
		await this.folderStore.replace(folder);
	}

	async getTrackImage(track: Track, size?: number, format?: string): Promise<IApiBinaryResult | undefined> {
		const folder = await this.folderStore.byId(track.parentID);
		if (!folder) {
			return;
		}
		return this.getFolderImage(folder, size, format);
	}

	async getUserImage(user: User, size?: number, format?: string): Promise<IApiBinaryResult | undefined> {
		if (user.avatar) {
			return this.images.get(user.id, path.join(this.userAvatarPath, user.avatar), size, format);
		}
	}

	async getAlbumImage(album: Album, size?: number, format?: string): Promise<IApiBinaryResult | undefined> {
		if (album.trackIDs.length === 0) {
			return;
		}
		const track = await this.trackStore.byId(album.trackIDs[0]);
		if (!track) {
			return;
		}
		const folder = await this.folderStore.byId(track.parentID);
		if (!folder) {
			return;
		}
		return this.getFolderImage(folder, size, format);
	}


	async collectFolderPath(folderId: string | undefined): Promise<Array<Folder>> {
		const result: Array<Folder> = [];
		const store = this.folderStore;

		async function collect(id?: string): Promise<void> {
			if (!id) {
				return;
			}
			const folder = await store.byId(id);
			if (folder) {
				result.unshift(folder);
				await collect(folder.parentID);
			}
		}

		await collect(folderId);
		return result;
	}

	async getArtistImage(artist: Artist, size?: number, format?: string): Promise<IApiBinaryResult | undefined> {
		if (artist.trackIDs.length === 0) {
			return;
		}
		const track = await this.trackStore.byId(artist.trackIDs[0]);
		if (!track) {
			return;
		}
		const folders = await this.collectFolderPath(track.parentID);
		if (folders.length === 0) {
			return;
		}
		let folder = folders.find(f => f.tag.type === FolderType.artist);
		if (!folder) {
			folder = folders[folders.length - 1];
		}
		if (!folder) {
			return;
		}
		return this.getFolderImage(folder, size, format);
	}

	async getObjImage(o: DBObject, size?: number, format?: string): Promise<IApiBinaryResult> {
		let result: IApiBinaryResult | undefined;
		switch (o.type) {
			case DBObjectType.track:
				const track = <Track>o;
				result = await this.getTrackImage(track, size, format);
				break;
			case DBObjectType.folder:
				const folder = <Folder>o;
				result = await this.getFolderImage(folder, size, format);
				break;
			case DBObjectType.artist:
				const artist = <Artist>o;
				result = await this.getArtistImage(artist, size, format);
				break;
			case DBObjectType.album:
				const album = <Album>o;
				result = await this.getAlbumImage(album, size, format);
				break;
			case DBObjectType.user:
				const user = <User>o;
				result = await this.getUserImage(user, size, format);
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
		return this.images.paint(s, size || 128, format);
	}

	async clearImageCacheByIDs(ids: Array<string>) {
		await this.images.clearImageCacheByIDs(ids);
	}

	async createAvatar(filename: string, destName: string) {
		await this.images.createAvatar(filename, destName);
	}

	async clearImageCacheByID(id: string) {
		await this.images.clearImageCacheByID(id);
	}
}
