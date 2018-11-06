import {JamServe} from '../../model/jamserve';
import {dirExist, fileExists} from '../../utils/fs-utils';
import path from 'path';
import Logger from '../../utils/logger';
import {Store} from '../../store/store';
import {MergeChanges} from './merge';
import {DBObjectType} from '../../types';
import {updatePlayListTracks} from '../../engine/components/playlists';
import {Images} from './images';
import {Waveforms} from './waveforms';

const log = Logger('IO.clean');

function isInRoot(list: Array<JamServe.Root>, fullpath: string): JamServe.Root | null {
	const result = null;
	for (let i = 0; i < list.length; i++) {
		if (fullpath.indexOf(list[i].path) === 0) {
			return list[i];
		}
	}
	return result;
}

export async function scanCleanStore(store: Store, images: Images, waveforms: Waveforms, changes: MergeChanges): Promise<void> {

	const removeTracks: Array<JamServe.Track> = changes.removedTracks;
	const removeFolders: Array<JamServe.Folder> = changes.removedFolders;
	const doneFileIds: Array<string> = changes.newTracks.map(t => t.track.id)
		.concat(changes.updateTracks.map(t => t.track.id))
		.concat(changes.unchangedTracks.map(t => t.track.id))
		.concat(changes.removedTracks.map(t => t.id));
	const doneFolderIds: Array<string> = changes.newFolders.map(t => t.id)
		.concat(changes.updateFolders.map(t => t.id))
		.concat(changes.unchangedFolders.map(t => t.id))
		.concat(changes.removedFolders.map(t => t.id))
	;

	const roots = await store.root.all();
	log.debug('Collecting removed folders');
	await store.folder.iterate(async (folders) => {
		for (const folder of folders) {
			if (!isInRoot(roots, folder.path)) {
				removeFolders.push(folder);
			} else if (doneFolderIds.indexOf(folder.id) < 0) {
				const exists = await dirExist(folder.path);
				if (!exists) {
					removeFolders.push(folder);
				}
			}
		}
	});
	log.debug('Collecting removed tracks');
	await store.track.iterate(async (tracks) => {
		for (const track of tracks) {
			if (!isInRoot(roots, track.path)) {
				removeTracks.push(track);
			} else if (doneFileIds.indexOf(track.id) < 0) {
				const exists = await fileExists(path.join(track.path, track.name));
				if (!exists) {
					removeTracks.push(track);
				}
			}
		}
	});
	await cleanStore(store, images, waveforms, removeTracks, removeFolders);
}

export async function clearID3(store: Store, images: Images, removeTracks: Array<JamServe.Track>): Promise<void> {
	if (removeTracks.length === 0) {
		return;
	}
	log.debug('Cleaning ID3');
	const trackIDs = removeTracks.map(track => track.id);
	const albums = await store.album.search({trackIDs});
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
		await store.album.remove(removeAlbums);
		await store.state.removeByQuery({destIDs: removeAlbums, type: DBObjectType.album});
	}
	if (updateAlbums.length > 0) {
		await store.album.replaceMany(updateAlbums);
	}
	const artists = await store.artist.search({trackIDs});
	artists.forEach(artist => {
		artist.trackIDs = artist.trackIDs.filter(id => trackIDs.indexOf(id) < 0);
		artist.albumIDs = artist.albumIDs.filter(id => removeAlbums.indexOf(id) < 0);
	});
	const removeArtists = artists.filter(artist => artist.trackIDs.length === 0).map(artist => artist.id);
	const updateArtists = artists.filter(artist => artist.trackIDs.length !== 0);
	if (removeArtists.length > 0) {
		await store.artist.remove(removeArtists);
		await store.state.removeByQuery({destIDs: removeArtists, type: DBObjectType.artist});
	}
	if (updateArtists.length > 0) {
		await store.artist.replaceMany(updateArtists);
	}
	const ids = removeAlbums.concat(removeArtists);
	await images.clearImageCacheByIDs(ids);
}

export async function cleanStore(store: Store, images: Images, waveforms: Waveforms, removeTracks: Array<JamServe.Track>, removeFolders: Array<JamServe.Folder>): Promise<void> {
	let ids: Array<string> = [];
	if (removeFolders.length > 0) {
		log.debug('Cleaning folders', removeFolders.length);
		const folderIDs = removeFolders.map(folder => folder.id);
		await store.folder.remove(folderIDs);
		await store.state.removeByQuery({destIDs: folderIDs, type: DBObjectType.folder});
		ids = folderIDs;
	}
	if (removeTracks.length > 0) {
		log.debug('Cleaning tracks', removeTracks.length);
		const trackIDs = removeTracks.map(track => track.id);
		await store.track.remove(trackIDs);
		await store.state.removeByQuery({destIDs: trackIDs, type: DBObjectType.track});
		await store.bookmark.removeByQuery({destIDs: trackIDs});
		const playlists = await store.playlist.search({trackIDs: trackIDs});
		ids = ids.concat(trackIDs);
		if (playlists.length > 0) {
			for (const playlist of playlists) {
				playlist.trackIDs = playlist.trackIDs.filter(id => trackIDs.indexOf(id) < 0);
				if (playlist.trackIDs.length === 0) {
					await store.playlist.remove(playlist.id);
				} else {
					await updatePlayListTracks(store, playlist);
					await store.playlist.replace(playlist);
				}
			}

		}
	}
	await images.clearImageCacheByIDs(ids);
	await waveforms.clearWaveformCacheByIDs(ids);
	await clearID3(store, images, removeTracks);
}
