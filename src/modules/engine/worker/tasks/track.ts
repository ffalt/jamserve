import fse from 'fs-extra';
import path from 'path';
import {ensureTrailingPathSeparator} from '../../../../utils/fs-utils';
import {RawTag} from '../../../audio/rawTag';
import {TrackHealthID} from '../../../../types/enums';
import {processQueue} from '../../../../utils/queue';
import {Root} from '../../../../entity/root/root';
import {Changes} from '../changes';
import {BaseWorker} from './base';
import {Track} from '../../../../entity/track/track';

export class TrackWorker extends BaseWorker {

	public async writeTags(tags: Array<{ trackID: string; tag: RawTag }>, changes: Changes): Promise<void> {
		for (const tag of tags) {
			const track = await this.orm.Track.findOne(tag.trackID);
			if (track) {
				const filename = path.join(track.path, track.fileName);
				await this.audioModule.writeRawTag(filename, tag.tag);
				await this.updateTrackStats(track);
				changes.tracks.updated.add(track);
				changes.folders.updated.add(track.folder);
			}
		}
	}

	public async fix(fixes: Array<{ trackID: string; fixID: TrackHealthID }>, changes: Changes): Promise<void> {
		const tracks = await this.orm.Track.find(fixes.map(t => t.trackID));
		const fixTasks: Array<{ filename: string; fixIDs: Array<TrackHealthID> }> = [];
		for (const track of tracks) {
			changes.tracks.updated.add(track);
			changes.folders.updated.add(track.folder);
			fixTasks.push({
				filename: path.join(track.path, track.fileName),
				fixIDs: fixes.filter(f => f.trackID === track.id).map(f => f.fixID)
			});
		}
		await processQueue<{ filename: string; fixIDs: Array<TrackHealthID> }>(3, fixTasks, async item => {
			for (const fixID of item.fixIDs) {
				if ([TrackHealthID.mp3HeaderExists, TrackHealthID.mp3HeaderValid].includes(fixID)) {
					await this.audioModule.mp3.rewrite(item.filename);
				} else if ([TrackHealthID.mp3Garbage, TrackHealthID.mp3MediaValid].includes(fixID)) {
					await this.audioModule.mp3.fixAudio(item.filename);
				} else if ([TrackHealthID.id3v2NoId3v1].includes(fixID)) {
					await this.audioModule.mp3.removeID3v1(item.filename);
				}
			}
		});
	}

	private async updateTrackStats(track: Track): Promise<void> {
		const stat = await fse.stat(path.join(track.path, track.fileName));
		track.statCreated = stat.ctime.valueOf();
		track.statModified = stat.mtime.valueOf();
		track.fileSize = stat.size;
	}

	public async rename(trackID: string, newName: string, changes: Changes): Promise<void> {
		const track = await this.orm.Track.findOne(trackID);
		if (!track) {
			return Promise.reject(Error('Track not found'));
		}
		track.fileName = await this.renameFile(track.path, track.fileName, newName);
		await this.updateTrackStats(track);
		this.orm.orm.em.persistLater(track);
		changes.tracks.updated.add(track);
		changes.folders.updated.add(track.folder);
	}

	public async remove(root: Root, trackIDs: Array<string>, changes: Changes): Promise<void> {
		const removedTracks = await this.orm.Track.find(trackIDs);
		if (removedTracks.length !== trackIDs.length) {
			return Promise.reject(Error('Track not found'));
		}
		for (const track of removedTracks) {
			await this.moveToTrash(root, track.path, track.fileName);
			changes.folders.updated.add(track.folder);
			changes.tracks.removed.add(track);
		}
	}

	public async move(trackIDs: Array<string>, newParentID: string, changes: Changes): Promise<void> {
		const tracks = await this.orm.Track.find(trackIDs);
		if (tracks.length !== trackIDs.length) {
			return Promise.reject(Error('Track not found'));
		}
		const newParent = await this.orm.Folder.findOne(newParentID);
		if (!newParent) {
			return Promise.reject(Error('Destination Folder not found'));
		}
		for (const track of tracks) {
			if (await fse.pathExists(path.join(newParent.path, track.fileName))) {
				return Promise.reject(Error('File name is already used in folder'));
			}
		}
		changes.folders.updated.add(newParent);
		for (const track of tracks) {
			changes.tracks.updated.add(track);
			const oldParent = track.folder;
			if (oldParent.id !== newParentID) {
				changes.folders.updated.add(oldParent);
				await fse.move(path.join(track.path, track.fileName), path.join(newParent.path, track.fileName));
				track.path = ensureTrailingPathSeparator(newParent.path);
				track.root = newParent.root;
				track.folder = newParent;
				await this.updateTrackStats(track);
				this.orm.orm.em.persistLater(track);
			}
		}
	}

	public async refresh(trackIDs: Array<string>, changes: Changes): Promise<void> {
		const tracks = await this.orm.Track.find(trackIDs);
		if (tracks.length !== trackIDs.length) {
			return Promise.reject(Error('Track not found'));
		}
		for (const track of tracks) {
			changes.tracks.updated.add(track);
			changes.folders.updated.add(track.folder);
		}
	}
}
