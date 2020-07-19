import {MikroORM} from 'mikro-orm';
import options from '../../../config/orm.config';
import {Album} from '../../../entity/album/album';
import {State} from '../../../entity/state/state';
import {Artist} from '../../../entity/artist/artist';
import {Artwork} from '../../../entity/artwork/artwork';
import {Bookmark} from '../../../entity/bookmark/bookmark';
import {Episode} from '../../../entity/episode/episode';
import {Folder} from '../../../entity/folder/folder';
import {Root} from '../../../entity/root/root';
import {PlayQueue} from '../../../entity/playqueue/playqueue';
import {Playlist} from '../../../entity/playlist/playlist';
import {Podcast} from '../../../entity/podcast/podcast';
import {Series} from '../../../entity/series/series';
import {Radio} from '../../../entity/radio/radio';
import {Session} from '../../../entity/session/session';
import {Settings} from '../../../entity/settings/settings';
import {Track} from '../../../entity/track/track';
import {User} from '../../../entity/user/user';
import {Tag} from '../../../entity/tag/tag';
import {Singleton} from 'typescript-ioc';
import {MetaData} from '../../../entity/metadata/metadata';
import {PlaylistEntry} from '../../../entity/playlistentry/playlist-entry';
import {PlayQueueEntry} from '../../../entity/playqueueentry/playqueue-entry';
import {Base} from '../../../entity/base/base';
import {DBObjectType} from '../../../types/enums';
import {BaseRepository} from '../../../entity/base/base.repository';
import {AlbumRepository} from '../../../entity/album/album.repository';
import {UserRepository} from '../../../entity/user/user.repository';
import {TrackRepository} from '../../../entity/track/track.repository';
import {TagRepository} from '../../../entity/tag/tag.repository';
import {SessionRepository} from '../../../entity/session/session.repository';
import {SeriesRepository} from '../../../entity/series/series.repository';
import {RadioRepository} from '../../../entity/radio/radio.repository';
import {PlaylistEntryRepository} from '../../../entity/playlistentry/playlist-entry.repository';
import {PlaylistRepository} from '../../../entity/playlist/playlist.repository';
import {RootRepository} from '../../../entity/root/root.repository';
import {FolderRepository} from '../../../entity/folder/folder.repository';
import {EpisodeRepository} from '../../../entity/episode/episode.repository';
import {BookmarkRepository} from '../../../entity/bookmark/bookmark.repository';
import {ArtworkRepository} from '../../../entity/artwork/artwork.repository';
import {ArtistRepository} from '../../../entity/artist/artist.repository';
import {StateRepository} from '../../../entity/state/state.repository';
import {MetaDataRepository} from '../../../entity/metadata/metadata.repository';
import {PlayQueueRepository} from '../../../entity/playqueue/playqueue.repository';
import {PlayQueueEntryRepository} from '../../../entity/playqueueentry/playqueue-entry.repository';
import {PodcastRepository} from '../../../entity/podcast/podcast.repository';
import {SettingsRepository} from '../../../entity/settings/settings.repository';
import path from 'path';

@Singleton
export class OrmService {
	public orm!: MikroORM;

	public Album!: AlbumRepository;
	public Artist!: ArtistRepository;
	public Artwork!: ArtworkRepository;
	public Bookmark!: BookmarkRepository;
	public Episode!: EpisodeRepository;
	public Folder!: FolderRepository;
	public Playlist!: PlaylistRepository;
	public Podcast!: PodcastRepository;
	public Series!: SeriesRepository;
	public Session!: SessionRepository;
	public Radio!: RadioRepository;
	public Track!: TrackRepository;
	public User!: UserRepository;
	public Tag!: TagRepository;
	public State!: StateRepository;
	public Root!: RootRepository;
	public PlaylistEntry!: PlaylistEntryRepository;
	public PlayQueue!: PlayQueueRepository;
	public PlayQueueEntry!: PlayQueueEntryRepository;
	public Settings!: SettingsRepository;
	public MetaData!: MetaDataRepository;

	async start(dataPath: string): Promise<void> {
		this.orm = await MikroORM.init({
			...options,
			dbName: path.resolve(dataPath, 'jam.sqlite'),
		});
		this.State = new StateRepository(this.orm.em, State);
		this.Album = new AlbumRepository(this.orm.em, Album);
		this.Artist = new ArtistRepository(this.orm.em, Artist);
		this.Artwork = new ArtworkRepository(this.orm.em, Artwork);
		this.Bookmark = new BookmarkRepository(this.orm.em, Bookmark);
		this.Episode = new EpisodeRepository(this.orm.em, Episode);
		this.Folder = new FolderRepository(this.orm.em, Folder);
		this.Root = new RootRepository(this.orm.em, Root);
		this.MetaData = new MetaDataRepository(this.orm.em, MetaData);
		this.PlayQueue = new PlayQueueRepository(this.orm.em, PlayQueue);
		this.PlayQueueEntry = new PlayQueueEntryRepository(this.orm.em, PlayQueueEntry);
		this.Playlist = new PlaylistRepository(this.orm.em, Playlist);
		this.PlaylistEntry = new PlaylistEntryRepository(this.orm.em, PlaylistEntry);
		this.Podcast = new PodcastRepository(this.orm.em, Podcast);
		this.Radio = new RadioRepository(this.orm.em, Radio);
		this.Series = new SeriesRepository(this.orm.em, Series);
		this.Session = new SessionRepository(this.orm.em, Session);
		this.Settings = new SettingsRepository(this.orm.em, Settings);
		this.Tag = new TagRepository(this.orm.em, Tag);
		this.Track = new TrackRepository(this.orm.em, Track);
		this.User = new UserRepository(this.orm.em, User);

		const generator = this.orm.getSchemaGenerator();
		// await generator.dropSchema();
		await generator.ensureDatabase();
		await generator.updateSchema();
	}

	public async stop() {
		await this.orm.close();
	}

	public async findInStreamTypes(id: string): Promise<{ obj: Base; objType: DBObjectType } | undefined> {
		const repos: Array<BaseRepository<any, any, any>> = [
			this.Track,
			this.Episode
		];
		for (const repo of repos) {
			const obj = await repo.findOne({id});
			if (obj) {
				return {obj: obj as any, objType: repo.objType};
			}
		}
	}

}
