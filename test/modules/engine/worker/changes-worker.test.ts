import { afterEach, describe, expect, it, jest } from '@jest/globals';
import { ChangesWorker } from '../../../../src/modules/engine/worker/changes-worker.js';
import { Changes } from '../../../../src/modules/engine/worker/changes.js';
import { MetaMerger } from '../../../../src/modules/engine/worker/merge-meta.js';

function makeTrackEntry(mediaDuration: number) {
	return {
		track: {
			get: jest.fn<() => Promise<any>>().mockResolvedValue({
				tag: { get: jest.fn<() => Promise<any>>().mockResolvedValue({ mediaDuration }) }
			})
		},
		episode: { get: jest.fn<() => Promise<any>>().mockResolvedValue(undefined) }
	};
}

function makeEpisodeEntry(mediaDuration: number) {
	return {
		track: { get: jest.fn<() => Promise<any>>().mockResolvedValue(undefined) },
		episode: {
			get: jest.fn<() => Promise<any>>().mockResolvedValue({
				tag: { get: jest.fn<() => Promise<any>>().mockResolvedValue({ mediaDuration }) }
			})
		}
	};
}

function makeEmptyEntry(playlistId = 'pl-1') {
	return {
		playlist: { id: () => playlistId },
		track: { get: jest.fn<() => Promise<any>>().mockResolvedValue(undefined) },
		episode: { get: jest.fn<() => Promise<any>>().mockResolvedValue(undefined) }
	};
}

function makeOrm(overrides: Record<string, unknown> = {}) {
	// eslint-disable-next-line @typescript-eslint/no-unsafe-return
	return {
		Bookmark: {
			findIDs: jest.fn<(options: unknown) => Promise<Array<string>>>().mockResolvedValue([]),
			removeLaterByIDs: jest.fn<(ids: Array<string>) => Promise<void>>().mockResolvedValue(undefined)
		},
		PlaylistEntry: {
			findIDs: jest.fn<(options: unknown) => Promise<Array<string>>>().mockResolvedValue([]),
			findByIDs: jest.fn<(ids: Array<string>) => Promise<Array<any>>>().mockResolvedValue([]),
			removeLater: jest.fn<(entity: unknown) => void>()
		},
		State: {
			findIDs: jest.fn<(options: unknown) => Promise<Array<string>>>().mockResolvedValue([]),
			removeLaterByIDs: jest.fn<(ids: Array<string>) => Promise<void>>().mockResolvedValue(undefined)
		},
		Playlist: {
			findByIDs: jest.fn<(ids: Array<string>) => Promise<Array<any>>>().mockResolvedValue([]),
			persistLater: jest.fn<(entity: unknown) => void>()
		},
		em: {
			hasChanges: jest.fn<() => boolean>().mockReturnValue(false),
			flush: jest.fn<() => Promise<void>>().mockResolvedValue(undefined)
		},
		...overrides
	} as any;
}

function makeWorker() {
	const worker = Object.create(ChangesWorker.prototype) as ChangesWorker;
	(worker as any).imageModule = {
		clearImageCacheByIDs: jest.fn<(ids: Array<string>) => Promise<void>>().mockResolvedValue(undefined)
	};
	(worker as any).audioModule = {
		clearCacheByIDs: jest.fn<(ids: Array<string>) => Promise<void>>().mockResolvedValue(undefined)
	};
	(worker as any).ormService = {
		fork: jest.fn<(autoCommit: boolean) => unknown>(),
		clearCache: jest.fn<() => void>()
	};
	return worker;
}

// ─── start ───────────────────────────────────────────────────────────────────

describe('ChangesWorker.start', () => {
	it('forks the ORM and resolves the root', async () => {
		const root = { id: 'root-1' };
		const orm = { Root: { findOneOrFailByID: jest.fn<(id: string) => Promise<any>>().mockResolvedValue(root) } };
		const worker = makeWorker();
		(worker as any).ormService.fork = jest.fn<() => unknown>().mockReturnValue(orm);

		const result = await worker.start('root-1');

		expect((worker as any).ormService.fork).toHaveBeenCalledWith(true);
		expect(orm.Root.findOneOrFailByID).toHaveBeenCalledWith('root-1');
		expect(result.root).toBe(root);
		expect(result.orm).toBe(orm);
		expect(result.changes).toBeInstanceOf(Changes);
	});
});

// ─── finish ───────────────────────────────────────────────────────────────────

describe('ChangesWorker.finish', () => {
	afterEach(async () => {
		jest.restoreAllMocks();
	});

	it('orchestrates merge steps, sets changes.end, clears cache, and returns changes', async () => {
		jest.spyOn(MetaMerger.prototype, 'mergeMeta').mockResolvedValue(undefined as never);
		jest.spyOn(ChangesWorker as any, 'mergeDependendRemovals').mockResolvedValue(undefined);
		jest.spyOn(ChangesWorker as any, 'mergeRemovals').mockResolvedValue(undefined);

		const worker = makeWorker();
		const orm = makeOrm();
		const changes = new Changes();
		const root = { id: 'root-1' } as any;
		const before = Date.now();

		const result = await worker.finish(orm, changes, root);

		expect(result).toBe(changes);
		expect(result.end).toBeGreaterThanOrEqual(before);
		expect((worker as any).ormService.clearCache).toHaveBeenCalled();
		expect(MetaMerger.prototype.mergeMeta).toHaveBeenCalled();
		expect((ChangesWorker as any).mergeDependendRemovals).toHaveBeenCalledWith(orm, changes);
		expect((ChangesWorker as any).mergeRemovals).toHaveBeenCalledWith(orm, changes);
	});
});

// ─── cleanCacheFiles ─────────────────────────────────────────────────────────

describe('ChangesWorker.cleanCacheFiles', () => {
	it('clears image cache for removed and updated entities across all change sets', async () => {
		const worker = makeWorker();
		const changes = new Changes();
		changes.albums.removed.addID('album-1');
		changes.artists.updated.addID('artist-1');
		changes.artworks.removed.addID('artwork-1');
		changes.folders.updated.addID('folder-1');
		changes.roots.removed.addID('root-1');
		changes.series.updated.addID('series-1');
		changes.genres.removed.addID('genre-1');

		await (worker as any).cleanCacheFiles(changes);

		const clearImage = (worker as any).imageModule.clearImageCacheByIDs;
		expect(clearImage).toHaveBeenCalledTimes(1);
		const [imageIds] = clearImage.mock.calls[0] as [Array<string>];
		expect(imageIds).toEqual(expect.arrayContaining(['album-1', 'artist-1', 'artwork-1', 'folder-1', 'root-1', 'series-1', 'genre-1']));
	});

	it('clears audio cache only for removed and updated tracks', async () => {
		const worker = makeWorker();
		const changes = new Changes();
		changes.tracks.removed.addID('track-removed');
		changes.tracks.updated.addID('track-updated');
		changes.albums.removed.addID('album-1');

		await (worker as any).cleanCacheFiles(changes);

		const clearAudio = (worker as any).audioModule.clearCacheByIDs;
		expect(clearAudio).toHaveBeenCalledTimes(1);
		const [audioIds] = clearAudio.mock.calls[0] as [Array<string>];
		expect(audioIds).toEqual(expect.arrayContaining(['track-removed', 'track-updated']));
		expect(audioIds).not.toContain('album-1');
	});

	it('does not call clearImageCacheByIDs when no entity IDs are collected', async () => {
		const worker = makeWorker();
		await (worker as any).cleanCacheFiles(new Changes());
		expect((worker as any).imageModule.clearImageCacheByIDs).not.toHaveBeenCalled();
	});

	it('does not call clearCacheByIDs when no track IDs are collected', async () => {
		const worker = makeWorker();
		const changes = new Changes();
		changes.albums.removed.addID('album-1');

		await (worker as any).cleanCacheFiles(changes);

		expect((worker as any).audioModule.clearCacheByIDs).not.toHaveBeenCalled();
	});

	it('includes tracks in the image cache clear', async () => {
		const worker = makeWorker();
		const changes = new Changes();
		changes.tracks.removed.addID('track-1');
		changes.tracks.updated.addID('track-2');

		await (worker as any).cleanCacheFiles(changes);

		const [imageIds] = (worker as any).imageModule.clearImageCacheByIDs.mock.calls[0] as [Array<string>];
		expect(imageIds).toEqual(expect.arrayContaining(['track-1', 'track-2']));
	});
});

// ─── mergeRemovals ────────────────────────────────────────────────────────────

describe('ChangesWorker.mergeRemovals', () => {
	function makeRemovalsOrm() {
		const removeLaterByIDs = jest.fn<(ids: Array<string>) => Promise<void>>().mockResolvedValue(undefined);
		return {
			orm: {
				Track: { removeLaterByIDs },
				Artwork: { removeLaterByIDs },
				Folder: { removeLaterByIDs },
				Root: { removeLaterByIDs },
				Album: { removeLaterByIDs },
				Artist: { removeLaterByIDs },
				Series: { removeLaterByIDs },
				em: {
					hasChanges: jest.fn<() => boolean>().mockReturnValue(true),
					flush: jest.fn<() => Promise<void>>().mockResolvedValue(undefined)
				}
			} as any,
			removeLaterByIDs
		};
	}

	it('calls removeLaterByIDs for all seven entity types', async () => {
		const { orm, removeLaterByIDs } = makeRemovalsOrm();
		const changes = new Changes();
		changes.tracks.removed.addID('t1');
		changes.artworks.removed.addID('a1');
		changes.folders.removed.addID('f1');
		changes.roots.removed.addID('r1');
		changes.albums.removed.addID('al1');
		changes.artists.removed.addID('ar1');
		changes.series.removed.addID('s1');

		await (ChangesWorker as any).mergeRemovals(orm, changes);

		expect(removeLaterByIDs).toHaveBeenCalledTimes(7);
		expect(removeLaterByIDs).toHaveBeenCalledWith(['t1']);
		expect(removeLaterByIDs).toHaveBeenCalledWith(['a1']);
		expect(removeLaterByIDs).toHaveBeenCalledWith(['f1']);
		expect(removeLaterByIDs).toHaveBeenCalledWith(['r1']);
		expect(removeLaterByIDs).toHaveBeenCalledWith(['al1']);
		expect(removeLaterByIDs).toHaveBeenCalledWith(['ar1']);
		expect(removeLaterByIDs).toHaveBeenCalledWith(['s1']);
	});

	it('flushes when hasChanges is true', async () => {
		const { orm } = makeRemovalsOrm();
		await (ChangesWorker as any).mergeRemovals(orm, new Changes());
		expect(orm.em.flush).toHaveBeenCalled();
	});

	it('does not flush when hasChanges is false', async () => {
		const { orm } = makeRemovalsOrm();
		orm.em.hasChanges.mockReturnValue(false);
		await (ChangesWorker as any).mergeRemovals(orm, new Changes());
		expect(orm.em.flush).not.toHaveBeenCalled();
	});
});

// ─── mergeDependendRemovals ───────────────────────────────────────────────────

describe('ChangesWorker.mergeDependendRemovals', () => {
	it('removes bookmarks for removed tracks and includes their IDs in state cleanup', async () => {
		const orm = makeOrm({
			Bookmark: {
				findIDs: jest.fn<(options: unknown) => Promise<Array<string>>>().mockResolvedValue(['bm-1', 'bm-2']),
				removeLaterByIDs: jest.fn<(ids: Array<string>) => Promise<void>>().mockResolvedValue(undefined)
			},
			State: {
				findIDs: jest.fn<(options: unknown) => Promise<Array<string>>>().mockResolvedValue(['st-1']),
				removeLaterByIDs: jest.fn<(ids: Array<string>) => Promise<void>>().mockResolvedValue(undefined)
			},
			em: {
				hasChanges: jest.fn<() => boolean>().mockReturnValue(true),
				flush: jest.fn<() => Promise<void>>().mockResolvedValue(undefined)
			}
		});

		const changes = new Changes();
		changes.tracks.removed.addID('track-1');

		await (ChangesWorker as any).mergeDependendRemovals(orm, changes);

		expect(orm.Bookmark.findIDs).toHaveBeenCalledWith({ where: { track: ['track-1'] } });
		expect(orm.Bookmark.removeLaterByIDs).toHaveBeenCalledWith(['bm-1', 'bm-2']);
		// bookmark IDs must be included in the state destID lookup
		const stateCall = orm.State.findIDs.mock.calls[0][0] as { where: { destID: Array<string> } };
		expect(stateCall.where.destID).toEqual(expect.arrayContaining(['bm-1', 'bm-2']));
	});

	it('collects removed IDs from all entity types for state cleanup', async () => {
		const orm = makeOrm({
			State: {
				findIDs: jest.fn<(options: unknown) => Promise<Array<string>>>().mockResolvedValue([]),
				removeLaterByIDs: jest.fn<(ids: Array<string>) => Promise<void>>().mockResolvedValue(undefined)
			},
			em: {
				hasChanges: jest.fn<() => boolean>().mockReturnValue(true),
				flush: jest.fn<() => Promise<void>>().mockResolvedValue(undefined)
			}
		});

		const changes = new Changes();
		changes.tracks.removed.addID('track-1');
		changes.albums.removed.addID('album-1');
		changes.artists.removed.addID('artist-1');
		changes.folders.removed.addID('folder-1');
		changes.genres.removed.addID('genre-1');
		changes.roots.removed.addID('root-1');
		changes.series.removed.addID('series-1');

		await (ChangesWorker as any).mergeDependendRemovals(orm, changes);

		const stateCall = orm.State.findIDs.mock.calls[0][0] as { where: { destID: Array<string> } };
		expect(stateCall.where.destID).toEqual(expect.arrayContaining([
			'track-1', 'album-1', 'artist-1', 'folder-1', 'genre-1', 'root-1', 'series-1'
		]));
	});

	it('removes found state IDs', async () => {
		const orm = makeOrm({
			State: {
				findIDs: jest.fn<(options: unknown) => Promise<Array<string>>>().mockResolvedValue(['state-1', 'state-2']),
				removeLaterByIDs: jest.fn<(ids: Array<string>) => Promise<void>>().mockResolvedValue(undefined)
			},
			em: {
				hasChanges: jest.fn<() => boolean>().mockReturnValue(true),
				flush: jest.fn<() => Promise<void>>().mockResolvedValue(undefined)
			}
		});
		const changes = new Changes();
		changes.tracks.removed.addID('track-1');

		await (ChangesWorker as any).mergeDependendRemovals(orm, changes);

		expect(orm.State.removeLaterByIDs).toHaveBeenCalledWith(['state-1', 'state-2']);
	});

	it('does not flush when hasChanges is false', async () => {
		const orm = makeOrm();
		const changes = new Changes();
		changes.tracks.removed.addID('track-1');

		await (ChangesWorker as any).mergeDependendRemovals(orm, changes);

		expect(orm.em.flush).not.toHaveBeenCalled();
	});

	it('marks playlist entries for removal and collects their playlist IDs', async () => {
		const removedEntry1 = makeEmptyEntry('pl-1');
		const removedEntry2 = makeEmptyEntry('pl-2');
		const playlist1 = {
			name: 'Playlist 1', duration: 0,
			entries: { getItems: jest.fn<() => Promise<Array<any>>>().mockResolvedValue([]) }
		};
		const playlist2 = {
			name: 'Playlist 2', duration: 0,
			entries: { getItems: jest.fn<() => Promise<Array<any>>>().mockResolvedValue([]) }
		};

		const removeLater = jest.fn<(entity: unknown) => void>();
		const findByIDsPlaylist = jest.fn<(ids: Array<string>) => Promise<Array<any>>>().mockResolvedValue([playlist1, playlist2]);
		const orm = makeOrm({
			PlaylistEntry: {
				findIDs: jest.fn<() => Promise<Array<string>>>().mockResolvedValue(['pe-1', 'pe-2']),
				findByIDs: jest.fn<() => Promise<Array<any>>>().mockResolvedValue([removedEntry1, removedEntry2]),
				removeLater
			},
			Playlist: { findByIDs: findByIDsPlaylist, persistLater: jest.fn<() => void>() },
			em: {
				hasChanges: jest.fn<() => boolean>().mockReturnValue(true),
				flush: jest.fn<() => Promise<void>>().mockResolvedValue(undefined)
			}
		});

		const changes = new Changes();
		changes.tracks.removed.addID('track-1');

		await (ChangesWorker as any).mergeDependendRemovals(orm, changes);

		expect(removeLater).toHaveBeenCalledTimes(2);
		expect(findByIDsPlaylist).toHaveBeenCalledWith(expect.arrayContaining(['pl-1', 'pl-2']));
	});

	it('deduplicates playlist IDs when multiple entries reference the same playlist', async () => {
		const removedEntries = [makeEmptyEntry('pl-x'), makeEmptyEntry('pl-x'), makeEmptyEntry('pl-x')];
		const findByIDsPlaylist = jest.fn<(ids: Array<string>) => Promise<Array<any>>>().mockResolvedValue([{
			name: 'X', duration: 0,
			entries: { getItems: jest.fn<() => Promise<Array<any>>>().mockResolvedValue([]) }
		}]);
		const orm = makeOrm({
			PlaylistEntry: {
				findIDs: jest.fn<() => Promise<Array<string>>>().mockResolvedValue(['pe-1', 'pe-2', 'pe-3']),
				findByIDs: jest.fn<() => Promise<Array<any>>>().mockResolvedValue(removedEntries),
				removeLater: jest.fn<() => void>()
			},
			Playlist: { findByIDs: findByIDsPlaylist, persistLater: jest.fn<() => void>() },
			em: {
				hasChanges: jest.fn<() => boolean>().mockReturnValue(true),
				flush: jest.fn<() => Promise<void>>().mockResolvedValue(undefined)
			}
		});

		const changes = new Changes();
		changes.tracks.removed.addID('track-1');

		await (ChangesWorker as any).mergeDependendRemovals(orm, changes);

		expect(findByIDsPlaylist).toHaveBeenCalledWith(['pl-x']);
	});

	it('skips playlist update when no playlist entries are removed', async () => {
		const findByIDsPlaylist = jest.fn<() => Promise<Array<any>>>();
		const orm = makeOrm({
			Playlist: { findByIDs: findByIDsPlaylist, persistLater: jest.fn<() => void>() }
		});

		const changes = new Changes();
		changes.tracks.removed.addID('track-1');

		await (ChangesWorker as any).mergeDependendRemovals(orm, changes);

		expect(findByIDsPlaylist).not.toHaveBeenCalled();
	});

	it('updates playlist duration after entries are removed and flushed', async () => {
		const remainingEntry = makeTrackEntry(180);
		const removedEntry = makeEmptyEntry('pl-1');
		const playlist = {
			name: 'Test Playlist',
			duration: 500,
			entries: { getItems: jest.fn<() => Promise<Array<any>>>().mockResolvedValue([remainingEntry]) }
		};

		const persistLater = jest.fn<(entity: unknown) => void>();
		const flushCalls: Array<number> = [];
		const orm = makeOrm({
			PlaylistEntry: {
				findIDs: jest.fn<() => Promise<Array<string>>>().mockResolvedValue(['pe-1']),
				findByIDs: jest.fn<() => Promise<Array<any>>>().mockResolvedValue([removedEntry]),
				removeLater: jest.fn<() => void>()
			},
			Playlist: { findByIDs: jest.fn<() => Promise<Array<any>>>().mockResolvedValue([playlist]), persistLater },
			em: {
				hasChanges: jest.fn<() => boolean>().mockReturnValue(true),
				flush: jest.fn<() => Promise<void>>().mockImplementation(async () => {
					flushCalls.push(1);
				})
			}
		});

		const changes = new Changes();
		changes.tracks.removed.addID('track-1');

		await (ChangesWorker as any).mergeDependendRemovals(orm, changes);

		expect(playlist.duration).toBe(180);
		expect(persistLater).toHaveBeenCalledWith(playlist);
		expect(flushCalls).toHaveLength(2);
	});
});

// ─── updateAffectedPlaylists ──────────────────────────────────────────────────

describe('ChangesWorker.updateAffectedPlaylists', () => {
	it('does nothing when affectedPlaylistIDs is empty', async () => {
		const orm = makeOrm();

		await (ChangesWorker as any).updateAffectedPlaylists(orm, []);

		expect(orm.Playlist.findByIDs).not.toHaveBeenCalled();
		expect(orm.em.flush).not.toHaveBeenCalled();
	});

	it('sets duration to 0 for a playlist with no remaining entries', async () => {
		const playlist = {
			name: 'Empty Playlist',
			duration: 300,
			entries: { getItems: jest.fn<() => Promise<Array<any>>>().mockResolvedValue([]) }
		};
		const orm = makeOrm({
			Playlist: {
				findByIDs: jest.fn<() => Promise<Array<any>>>().mockResolvedValue([playlist]),
				persistLater: jest.fn<() => void>()
			},
			em: {
				hasChanges: jest.fn<() => boolean>().mockReturnValue(true),
				flush: jest.fn<() => Promise<void>>().mockResolvedValue(undefined)
			}
		});

		await (ChangesWorker as any).updateAffectedPlaylists(orm, ['pl-1']);

		expect(playlist.duration).toBe(0);
		expect(orm.Playlist.persistLater).toHaveBeenCalledWith(playlist);
		expect(orm.em.flush).toHaveBeenCalled();
	});

	it('sums mediaDuration from remaining track entries', async () => {
		const entries = [makeTrackEntry(120), makeTrackEntry(90), makeTrackEntry(60)];
		const playlist = {
			name: 'Track Playlist',
			duration: 0,
			entries: { getItems: jest.fn<() => Promise<Array<any>>>().mockResolvedValue(entries) }
		};
		const orm = makeOrm({
			Playlist: {
				findByIDs: jest.fn<() => Promise<Array<any>>>().mockResolvedValue([playlist]),
				persistLater: jest.fn<() => void>()
			},
			em: {
				hasChanges: jest.fn<() => boolean>().mockReturnValue(true),
				flush: jest.fn<() => Promise<void>>().mockResolvedValue(undefined)
			}
		});

		await (ChangesWorker as any).updateAffectedPlaylists(orm, ['pl-1']);

		expect(playlist.duration).toBe(270);
	});

	it('sums mediaDuration from remaining episode entries', async () => {
		const entries = [makeEpisodeEntry(300), makeEpisodeEntry(200)];
		const playlist = {
			name: 'Episode Playlist',
			duration: 0,
			entries: { getItems: jest.fn<() => Promise<Array<any>>>().mockResolvedValue(entries) }
		};
		const orm = makeOrm({
			Playlist: {
				findByIDs: jest.fn<() => Promise<Array<any>>>().mockResolvedValue([playlist]),
				persistLater: jest.fn<() => void>()
			},
			em: {
				hasChanges: jest.fn<() => boolean>().mockReturnValue(true),
				flush: jest.fn<() => Promise<void>>().mockResolvedValue(undefined)
			}
		});

		await (ChangesWorker as any).updateAffectedPlaylists(orm, ['pl-1']);

		expect(playlist.duration).toBe(500);
	});

	it('handles mixed track and episode entries', async () => {
		const entries = [makeTrackEntry(100), makeEpisodeEntry(50)];
		const playlist = {
			name: 'Mixed Playlist',
			duration: 0,
			entries: { getItems: jest.fn<() => Promise<Array<any>>>().mockResolvedValue(entries) }
		};
		const orm = makeOrm({
			Playlist: {
				findByIDs: jest.fn<() => Promise<Array<any>>>().mockResolvedValue([playlist]),
				persistLater: jest.fn<() => void>()
			},
			em: {
				hasChanges: jest.fn<() => boolean>().mockReturnValue(true),
				flush: jest.fn<() => Promise<void>>().mockResolvedValue(undefined)
			}
		});

		await (ChangesWorker as any).updateAffectedPlaylists(orm, ['pl-1']);

		expect(playlist.duration).toBe(150);
	});

	it('treats undefined tag as zero duration', async () => {
		const entryWithNoTag = {
			track: {
				get: jest.fn<() => Promise<any>>().mockResolvedValue({
					tag: { get: jest.fn<() => Promise<any>>().mockResolvedValue(undefined) }
				})
			},
			episode: { get: jest.fn<() => Promise<any>>().mockResolvedValue(undefined) }
		};
		const playlist = {
			name: 'No Tag Playlist',
			duration: 999,
			entries: { getItems: jest.fn<() => Promise<Array<any>>>().mockResolvedValue([entryWithNoTag]) }
		};
		const orm = makeOrm({
			Playlist: {
				findByIDs: jest.fn<() => Promise<Array<any>>>().mockResolvedValue([playlist]),
				persistLater: jest.fn<() => void>()
			},
			em: {
				hasChanges: jest.fn<() => boolean>().mockReturnValue(true),
				flush: jest.fn<() => Promise<void>>().mockResolvedValue(undefined)
			}
		});

		await (ChangesWorker as any).updateAffectedPlaylists(orm, ['pl-1']);

		expect(playlist.duration).toBe(0);
	});

	it('updates multiple playlists independently', async () => {
		const playlist1 = {
			name: 'Playlist 1', duration: 0,
			entries: { getItems: jest.fn<() => Promise<Array<any>>>().mockResolvedValue([makeTrackEntry(100)]) }
		};
		const playlist2 = {
			name: 'Playlist 2', duration: 0,
			entries: { getItems: jest.fn<() => Promise<Array<any>>>().mockResolvedValue([makeTrackEntry(200), makeTrackEntry(300)]) }
		};
		const orm = makeOrm({
			Playlist: {
				findByIDs: jest.fn<() => Promise<Array<any>>>().mockResolvedValue([playlist1, playlist2]),
				persistLater: jest.fn<() => void>()
			},
			em: {
				hasChanges: jest.fn<() => boolean>().mockReturnValue(true),
				flush: jest.fn<() => Promise<void>>().mockResolvedValue(undefined)
			}
		});

		await (ChangesWorker as any).updateAffectedPlaylists(orm, ['pl-1', 'pl-2']);

		expect(playlist1.duration).toBe(100);
		expect(playlist2.duration).toBe(500);
	});

	it('does not flush when hasChanges returns false', async () => {
		const playlist = {
			name: 'Unchanged Playlist', duration: 0,
			entries: { getItems: jest.fn<() => Promise<Array<any>>>().mockResolvedValue([]) }
		};
		const orm = makeOrm({
			Playlist: {
				findByIDs: jest.fn<() => Promise<Array<any>>>().mockResolvedValue([playlist]),
				persistLater: jest.fn<() => void>()
			},
			em: {
				hasChanges: jest.fn<() => boolean>().mockReturnValue(false),
				flush: jest.fn<() => Promise<void>>().mockResolvedValue(undefined)
			}
		});

		await (ChangesWorker as any).updateAffectedPlaylists(orm, ['pl-1']);

		expect(orm.em.flush).not.toHaveBeenCalled();
	});
});
