import path from 'node:path';
import { InRequestScope } from 'typescript-ioc';
import { Episode } from '../episode/episode.js';
import { Track } from '../track/track.js';
import { Folder } from '../folder/folder.js';
import { Artist } from '../artist/artist.js';
import { Series } from '../series/series.js';
import { Album } from '../album/album.js';
import { Podcast } from '../podcast/podcast.js';
import { Playlist } from '../playlist/playlist.js';
import { CompressListStream } from '../../utils/compress-list-stream.js';
import { CompressFolderStream } from '../../utils/compress-folder-stream.js';
import { User } from '../user/user.js';
import { DBObjectType } from '../../types/enums.js';
import { Base } from '../base/base.js';
import { Artwork } from '../artwork/artwork.js';
import { ApiBinaryResult } from '../../modules/deco/express/express-responder.js';
import { invalidParameterError, unauthError } from '../../modules/deco/express/express-error.js';

@InRequestScope
export class DownloadService {
	private static async downloadEpisode(episode: Episode, format?: string): Promise<ApiBinaryResult> {
		if (!episode.path) {
			return Promise.reject(new Error('Podcast episode not ready'));
		}
		return { pipe: new CompressListStream([episode.path], path.basename(episode.path), format) };
	}

	private static async downloadTrack(track: Track, format?: string): Promise<ApiBinaryResult> {
		return { pipe: new CompressListStream([path.join(track.path, track.fileName)], path.basename(track.fileName), format) };
	}

	private static async downloadArtwork(artwork: Artwork, format?: string): Promise<ApiBinaryResult> {
		return { pipe: new CompressListStream([path.join(artwork.path, artwork.name)], path.basename(artwork.name), format) };
	}

	private static async downloadFolder(folder: Folder, format?: string): Promise<ApiBinaryResult> {
		return { pipe: new CompressFolderStream(folder.path, path.basename(folder.path), format) };
	}

	private async downloadArtist(artist: Artist, format?: string): Promise<ApiBinaryResult> {
		const tracks = await artist.tracks.getItems();
		const fileList = tracks.map(t => path.join(t.path, t.fileName));
		return { pipe: new CompressListStream(fileList, artist.name, format) };
	}

	private async downloadSeries(series: Series, format?: string): Promise<ApiBinaryResult> {
		const tracks = await series.tracks.getItems();
		const fileList = tracks.map(t => path.join(t.path, t.fileName));
		return { pipe: new CompressListStream(fileList, series.name, format) };
	}

	private async downloadAlbum(album: Album, format?: string): Promise<ApiBinaryResult> {
		const tracks = await album.tracks.getItems();
		const fileList = tracks.map(t => path.join(t.path, t.fileName));
		return { pipe: new CompressListStream(fileList, album.name, format) };
	}

	private async downloadPodcast(podcast: Podcast, format: string | undefined): Promise<ApiBinaryResult> {
		const episodes = await podcast.episodes.getItems();
		const fileList: Array<string> = episodes.filter(episode => !!episode.path).map(episode => episode.path!);
		return { pipe: new CompressListStream(fileList, podcast.id, format) };
	}

	private static async downloadPlaylist(playlist: Playlist, format: string | undefined, user: User): Promise<ApiBinaryResult> {
		const userID = playlist.user.id();
		if (userID !== user.id && !playlist.isPublic) {
			return Promise.reject(unauthError());
		}
		const entries = await playlist.entries.getItems();
		const fileList: Array<string> = [];
		for (const entry of entries) {
			const track = await entry.track.get();
			if (track) {
				fileList.push(path.join(track.path, track.fileName));
			} else {
				const episode = await entry.episode.get();
				if (episode?.path) {
					fileList.push(episode.path);
				}
			}
		}
		// TODO: add playlist index file m3u/pls
		return { pipe: new CompressListStream(fileList, playlist.name, format) };
	}

	async getObjDownload(o: Base, objType: DBObjectType, format: string | undefined, user: User): Promise<ApiBinaryResult> {
		switch (objType) {
			case DBObjectType.track: {
				return DownloadService.downloadTrack(o as Track, format);
			}
			case DBObjectType.artwork: {
				return DownloadService.downloadArtwork(o as Artwork, format);
			}
			case DBObjectType.folder: {
				return DownloadService.downloadFolder(o as Folder, format);
			}
			case DBObjectType.artist: {
				return this.downloadArtist(o as Artist, format);
			}
			case DBObjectType.series: {
				return this.downloadSeries(o as Series, format);
			}
			case DBObjectType.album: {
				return this.downloadAlbum(o as Album, format);
			}
			case DBObjectType.episode: {
				return DownloadService.downloadEpisode(o as Episode, format);
			}
			case DBObjectType.podcast: {
				return this.downloadPodcast(o as Podcast, format);
			}
			case DBObjectType.playlist: {
				return DownloadService.downloadPlaylist(o as Playlist, format, user);
			}
			default:
		}
		return Promise.reject(invalidParameterError('type', 'Invalid Download Type'));
	}
}
