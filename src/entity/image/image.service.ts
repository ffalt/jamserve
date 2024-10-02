import path from 'path';
import { Inject, InRequestScope } from 'typescript-ioc';
import { ImageModule } from '../../modules/image/image.module.js';
import { Folder } from '../folder/folder.js';
import { DBObjectType, FolderType } from '../../types/enums.js';
import { Episode } from '../episode/episode.js';
import { Track } from '../track/track.js';
import { Podcast } from '../podcast/podcast.js';
import { Base } from '../base/base.js';
import { Playlist } from '../playlist/playlist.js';
import { Series } from '../series/series.js';
import { Album } from '../album/album.js';
import { Artist } from '../artist/artist.js';
import { User } from '../user/user.js';
import { Root } from '../root/root.js';
import { ApiBinaryResult } from '../../modules/rest/index.js';
import { AudioModule } from '../../modules/audio/audio.module.js';
import { PodcastService } from '../podcast/podcast.service.js';
import { TrackService } from '../track/track.service.js';
import { FolderService } from '../folder/folder.service.js';
import { UserService } from '../user/user.service.js';
import { AlbumService } from '../album/album.service.js';
import { ArtistService } from '../artist/artist.service.js';
import { SeriesService } from '../series/series.service.js';
import { RootService } from '../root/root.service.js';
import { Artwork } from '../artwork/artwork.js';
import { ArtworkService } from '../artwork/artwork.service.js';
import { Orm } from '../../modules/engine/services/orm.service.js';

@InRequestScope
export class ImageService {
	@Inject
	private imageModule!: ImageModule;

	@Inject
	private audioModule!: AudioModule;

	@Inject
	private podcastService!: PodcastService;

	@Inject
	private trackService!: TrackService;

	@Inject
	private folderService!: FolderService;

	@Inject
	private userService!: UserService;

	@Inject
	private rootService!: RootService;

	@Inject
	private seriesService!: SeriesService;

	@Inject
	private artistService!: ArtistService;

	@Inject
	private albumService!: AlbumService;

	@Inject
	private artworkService!: ArtworkService;

	private static getCoverArtTextFolder(folder: Folder): string {
		let result: string | undefined;
		if (folder.folderType === FolderType.artist) {
			result = folder.artist;
		} else if ([FolderType.multialbum, FolderType.album].includes(folder.folderType)) {
			result = folder.album;
		}
		if (!result || result.length === 0) {
			result = path.basename(folder.path);
		}
		return result;
	}

	private static async getCoverArtTextEpisode(episode: Episode): Promise<string> {
		const tag = await episode.tag.get();
		let text: string | undefined = tag?.title;
		if (!text && episode.path) {
			text = path.basename(episode.path);
		}
		if (!text) {
			text = episode.name;
		}
		if (!text) {
			text = 'Podcast Episode';
		}
		return text;
	}

	private static async getCoverArtTextTrack(track: Track): Promise<string> {
		const tag = await track.tag.get();
		return tag && tag.title ? tag.title : path.basename(track.path);
	}

	private static getCoverArtTextPodcast(podcast: Podcast): string {
		return podcast.title || podcast.url;
	}

	private static async getCoverArtText(o: Base, type: DBObjectType): Promise<string> {
		switch (type) {
			case DBObjectType.track:
				return await ImageService.getCoverArtTextTrack(o as Track);
			case DBObjectType.folder:
				return ImageService.getCoverArtTextFolder(o as Folder);
			case DBObjectType.episode:
				return await ImageService.getCoverArtTextEpisode(o as Episode);
			case DBObjectType.podcast:
				return ImageService.getCoverArtTextPodcast(o as Podcast);
			case DBObjectType.playlist:
				return (o as Playlist).name;
			case DBObjectType.series:
				return (o as Series).name;
			case DBObjectType.album:
				return (o as Album).name;
			case DBObjectType.artist:
				return (o as Artist).name;
			case DBObjectType.user:
				return (o as User).name;
			case DBObjectType.root:
				return (o as Root).name;
		}
		return type;
	}

	async getObjImageByType(orm: Orm, o: Base, type: DBObjectType, size?: number, format?: string): Promise<ApiBinaryResult | undefined> {
		switch (type) {
			case DBObjectType.track:
				return this.trackService.getImage(orm, o as Track, size, format);
			case DBObjectType.folder:
				return this.folderService.getImage(orm, o as Folder, size, format);
			case DBObjectType.artist:
				return this.artistService.getImage(orm, o as Artist, size, format);
			case DBObjectType.album:
				return this.albumService.getImage(orm, o as Album, size, format);
			case DBObjectType.user:
				return this.userService.getImage(orm, o as User, size, format);
			case DBObjectType.podcast:
				return this.podcastService.getImage(orm, o as Podcast, size, format);
			case DBObjectType.episode:
				return this.podcastService.getEpisodeImage(orm, o as Episode, size, format);
			case DBObjectType.series:
				return this.seriesService.getImage(orm, o as Series, size, format);
			case DBObjectType.artwork:
				return this.artworkService.getImage(orm, o as Artwork, size, format);
			case DBObjectType.root:
				return this.rootService.getImage(orm, o as Root, size, format);
		}
		return;
	}

	async getObjImage(orm: Orm, o: Base, type: DBObjectType, size?: number, format?: string): Promise<ApiBinaryResult> {
		return await this.getObjImageByType(orm, o, type, size, format) ?? await this.paintImage(o, type, size, format);
	}

	async paintImage(obj: Base, type: DBObjectType, size?: number, format?: string): Promise<ApiBinaryResult> {
		const s = await ImageService.getCoverArtText(obj, type);
		return this.imageModule.paint(s, size || 128, format);
	}
}
