import {DBObjectType} from '../../db/db.types';
import {Album} from '../../engine/album/album.model';
import {Episode} from '../../engine/episode/episode.model';
import {Folder} from '../../engine/folder/folder.model';
import {Track} from '../../engine/track/track.model';
import {SearchQueryTrack} from '../../engine/track/track.store';
import {FolderType, FolderTypesAlbum} from '../../model/jam-types';
import {Subsonic} from '../../model/subsonic-rest-data';
import {SubsonicParameters} from '../../model/subsonic-rest-params';
import {ApiBinaryResult} from '../../typings';
import {logger} from '../../utils/logger';
import {paginate} from '../../utils/paginate';
import {randomItems} from '../../utils/random';
import {SubsonicAnnotationApi} from './api/api.annotation';
import {SubsonicBookmarkApi} from './api/api.bookmarks';
import {SubsonicBrowsingApi} from './api/api.browsing';
import {SubsonicChatApi} from './api/api.chat';
import {SubsonicInternetRadioApi} from './api/api.internetradio';
import {SubsonicLibraryApi} from './api/api.library';
import {SubsonicListsApi} from './api/api.lists';
import {SubsonicMediaRetrievalApi} from './api/api.mediaretrieval';
import {SubsonicPlaylistsApi} from './api/api.playlists';
import {SubsonicPodcastApi} from './api/api.podcast';
import {SubsonicSearchApi} from './api/api.search';
import {SubsonicSharingApi} from './api/api.sharing';
import {SubsonicSystemApi} from './api/api.system';
import {SubsonicUserApi} from './api/api.user';
import {ApiOptions, SubsonicApiBase} from './base';
import {FORMAT} from './format';

/**
 * api functions
 * http://www.subsonic.org/pages/api.jsp
 */
export class SubsonicApi extends SubsonicApiBase {
	searching = new SubsonicSearchApi(this.engine);
	chat = new SubsonicChatApi(this.engine);
	user = new SubsonicUserApi(this.engine);
	bookmarks = new SubsonicBookmarkApi(this.engine);
	playlists = new SubsonicPlaylistsApi(this.engine);
	podcast = new SubsonicPodcastApi(this.engine);
	internetradio = new SubsonicInternetRadioApi(this.engine);
	sharing = new SubsonicSharingApi(this.engine);
	browsing = new SubsonicBrowsingApi(this.engine);
	system = new SubsonicSystemApi(this.engine);
	mediaretrieval = new SubsonicMediaRetrievalApi(this.engine);
	annotation = new SubsonicAnnotationApi(this.engine);
	lists = new SubsonicListsApi(this.engine);
	library = new SubsonicLibraryApi(this.engine);

}
