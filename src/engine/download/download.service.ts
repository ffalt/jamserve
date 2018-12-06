import {IApiBinaryResult} from '../../typings';
import path from 'path';
import {CompressListStream, CompressStream} from '../../utils/compress-stream';
import {replaceFileSystemChars} from '../../utils/fs-utils';
import {DBObjectType} from '../../types';
import {Store} from '../store/store';
import {User} from '../../objects/user/user.model';
import {DBObject} from '../../objects/base/base.model';
import {Track} from '../../objects/track/track.model';
import {Folder} from '../../objects/folder/folder.model';
import {Artist} from '../../objects/artist/artist.model';
import {Album} from '../../objects/album/album.model';
import {Playlist} from '../../objects/playlist/playlist.model';
import {TrackStore} from '../../objects/track/track.store';

export class DownloadService {

	constructor(private trackStore: TrackStore) {

	}

	async getObjDownload(o: DBObject, format: string | undefined, user: User): Promise<IApiBinaryResult> {

		const sendTrackList = (name: string, tracks: Array<Track>): IApiBinaryResult => {
			const fileList = tracks.map(t => path.join(t.path, t.name));
			return {pipe: new CompressListStream(fileList, replaceFileSystemChars(name, '_'))};
		};

		switch (o.type) {
			case DBObjectType.track:
				const track = <Track>o;
				return {pipe: new CompressListStream([path.join(track.path, track.name)], path.basename(track.name))};
			case DBObjectType.folder:
				const folder = <Folder>o;
				return {pipe: new CompressStream(folder.path, path.basename(folder.path))};
			case DBObjectType.artist:
				const artist = <Artist>o;
				return sendTrackList(artist.name || 'artist', await this.trackStore.byIds(artist.trackIDs));
			case DBObjectType.album:
				const album = <Album>o;
				return sendTrackList(album.name || 'album', await this.trackStore.byIds(album.trackIDs));
			case DBObjectType.playlist:
				const playlist = <Playlist>o;
				if (playlist.userID !== user.id) {
					return Promise.reject(Error('Unauthorized'));
				}
				// TODO: add playlist index file m3u/pls
				return sendTrackList(playlist.name || 'playlist', await this.trackStore.byIds(playlist.trackIDs));
		}
		return Promise.reject(Error('Invalid Object Type for Download'));
	}

}
