import { ArtworkWorker } from '../worker/tasks/artwork.js';
import { FolderWorker } from '../worker/tasks/folder.js';
import { RootWorker } from '../worker/tasks/root.js';
import { TrackWorker } from '../worker/tasks/track.js';
import { Inject, InRequestScope } from 'typescript-ioc';
import { WorkerCommandsFolder } from './worker/worker.commands.folder.js';
import { WorkerCommandsArtwork } from './worker/worker.commands.artwork.js';
import { WorkerCommandsRoot } from './worker/worker.commands.root.js';
import { WorkerCommandsTrack } from './worker/worker.commands.track.js';
import { ChangesWorker } from '../worker/changes-worker.js';

@InRequestScope
export class WorkerService {
	@Inject
	public readonly artworkWorker!: ArtworkWorker;

	@Inject
	public readonly trackWorker!: TrackWorker;

	@Inject
	public readonly folderWorker!: FolderWorker;

	@Inject
	public readonly rootWorker!: RootWorker;

	@Inject
	public readonly changes!: ChangesWorker;

	public readonly folder = new WorkerCommandsFolder(this);
	public readonly artwork = new WorkerCommandsArtwork(this);
	public readonly root = new WorkerCommandsRoot(this);
	public readonly track = new WorkerCommandsTrack(this);
}
