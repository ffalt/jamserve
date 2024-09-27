import {SubsonicAnnotationApi} from './api.annotation.js';
import {SubsonicBookmarkApi} from './api.bookmarks.js';
import {SubsonicBrowsingApi} from './api.browsing.js';
import {SubsonicChatApi} from './api.chat.js';
import {SubsonicInternetRadioApi} from './api.internetradio.js';
import {SubsonicLibraryApi} from './api.library.js';
import {SubsonicListsApi} from './api.lists.js';
import {SubsonicMediaRetrievalApi} from './api.mediaretrieval.js';
import {SubsonicPlaylistsApi} from './api.playlists.js';
import {SubsonicPodcastApi} from './api.podcast.js';
import {SubsonicSearchApi} from './api.search.js';
import {SubsonicSharingApi} from './api.sharing.js';
import {SubsonicSystemApi} from './api.system.js';
import {SubsonicUserApi} from './api.user.js';
import {SubsonicApiBase} from './api.base.js';


/**
 * api functions
 * http://www.subsonic.org/pages/api.jsp
 */
export class SubsonicApi extends SubsonicApiBase {
	searching = new SubsonicSearchApi();
	chat = new SubsonicChatApi();
	user = new SubsonicUserApi();
	bookmarks = new SubsonicBookmarkApi();
	playlists = new SubsonicPlaylistsApi();
	podcast = new SubsonicPodcastApi();
	internetradio = new SubsonicInternetRadioApi();
	sharing = new SubsonicSharingApi();
	browsing = new SubsonicBrowsingApi();
	system = new SubsonicSystemApi();
	mediaretrieval = new SubsonicMediaRetrievalApi();
	annotation = new SubsonicAnnotationApi();
	lists = new SubsonicListsApi();
	library = new SubsonicLibraryApi();
}
