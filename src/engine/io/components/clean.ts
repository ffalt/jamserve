import path from 'path';
import Logger from '../../../utils/logger';
import {Store} from '../../store/store';
import {MergeChanges} from './merge';
import {DBObjectType} from '../../../model/jam-types';
import {Root} from '../../../objects/root/root.model';
import {Track} from '../../../objects/track/track.model';
import {Folder} from '../../../objects/folder/folder.model';
import fse from 'fs-extra';
import {ImageModule} from '../../../modules/image/image.module';

const log = Logger('IO.clean');

function isInRoot(list: Array<Root>, fullpath: string): Root | null {
	const result = null;
	for (let i = 0; i < list.length; i++) {
		if (fullpath.indexOf(list[i].path) === 0) {
			return list[i];
		}
	}
	return result;
}

export async function scanForRemoved(store: Store, changes: MergeChanges): Promise<{
	removeTracks: Array<Track>;
	removeFolders: Array<Folder>;
}> {

	const removeTracks: Array<Track> = changes.removedTracks;
	const removeFolders: Array<Folder> = changes.removedFolders;
	const doneFileIds: Array<string> = changes.newTracks.map(t => t.track.id)
		.concat(changes.updateTracks.map(t => t.track.id))
		.concat(changes.unchangedTracks.map(t => t.track.id))
		.concat(changes.removedTracks.map(t => t.id));
	const doneFolderIds: Array<string> = changes.newFolders.map(t => t.id)
		.concat(changes.updateFolders.map(t => t.id))
		.concat(changes.unchangedFolders.map(t => t.id))
		.concat(changes.removedFolders.map(t => t.id));

	const roots = await store.rootStore.all();
	log.debug('Collecting removed folders');
	await store.folderStore.iterate(async (folders) => {
		for (const folder of folders) {
			if (!isInRoot(roots, folder.path)) {
				removeFolders.push(folder);
			} else if (doneFolderIds.indexOf(folder.id) < 0) {
				const exists = await fse.pathExists(folder.path);
				if (!exists) {
					removeFolders.push(folder);
				}
			}
		}
	});
	log.debug('Collecting removed tracks');
	await store.trackStore.iterate(async (tracks) => {
		for (const track of tracks) {
			if (!isInRoot(roots, track.path)) {
				removeTracks.push(track);
			} else if (doneFileIds.indexOf(track.id) < 0) {
				const exists = await fse.pathExists(path.join(track.path, track.name));
				if (!exists) {
					removeTracks.push(track);
				}
			}
		}
	});
	return {removeTracks, removeFolders};
}

export async function clearID3(store: Store, imageModule: ImageModule, removeTracks: Array<Track>): Promise<void> {
	if (removeTracks.length === 0) {
		return;
	}
	log.debug('Cleaning ID3');
	const trackIDs = removeTracks.map(track => track.id);
	const albums = await store.albumStore.search({trackIDs});
	albums.forEach(album => {
		let duration = 0;
		album.trackIDs = album.trackIDs.filter(id => {
			const track = removeTracks.find(t => t.id === id);
			if (track) {
				duration += (track.media.duration || 0);
				return false;
			}
			return true;
		});
		album.duration -= duration;
	});
	const removeAlbums = albums.filter(album => album.trackIDs.length === 0).map(album => album.id);
	const updateAlbums = albums.filter(album => album.trackIDs.length !== 0);
	if (removeAlbums.length > 0) {
		await store.albumStore.remove(removeAlbums);
		await store.stateStore.removeByQuery({destIDs: removeAlbums, type: DBObjectType.album});
	}
	if (updateAlbums.length > 0) {
		await store.albumStore.replaceMany(updateAlbums);
	}
	const artists = await store.artistStore.search({trackIDs});
	artists.forEach(artist => {
		artist.trackIDs = artist.trackIDs.filter(id => trackIDs.indexOf(id) < 0);
		artist.albumIDs = artist.albumIDs.filter(id => removeAlbums.indexOf(id) < 0);
	});
	const removeArtists = artists.filter(artist => artist.trackIDs.length === 0).map(artist => artist.id);
	const updateArtists = artists.filter(artist => artist.trackIDs.length !== 0);
	if (removeArtists.length > 0) {
		await store.artistStore.remove(removeArtists);
		await store.stateStore.removeByQuery({destIDs: removeArtists, type: DBObjectType.artist});
	}
	if (updateArtists.length > 0) {
		await store.artistStore.replaceMany(updateArtists);
	}
	const ids = removeAlbums.concat(removeArtists);
	await imageModule.clearImageCacheByIDs(ids);
}

