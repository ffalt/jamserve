import fse from 'fs-extra';
import path from 'node:path';
import { ensureTrailingPathSeparator } from '../../../../utils/fs-utils.js';
import { RawTag } from '../../../audio/raw-tag.js';
import { TrackHealthID } from '../../../../types/enums.js';
import { processQueue } from '../../../../utils/queue.js';
import { Root } from '../../../../entity/root/root.js';
import { Changes } from '../changes.js';
import { BaseWorker } from './base.js';
import { Track } from '../../../../entity/track/track.js';
import { InRequestScope } from 'typescript-ioc';
import { Orm } from '../../services/orm.service.js';
import { AudioModule } from '../../../audio/audio.module.js';
import { TrackTag } from '../../../audio/audio.format.js';
import { Genre } from '../../../../entity/genre/genre.js';

export class TrackUpdater {
	private readonly genresCache: Array<Genre> = [];

	constructor(
		private readonly orm: Orm,
		private readonly audioModule: AudioModule,
		private readonly changes: Changes) {
	}

	public async updateTrackValues(track: Track, filename: string): Promise<void> {
		const data = await this.audioModule.read(filename);
		const tag = this.orm.Tag.createByScan(data, filename);
		this.orm.Tag.persistLater(tag);
		const oldTag = await track.tag.get();
		if (oldTag) {
			this.orm.Tag.removeLater(oldTag);
		}
		await track.tag.set(tag);
		const genres = await this.findOrCreateGenres(tag);
		const ids = await track.genres.getIDs();
		const removedGenreIDs = ids.filter(id => !genres.some(g => g.id === id));
		this.changes.genres.updated.appendIDs(removedGenreIDs);
		await track.genres.set(genres);
	}

	async findOrCreateGenres(tag: TrackTag): Promise<Array<Genre>> {
		const names = tag.genres ?? [];
		const genres = [];
		for (const name of names) {
			genres.push(await this.findOrCreateGenre(name));
		}
		return genres;
	}

	private async findOrCreateGenre(name: string): Promise<Genre> {
		let genre = this.genresCache.find(g => g.name === name);
		if (!genre) {
			genre = await this.orm.Genre.findOne({ where: { name } });
			if (genre) {
				this.genresCache.push(genre);
			}
		}
		if (!genre) {
			genre = this.orm.Genre.create({ name });
			this.orm.Genre.persistLater(genre);
			this.genresCache.push(genre);
			this.changes.genres.added.add(genre);
		}
		return genre;
	}
}

@InRequestScope
export class TrackWorker extends BaseWorker {
	public async writeTags(orm: Orm, tags: Array<{ trackID: string; tag: RawTag }>, changes: Changes): Promise<void> {
		const trackUpdater = new TrackUpdater(orm, this.audioModule, changes);
		for (const writeTag of tags) {
			const track = await orm.Track.findOneByID(writeTag.trackID);
			if (track) {
				const filename = path.join(track.path, track.fileName);
				await this.audioModule.writeRawTag(filename, writeTag.tag);
				await trackUpdater.updateTrackValues(track, filename);
				await TrackWorker.updateTrackStats(track);
				orm.Track.persistLater(track);
				changes.tracks.updated.add(track);
				changes.folders.updated.addID(track.folder.id());
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

	private static async updateTrackStats(track: Track): Promise<void> {
		const stat = await fse.stat(path.join(track.path, track.fileName));
		track.statCreated = stat.ctime;
		track.statModified = stat.mtime;
		track.fileSize = stat.size;
	}

	public async rename(orm: Orm, trackID: string, newName: string, changes: Changes): Promise<void> {
		const track = await orm.Track.findOneByID(trackID);
		if (!track) {
			return Promise.reject(new Error('Track not found'));
		}
		track.fileName = await this.renameFile(track.path, track.fileName, newName);
		await TrackWorker.updateTrackStats(track);
		orm.Track.persistLater(track);
		changes.tracks.updated.add(track);
		changes.folders.updated.add(await track.folder.get());
	}

	public async remove(orm: Orm, root: Root, trackIDs: Array<string>, changes: Changes): Promise<void> {
		const removedTracks = await orm.Track.findByIDs(trackIDs);
		if (removedTracks.length !== trackIDs.length) {
			return Promise.reject(new Error('Track not found'));
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
			return Promise.reject(new Error('Track not found'));
		}
		const newParent = await orm.Folder.findOneByID(newParentID);
		if (!newParent) {
			return Promise.reject(new Error('Destination Folder not found'));
		}
		for (const track of tracks) {
			if (await fse.pathExists(path.join(newParent.path, track.fileName))) {
				return Promise.reject(new Error('File name is already used in folder'));
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
				await TrackWorker.updateTrackStats(track);
				orm.Track.persistLater(track);
			}
		}
	}

	public async refresh(orm: Orm, trackIDs: Array<string>, changes: Changes): Promise<void> {
		const tracks = await orm.Track.findByIDs(trackIDs);
		if (tracks.length !== trackIDs.length) {
			return Promise.reject(new Error('Track not found'));
		}
		for (const track of tracks) {
			changes.tracks.updated.add(track);
			changes.folders.updated.add(await track.folder.get());
		}
	}
}
