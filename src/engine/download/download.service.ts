import path from 'path';
import {Errors} from '../../api/jam/error';
import {DBObjectType} from '../../db/db.types';
import {ApiBinaryResult} from '../../typings';
import {CompressFolderStream} from '../../utils/compress-folder-stream';
import {CompressListStream} from '../../utils/compress-list-stream';
import {Album} from '../album/album.model';
import {Artist} from '../artist/artist.model';
import {DBObject} from '../base/base.model';
import {Episode} from '../episode/episode.model';
import {EpisodeStore} from '../episode/episode.store';
import {Folder} from '../folder/folder.model';
import {Playlist} from '../playlist/playlist.model';
import {Podcast} from '../podcast/podcast.model';
import {Series} from '../series/series.model';
import {Track} from '../track/track.model';
import {TrackStore} from '../track/track.store';
import {User} from '../user/user.model';

export class DownloadService {

	constructor(private trackStore: TrackStore, private episodeStore: EpisodeStore) {
	}

	private async downloadEpisode(episode: Episode, format?: string): Promise<ApiBinaryResult> {
		if (!episode.path) {
			return Promise.reject(Error('Podcast episode not ready'));
		}
		return {pipe: new CompressListStream([episode.path], path.basename(episode.path), format)};
	}

	private async downloadTrack(track: Track, format?: string): Promise<ApiBinaryResult> {
		return {pipe: new CompressListStream([path.join(track.path, track.name)], path.basename(track.name), format)};
	}

	private async downloadFolder(folder: Folder, format?: string): Promise<ApiBinaryResult> {
		return {pipe: new CompressFolderStream(folder.path, path.basename(folder.path), format)};
	}

	private async downloadArtist(artist: Artist, format?: string): Promise<ApiBinaryResult> {
		const tracks = await this.trackStore.byIds(artist.trackIDs);
		const fileList = tracks.map(t => path.join(t.path, t.name));
		return {pipe: new CompressListStream(fileList, artist.name, format)};
	}

	private async downloadSeries(series: Series, format?: string): Promise<ApiBinaryResult> {
		const tracks = await this.trackStore.byIds(series.trackIDs);
		const fileList = tracks.map(t => path.join(t.path, t.name));
		return {pipe: new CompressListStream(fileList, series.name, format)};
	}

	private async downloadAlbum(album: Album, format?: string): Promise<ApiBinaryResult> {
		const tracks = await this.trackStore.byIds(album.trackIDs);
		const fileList = tracks.map(t => path.join(t.path, t.name));
		return {pipe: new CompressListStream(fileList, album.name, format)};
	}

	private async downloadPodcast(podcast: Podcast, format: string | undefined): Promise<ApiBinaryResult> {
		const episodes = await this.episodeStore.search({podcastID: podcast.id});
		const fileList: Array<string> = episodes.items.filter(e => !!e.path).map(e => e.path as string);
		return {pipe: new CompressListStream(fileList, podcast.id, format)};
	}

	private async downloadPlaylist(playlist: Playlist, format: string | undefined, user: User): Promise<ApiBinaryResult> {
		if (playlist.userID !== user.id && !playlist.isPublic) {
			return Promise.reject(Error(Errors.unauthorized));
		}
		const tracks = await this.trackStore.byIds(playlist.trackIDs);
		const fileList = tracks.map(t => path.join(t.path, t.name));
		// TODO: add playlist index file m3u/pls
		return {pipe: new CompressListStream(fileList, playlist.name, format)};
	}

	async getObjDownload(o: DBObject, format: string | undefined, user: User): Promise<ApiBinaryResult> {
		switch (o.type) {
			case DBObjectType.track:
				return this.downloadTrack(o as Track, format);
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
