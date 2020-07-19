import path from 'path';
import {Inject, Singleton} from 'typescript-ioc';
import {OrmService} from '../../modules/engine/services/orm.service';
import {Episode} from '../episode/episode';
import {ApiBinaryResult} from '../../modules/rest/builder/express-responder';
import {Track} from '../track/track';
import {Folder} from '../folder/folder';
import {Artist} from '../artist/artist';
import {Series} from '../series/series';
import {Album} from '../album/album';
import {Podcast} from '../podcast/podcast';
import {Playlist} from '../playlist/playlist';
import {CompressListStream} from '../../utils/compress-list-stream';
import {CompressFolderStream} from '../../utils/compress-folder-stream';
import {User} from '../user/user';
import {UnauthError} from '../../modules/rest/builder/express-error';
import {DBObjectType} from '../../types/enums';
import {Base} from '../base/base';
import {Artwork} from '../artwork/artwork';

@Singleton
export class DownloadService {
	@Inject
	private orm!: OrmService;

	private async downloadEpisode(episode: Episode, format?: string): Promise<ApiBinaryResult> {
		if (!episode.path) {
			return Promise.reject(Error('Podcast episode not ready'));
		}
		return {pipe: new CompressListStream([episode.path], path.basename(episode.path), format)};
	}

	private async downloadTrack(track: Track, format?: string): Promise<ApiBinaryResult> {
		return {pipe: new CompressListStream([path.join(track.path, track.fileName)], path.basename(track.fileName), format)};
	}

	private async downloadArtwork(artwork: Artwork, format?: string): Promise<ApiBinaryResult> {
		return {pipe: new CompressListStream([path.join(artwork.path, artwork.name)], path.basename(artwork.name), format)};
	}

	private async downloadFolder(folder: Folder, format?: string): Promise<ApiBinaryResult> {
		return {pipe: new CompressFolderStream(folder.path, path.basename(folder.path), format)};
	}

	private async downloadArtist(artist: Artist, format?: string): Promise<ApiBinaryResult> {
		const fileList = artist.tracks.getItems().map(t => path.join(t.path, t.fileName));
		return {pipe: new CompressListStream(fileList, artist.name, format)};
	}

	private async downloadSeries(series: Series, format?: string): Promise<ApiBinaryResult> {
		const fileList = series.tracks.getItems().map(t => path.join(t.path, t.fileName));
		return {pipe: new CompressListStream(fileList, series.name, format)};
	}

	private async downloadAlbum(album: Album, format?: string): Promise<ApiBinaryResult> {
		const fileList = album.tracks.getItems().map(t => path.join(t.path, t.fileName));
		return {pipe: new CompressListStream(fileList, album.name, format)};
	}

	private async downloadPodcast(podcast: Podcast, format: string | undefined): Promise<ApiBinaryResult> {
		const fileList: Array<string> = podcast.episodes.getItems().filter(e => !!e.path).map(e => e.path as string);
		return {pipe: new CompressListStream(fileList, podcast.id, format)};
	}

	private async downloadPlaylist(playlist: Playlist, format: string | undefined, user: User): Promise<ApiBinaryResult> {
		if (playlist.user.id !== user.id && !playlist.isPublic) {
			return Promise.reject(UnauthError());
		}
		const fileList = playlist.entries.getItems().map(t => {
			if (t.episode) {
				return t.episode.path
			} else if (t.track) {
				return path.join(t.track.path, t.track.fileName)
			}
		}).filter(s => !!s) as Array<string>;
		// TODO: add playlist index file m3u/pls
		return {pipe: new CompressListStream(fileList, playlist.name, format)};
	}

	async getObjDownload(o: Base, objType: DBObjectType, format: string | undefined, user: User): Promise<ApiBinaryResult> {
		switch (objType) {
			case DBObjectType.track:
				return this.downloadTrack(o as Track, format);
			case DBObjectType.artwork:
				return this.downloadArtwork(o as Artwork, format);
			case DBObjectType.folder:
				return this.downloadFolder(o as Folder, format);
			case DBObjectType.artist:
				return this.downloadArtist(o as Artist, format);
			case DBObjectType.series:
				return this.downloadSeries(o as Series, format);
			case DBObjectType.album:
				return this.downloadAlbum(o as Album, format);
			case DBObjectType.episode:
				return this.downloadEpisode(o as Episode, format);
			case DBObjectType.podcast:
				return this.downloadPodcast(o as Podcast, format);
			case DBObjectType.playlist:
				return this.downloadPlaylist(o as Playlist, format, user);
			default:
		}
		return Promise.reject(Error('Invalid Download Type'));
	}

}
