import {ArtworkWorker} from '../worker/tasks/artwork.js';
import {FolderWorker} from '../worker/tasks/folder.js';
import {RootWorker} from '../worker/tasks/root.js';
import {TrackWorker} from '../worker/tasks/track.js';
import {SettingsService} from '../../../entity/settings/settings.service.js';
import {AudioModule} from '../../audio/audio.module.js';
import {ImageModule} from '../../image/image.module.js';
import {Inject, InRequestScope} from 'typescript-ioc';
import {WorkerCommandsFolder} from './worker/worker.commands.folder.js';
import {WorkerCommandsArtwork} from './worker/worker.commands.artwork.js';
import {WorkerCommandsRoot} from './worker/worker.commands.root.js';
import {WorkerCommandsTrack} from './worker/worker.commands.track.js';
import {ChangesWorker} from '../worker/changes-worker.js';

@InRequestScope
export class WorkerService {
	@Inject
	public artworkWorker!: ArtworkWorker;
	@Inject
	public trackWorker!: TrackWorker;
	@Inject
	public folderWorker!: FolderWorker;
	@Inject
	public rootWorker!: RootWorker;
	@Inject
	public changes!: ChangesWorker;
	@Inject
	private audioModule!: AudioModule;
	@Inject
	private imageModule!: ImageModule;
	@Inject
	private settingsService!: SettingsService;
	public folder = new WorkerCommandsFolder(this);
	public artwork = new WorkerCommandsArtwork(this);
	public root = new WorkerCommandsRoot(this);
	public track = new WorkerCommandsTrack(this);
}
