import {IApiBinaryResult} from '../../typings';
import path from 'path';
import {CompressFolderStream, CompressListStream} from '../../utils/compress-stream';
import {DBObjectType} from '../../types';
import {User} from '../../objects/user/user.model';
import {DBObject} from '../../objects/base/base.model';
import {Track} from '../../objects/track/track.model';
import {Folder} from '../../objects/folder/folder.model';
import {Artist} from '../../objects/artist/artist.model';
import {Album} from '../../objects/album/album.model';
import {Playlist} from '../../objects/playlist/playlist.model';
import {TrackStore} from '../../objects/track/track.store';
import {Episode} from '../../objects/episode/episode.model';

export class DownloadService {

	constructor(private trackStore: TrackStore) {

	}

	private async downloadEpisode(episode: Episode, format?: string): Promise<IApiBinaryResult> {
		if (!episode.path) {
			return Promise.reject(Error('Podcast episode not ready'));
		}
		return {pipe: new CompressListStream([episode.path], path.basename(episode.path), format)};
	}

	private async downloadTrack(track: Track, format?: string): Promise<IApiBinaryResult> {
		return {pipe: new CompressListStream([path.join(track.path, track.name)], path.basename(track.name), format)};
	}

	private async downloadFolder(folder: Folder, format?: string): Promise<IApiBinaryResult> {
		return {pipe: new CompressFolderStream(folder.path, path.basename(folder.path), format)};
	}

	private async downloadArtist(artist: Artist, format?: string): Promise<IApiBinaryResult> {
		const tracks = await this.trackStore.byIds(artist.trackIDs);
		const fileList = tracks.map(t => path.join(t.path, t.name));
		return {pipe: new CompressListStream(fileList, artist.name, format)};
	}

	private async downloadAlbum(album: Album, format?: string): Promise<IApiBinaryResult> {
		const tracks = await this.trackStore.byIds(album.trackIDs);
		const fileList = tracks.map(t => path.join(t.path, t.name));
		return {pipe: new CompressListStream(fileList, album.name, format)};
	}

	private async downloadPlaylist(playlist: Playlist, format: string | undefined, user: User): Promise<IApiBinaryResult> {
		if (playlist.userID !== user.id && !playlist.isPublic) {
			return Promise.reject(Error('Unauthorized'));
		}
		const tracks = await this.trackStore.byIds(playlist.trackIDs);
		const fileList = tracks.map(t => path.join(t.path, t.name));
		// TODO: add playlist index file m3u/pls
		return {pipe: new CompressListStream(fileList, playlist.name, format)};
	}

	async getObjDownload(o: DBObject, format: string | undefined, user: User): Promise<IApiBinaryResult> {
		switch (o.type) {
			case DBObjectType.track:
				return this.downloadTrack(<Track>o, format);
			case DBObjectType.folder:
				return this.downloadFolder(<Folder>o, format);
			case DBObjectType.artist:
				return this.downloadArtist(<Artist>o, format);
			case DBObjectType.album:
				return this.downloadAlbum(<Album>o, format);
			case DBObjectType.episode:
				return this.downloadEpisode(<Episode>o, format);
			case DBObjectType.playlist:
				return this.downloadPlaylist(<Playlist>o, format, user);
		}
		return Promise.reject(Error('Invalid Download Type'));
	}

}
