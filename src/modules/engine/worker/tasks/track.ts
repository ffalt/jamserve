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
import {InRequestScope} from 'typescript-ioc';
import {Orm} from '../../services/orm.service';

@InRequestScope
export class TrackWorker extends BaseWorker {

	public async writeTags(orm: Orm, tags: Array<{ trackID: string; tag: RawTag }>, changes: Changes): Promise<void> {
		for (const tag of tags) {
			const track = await orm.Track.findOneByID(tag.trackID);
			if (track) {
				const filename = path.join(track.path, track.fileName);
				await this.audioModule.writeRawTag(filename, tag.tag);
				// await this.updateTrackStats(track);
				// await this.updateTrackTag(orm, track);
				changes.tracks.updated.add(track);
				changes.folders.updated.add(await track.folder.get());
				// orm.Track.persistLater(track);
			}
		}
	}

	public async fix(orm: Orm, fixes: Array<{ trackID: string; fixID: TrackHealthID }>, changes: Changes): Promise<void> {
		const tracks = await orm.Track.findByIDs(fixes.map(t => t.trackID));
		const fixTasks: Array<{ filename: string; fixIDs: Array<TrackHealthID> }> = [];
		for (const track of tracks) {
			changes.tracks.updated.add(track);
			changes.folders.updated.add(await track.folder.get());
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

	public async rename(orm: Orm, trackID: string, newName: string, changes: Changes): Promise<void> {
		const track = await orm.Track.findOneByID(trackID);
		if (!track) {
			return Promise.reject(Error('Track not found'));
		}
		track.fileName = await this.renameFile(track.path, track.fileName, newName);
		await this.updateTrackStats(track);
		orm.Track.persistLater(track);
		changes.tracks.updated.add(track);
		changes.folders.updated.add(await track.folder.get());
	}

	public async remove(orm: Orm, root: Root, trackIDs: Array<string>, changes: Changes): Promise<void> {
		const removedTracks = await orm.Track.findByIDs(trackIDs);
		if (removedTracks.length !== trackIDs.length) {
			return Promise.reject(Error('Track not found'));
		}
		for (const track of removedTracks) {
			await this.moveToTrash(root, track.path, track.fileName);
			changes.folders.updated.add(await track.folder.get());
			changes.tracks.removed.add(track);
		}
	}

	public async move(orm: Orm, trackIDs: Array<string>, newParentID: string, changes: Changes): Promise<void> {
		const tracks = await orm.Track.findByIDs(trackIDs);
		if (tracks.length !== trackIDs.length) {
			return Promise.reject(Error('Track not found'));
		}
		const newParent = await orm.Folder.findOneByID(newParentID);
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
			const oldParent = await track.folder.get();
			if (oldParent?.id !== newParentID) {
				changes.folders.updated.add(oldParent);
				await fse.move(path.join(track.path, track.fileName), path.join(newParent.path, track.fileName));
				track.path = ensureTrailingPathSeparator(newParent.path);
				await track.root.set(await newParent.root.getOrFail());
				await track.folder.set(newParent);
				await this.updateTrackStats(track);
				orm.Track.persistLater(track);
			}
		}
	}

	public async refresh(orm: Orm, trackIDs: Array<string>, changes: Changes): Promise<void> {
		const tracks = await orm.Track.findByIDs(trackIDs);
		if (tracks.length !== trackIDs.length) {
			return Promise.reject(Error('Track not found'));
		}
		for (const track of tracks) {
			changes.tracks.updated.add(track);
			changes.folders.updated.add(await track.folder.get());
		}
	}
}
