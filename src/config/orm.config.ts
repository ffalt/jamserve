import {Album} from '../entity/album/album';
import {Artist} from '../entity/artist/artist';
import {Artwork} from '../entity/artwork/artwork';
import {Bookmark} from '../entity/bookmark/bookmark';
import {Episode} from '../entity/episode/episode';
import {Folder} from '../entity/folder/folder';
import {Root} from '../entity/root/root';
import {MetaData} from '../entity/metadata/metadata';
import {Playlist} from '../entity/playlist/playlist';
import {PlaylistEntry} from '../entity/playlistentry/playlist-entry';
import {Podcast} from '../entity/podcast/podcast';
import {Radio} from '../entity/radio/radio';
import {Series} from '../entity/series/series';
import {Session} from '../entity/session/session';
import {State} from '../entity/state/state';
import {Tag} from '../entity/tag/tag';
import {Track} from '../entity/track/track';
import {User} from '../entity/user/user';
import {Base} from '../entity/base/base';
import {PlayQueue} from '../entity/playqueue/playqueue';
import {PlayQueueEntry} from '../entity/playqueueentry/playqueue-entry';
import {Settings} from '../entity/settings/settings';
import {EntityCaseNamingStrategy} from 'mikro-orm';

const entities = [
	Base,
	Album,
	Artist,
	Artwork,
	Bookmark,
	Episode,
	Folder,
	Root,
	MetaData,
	Playlist,
	PlaylistEntry,
	PlayQueue,
	PlayQueueEntry,
	Podcast,
	Radio,
	Series,
	Session,
	Settings,
	State,
	Tag,
	Track,
	User
];

const empty = entities.findIndex(e => e === undefined);
if (empty >= 0) {
	console.error(entities);
	throw new Error('Entity missing, probably because of a circular reference');
}

const options = {
	entities,
	namingStrategy: EntityCaseNamingStrategy,
	dbName: './data/jam.sqlite',
	type: 'sqlite',
	debug: false
};

export default options;
