import {ArtworkWorker} from '../worker/tasks/artwork';
import {FolderWorker} from '../worker/tasks/folder';
import {RootWorker} from '../worker/tasks/root';
import {TrackWorker} from '../worker/tasks/track';
import {SettingsService} from '../../../entity/settings/settings.service';
import {AudioModule} from '../../audio/audio.module';
import {ImageModule} from '../../image/image.module';
import {Inject, InRequestScope} from 'typescript-ioc';
import {WorkerCommandsFolder} from './worker/worker.commands.folder';
import {WorkerCommandsArtwork} from './worker/worker.commands.artwork';
import {WorkerCommandsRoot} from './worker/worker.commands.root';
import {WorkerCommandsTrack} from './worker/worker.commands.track';
import {ChangesWorker} from '../worker/changes-worker';

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
