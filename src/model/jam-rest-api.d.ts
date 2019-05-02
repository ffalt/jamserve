import {Jam} from './jam-rest-data';
import {JamParameters} from './jam-rest-params';

export interface JamApiErrorUnauthorized {
	error: 401;
	text: 'unauthorized';
}

export interface JamApiErrorGeneric {
	error: 500;
	text: 'internal server error';
}

export interface JamApiErrorParameters {
	error: 400;
	text: 'parameter is missing or invalid';
}

export interface JamApiErrorNotFound {
	error: 404;
	text: 'requested object not found';
}

export type JamApiImageTypes = ['image/jpeg', 'image/png'];
export type JamApiDownloadTypes = ['application/zip', 'application/tar'];
export type JamApiStreamTypes = ['audio/mpeg', 'audio/flac', 'audio/mp4', 'audio/ogg', 'audio/x-flv'];
export type JamApiDefaultStreamTypes = ['audio/mpeg'];
export type JamApiWaveformTypes = ['image/svg+xml', 'application/json', 'application/binary'];
export type JamApiDefaultDownloadTypes = ['application/zip'];

export interface JamApi {

	GET: {
		/**
		 * various: is the api online?
		 */
		'ping'?: {
			result: Jam.Ping;
			public: true;
		};
		/**
		 * auth: check the login state
		 */
		'session'?: {
			result: Jam.Session;
			public: true;
		};

		/**
		 * metadata: lookup lastfm data
		 */
		'lastfm/lookup'?: {
			operationId: 'metadata.lastfmLookup'
			params: JamParameters.LastFMLookup;
			result: Jam.LastFMResponse;
			errors: JamApiErrorUnauthorized | JamApiErrorGeneric | JamApiErrorParameters;
		};
		/**
		 * metadata: lookup acoustid data
		 */
		'acoustid/lookup'?: {
			operationId: 'metadata.acoustidLookup'
			params: JamParameters.AcoustidLookup;
			result: Array<Jam.AcoustidResponse>;
			errors: JamApiErrorUnauthorized | JamApiErrorGeneric | JamApiErrorParameters;
		};
		/**
		 * metadata: lookup musicbrainz data
		 */
		'musicbrainz/lookup'?: {
			operationId: 'metadata.musicbrainzLookup'
			params: JamParameters.MusicBrainzLookup;
			result: Jam.MusicBrainzResponse;
			errors: JamApiErrorUnauthorized | JamApiErrorGeneric | JamApiErrorParameters;
		};
		/**
		 * metadata: search musicbrainz data
		 */
		'musicbrainz/search'?: {
			operationId: 'metadata.musicbrainzSearch'
			params: JamParameters.MusicBrainzSearch;
			result: Jam.MusicBrainzResponse;
			errors: JamApiErrorUnauthorized | JamApiErrorGeneric | JamApiErrorParameters;
		};
		/**
		 * metadata: search chartlyrics data
		 */
		'chartlyrics/search'?: {
			operationId: 'metadata.chartlyricsSearch'
			params: JamParameters.ChartlyricsSearch;
			result: Jam.ChartLyricsResponse;
			errors: JamApiErrorUnauthorized | JamApiErrorGeneric | JamApiErrorParameters;
		};
		/**
		 * metadata: lookup acousticbrainz data
		 */
		'acousticbrainz/lookup'?: {
			operationId: 'metadata.acousticbrainzLookup'
			params: JamParameters.AcousticBrainzLookup;
			result: Jam.AcousticBrainzResponse;
			errors: JamApiErrorUnauthorized | JamApiErrorGeneric | JamApiErrorParameters;
		};
		/**
		 * metadata: lookup coverartarchive data
		 */
		'coverartarchive/lookup'?: {
			operationId: 'metadata.coverartarchiveLookup'
			params: JamParameters.CoverArtArchiveLookup;
			result: Jam.CoverArtArchiveResponse;
			errors: JamApiErrorUnauthorized | JamApiErrorGeneric | JamApiErrorParameters;
		};
		/**
		 * metadata: wikipedia summary
		 */
		'wikipedia/summary'?: {
			operationId: 'metadata.wikipediaSummary'
			params: JamParameters.WikipediaSummary;
			result: Jam.WikipediaResponse;
			errors: JamApiErrorUnauthorized | JamApiErrorGeneric | JamApiErrorParameters;
		};
		/**
		 * metadata: wikipedia summary
		 */
		'wikidata/summary'?: {
			operationId: 'metadata.wikidataSummary'
			params: JamParameters.WikidataSummary;
			result: Jam.WikipediaResponse;
			errors: JamApiErrorUnauthorized | JamApiErrorGeneric | JamApiErrorParameters;
		};

		/**
		 * various: autocomplete
		 */
		'autocomplete'?: {
			operationId: 'autocomplete.autocomplete'
			params: JamParameters.AutoComplete;
			result: Jam.AutoComplete;
			errors: JamApiErrorUnauthorized | JamApiErrorGeneric | JamApiErrorParameters | JamApiErrorNotFound;
		};
		/**
		 * various: get list of genres found in the library
		 */
		'genre/list'?: {
			params: JamParameters.Genres;
			result: Array<Jam.Genre>;
			errors: JamApiErrorUnauthorized | JamApiErrorGeneric | JamApiErrorParameters;
		};
		/**
		 * various: get count stats for folders/tracks/albums/...
		 */
		'stats'?: {
			operationId: 'stats.get'
			params: JamParameters.Stats;
			result: Jam.Stats;
			errors: JamApiErrorUnauthorized | JamApiErrorGeneric | JamApiErrorParameters;
		};
		/**
		 * various: get list of tracks played by all users
		 */
		'nowPlaying/list'?: {
			result: Array<Jam.NowPlaying>;
			errors: JamApiErrorUnauthorized | JamApiErrorGeneric;
		};

		/**
		 * chat: get chat messages
		 */
		'chat/list'?: {
			params: JamParameters.Chat;
			result: Array<Jam.ChatMessage>;
			errors: JamApiErrorUnauthorized | JamApiErrorGeneric | JamApiErrorParameters;
		};

		/**
		 * folder: get the navigation index for folders
		 */
		'folder/index'?: {
			params: JamParameters.FolderIndex;
			result: Jam.FolderIndex;
			errors: JamApiErrorUnauthorized | JamApiErrorGeneric | JamApiErrorParameters;
		};
		/**
		 * folder: get a folder by id
		 */
		'folder/id'?: {
			params: JamParameters.Folder;
			result: Jam.Folder;
			errors: JamApiErrorUnauthorized | JamApiErrorGeneric | JamApiErrorParameters | JamApiErrorNotFound;
		};
		/**
		 * folder: get folders by ids
		 */
		'folder/ids'?: {
			params: JamParameters.Folders;
			result: Array<Jam.Folder>;
			errors: JamApiErrorUnauthorized | JamApiErrorGeneric | JamApiErrorParameters;
		};
		/**
		 * folder: get tracks and subfolders of a folder by id
		 */
		'folder/children'?: {
			params: JamParameters.FolderChildren;
			result: Jam.FolderChildren;
			errors: JamApiErrorUnauthorized | JamApiErrorGeneric | JamApiErrorParameters | JamApiErrorNotFound;
		};
		/**
		 * folder: get tracks of a folder by id
		 */
		'folder/tracks'?: {
			params: JamParameters.FolderTracks;
			result: Array<Jam.Track>;
			errors: JamApiErrorUnauthorized | JamApiErrorGeneric | JamApiErrorParameters | JamApiErrorNotFound;
		};
		/**
		 * folder: get sub folders of a folder by id
		 */
		'folder/subfolders'?: {
			params: JamParameters.FolderSubFolders;
			result: Array<Jam.Folder>;
			errors: JamApiErrorUnauthorized | JamApiErrorGeneric | JamApiErrorParameters | JamApiErrorNotFound;
		};
		/**
		 * folder: get similar artist folders of a folder by id
		 */
		'folder/artist/similar'?: {
			params: JamParameters.Folder;
			result: Array<Jam.Folder>;
			errors: JamApiErrorUnauthorized | JamApiErrorGeneric | JamApiErrorParameters | JamApiErrorNotFound;
		};
		/**
		 * folder: get external artist description of a folder by id
		 */
		'folder/artist/info'?: {
			params: JamParameters.ID;
			result: Jam.Info;
			errors: JamApiErrorUnauthorized | JamApiErrorGeneric | JamApiErrorParameters | JamApiErrorNotFound;
		};
		/**
		 * folder: get external album description of a folder by id
		 */
		'folder/album/info'?: {
			params: JamParameters.ID;
			result: Jam.Info;
			errors: JamApiErrorUnauthorized | JamApiErrorGeneric | JamApiErrorParameters | JamApiErrorNotFound;
		};
		/**
		 * folder: get a list of folders by list type
		 */
		'folder/list'?: {
			params: JamParameters.FolderList;
			result: Array<Jam.Folder>;
			errors: JamApiErrorUnauthorized | JamApiErrorGeneric | JamApiErrorParameters;
		};
		/**
		 * folder: search folders
		 */
		'folder/search'?: {
			params: JamParameters.FolderSearch;
			result: Array<Jam.Folder>;
			errors: JamApiErrorUnauthorized | JamApiErrorGeneric | JamApiErrorParameters;
		};
		/**
		 * folder: list of folders with health issues
		 */
		'folder/health'?: {
			params: JamParameters.FolderHealth;
			result: Array<Jam.FolderHealth>;
			errors: JamApiErrorUnauthorized | JamApiErrorGeneric | JamApiErrorParameters;
			roles: ['admin'];
		};
		/**
		 * folder: get the user state (fav/rating) by folder id
		 */
		'folder/state'?: {
			params: JamParameters.ID;
			result: Jam.State;
			errors: JamApiErrorUnauthorized | JamApiErrorGeneric | JamApiErrorParameters | JamApiErrorNotFound;
		};
		/**
		 * folder: get the user states (fav/rating) by folders ids
		 */
		'folder/states'?: {
			params: JamParameters.IDs;
			result: Jam.States;
			errors: JamApiErrorUnauthorized | JamApiErrorGeneric | JamApiErrorParameters | JamApiErrorNotFound;
		};
		/**
		 * folder: get similar tracks of a/by artist folder id
		 */
		'folder/artist/similar/tracks'?: {
			params: JamParameters.SimilarTracks;
			result: Array<Jam.Track>;
			errors: JamApiErrorUnauthorized | JamApiErrorGeneric | JamApiErrorParameters | JamApiErrorNotFound;
		};
		/**
		 * folder: get the artwork list by folder id
		 */
		'folder/artworks'?: {
			params: JamParameters.ID;
			result: Array<Jam.ArtworkImage>;
			errors: JamApiErrorUnauthorized | JamApiErrorGeneric | JamApiErrorParameters | JamApiErrorNotFound;
		};

		/**
		 * track: get a track by id
		 */
		'track/id'?: {
			params: JamParameters.Track;
			result: Jam.Track;
			errors: JamApiErrorUnauthorized | JamApiErrorGeneric | JamApiErrorParameters | JamApiErrorNotFound;
		};
		/**
		 * track: get tracks by ids
		 */
		'track/ids'?: {
			params: JamParameters.Tracks;
			result: Array<Jam.Track>;
			errors: JamApiErrorUnauthorized | JamApiErrorGeneric | JamApiErrorParameters;
		};
		/**
		 * track: get an raw tag (eg. id3/vorbis) by track id
		 */
		'track/rawTag'?: {
			params: JamParameters.ID;
			result: Jam.RawTag;
			errors: JamApiErrorUnauthorized | JamApiErrorGeneric | JamApiErrorParameters | JamApiErrorNotFound;
		};
		/**
		 * track: get raw tags (eg. id3/vorbis) by track ids
		 */
		'track/rawTags'?: {
			params: JamParameters.IDs;
			result: Jam.RawTags;
			errors: JamApiErrorUnauthorized | JamApiErrorGeneric | JamApiErrorParameters;
		};
		/**
		 * track: search tracks
		 */
		'track/search'?: {
			params: JamParameters.TrackSearch;
			result: Array<Jam.Track>;
			errors: JamApiErrorUnauthorized | JamApiErrorGeneric | JamApiErrorParameters;
		};
		/**
		 * track: get the user state (fav/rating) by track id
		 */
		'track/state'?: {
			params: JamParameters.ID;
			result: Jam.State;
			errors: JamApiErrorUnauthorized | JamApiErrorGeneric | JamApiErrorParameters | JamApiErrorNotFound;
		};
		/**
		 * track: get the user states (fav/rating) by track ids
		 */
		'track/states'?: {
			params: JamParameters.IDs;
			result: Jam.States;
			errors: JamApiErrorUnauthorized | JamApiErrorGeneric | JamApiErrorParameters | JamApiErrorNotFound;
		};
		/**
		 * track: get a track list by track list type
		 */
		'track/list'?: {
			params: JamParameters.TrackList;
			result: Array<Jam.Track>;
			errors: JamApiErrorUnauthorized | JamApiErrorGeneric | JamApiErrorParameters;
		};
		/**
		 * track: get the similar tracks by track id
		 */
		'track/similar'?: {
			params: JamParameters.SimilarTracks;
			result: Array<Jam.Track>;
			errors: JamApiErrorUnauthorized | JamApiErrorGeneric | JamApiErrorParameters | JamApiErrorNotFound;
		};
		/**
		 * track: list of tracks with health issues
		 */
		'track/health'?: {
			params: JamParameters.TrackHealth;
			result: Array<Jam.TrackHealth>;
			errors: JamApiErrorUnauthorized | JamApiErrorGeneric | JamApiErrorParameters;
			roles: ['admin'];
		};

		/**
		 * episode: get a podcast episode by id
		 */
		'episode/id'?: {
			params: JamParameters.Episode;
			result: Jam.PodcastEpisode;
			errors: JamApiErrorUnauthorized | JamApiErrorGeneric | JamApiErrorParameters | JamApiErrorNotFound;
		};
		/**
		 * episode: get podcast episodes by ids
		 */
		'episode/ids'?: {
			params: JamParameters.Episodes;
			result: Array<Jam.PodcastEpisode>;
			errors: JamApiErrorUnauthorized | JamApiErrorGeneric | JamApiErrorParameters;
		};
		/**
		 * episode: search podcast episodes
		 */
		'episode/search'?: {
			params: JamParameters.EpisodeSearch;
			result: Array<Jam.PodcastEpisode>;
			errors: JamApiErrorUnauthorized | JamApiErrorGeneric | JamApiErrorParameters;
		};
		/**
		 * episode: retrieve a podcast episode media file
		 */
		'episode/retrieve'?: {
			params: JamParameters.ID;
			errors: JamApiErrorUnauthorized | JamApiErrorGeneric | JamApiErrorParameters | JamApiErrorNotFound;
			roles: ['podcast'];
		};
		/**
		 * episode: get the user state (fav/rating) by podcast episode id
		 */
		'episode/state'?: {
			params: JamParameters.ID;
			result: Jam.State
			errors: JamApiErrorUnauthorized | JamApiErrorGeneric | JamApiErrorParameters | JamApiErrorNotFound;
		};
		/**
		 * episode: get the user states (fav/rating) by podcast episode ids
		 */
		'episode/states'?: {
			params: JamParameters.IDs;
			result: Jam.States;
			errors: JamApiErrorUnauthorized | JamApiErrorGeneric | JamApiErrorParameters | JamApiErrorNotFound;
		};
		/**
		 * episode: get the episode state (e.g. downloading, new, etc.) by podcast episode id
		 */
		'episode/status'?: {
			params: JamParameters.ID;
			result: Jam.PodcastEpisodeStatus;
			errors: JamApiErrorUnauthorized | JamApiErrorGeneric | JamApiErrorParameters;
		};
		/**
		 * episode: get a list of episodes by list type
		 */
		'episode/list'?: {
			params: JamParameters.PodcastEpisodeList;
			result: Array<Jam.PodcastEpisode>;
			errors: JamApiErrorUnauthorized | JamApiErrorGeneric | JamApiErrorParameters;
		};

		/**
		 * podcast: get a podcast by id
		 */
		'podcast/id'?: {
			params: JamParameters.Podcast;
			result: Jam.Podcast;
			errors: JamApiErrorUnauthorized | JamApiErrorGeneric | JamApiErrorParameters | JamApiErrorNotFound;
		};
		/**
		 * podcast: get podcasts by ids
		 */
		'podcast/ids'?: {
			params: JamParameters.Podcasts;
			result: Array<Jam.Podcast>;
			errors: JamApiErrorUnauthorized | JamApiErrorGeneric | JamApiErrorParameters;
		};
		/**
		 * podcast: get the podcast state (e.g. downloading, new, etc.) by podcast id
		 */
		'podcast/status'?: {
			params: JamParameters.ID;
			result: Jam.PodcastStatus;
			errors: JamApiErrorUnauthorized | JamApiErrorGeneric | JamApiErrorParameters;
		};
		/**
		 * podcast: search podcasts
		 */
		'podcast/search'?: {
			params: JamParameters.PodcastSearch;
			result: Array<Jam.Podcast>;
			errors: JamApiErrorUnauthorized | JamApiErrorGeneric | JamApiErrorParameters;
		};
		/**
		 * podcast: check all podcast feeds for new episodes
		 */
		'podcast/refreshAll'?: {
			roles: ['podcast'];
		};
		/**
		 * podcast: check podcast feeds for new episodes by podcast id
		 */
		'podcast/refresh'?: {
			params: JamParameters.ID;
			errors: JamApiErrorUnauthorized | JamApiErrorGeneric | JamApiErrorParameters | JamApiErrorNotFound;
			roles: ['podcast'];
		};
		/**
		 * podcast: get the user state (fav/rating) by podcast id
		 */
		'podcast/state'?: {
			params: JamParameters.ID;
			result: Jam.State;
			errors: JamApiErrorUnauthorized | JamApiErrorGeneric | JamApiErrorParameters | JamApiErrorNotFound;
		};
		/**
		 * podcast: get the user states (fav/rating) by podcast ids
		 */
		'podcast/states'?: {
			params: JamParameters.IDs;
			result: Jam.States;
			errors: JamApiErrorUnauthorized | JamApiErrorGeneric | JamApiErrorParameters | JamApiErrorNotFound;
		};
		/**
		 * podcast: get a list of podcasts by list type
		 */
		'podcast/list'?: {
			params: JamParameters.PodcastList;
			result: Array<Jam.Podcast>;
			errors: JamApiErrorUnauthorized | JamApiErrorGeneric | JamApiErrorParameters;
		};

		/**
		 * radio: get a radio by id
		 */
		'radio/id'?: {
			params: JamParameters.Radio;
			result: Jam.Radio;
			errors: JamApiErrorUnauthorized | JamApiErrorGeneric | JamApiErrorParameters | JamApiErrorNotFound;
		};
		/**
		 * radio: get radios by ids
		 */
		'radio/ids'?: {
			params: JamParameters.Radios;
			result: Array<Jam.Radio>;
			errors: JamApiErrorUnauthorized | JamApiErrorGeneric | JamApiErrorParameters;
		};
		/**
		 * radio: search radios
		 */
		'radio/search'?: {
			params: JamParameters.Radios;
			result: Array<Jam.Radio>;
			errors: JamApiErrorUnauthorized | JamApiErrorGeneric | JamApiErrorParameters;
		};
		/**
		 * radio: get the user state (fav/rating) by radio id
		 */
		'radio/state'?: {
			params: JamParameters.ID;
			result: Jam.State
			errors: JamApiErrorUnauthorized | JamApiErrorGeneric | JamApiErrorParameters | JamApiErrorNotFound;
		};
		/**
		 * radio: get the user states (fav/rating) by radio ids
		 */
		'radio/states'?: {
			params: JamParameters.IDs;
			result: Jam.States;
			errors: JamApiErrorUnauthorized | JamApiErrorGeneric | JamApiErrorParameters | JamApiErrorNotFound;
		};

		/**
		 * artist: get an artist by id
		 */
		'artist/id'?: {
			params: JamParameters.Artist;
			result: Jam.Artist;
			errors: JamApiErrorUnauthorized | JamApiErrorGeneric | JamApiErrorParameters | JamApiErrorNotFound;
		};
		/**
		 * artist: get artists by ids
		 */
		'artist/ids'?: {
			params: JamParameters.Artists;
			result: Array<Jam.Artist>;
			errors: JamApiErrorUnauthorized | JamApiErrorGeneric | JamApiErrorParameters;
		};
		/**
		 * artist: search artists
		 */
		'artist/search'?: {
			params: JamParameters.ArtistSearch;
			result: Array<Jam.Artist>;
			errors: JamApiErrorUnauthorized | JamApiErrorGeneric | JamApiErrorParameters;
		};
		/**
		 * artist: get the user state (fav/rating) by artist id
		 */
		'artist/state'?: {
			params: JamParameters.ID;
			result: Jam.State;
			errors: JamApiErrorUnauthorized | JamApiErrorGeneric | JamApiErrorParameters | JamApiErrorNotFound;
		};
		/**
		 * artist: get the user states (fav/rating) by artist ids
		 */
		'artist/states'?: {
			params: JamParameters.IDs;
			result: Jam.States;
			errors: JamApiErrorUnauthorized | JamApiErrorGeneric | JamApiErrorParameters | JamApiErrorNotFound;
		};
		/**
		 * artist: get a artist list by artist list type
		 */
		'artist/list'?: {
			params: JamParameters.ArtistList;
			result: Array<Jam.Artist>;
			errors: JamApiErrorUnauthorized | JamApiErrorGeneric | JamApiErrorParameters;
		};
		/**
		 * artist: get similar tracks of an artist by artist id
		 */
		'artist/similar/tracks'?: {
			params: JamParameters.SimilarTracks;
			result: Array<Jam.Track>;
			errors: JamApiErrorUnauthorized | JamApiErrorGeneric | JamApiErrorParameters | JamApiErrorNotFound;
		};
		/**
		 * artist: get similar artists of an artist by artist id
		 */
		'artist/similar'?: {
			params: JamParameters.Artist;
			result: Array<Jam.Artist>;
			errors: JamApiErrorUnauthorized | JamApiErrorGeneric | JamApiErrorParameters | JamApiErrorNotFound;
		};
		/**
		 * artist: get the navigation index for artists
		 */
		'artist/index'?: {
			params: JamParameters.ArtistIndex;
			result: Jam.ArtistIndex
			errors: JamApiErrorUnauthorized | JamApiErrorGeneric | JamApiErrorParameters;
		};
		/**
		 * album: get tracks of an artist by artist id
		 */
		'artist/tracks'?: {
			params: JamParameters.Tracks;
			result: Array<Jam.Track>;
			errors: JamApiErrorUnauthorized | JamApiErrorGeneric | JamApiErrorParameters | JamApiErrorNotFound;
		};
		/**
		 * artist: get external artist description by id
		 */
		'artist/info'?: {
			params: JamParameters.ID;
			result: Jam.Info;
			errors: JamApiErrorUnauthorized | JamApiErrorGeneric | JamApiErrorParameters | JamApiErrorNotFound;
		};

		/**
		 * album: get an album by id
		 */
		'album/id'?: {
			params: JamParameters.Album;
			result: Jam.Album;
			errors: JamApiErrorUnauthorized | JamApiErrorGeneric | JamApiErrorParameters | JamApiErrorNotFound;
		};
		/**
		 * album: get albums by ids
		 */
		'album/ids'?: {
			params: JamParameters.Albums;
			result: Array<Jam.Album>;
			errors: JamApiErrorUnauthorized | JamApiErrorGeneric | JamApiErrorParameters;
		};
		/**
		 * album: get a artist list by album list type
		 */
		'album/list'?: {
			params: JamParameters.AlbumList;
			result: Array<Jam.Album>;
			errors: JamApiErrorUnauthorized | JamApiErrorGeneric | JamApiErrorParameters;
		};
		/**
		 * album: search albums
		 */
		'album/search'?: {
			params: JamParameters.AlbumSearch;
			result: Array<Jam.Album>;
			errors: JamApiErrorUnauthorized | JamApiErrorGeneric | JamApiErrorParameters;
		};
		/**
		 * album: get the navigation index for albums
		 */
		'album/index'?: {
			params: JamParameters.AlbumIndex;
			result: Jam.AlbumIndex;
			errors: JamApiErrorUnauthorized | JamApiErrorGeneric | JamApiErrorParameters;
		};
		/**
		 * album: get the user state (fav/rating) by album id
		 */
		'album/state'?: {
			params: JamParameters.ID;
			result: Jam.State;
			errors: JamApiErrorUnauthorized | JamApiErrorGeneric | JamApiErrorParameters | JamApiErrorNotFound;
		};
		/**
		 * album: get the user states (fav/rating) by album ids
		 */
		'album/states'?: {
			params: JamParameters.IDs;
			result: Jam.States;
			errors: JamApiErrorUnauthorized | JamApiErrorGeneric | JamApiErrorParameters | JamApiErrorNotFound;
		};
		/**
		 * album: get similar tracks of an artist by album id
		 */
		'album/similar/tracks'?: {
			params: JamParameters.SimilarTracks;
			result: Array<Jam.Track>;
			errors: JamApiErrorUnauthorized | JamApiErrorGeneric | JamApiErrorParameters | JamApiErrorNotFound;
		};
		/**
		 * album: get tracks of an album by album id
		 */
		'album/tracks'?: {
			params: JamParameters.Tracks;
			result: Array<Jam.Track>;
			errors: JamApiErrorUnauthorized | JamApiErrorGeneric | JamApiErrorParameters | JamApiErrorNotFound;
		};
		/**
		 * album: get external album description by id
		 */
		'album/info'?: {
			params: JamParameters.ID;
			result: Jam.Info;
			errors: JamApiErrorUnauthorized | JamApiErrorGeneric | JamApiErrorParameters | JamApiErrorNotFound;
		};

		/**
		 * playlist: get a playlist by id
		 */
		'playlist/id'?: {
			params: JamParameters.Playlist;
			result: Jam.Playlist;
			errors: JamApiErrorUnauthorized | JamApiErrorGeneric | JamApiErrorParameters | JamApiErrorNotFound;
		};
		/**
		 * playlist: get playlists by ids
		 */
		'playlist/ids'?: {
			params: JamParameters.Playlists;
			result: Array<Jam.Playlist>;
			errors: JamApiErrorUnauthorized | JamApiErrorGeneric | JamApiErrorParameters;
		};
		/**
		 * playlist: search playlists
		 */
		'playlist/search'?: {
			params: JamParameters.PlaylistSearch;
			result: Array<Jam.Playlist>;
			errors: JamApiErrorUnauthorized | JamApiErrorGeneric | JamApiErrorParameters;
		};
		/**
		 * playlist: get the user state (fav/rating) by playlist id
		 */
		'playlist/state'?: {
			params: JamParameters.ID;
			result: Jam.State;
			errors: JamApiErrorUnauthorized | JamApiErrorGeneric | JamApiErrorParameters | JamApiErrorNotFound;
		};
		/**
		 * playlist: get the user states (fav/rating) by playlist ids
		 */
		'playlist/states'?: {
			params: JamParameters.IDs;
			result: Jam.States;
			errors: JamApiErrorUnauthorized | JamApiErrorGeneric | JamApiErrorParameters | JamApiErrorNotFound;
		};
		'playlist/tracks'?: {
			params: JamParameters.Tracks;
			result: Array<Jam.Track>;
			errors: JamApiErrorUnauthorized | JamApiErrorGeneric | JamApiErrorParameters | JamApiErrorNotFound;
		};

		/**
		 * user: get an user by id
		 */
		'user/id'?: {
			params: JamParameters.ID;
			result: Jam.User;
			errors: JamApiErrorUnauthorized | JamApiErrorGeneric | JamApiErrorParameters | JamApiErrorNotFound;
			roles: ['admin'];
		};
		/**
		 * user: get users by ids
		 */
		'user/ids'?: {
			params: JamParameters.IDs;
			result: Array<Jam.User>;
			errors: JamApiErrorUnauthorized | JamApiErrorGeneric | JamApiErrorParameters;
			roles: ['admin'];
		};
		/**
		 * user: search users
		 */
		'user/search'?: {
			params: JamParameters.UserSearch;
			result: Array<Jam.User>;
			errors: JamApiErrorUnauthorized | JamApiErrorGeneric | JamApiErrorParameters;
			roles: ['admin'];
		};

		/**
		 * playqueue: get a playqueue for calling user
		 */
		'playqueue/get'?: {
			params: JamParameters.PlayQueue;
			result: Jam.PlayQueue;
			errors: JamApiErrorUnauthorized | JamApiErrorGeneric | JamApiErrorParameters;
		};

		/**
		 * bookmark: get a bookmarks list for the calling user
		 */
		'bookmark/list'?: {
			params: JamParameters.BookmarkList;
			result: Array<Jam.Bookmark>;
			errors: JamApiErrorUnauthorized | JamApiErrorGeneric | JamApiErrorParameters | JamApiErrorNotFound;
		};

		/**
		 * root: get a root by id
		 */
		'root/id'?: {
			params: JamParameters.ID;
			result: Jam.Root;
			errors: JamApiErrorUnauthorized | JamApiErrorGeneric | JamApiErrorParameters | JamApiErrorNotFound;
		};
		/**
		 * root: get roots by ids
		 */
		'root/ids'?: {
			params: JamParameters.IDs;
			result: Array<Jam.Root>;
			errors: JamApiErrorUnauthorized | JamApiErrorGeneric | JamApiErrorParameters;
		};
		/**
		 * root: search roots
		 */
		'root/search'?: {
			params: JamParameters.RootSearch;
			result: Array<Jam.Root>;
			errors: JamApiErrorUnauthorized | JamApiErrorGeneric | JamApiErrorParameters;
		};
		/**
		 * root: start a root scan by root id
		 */
		'root/scan'?: {
			params: JamParameters.ID;
			errors: JamApiErrorUnauthorized | JamApiErrorGeneric | JamApiErrorParameters | JamApiErrorNotFound;
			roles: ['admin'];
		};
		/**
		 * root: start scan of all roots
		 */
		'root/scanAll'?: {
			errors: JamApiErrorUnauthorized | JamApiErrorGeneric;
			roles: ['admin'];
		};
		/**
		 * root: scanning status of a root scan by root id
		 */
		'root/status'?: {
			params: JamParameters.ID;
			result: Jam.RootStatus;
			errors: JamApiErrorUnauthorized | JamApiErrorGeneric | JamApiErrorParameters;
		};

		/**
		 * admin: get admin settings for the server
		 */
		'admin/settings'?: {
			result: Jam.AdminSettings;
			errors: JamApiErrorUnauthorized | JamApiErrorGeneric;
			roles: ['admin'];
			operationId: 'settings.admin'
		};
		/**
		 * admin: get admin change request status
		 */
		'admin/queue/id'?: {
			params: JamParameters.ID;
			result: Jam.AdminChangeQueueInfo;
			errors: JamApiErrorUnauthorized | JamApiErrorGeneric;
			roles: ['admin'];
			operationId: 'root.queue.id'
		};

		// binary

		/**
		 * folder: download folder as binary archive
		 */
		'folder/download'?: {
			params: JamParameters.Download;
			errors: JamApiErrorUnauthorized | JamApiErrorGeneric | JamApiErrorParameters | JamApiErrorNotFound;
			binary: JamApiDownloadTypes;
			roles: ['stream'];
		};
		/**
		 * folder: download default image as binary
		 */
		'folder/image'?: {
			params: JamParameters.Image;
			errors: JamApiErrorUnauthorized | JamApiErrorGeneric | JamApiErrorParameters | JamApiErrorNotFound;
			binary: JamApiImageTypes;
		};
		/**
		 * folder: download artwork image as binary
		 */
		'folder/artwork/image'?: {
			params: JamParameters.Image;
			errors: JamApiErrorUnauthorized | JamApiErrorGeneric | JamApiErrorParameters | JamApiErrorNotFound;
			binary: JamApiImageTypes;
		};

		/**
		 * track: download track media as binary
		 */
		'track/stream'?: {
			params: JamParameters.Stream;
			errors: JamApiErrorUnauthorized | JamApiErrorGeneric | JamApiErrorParameters | JamApiErrorNotFound;
			binary: JamApiStreamTypes;
			roles: ['stream'];
		};
		/**
		 * track: download track media as binary archive
		 */
		'track/download'?: {
			params: JamParameters.Download;
			errors: JamApiErrorUnauthorized | JamApiErrorGeneric | JamApiErrorParameters | JamApiErrorNotFound;
			binary: JamApiDownloadTypes;
			roles: ['stream'];
		};
		/**
		 * track: download default image as binary
		 */
		'track/image'?: {
			params: JamParameters.Image;
			errors: JamApiErrorUnauthorized | JamApiErrorGeneric | JamApiErrorParameters | JamApiErrorNotFound;
			binary: JamApiImageTypes;
		};

		/**
		 * episode: download episode media as binary
		 */
		'episode/stream'?: {
			params: JamParameters.Stream;
			errors: JamApiErrorUnauthorized | JamApiErrorGeneric | JamApiErrorParameters | JamApiErrorNotFound;
			binary: JamApiStreamTypes;
			roles: ['stream'];
		};
		/**
		 * episode: download episode media as binary archive
		 */
		'episode/download'?: {
			params: JamParameters.Download;
			errors: JamApiErrorUnauthorized | JamApiErrorGeneric | JamApiErrorParameters | JamApiErrorNotFound;
			binary: JamApiDownloadTypes;
			roles: ['stream'];
		};
		/**
		 * episode: download default image as binary
		 */
		'episode/image'?: {
			params: JamParameters.Image;
			errors: JamApiErrorUnauthorized | JamApiErrorGeneric | JamApiErrorParameters | JamApiErrorNotFound;
			binary: JamApiImageTypes;
		};

		/**
		 * podcast: download default image as binary
		 */
		'podcast/image'?: {
			params: JamParameters.Image;
			errors: JamApiErrorUnauthorized | JamApiErrorGeneric | JamApiErrorParameters | JamApiErrorNotFound;
			binary: JamApiImageTypes;
		};
		/**
		 * podcast: download podcast episodes as binary archive
		 */
		'podcast/download'?: {
			params: JamParameters.Download;
			errors: JamApiErrorUnauthorized | JamApiErrorGeneric | JamApiErrorParameters | JamApiErrorNotFound;
			binary: JamApiDownloadTypes;
			roles: ['stream'];
		};

		/**
		 * artist: download default image as binary
		 */
		'artist/image'?: {
			params: JamParameters.Image;
			errors: JamApiErrorUnauthorized | JamApiErrorGeneric | JamApiErrorParameters | JamApiErrorNotFound;
			binary: JamApiImageTypes;
		};
		/**
		 * artist: download artist tracks as binary archive
		 */
		'artist/download'?: {
			params: JamParameters.Download;
			errors: JamApiErrorUnauthorized | JamApiErrorGeneric | JamApiErrorParameters | JamApiErrorNotFound;
			binary: JamApiDownloadTypes;
			roles: ['stream'];
		};

		/**
		 * album: download default image as binary
		 */
		'album/image'?: {
			params: JamParameters.Image;
			errors: JamApiErrorUnauthorized | JamApiErrorGeneric | JamApiErrorParameters | JamApiErrorNotFound;
			binary: JamApiImageTypes;
		};
		/**
		 * album: download album tracks as binary archive
		 */
		'album/download'?: {
			params: JamParameters.Download;
			errors: JamApiErrorUnauthorized | JamApiErrorGeneric | JamApiErrorParameters | JamApiErrorNotFound;
			binary: JamApiDownloadTypes;
			roles: ['stream'];
		};

		/**
		 * playlist: download default image as binary
		 */
		'playlist/image'?: {
			params: JamParameters.Image;
			errors: JamApiErrorUnauthorized | JamApiErrorGeneric | JamApiErrorParameters | JamApiErrorNotFound;
			binary: JamApiImageTypes;
		};
		/**
		 * playlist: download playlist tracks as binary archive
		 */
		'playlist/download'?: {
			params: JamParameters.Download;
			errors: JamApiErrorUnauthorized | JamApiErrorGeneric | JamApiErrorParameters | JamApiErrorNotFound;
			binary: JamApiDownloadTypes;
			roles: ['stream'];
		};

		/**
		 * user: download default image as binary
		 */
		'user/image'?: {
			params: JamParameters.Image;
			errors: JamApiErrorUnauthorized | JamApiErrorGeneric | JamApiErrorParameters | JamApiErrorNotFound;
			binary: JamApiImageTypes;
		};

		/**
		 * root: download default image as binary
		 */
		'root/image'?: {
			params: JamParameters.Image;
			errors: JamApiErrorUnauthorized | JamApiErrorGeneric | JamApiErrorParameters | JamApiErrorNotFound;
			binary: JamApiImageTypes;
		};

		/**
		 * image: download image for object as binary by id
		 */
		'image/{id}-{size}.{format}'?: {
			operationId: 'image.image';
			pathParams: JamParameters.Image;
			errors: JamApiErrorUnauthorized | JamApiErrorGeneric | JamApiErrorParameters | JamApiErrorNotFound;
			binary: JamApiImageTypes;
		};
		/**
		 * image: download image for object as binary by id
		 */
		'image/{id}-{size}'?: {
			operationId: 'image.image';
			pathParams: JamParameters.PathImageSize;
			errors: JamApiErrorUnauthorized | JamApiErrorGeneric | JamApiErrorParameters | JamApiErrorNotFound;
			binary: JamApiImageTypes;
			aliasFor: 'image/{id}-{size}.{format}';
		};
		/**
		 * image: download image for object as binary by id
		 */
		'image/{id}.{format}'?: {
			operationId: 'image.image';
			pathParams: JamParameters.PathImageFormat;
			errors: JamApiErrorUnauthorized | JamApiErrorGeneric | JamApiErrorParameters | JamApiErrorNotFound;
			binary: JamApiImageTypes;
			aliasFor: 'image/{id}-{size}.{format}';
		};
		/**
		 * image: download image for object as binary by id
		 */
		'image/{id}'?: {
			operationId: 'image.image';
			pathParams: JamParameters.ID;
			errors: JamApiErrorUnauthorized | JamApiErrorGeneric | JamApiErrorParameters | JamApiErrorNotFound;
			binary: JamApiImageTypes;
			aliasFor: 'image/{id}-{size}.{format}';
		};

		/**
		 * media: stream a media file in a format
		 */
		'stream/{id}.{format}'?: {
			operationId: 'stream.stream';
			pathParams: JamParameters.PathStream;
			errors: JamApiErrorUnauthorized | JamApiErrorGeneric | JamApiErrorParameters | JamApiErrorNotFound;
			binary: JamApiStreamTypes;
			roles: ['stream'];
		};
		/**
		 * media: stream a media file
		 */
		'stream/{id}'?: {
			operationId: 'stream.stream';
			pathParams: JamParameters.ID;
			errors: JamApiErrorUnauthorized | JamApiErrorGeneric | JamApiErrorParameters | JamApiErrorNotFound;
			binary: JamApiDefaultStreamTypes;
			aliasFor: 'stream/{id}.{format}';
			roles: ['stream'];
		};
		/**
		 * media: get peaks waveform data as svg | json | binary
		 */
		'waveform/{id}.{format}'?: {
			operationId: 'waveform.waveform';
			pathParams: JamParameters.Waveform;
			errors: JamApiErrorUnauthorized | JamApiErrorGeneric | JamApiErrorParameters | JamApiErrorNotFound;
			binary: JamApiWaveformTypes;
			roles: ['stream'];
		};

		/**
		 * download: download object as binary archive by id
		 */
		'download/{id}'?: {
			operationId: 'download.download';
			pathParams: JamParameters.ID;
			errors: JamApiErrorUnauthorized | JamApiErrorGeneric | JamApiErrorParameters | JamApiErrorNotFound;
			binary: JamApiDefaultDownloadTypes;
			aliasFor: 'download/{id}.{format}';
			roles: ['stream'];
		};
		/**
		 * download: download object as binary archive by id
		 */
		'download/{id}.{format}'?: {
			operationId: 'download.download';
			pathParams: JamParameters.Download;
			errors: JamApiErrorUnauthorized | JamApiErrorGeneric | JamApiErrorParameters | JamApiErrorNotFound;
			binary: JamApiDownloadTypes;
			roles: ['stream'];
		};
	};

	POST: {
		/**
		 * auth: login an user
		 *
		 */
		'login'?: {
			params: JamParameters.Login;
			/**
			 * returns a Jam.Session on success
			 */
			result: Jam.Session;
			errors: JamApiErrorUnauthorized | JamApiErrorGeneric | JamApiErrorParameters;
			public: true;
		};
		/**
		 * auth: logout an user
		 */
		'logout'?: {
			errors: JamApiErrorUnauthorized | JamApiErrorGeneric;
		};

		/**
		 * bookmark: create a bookmark
		 */
		'bookmark/create'?: {
			params: JamParameters.BookmarkCreate;
			result: Jam.Bookmark;
			errors: JamApiErrorUnauthorized | JamApiErrorGeneric | JamApiErrorParameters;
		};
		/**
		 * bookmark: delete a bookmark
		 */
		'bookmark/delete'?: {
			params: JamParameters.ID;
			errors: JamApiErrorUnauthorized | JamApiErrorGeneric | JamApiErrorParameters | JamApiErrorNotFound;
		};

		'chat/create'?: {
			params: JamParameters.ChatNew;
			errors: JamApiErrorUnauthorized | JamApiErrorGeneric | JamApiErrorParameters;
		};
		'chat/delete'?: {
			params: JamParameters.ChatDelete;
			errors: JamApiErrorUnauthorized | JamApiErrorGeneric | JamApiErrorParameters | JamApiErrorNotFound;
		};

		'radio/create'?: {
			params: JamParameters.RadioNew;
			result: Jam.Radio;
			errors: JamApiErrorUnauthorized | JamApiErrorGeneric | JamApiErrorParameters;
			roles: ['admin'];
		};
		'radio/update'?: {
			params: JamParameters.RadioUpdate;
			errors: JamApiErrorUnauthorized | JamApiErrorGeneric | JamApiErrorParameters | JamApiErrorNotFound;
			roles: ['admin'];
		};
		'radio/delete'?: {
			params: JamParameters.ID;
			errors: JamApiErrorUnauthorized | JamApiErrorGeneric | JamApiErrorParameters | JamApiErrorNotFound;
			roles: ['admin'];
		};

		'track/fav/update'?: {
			params: JamParameters.Fav;
			errors: JamApiErrorUnauthorized | JamApiErrorGeneric | JamApiErrorParameters | JamApiErrorNotFound;
		};
		'track/rate/update'?: {
			params: JamParameters.Rate;
			errors: JamApiErrorUnauthorized | JamApiErrorGeneric | JamApiErrorParameters | JamApiErrorNotFound;
		};
		'track/rawTag/update'?: {
			params: JamParameters.RawTagUpdate;
			result: Jam.AdminChangeQueueInfo,
			errors: JamApiErrorUnauthorized | JamApiErrorGeneric | JamApiErrorParameters | JamApiErrorNotFound;
			roles: ['admin'];
		};
		'track/name/update'?: {
			params: JamParameters.TrackEditName;
			result: Jam.AdminChangeQueueInfo,
			errors: JamApiErrorUnauthorized | JamApiErrorGeneric | JamApiErrorParameters | JamApiErrorNotFound;
			roles: ['admin'];
		};
		'track/parent/update'?: {
			params: JamParameters.TrackMoveParent;
			result: Jam.AdminChangeQueueInfo,
			errors: JamApiErrorUnauthorized | JamApiErrorGeneric | JamApiErrorParameters | JamApiErrorNotFound;
			roles: ['admin'];
		};
		'track/delete'?: {
			params: JamParameters.ID;
			result: Jam.AdminChangeQueueInfo,
			errors: JamApiErrorUnauthorized | JamApiErrorGeneric | JamApiErrorParameters | JamApiErrorNotFound;
			roles: ['admin'];
		};
		'track/fix'?: {
			params: JamParameters.TrackFix;
			result: Jam.AdminChangeQueueInfo,
			errors: JamApiErrorUnauthorized | JamApiErrorGeneric | JamApiErrorParameters | JamApiErrorNotFound;
			roles: ['admin'];
		};

		'folder/imageUpload/update'?: {
			params: JamParameters.ID;
			errors: JamApiErrorUnauthorized | JamApiErrorGeneric | JamApiErrorParameters | JamApiErrorNotFound;
			roles: ['admin'];
			upload: 'image'
		};
		'folder/artwork/create'?: {
			params: JamParameters.FolderArtworkNew;
			result: Jam.ArtworkImage;
			errors: JamApiErrorUnauthorized | JamApiErrorGeneric | JamApiErrorParameters | JamApiErrorNotFound;
			roles: ['admin'];
		};
		'folder/artwork/delete'?: {
			params: JamParameters.ID;
			errors: JamApiErrorUnauthorized | JamApiErrorGeneric | JamApiErrorParameters | JamApiErrorNotFound;
			roles: ['admin'];
		};
		'folder/artwork/update'?: {
			params: JamParameters.FolderArtworkUpdate;
			result: Jam.ArtworkImage;
			errors: JamApiErrorUnauthorized | JamApiErrorGeneric | JamApiErrorParameters | JamApiErrorNotFound;
			roles: ['admin'];
		};
		'folder/name/update'?: {
			params: JamParameters.FolderEditName;
			errors: JamApiErrorUnauthorized | JamApiErrorGeneric | JamApiErrorParameters | JamApiErrorNotFound;
			result: Jam.AdminChangeQueueInfo,
			roles: ['admin'];
		};
		'folder/fav/update'?: {
			params: JamParameters.Fav;
			errors: JamApiErrorUnauthorized | JamApiErrorGeneric | JamApiErrorParameters | JamApiErrorNotFound;
		};
		'folder/rate/update'?: {
			params: JamParameters.Rate;
			errors: JamApiErrorUnauthorized | JamApiErrorGeneric | JamApiErrorParameters | JamApiErrorNotFound;
		};
		'folder/parent/update'?: {
			params: JamParameters.FolderMoveParent;
			result: Jam.AdminChangeQueueInfo,
			errors: JamApiErrorUnauthorized | JamApiErrorGeneric | JamApiErrorParameters | JamApiErrorNotFound;
			roles: ['admin'];
		};
		'folder/delete'?: {
			params: JamParameters.ID;
			errors: JamApiErrorUnauthorized | JamApiErrorGeneric | JamApiErrorParameters | JamApiErrorNotFound;
			result: Jam.AdminChangeQueueInfo,
			roles: ['admin'];
		};
		'folder/create'?: {
			params: JamParameters.FolderCreate;
			result: Jam.Folder;
			errors: JamApiErrorUnauthorized | JamApiErrorGeneric | JamApiErrorParameters | JamApiErrorNotFound;
			roles: ['admin'];
		};

		'album/fav/update'?: {
			params: JamParameters.Fav;
			errors: JamApiErrorUnauthorized | JamApiErrorGeneric | JamApiErrorParameters | JamApiErrorNotFound;
		};
		'album/rate/update'?: {
			params: JamParameters.Rate;
			errors: JamApiErrorUnauthorized | JamApiErrorGeneric | JamApiErrorParameters | JamApiErrorNotFound;
		};

		'artist/fav/update'?: {
			params: JamParameters.Fav;
			errors: JamApiErrorUnauthorized | JamApiErrorGeneric | JamApiErrorParameters | JamApiErrorNotFound;
		};
		'artist/rate/update'?: {
			params: JamParameters.Rate;
			errors: JamApiErrorUnauthorized | JamApiErrorGeneric | JamApiErrorParameters | JamApiErrorNotFound;
		};

		'episode/fav/update'?: {
			params: JamParameters.Fav;
			errors: JamApiErrorUnauthorized | JamApiErrorGeneric | JamApiErrorParameters | JamApiErrorNotFound;
		};
		'episode/rate/update'?: {
			params: JamParameters.Rate;
			errors: JamApiErrorUnauthorized | JamApiErrorGeneric | JamApiErrorParameters | JamApiErrorNotFound;
		};

		'podcast/create'?: {
			params: JamParameters.PodcastNew;
			result: Jam.Podcast;
			errors: JamApiErrorUnauthorized | JamApiErrorGeneric | JamApiErrorParameters;
			roles: ['podcast'];
		};
		'podcast/fav/update'?: {
			params: JamParameters.Fav;
			errors: JamApiErrorUnauthorized | JamApiErrorGeneric | JamApiErrorParameters | JamApiErrorNotFound;
		};
		'podcast/rate/update'?: {
			params: JamParameters.Rate;
			errors: JamApiErrorUnauthorized | JamApiErrorGeneric | JamApiErrorParameters | JamApiErrorNotFound;
		};
		'podcast/delete'?: {
			params: JamParameters.ID;
			errors: JamApiErrorUnauthorized | JamApiErrorGeneric | JamApiErrorParameters | JamApiErrorNotFound;
			roles: ['podcast'];
		};

		'playlist/create'?: {
			params: JamParameters.PlaylistNew;
			result: Jam.Playlist;
			errors: JamApiErrorUnauthorized | JamApiErrorGeneric | JamApiErrorParameters;
		};
		'playlist/update'?: {
			params: JamParameters.PlaylistUpdate;
			errors: JamApiErrorUnauthorized | JamApiErrorGeneric | JamApiErrorParameters | JamApiErrorNotFound;
		};
		'playlist/fav/update'?: {
			params: JamParameters.Fav;
			errors: JamApiErrorUnauthorized | JamApiErrorGeneric | JamApiErrorParameters | JamApiErrorNotFound;
		};
		'playlist/rate/update'?: {
			params: JamParameters.Rate;
			errors: JamApiErrorUnauthorized | JamApiErrorGeneric | JamApiErrorParameters | JamApiErrorNotFound;
		};
		'playlist/delete'?: {
			params: JamParameters.ID;
			errors: JamApiErrorUnauthorized | JamApiErrorGeneric | JamApiErrorParameters | JamApiErrorNotFound;
		};

		/**
		 * playqueue: create/update the playqueue for calling user
		 */
		'playqueue/update'?: {
			params: JamParameters.PlayQueueSet;
			errors: JamApiErrorUnauthorized | JamApiErrorGeneric | JamApiErrorParameters | JamApiErrorNotFound;
		};
		/**
		 * playqueue: delete the playqueue for calling user
		 */
		'playqueue/delete'?: {
			errors: JamApiErrorUnauthorized | JamApiErrorGeneric | JamApiErrorParameters | JamApiErrorNotFound;
		};

		/**
		 * user: create a new user
		 */
		'user/create'?: {
			params: JamParameters.UserNew;
			result: Jam.User;
			errors: JamApiErrorUnauthorized | JamApiErrorGeneric | JamApiErrorParameters;
			roles: ['admin'];
		};
		/**
		 * user: update user
		 */
		'user/update'?: {
			params: JamParameters.UserUpdate;
			errors: JamApiErrorUnauthorized | JamApiErrorGeneric | JamApiErrorParameters | JamApiErrorNotFound;
			roles: ['admin'];
		};
		/**
		 * user: set a password for the user
		 */
		'user/password/update'?: {
			params: JamParameters.UserPasswordUpdate;
			errors: JamApiErrorUnauthorized | JamApiErrorGeneric | JamApiErrorParameters | JamApiErrorNotFound;
		};
		/**
		 * user: set an email for an user
		 */
		'user/email/update'?: {
			params: JamParameters.UserEmailUpdate;
			errors: JamApiErrorUnauthorized | JamApiErrorGeneric | JamApiErrorParameters | JamApiErrorNotFound;
		};
		/**
		 * user: set an avatar image for an user
		 */
		'user/imageUpload/update'?: {
			params: JamParameters.ID;
			errors: JamApiErrorUnauthorized | JamApiErrorGeneric | JamApiErrorParameters | JamApiErrorNotFound;
			upload: 'image'
		};
		'user/delete'?: {
			params: JamParameters.ID;
			errors: JamApiErrorUnauthorized | JamApiErrorGeneric | JamApiErrorParameters | JamApiErrorNotFound;
			roles: ['admin'];
		};

		'root/create'?: {
			params: JamParameters.RootNew;
			result: Jam.Root;
			errors: JamApiErrorUnauthorized | JamApiErrorGeneric | JamApiErrorParameters;
			roles: ['admin'];
		};
		'root/update'?: {
			params: JamParameters.RootUpdate;
			errors: JamApiErrorUnauthorized | JamApiErrorGeneric | JamApiErrorParameters | JamApiErrorNotFound;
			roles: ['admin'];
		};
		'root/delete'?: {
			params: JamParameters.ID;
			errors: JamApiErrorUnauthorized | JamApiErrorGeneric | JamApiErrorParameters | JamApiErrorNotFound;
			roles: ['admin'];
		};

		/**
		 * admin: update admin settings for the server
		 */
		'admin/settings/update'?: {
			params: Jam.AdminSettings;
			errors: JamApiErrorUnauthorized | JamApiErrorGeneric | JamApiErrorParameters | JamApiErrorNotFound;
			roles: ['admin'];
			operationId: 'settings.admin.update'
		};

	};
}

