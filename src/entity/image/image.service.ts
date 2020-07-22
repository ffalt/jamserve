import path from 'path';
import {Inject, InRequestScope} from 'typescript-ioc';
import {ImageModule} from '../../modules/image/image.module';
import {Folder} from '../folder/folder';
import {DBObjectType, FolderType} from '../../types/enums';
import {Episode} from '../episode/episode';
import {Track} from '../track/track';
import {Podcast} from '../podcast/podcast';
import {Base} from '../base/base';
import {Playlist} from '../playlist/playlist';
import {Series} from '../series/series';
import {Album} from '../album/album';
import {Artist} from '../artist/artist';
import {User} from '../user/user';
import {Root} from '../root/root';
import {ApiBinaryResult} from '../../modules/rest/builder';
import {AudioModule} from '../../modules/audio/audio.module';
import {PodcastService} from '../podcast/podcast.service';
import {TrackService} from '../track/track.service';
import {FolderService} from '../folder/folder.service';
import {UserService} from '../user/user.service';
import {AlbumService} from '../album/album.service';
import {ArtistService} from '../artist/artist.service';
import {SeriesService} from '../series/series.service';
import {RootService} from '../root/root.service';
import {Artwork} from '../artwork/artwork';
import {ArtworkService} from '../artwork/artwork.service';
import {Orm} from '../../modules/engine/services/orm.service';

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

	private async getCoverArtText(o: Base, type: DBObjectType): Promise<string> {
		switch (type) {
			case DBObjectType.track:
				return await ImageService.getCoverArtTextTrack(o as Track);
			case DBObjectType.folder:
				return ImageService.getCoverArtTextFolder(o as Folder);
			case DBObjectType.episode:
				return await ImageService.getCoverArtTextEpisode(o as Episode);
			case DBObjectType.playlist:
				return (o as Playlist).name;
			case DBObjectType.series:
				return (o as Series).name;
			case DBObjectType.podcast:
				return ImageService.getCoverArtTextPodcast(o as Podcast);
			case DBObjectType.album:
				return (o as Album).name;
			case DBObjectType.artist:
				return (o as Artist).name;
			case DBObjectType.user:
				return (o as User).name;
			case DBObjectType.root:
				return (o as Root).name;
			default:
				return type;
		}
	}

	async getObjImage(orm: Orm, o: Base, type: DBObjectType, size?: number, format?: string): Promise<ApiBinaryResult> {
		let result: ApiBinaryResult | undefined;
		switch (type) {
			case DBObjectType.track:
				result = await this.trackService.getImage(orm, o as Track, size, format);
				break;
			case DBObjectType.folder:
				result = await this.folderService.getImage(orm, o as Folder, size, format);
				break;
			case DBObjectType.artist:
				result = await this.artistService.getImage(orm, o as Artist, size, format);
				break;
			case DBObjectType.album:
				result = await this.albumService.getImage(orm, o as Album, size, format);
				break;
			case DBObjectType.user:
				result = await this.userService.getImage(orm, o as User, size, format);
				break;
			case DBObjectType.podcast:
				result = await this.podcastService.getImage(orm, o as Podcast, size, format);
				break;
			case DBObjectType.episode:
				result = await this.podcastService.getEpisodeImage(orm, o as Episode, size, format);
				break;
			case DBObjectType.series:
				result = await this.seriesService.getImage(orm, o as Series, size, format);
				break;
			case DBObjectType.artwork:
				result = await this.artworkService.getImage(orm, o as Artwork, size, format);
				break;
			case DBObjectType.root: {
				result = await this.rootService.getImage(orm, o as Root, size, format);
				break;
			}
			default:
				break;
		}
		if (!result) {
			return this.paintImage(o, type, size, format);
		}
		return result;
	}

	async paintImage(obj: Base, type: DBObjectType, size?: number, format?: string): Promise<ApiBinaryResult> {
		const s = await this.getCoverArtText(obj, type);
		return this.imageModule.paint(s, size || 128, format);
	}

}
