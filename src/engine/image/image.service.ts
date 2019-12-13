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
import {EpisodeService} from '../episode/episode.service';
import {Folder} from '../folder/folder.model';
import {FolderService} from '../folder/folder.service';
import {Playlist} from '../playlist/playlist.model';
import {Podcast} from '../podcast/podcast.model';
import {PodcastService} from '../podcast/podcast.service';
import {Root} from '../root/root.model';
import {Series} from '../series/series.model';
import {SeriesService} from '../series/series.service';
import {Track} from '../track/track.model';
import {TrackService} from '../track/track.service';
import {User} from '../user/user.model';
import {UserService} from '../user/user.service';

export class ImageService {

	constructor(
		private imageModule: ImageModule, private trackService: TrackService,
		private folderService: FolderService, private artistService: ArtistService,
		private albumService: AlbumService, private userService: UserService,
		private podcastService: PodcastService, private episodeService: EpisodeService,
		private seriesService: SeriesService) {
	}

	private static getCoverArtTextFolder(folder: Folder): string {
		let result: string | undefined;
		if (folder.tag) {
			if (folder.tag.type === FolderType.artist) {
				result = folder.tag.artist;
			} else if ([FolderType.multialbum, FolderType.album].includes(folder.tag.type)) {
				result = folder.tag.album;
			}
		}
		if (!result || result.length === 0) {
			result = path.basename(folder.path);
		}
		return result;
	}

	private static getCoverArtTextEpisode(episode: Episode): string {
		let text: string | undefined = episode.tag ? episode.tag.title : undefined;
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

	private static getCoverArtTextTrack(track: Track): string {
		return track.tag && track.tag.title ? track.tag.title : path.basename(track.path);
	}

	private static getCoverArtTextPodcast(podcast: Podcast): string {
		return podcast.tag ? podcast.tag.title : podcast.url;
	}

	private getCoverArtText(o: DBObject): string {
		switch (o.type) {
			case DBObjectType.track:
				return ImageService.getCoverArtTextTrack(o as Track);
			case DBObjectType.folder:
				return ImageService.getCoverArtTextFolder(o as Folder);
			case DBObjectType.episode:
				return ImageService.getCoverArtTextEpisode(o as Episode);
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
				return DBObjectType[o.type];
		}
	}

	async getObjImage(o: DBObject, size?: number, format?: string): Promise<ApiBinaryResult> {
		let result: ApiBinaryResult | undefined;
		switch (o.type) {
			case DBObjectType.track:
				result = await this.trackService.getImage(o as Track, size, format);
				break;
			case DBObjectType.folder:
				result = await this.folderService.getImage(o as Folder, size, format);
				break;
			case DBObjectType.artist:
				result = await this.artistService.getImage(o as Artist, size, format);
				break;
			case DBObjectType.album:
				result = await this.albumService.getImage(o as Album, size, format);
				break;
			case DBObjectType.user:
				result = await this.userService.getImage(o as User, size, format);
				break;
			case DBObjectType.podcast:
				result = await this.podcastService.getImage(o as Podcast, size, format);
				break;
			case DBObjectType.episode:
				result = await this.podcastService.getEpisodeImage(o as Episode, size, format);
				break;
			case DBObjectType.series:
				result = await this.seriesService.getImage(o as Series, size, format);
				break;
			case DBObjectType.root:
				const rootFolder = await this.folderService.folderStore.searchOne({rootID: (o as Root).id, level: 0});
				if (rootFolder) {
					result = await this.folderService.getImage(rootFolder, size, format);
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
		const s = this.getCoverArtText(obj);
		return this.imageModule.paint(s, size || 128, format);
	}

}
