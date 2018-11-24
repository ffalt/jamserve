import {Jam} from '../../model/jam-rest-data-0.1.0';
import {MusicBrainz} from '../../model/musicbrainz-rest-data-2.0';
import {Acoustid} from '../../model/acoustid-rest-data-2.0';
import {LastFM} from '../../model/lastfm-rest-data-2.0';
import {JamParameters} from '../../model/jam-rest-params-0.1.0';
import {JamController, JamRequest} from './api';
import {ApiResponder} from './response';
import express from 'express';
import {IApiBinaryResult} from '../../typings';
import {apiCheck} from './check';

export function registerPublicApi(router: express.Router, api: JamController): void {
	router.get('/ping', apiCheck('/ping'), async (req, res) => {
		try {
			const options: JamRequest<{}> = {query: req.query, user: req.user, client: req.client};
			const result: Jam.Ping = await api.ping(options);
			await ApiResponder.data(res, result);
		} catch (e) {
			await ApiResponder.error(res, e);
		}
	});

	router.get('/session', apiCheck('/session'), async (req, res) => {
		try {
			const options: JamRequest<{}> = {query: req.query, user: req.user, client: req.client};
			const result: Jam.Session = await api.session(options);
			await ApiResponder.data(res, result);
		} catch (e) {
			await ApiResponder.error(res, e);
		}
	});
}

export function registerUserApi(router: express.Router, api: JamController, image: express.RequestHandler, uploadAutoRemove: express.RequestHandler): void {
	router.get('/lastfm/lookup', apiCheck('/lastfm/lookup'), async (req, res) => {
		try {
			const options: JamRequest<JamParameters.LastFMLookup> = {query: req.query, user: req.user, client: req.client};
			const result: LastFM.Result = await api.metadataController.lastfmLookup(options);
			await ApiResponder.data(res, result);
		} catch (e) {
			await ApiResponder.error(res, e);
		}
	});

	router.get('/acoustid/lookup', apiCheck('/acoustid/lookup'), async (req, res) => {
		try {
			const options: JamRequest<JamParameters.AcoustidLookup> = {query: req.query, user: req.user, client: req.client};
			const result: Array<Acoustid.Result> = await api.metadataController.acoustidLookup(options);
			await ApiResponder.data(res, result);
		} catch (e) {
			await ApiResponder.error(res, e);
		}
	});

	router.get('/brainz/lookup', apiCheck('/brainz/lookup'), async (req, res) => {
		try {
			const options: JamRequest<JamParameters.BrainzLookup> = {query: req.query, user: req.user, client: req.client};
			const result: MusicBrainz.Response = await api.metadataController.brainzLookup(options);
			await ApiResponder.data(res, result);
		} catch (e) {
			await ApiResponder.error(res, e);
		}
	});

	router.get('/brainz/search', apiCheck('/brainz/search'), async (req, res) => {
		try {
			const options: JamRequest<JamParameters.BrainzSearch> = {query: req.query, user: req.user, client: req.client};
			const result: MusicBrainz.Response = await api.metadataController.brainzSearch(options);
			await ApiResponder.data(res, result);
		} catch (e) {
			await ApiResponder.error(res, e);
		}
	});

	router.get('/autocomplete', apiCheck('/autocomplete'), async (req, res) => {
		try {
			const options: JamRequest<JamParameters.AutoComplete> = {query: req.query, user: req.user, client: req.client};
			const result: Jam.AutoComplete = await api.autocompleteController.autocomplete(options);
			await ApiResponder.data(res, result);
		} catch (e) {
			await ApiResponder.error(res, e);
		}
	});

	router.get('/genre/list', apiCheck('/genre/list'), async (req, res) => {
		try {
			const options: JamRequest<JamParameters.Genres> = {query: req.query, user: req.user, client: req.client};
			const result: Array<Jam.Genre> = await api.genreController.list(options);
			await ApiResponder.data(res, result);
		} catch (e) {
			await ApiResponder.error(res, e);
		}
	});

	router.get('/nowPlaying', apiCheck('/nowPlaying'), async (req, res) => {
		try {
			const options: JamRequest<{}> = {query: req.query, user: req.user, client: req.client};
			const result: Array<Jam.NowPlaying> = await api.nowPlayingController.nowPlaying(options);
			await ApiResponder.data(res, result);
		} catch (e) {
			await ApiResponder.error(res, e);
		}
	});

	router.get('/chat/list', apiCheck('/chat/list'), async (req, res) => {
		try {
			const options: JamRequest<JamParameters.Chat> = {query: req.query, user: req.user, client: req.client};
			const result: Array<Jam.ChatMessage> = await api.chatController.list(options);
			await ApiResponder.data(res, result);
		} catch (e) {
			await ApiResponder.error(res, e);
		}
	});

	router.get('/folder/index', apiCheck('/folder/index'), async (req, res) => {
		try {
			const options: JamRequest<JamParameters.Index> = {query: req.query, user: req.user, client: req.client};
			const result: Jam.FolderIndex = await api.folderController.index(options);
			await ApiResponder.data(res, result);
		} catch (e) {
			await ApiResponder.error(res, e);
		}
	});

	router.get('/folder/id', apiCheck('/folder/id'), async (req, res) => {
		try {
			const options: JamRequest<JamParameters.Folder> = {query: req.query, user: req.user, client: req.client};
			const result: Jam.Folder = await api.folderController.id(options);
			await ApiResponder.data(res, result);
		} catch (e) {
			await ApiResponder.error(res, e);
		}
	});

	router.get('/folder/ids', apiCheck('/folder/ids'), async (req, res) => {
		try {
			const options: JamRequest<JamParameters.Folders> = {query: req.query, user: req.user, client: req.client};
			const result: Array<Jam.Folder> = await api.folderController.ids(options);
			await ApiResponder.data(res, result);
		} catch (e) {
			await ApiResponder.error(res, e);
		}
	});

	router.get('/folder/children', apiCheck('/folder/children'), async (req, res) => {
		try {
			const options: JamRequest<JamParameters.FolderChildren> = {query: req.query, user: req.user, client: req.client};
			const result: Jam.FolderChildren = await api.folderController.children(options);
			await ApiResponder.data(res, result);
		} catch (e) {
			await ApiResponder.error(res, e);
		}
	});

	router.get('/folder/tracks', apiCheck('/folder/tracks'), async (req, res) => {
		try {
			const options: JamRequest<JamParameters.FolderTracks> = {query: req.query, user: req.user, client: req.client};
			const result: Array<Jam.Track> = await api.folderController.tracks(options);
			await ApiResponder.data(res, result);
		} catch (e) {
			await ApiResponder.error(res, e);
		}
	});

	router.get('/folder/subfolders', apiCheck('/folder/subfolders'), async (req, res) => {
		try {
			const options: JamRequest<JamParameters.FolderSubFolders> = {query: req.query, user: req.user, client: req.client};
			const result: Array<Jam.Folder> = await api.folderController.subfolders(options);
			await ApiResponder.data(res, result);
		} catch (e) {
			await ApiResponder.error(res, e);
		}
	});

	router.get('/folder/artist/similar', apiCheck('/folder/artist/similar'), async (req, res) => {
		try {
			const options: JamRequest<JamParameters.Folder> = {query: req.query, user: req.user, client: req.client};
			const result: Array<Jam.Folder> = await api.folderController.artistSimilar(options);
			await ApiResponder.data(res, result);
		} catch (e) {
			await ApiResponder.error(res, e);
		}
	});

	router.get('/folder/artist/info', apiCheck('/folder/artist/info'), async (req, res) => {
		try {
			const options: JamRequest<JamParameters.ArtistInfo> = {query: req.query, user: req.user, client: req.client};
			const result: Jam.ArtistFolderInfo = await api.folderController.artistInfo(options);
			await ApiResponder.data(res, result);
		} catch (e) {
			await ApiResponder.error(res, e);
		}
	});

	router.get('/folder/album/info', apiCheck('/folder/album/info'), async (req, res) => {
		try {
			const options: JamRequest<JamParameters.AlbumInfo> = {query: req.query, user: req.user, client: req.client};
			const result: Jam.AlbumFolderInfo = await api.folderController.albumInfo(options);
			await ApiResponder.data(res, result);
		} catch (e) {
			await ApiResponder.error(res, e);
		}
	});

	router.get('/folder/list', apiCheck('/folder/list'), async (req, res) => {
		try {
			const options: JamRequest<JamParameters.FolderList> = {query: req.query, user: req.user, client: req.client};
			const result: Array<Jam.Folder> = await api.folderController.list(options);
			await ApiResponder.data(res, result);
		} catch (e) {
			await ApiResponder.error(res, e);
		}
	});

	router.get('/folder/search', apiCheck('/folder/search'), async (req, res) => {
		try {
			const options: JamRequest<JamParameters.FolderSearch> = {query: req.query, user: req.user, client: req.client};
			const result: Array<Jam.Folder> = await api.folderController.search(options);
			await ApiResponder.data(res, result);
		} catch (e) {
			await ApiResponder.error(res, e);
		}
	});

	router.get('/folder/state', apiCheck('/folder/state'), async (req, res) => {
		try {
			const options: JamRequest<JamParameters.ID> = {query: req.query, user: req.user, client: req.client};
			const result: Jam.State = await api.folderController.state(options);
			await ApiResponder.data(res, result);
		} catch (e) {
			await ApiResponder.error(res, e);
		}
	});

	router.get('/folder/states', apiCheck('/folder/states'), async (req, res) => {
		try {
			const options: JamRequest<JamParameters.IDs> = {query: req.query, user: req.user, client: req.client};
			const result: Jam.States = await api.folderController.states(options);
			await ApiResponder.data(res, result);
		} catch (e) {
			await ApiResponder.error(res, e);
		}
	});

	router.get('/folder/artist/similar/tracks', apiCheck('/folder/artist/similar/tracks'), async (req, res) => {
		try {
			const options: JamRequest<JamParameters.SimilarTracks> = {query: req.query, user: req.user, client: req.client};
			const result: Array<Jam.Track> = await api.folderController.artistSimilarTracks(options);
			await ApiResponder.data(res, result);
		} catch (e) {
			await ApiResponder.error(res, e);
		}
	});

	router.get('/track/id', apiCheck('/track/id'), async (req, res) => {
		try {
			const options: JamRequest<JamParameters.Track> = {query: req.query, user: req.user, client: req.client};
			const result: Jam.Track = await api.trackController.id(options);
			await ApiResponder.data(res, result);
		} catch (e) {
			await ApiResponder.error(res, e);
		}
	});

	router.get('/track/ids', apiCheck('/track/ids'), async (req, res) => {
		try {
			const options: JamRequest<JamParameters.Tracks> = {query: req.query, user: req.user, client: req.client};
			const result: Array<Jam.Track> = await api.trackController.ids(options);
			await ApiResponder.data(res, result);
		} catch (e) {
			await ApiResponder.error(res, e);
		}
	});

	router.get('/track/tagID3', apiCheck('/track/tagID3'), async (req, res) => {
		try {
			const options: JamRequest<JamParameters.ID> = {query: req.query, user: req.user, client: req.client};
			const result: Jam.ID3Tag = await api.trackController.tagID3(options);
			await ApiResponder.data(res, result);
		} catch (e) {
			await ApiResponder.error(res, e);
		}
	});

	router.get('/track/tagID3s', apiCheck('/track/tagID3s'), async (req, res) => {
		try {
			const options: JamRequest<JamParameters.IDs> = {query: req.query, user: req.user, client: req.client};
			const result: Jam.ID3Tags = await api.trackController.tagID3s(options);
			await ApiResponder.data(res, result);
		} catch (e) {
			await ApiResponder.error(res, e);
		}
	});

	router.get('/track/search', apiCheck('/track/search'), async (req, res) => {
		try {
			const options: JamRequest<JamParameters.TrackSearch> = {query: req.query, user: req.user, client: req.client};
			const result: Array<Jam.Track> = await api.trackController.search(options);
			await ApiResponder.data(res, result);
		} catch (e) {
			await ApiResponder.error(res, e);
		}
	});

	router.get('/track/state', apiCheck('/track/state'), async (req, res) => {
		try {
			const options: JamRequest<JamParameters.ID> = {query: req.query, user: req.user, client: req.client};
			const result: Jam.State = await api.trackController.state(options);
			await ApiResponder.data(res, result);
		} catch (e) {
			await ApiResponder.error(res, e);
		}
	});

	router.get('/track/states', apiCheck('/track/states'), async (req, res) => {
		try {
			const options: JamRequest<JamParameters.IDs> = {query: req.query, user: req.user, client: req.client};
			const result: Jam.States = await api.trackController.states(options);
			await ApiResponder.data(res, result);
		} catch (e) {
			await ApiResponder.error(res, e);
		}
	});

	router.get('/track/list', apiCheck('/track/list'), async (req, res) => {
		try {
			const options: JamRequest<JamParameters.TrackList> = {query: req.query, user: req.user, client: req.client};
			const result: Array<Jam.Track> = await api.trackController.list(options);
			await ApiResponder.data(res, result);
		} catch (e) {
			await ApiResponder.error(res, e);
		}
	});

	router.get('/track/similar', apiCheck('/track/similar'), async (req, res) => {
		try {
			const options: JamRequest<JamParameters.SimilarTracks> = {query: req.query, user: req.user, client: req.client};
			const result: Array<Jam.Track> = await api.trackController.similar(options);
			await ApiResponder.data(res, result);
		} catch (e) {
			await ApiResponder.error(res, e);
		}
	});

	router.get('/track/bookmark/list', apiCheck('/track/bookmark/list'), async (req, res) => {
		try {
			const options: JamRequest<JamParameters.BookmarkList> = {query: req.query, user: req.user, client: req.client};
			const result: Array<Jam.TrackBookmark> = await api.trackController.bookmarkList(options);
			await ApiResponder.data(res, result);
		} catch (e) {
			await ApiResponder.error(res, e);
		}
	});

	router.get('/episode/id', apiCheck('/episode/id'), async (req, res) => {
		try {
			const options: JamRequest<JamParameters.Episode> = {query: req.query, user: req.user, client: req.client};
			const result: Jam.PodcastEpisode = await api.episodeController.id(options);
			await ApiResponder.data(res, result);
		} catch (e) {
			await ApiResponder.error(res, e);
		}
	});

	router.get('/episode/ids', apiCheck('/episode/ids'), async (req, res) => {
		try {
			const options: JamRequest<JamParameters.Episodes> = {query: req.query, user: req.user, client: req.client};
			const result: Array<Jam.PodcastEpisode> = await api.episodeController.ids(options);
			await ApiResponder.data(res, result);
		} catch (e) {
			await ApiResponder.error(res, e);
		}
	});

	router.get('/episode/search', apiCheck('/episode/search'), async (req, res) => {
		try {
			const options: JamRequest<JamParameters.EpisodeSearch> = {query: req.query, user: req.user, client: req.client};
			const result: Array<Jam.PodcastEpisode> = await api.episodeController.search(options);
			await ApiResponder.data(res, result);
		} catch (e) {
			await ApiResponder.error(res, e);
		}
	});

	router.get('/episode/state', apiCheck('/episode/state'), async (req, res) => {
		try {
			const options: JamRequest<JamParameters.ID> = {query: req.query, user: req.user, client: req.client};
			const result: Jam.State = await api.episodeController.state(options);
			await ApiResponder.data(res, result);
		} catch (e) {
			await ApiResponder.error(res, e);
		}
	});

	router.get('/episode/states', apiCheck('/episode/states'), async (req, res) => {
		try {
			const options: JamRequest<JamParameters.IDs> = {query: req.query, user: req.user, client: req.client};
			const result: Jam.States = await api.episodeController.states(options);
			await ApiResponder.data(res, result);
		} catch (e) {
			await ApiResponder.error(res, e);
		}
	});

	router.get('/episode/status', apiCheck('/episode/status'), async (req, res) => {
		try {
			const options: JamRequest<JamParameters.ID> = {query: req.query, user: req.user, client: req.client};
			const result: Jam.PodcastEpisodeStatus = await api.episodeController.status(options);
			await ApiResponder.data(res, result);
		} catch (e) {
			await ApiResponder.error(res, e);
		}
	});

	router.get('/podcast/id', apiCheck('/podcast/id'), async (req, res) => {
		try {
			const options: JamRequest<JamParameters.Podcast> = {query: req.query, user: req.user, client: req.client};
			const result: Jam.Podcast = await api.podcastController.id(options);
			await ApiResponder.data(res, result);
		} catch (e) {
			await ApiResponder.error(res, e);
		}
	});

	router.get('/podcast/ids', apiCheck('/podcast/ids'), async (req, res) => {
		try {
			const options: JamRequest<JamParameters.Podcasts> = {query: req.query, user: req.user, client: req.client};
			const result: Array<Jam.Podcast> = await api.podcastController.ids(options);
			await ApiResponder.data(res, result);
		} catch (e) {
			await ApiResponder.error(res, e);
		}
	});

	router.get('/podcast/status', apiCheck('/podcast/status'), async (req, res) => {
		try {
			const options: JamRequest<JamParameters.ID> = {query: req.query, user: req.user, client: req.client};
			const result: Jam.PodcastStatus = await api.podcastController.status(options);
			await ApiResponder.data(res, result);
		} catch (e) {
			await ApiResponder.error(res, e);
		}
	});

	router.get('/podcast/search', apiCheck('/podcast/search'), async (req, res) => {
		try {
			const options: JamRequest<JamParameters.PodcastSearch> = {query: req.query, user: req.user, client: req.client};
			const result: Array<Jam.Podcast> = await api.podcastController.search(options);
			await ApiResponder.data(res, result);
		} catch (e) {
			await ApiResponder.error(res, e);
		}
	});

	router.get('/podcast/refreshAll', apiCheck('/podcast/refreshAll'), async (req, res) => {
		try {
			const options: JamRequest<{}> = {query: req.query, user: req.user, client: req.client};
			await api.podcastController.refreshAll(options);
			await ApiResponder.ok(res);
		} catch (e) {
			await ApiResponder.error(res, e);
		}
	});

	router.get('/podcast/refresh', apiCheck('/podcast/refresh'), async (req, res) => {
		try {
			const options: JamRequest<JamParameters.ID> = {query: req.query, user: req.user, client: req.client};
			await api.podcastController.refresh(options);
			await ApiResponder.ok(res);
		} catch (e) {
			await ApiResponder.error(res, e);
		}
	});

	router.get('/podcast/state', apiCheck('/podcast/state'), async (req, res) => {
		try {
			const options: JamRequest<JamParameters.ID> = {query: req.query, user: req.user, client: req.client};
			const result: Jam.State = await api.podcastController.state(options);
			await ApiResponder.data(res, result);
		} catch (e) {
			await ApiResponder.error(res, e);
		}
	});

	router.get('/podcast/states', apiCheck('/podcast/states'), async (req, res) => {
		try {
			const options: JamRequest<JamParameters.IDs> = {query: req.query, user: req.user, client: req.client};
			const result: Jam.States = await api.podcastController.states(options);
			await ApiResponder.data(res, result);
		} catch (e) {
			await ApiResponder.error(res, e);
		}
	});

	router.get('/artist/id', apiCheck('/artist/id'), async (req, res) => {
		try {
			const options: JamRequest<JamParameters.Artist> = {query: req.query, user: req.user, client: req.client};
			const result: Jam.Artist = await api.artistController.id(options);
			await ApiResponder.data(res, result);
		} catch (e) {
			await ApiResponder.error(res, e);
		}
	});

	router.get('/artist/ids', apiCheck('/artist/ids'), async (req, res) => {
		try {
			const options: JamRequest<JamParameters.Artists> = {query: req.query, user: req.user, client: req.client};
			const result: Array<Jam.Artist> = await api.artistController.ids(options);
			await ApiResponder.data(res, result);
		} catch (e) {
			await ApiResponder.error(res, e);
		}
	});

	router.get('/artist/search', apiCheck('/artist/search'), async (req, res) => {
		try {
			const options: JamRequest<JamParameters.ArtistSearch> = {query: req.query, user: req.user, client: req.client};
			const result: Array<Jam.Artist> = await api.artistController.search(options);
			await ApiResponder.data(res, result);
		} catch (e) {
			await ApiResponder.error(res, e);
		}
	});

	router.get('/artist/state', apiCheck('/artist/state'), async (req, res) => {
		try {
			const options: JamRequest<JamParameters.ID> = {query: req.query, user: req.user, client: req.client};
			const result: Jam.State = await api.artistController.state(options);
			await ApiResponder.data(res, result);
		} catch (e) {
			await ApiResponder.error(res, e);
		}
	});

	router.get('/artist/states', apiCheck('/artist/states'), async (req, res) => {
		try {
			const options: JamRequest<JamParameters.IDs> = {query: req.query, user: req.user, client: req.client};
			const result: Jam.States = await api.artistController.states(options);
			await ApiResponder.data(res, result);
		} catch (e) {
			await ApiResponder.error(res, e);
		}
	});

	router.get('/artist/list', apiCheck('/artist/list'), async (req, res) => {
		try {
			const options: JamRequest<JamParameters.ArtistList> = {query: req.query, user: req.user, client: req.client};
			const result: Array<Jam.Artist> = await api.artistController.list(options);
			await ApiResponder.data(res, result);
		} catch (e) {
			await ApiResponder.error(res, e);
		}
	});

	router.get('/artist/similar/tracks', apiCheck('/artist/similar/tracks'), async (req, res) => {
		try {
			const options: JamRequest<JamParameters.SimilarTracks> = {query: req.query, user: req.user, client: req.client};
			const result: Array<Jam.Track> = await api.artistController.similarTracks(options);
			await ApiResponder.data(res, result);
		} catch (e) {
			await ApiResponder.error(res, e);
		}
	});

	router.get('/artist/similar', apiCheck('/artist/similar'), async (req, res) => {
		try {
			const options: JamRequest<JamParameters.Artist> = {query: req.query, user: req.user, client: req.client};
			const result: Array<Jam.Artist> = await api.artistController.similar(options);
			await ApiResponder.data(res, result);
		} catch (e) {
			await ApiResponder.error(res, e);
		}
	});

	router.get('/artist/index', apiCheck('/artist/index'), async (req, res) => {
		try {
			const options: JamRequest<JamParameters.Index> = {query: req.query, user: req.user, client: req.client};
			const result: Jam.ArtistIndex = await api.artistController.index(options);
			await ApiResponder.data(res, result);
		} catch (e) {
			await ApiResponder.error(res, e);
		}
	});

	router.get('/artist/tracks', apiCheck('/artist/tracks'), async (req, res) => {
		try {
			const options: JamRequest<JamParameters.Tracks> = {query: req.query, user: req.user, client: req.client};
			const result: Array<Jam.Track> = await api.artistController.tracks(options);
			await ApiResponder.data(res, result);
		} catch (e) {
			await ApiResponder.error(res, e);
		}
	});

	router.get('/album/id', apiCheck('/album/id'), async (req, res) => {
		try {
			const options: JamRequest<JamParameters.Album> = {query: req.query, user: req.user, client: req.client};
			const result: Jam.Album = await api.albumController.id(options);
			await ApiResponder.data(res, result);
		} catch (e) {
			await ApiResponder.error(res, e);
		}
	});

	router.get('/album/ids', apiCheck('/album/ids'), async (req, res) => {
		try {
			const options: JamRequest<JamParameters.Albums> = {query: req.query, user: req.user, client: req.client};
			const result: Array<Jam.Album> = await api.albumController.ids(options);
			await ApiResponder.data(res, result);
		} catch (e) {
			await ApiResponder.error(res, e);
		}
	});

	router.get('/album/list', apiCheck('/album/list'), async (req, res) => {
		try {
			const options: JamRequest<JamParameters.AlbumList> = {query: req.query, user: req.user, client: req.client};
			const result: Array<Jam.Album> = await api.albumController.list(options);
			await ApiResponder.data(res, result);
		} catch (e) {
			await ApiResponder.error(res, e);
		}
	});

	router.get('/album/search', apiCheck('/album/search'), async (req, res) => {
		try {
			const options: JamRequest<JamParameters.AlbumSearch> = {query: req.query, user: req.user, client: req.client};
			const result: Array<Jam.Album> = await api.albumController.search(options);
			await ApiResponder.data(res, result);
		} catch (e) {
			await ApiResponder.error(res, e);
		}
	});

	router.get('/album/state', apiCheck('/album/state'), async (req, res) => {
		try {
			const options: JamRequest<JamParameters.ID> = {query: req.query, user: req.user, client: req.client};
			const result: Jam.State = await api.albumController.state(options);
			await ApiResponder.data(res, result);
		} catch (e) {
			await ApiResponder.error(res, e);
		}
	});

	router.get('/album/states', apiCheck('/album/states'), async (req, res) => {
		try {
			const options: JamRequest<JamParameters.IDs> = {query: req.query, user: req.user, client: req.client};
			const result: Jam.States = await api.albumController.states(options);
			await ApiResponder.data(res, result);
		} catch (e) {
			await ApiResponder.error(res, e);
		}
	});

	router.get('/album/similar/tracks', apiCheck('/album/similar/tracks'), async (req, res) => {
		try {
			const options: JamRequest<JamParameters.SimilarTracks> = {query: req.query, user: req.user, client: req.client};
			const result: Array<Jam.Track> = await api.albumController.similarTracks(options);
			await ApiResponder.data(res, result);
		} catch (e) {
			await ApiResponder.error(res, e);
		}
	});

	router.get('/album/tracks', apiCheck('/album/tracks'), async (req, res) => {
		try {
			const options: JamRequest<JamParameters.Tracks> = {query: req.query, user: req.user, client: req.client};
			const result: Array<Jam.Track> = await api.albumController.tracks(options);
			await ApiResponder.data(res, result);
		} catch (e) {
			await ApiResponder.error(res, e);
		}
	});

	router.get('/playlist/id', apiCheck('/playlist/id'), async (req, res) => {
		try {
			const options: JamRequest<JamParameters.Playlist> = {query: req.query, user: req.user, client: req.client};
			const result: Jam.Playlist = await api.playlistController.id(options);
			await ApiResponder.data(res, result);
		} catch (e) {
			await ApiResponder.error(res, e);
		}
	});

	router.get('/playlist/ids', apiCheck('/playlist/ids'), async (req, res) => {
		try {
			const options: JamRequest<JamParameters.Playlists> = {query: req.query, user: req.user, client: req.client};
			const result: Array<Jam.Playlist> = await api.playlistController.ids(options);
			await ApiResponder.data(res, result);
		} catch (e) {
			await ApiResponder.error(res, e);
		}
	});

	router.get('/playlist/search', apiCheck('/playlist/search'), async (req, res) => {
		try {
			const options: JamRequest<JamParameters.PlaylistSearch> = {query: req.query, user: req.user, client: req.client};
			const result: Array<Jam.Playlist> = await api.playlistController.search(options);
			await ApiResponder.data(res, result);
		} catch (e) {
			await ApiResponder.error(res, e);
		}
	});

	router.get('/playlist/state', apiCheck('/playlist/state'), async (req, res) => {
		try {
			const options: JamRequest<JamParameters.ID> = {query: req.query, user: req.user, client: req.client};
			const result: Jam.State = await api.playlistController.state(options);
			await ApiResponder.data(res, result);
		} catch (e) {
			await ApiResponder.error(res, e);
		}
	});

	router.get('/playlist/states', apiCheck('/playlist/states'), async (req, res) => {
		try {
			const options: JamRequest<JamParameters.IDs> = {query: req.query, user: req.user, client: req.client};
			const result: Jam.States = await api.playlistController.states(options);
			await ApiResponder.data(res, result);
		} catch (e) {
			await ApiResponder.error(res, e);
		}
	});

	router.get('/playlist/tracks', apiCheck('/playlist/tracks'), async (req, res) => {
		try {
			const options: JamRequest<JamParameters.Tracks> = {query: req.query, user: req.user, client: req.client};
			const result: Array<Jam.Track> = await api.playlistController.tracks(options);
			await ApiResponder.data(res, result);
		} catch (e) {
			await ApiResponder.error(res, e);
		}
	});

	router.get('/user/playqueue', apiCheck('/user/playqueue'), async (req, res) => {
		try {
			const options: JamRequest<JamParameters.IncludesPlayQueue> = {query: req.query, user: req.user, client: req.client};
			const result: Jam.PlayQueue = await api.userController.playqueue(options);
			await ApiResponder.data(res, result);
		} catch (e) {
			await ApiResponder.error(res, e);
		}
	});

	router.get('/root/search', apiCheck('/root/search'), async (req, res) => {
		try {
			const options: JamRequest<JamParameters.RootSearch> = {query: req.query, user: req.user, client: req.client};
			const result: Array<Jam.Root> = await api.rootController.search(options);
			await ApiResponder.data(res, result);
		} catch (e) {
			await ApiResponder.error(res, e);
		}
	});

	router.get('/root/id', apiCheck('/root/id'), async (req, res) => {
		try {
			const options: JamRequest<JamParameters.ID> = {query: req.query, user: req.user, client: req.client};
			const result: Jam.Root = await api.rootController.id(options);
			await ApiResponder.data(res, result);
		} catch (e) {
			await ApiResponder.error(res, e);
		}
	});

	router.get('/root/ids', apiCheck('/root/ids'), async (req, res) => {
		try {
			const options: JamRequest<JamParameters.IDs> = {query: req.query, user: req.user, client: req.client};
			const result: Array<Jam.Root> = await api.rootController.ids(options);
			await ApiResponder.data(res, result);
		} catch (e) {
			await ApiResponder.error(res, e);
		}
	});

	router.get('/root/status', apiCheck('/root/status'), async (req, res) => {
		try {
			const options: JamRequest<JamParameters.ID> = {query: req.query, user: req.user, client: req.client};
			const result: Jam.RootStatus = await api.rootController.status(options);
			await ApiResponder.data(res, result);
		} catch (e) {
			await ApiResponder.error(res, e);
		}
	});

	router.get('/folder/download', apiCheck('/folder/download'), async (req, res) => {
		try {
			const options: JamRequest<JamParameters.Download> = {query: req.query, user: req.user, client: req.client};
			const result: IApiBinaryResult = await api.folderController.download(options);
			await ApiResponder.binary(res, result);
		} catch (e) {
			await ApiResponder.error(res, e);
		}
	});

	router.get('/folder/image', apiCheck('/folder/image'), async (req, res) => {
		try {
			const options: JamRequest<JamParameters.Image> = {query: req.query, user: req.user, client: req.client};
			const result: IApiBinaryResult = await api.folderController.image(options);
			await ApiResponder.binary(res, result);
		} catch (e) {
			await ApiResponder.error(res, e);
		}
	});

	router.get('/track/stream', apiCheck('/track/stream'), async (req, res) => {
		try {
			const options: JamRequest<JamParameters.Stream> = {query: req.query, user: req.user, client: req.client};
			const result: IApiBinaryResult = await api.trackController.stream(options);
			await ApiResponder.binary(res, result);
		} catch (e) {
			await ApiResponder.error(res, e);
		}
	});

	router.get('/track/download', apiCheck('/track/download'), async (req, res) => {
		try {
			const options: JamRequest<JamParameters.Download> = {query: req.query, user: req.user, client: req.client};
			const result: IApiBinaryResult = await api.trackController.download(options);
			await ApiResponder.binary(res, result);
		} catch (e) {
			await ApiResponder.error(res, e);
		}
	});

	router.get('/track/image', apiCheck('/track/image'), async (req, res) => {
		try {
			const options: JamRequest<JamParameters.Image> = {query: req.query, user: req.user, client: req.client};
			const result: IApiBinaryResult = await api.trackController.image(options);
			await ApiResponder.binary(res, result);
		} catch (e) {
			await ApiResponder.error(res, e);
		}
	});

	router.get('/episode/stream', apiCheck('/episode/stream'), async (req, res) => {
		try {
			const options: JamRequest<JamParameters.Stream> = {query: req.query, user: req.user, client: req.client};
			const result: IApiBinaryResult = await api.episodeController.stream(options);
			await ApiResponder.binary(res, result);
		} catch (e) {
			await ApiResponder.error(res, e);
		}
	});

	router.get('/episode/download', apiCheck('/episode/download'), async (req, res) => {
		try {
			const options: JamRequest<JamParameters.Download> = {query: req.query, user: req.user, client: req.client};
			const result: IApiBinaryResult = await api.episodeController.download(options);
			await ApiResponder.binary(res, result);
		} catch (e) {
			await ApiResponder.error(res, e);
		}
	});

	router.get('/episode/image', apiCheck('/episode/image'), async (req, res) => {
		try {
			const options: JamRequest<JamParameters.Image> = {query: req.query, user: req.user, client: req.client};
			const result: IApiBinaryResult = await api.episodeController.image(options);
			await ApiResponder.binary(res, result);
		} catch (e) {
			await ApiResponder.error(res, e);
		}
	});

	router.get('/podcast/image', apiCheck('/podcast/image'), async (req, res) => {
		try {
			const options: JamRequest<JamParameters.Image> = {query: req.query, user: req.user, client: req.client};
			const result: IApiBinaryResult = await api.podcastController.image(options);
			await ApiResponder.binary(res, result);
		} catch (e) {
			await ApiResponder.error(res, e);
		}
	});

	router.get('/podcast/download', apiCheck('/podcast/download'), async (req, res) => {
		try {
			const options: JamRequest<JamParameters.Download> = {query: req.query, user: req.user, client: req.client};
			const result: IApiBinaryResult = await api.podcastController.download(options);
			await ApiResponder.binary(res, result);
		} catch (e) {
			await ApiResponder.error(res, e);
		}
	});

	router.get('/artist/image', apiCheck('/artist/image'), async (req, res) => {
		try {
			const options: JamRequest<JamParameters.Image> = {query: req.query, user: req.user, client: req.client};
			const result: IApiBinaryResult = await api.artistController.image(options);
			await ApiResponder.binary(res, result);
		} catch (e) {
			await ApiResponder.error(res, e);
		}
	});

	router.get('/artist/download', apiCheck('/artist/download'), async (req, res) => {
		try {
			const options: JamRequest<JamParameters.Download> = {query: req.query, user: req.user, client: req.client};
			const result: IApiBinaryResult = await api.artistController.download(options);
			await ApiResponder.binary(res, result);
		} catch (e) {
			await ApiResponder.error(res, e);
		}
	});

	router.get('/album/image', apiCheck('/album/image'), async (req, res) => {
		try {
			const options: JamRequest<JamParameters.Image> = {query: req.query, user: req.user, client: req.client};
			const result: IApiBinaryResult = await api.albumController.image(options);
			await ApiResponder.binary(res, result);
		} catch (e) {
			await ApiResponder.error(res, e);
		}
	});

	router.get('/album/download', apiCheck('/album/download'), async (req, res) => {
		try {
			const options: JamRequest<JamParameters.Download> = {query: req.query, user: req.user, client: req.client};
			const result: IApiBinaryResult = await api.albumController.download(options);
			await ApiResponder.binary(res, result);
		} catch (e) {
			await ApiResponder.error(res, e);
		}
	});

	router.get('/playlist/image', apiCheck('/playlist/image'), async (req, res) => {
		try {
			const options: JamRequest<JamParameters.Image> = {query: req.query, user: req.user, client: req.client};
			const result: IApiBinaryResult = await api.playlistController.image(options);
			await ApiResponder.binary(res, result);
		} catch (e) {
			await ApiResponder.error(res, e);
		}
	});

	router.get('/playlist/download', apiCheck('/playlist/download'), async (req, res) => {
		try {
			const options: JamRequest<JamParameters.Download> = {query: req.query, user: req.user, client: req.client};
			const result: IApiBinaryResult = await api.playlistController.download(options);
			await ApiResponder.binary(res, result);
		} catch (e) {
			await ApiResponder.error(res, e);
		}
	});

	router.get('/user/image', apiCheck('/user/image'), async (req, res) => {
		try {
			const options: JamRequest<JamParameters.Image> = {query: req.query, user: req.user, client: req.client};
			const result: IApiBinaryResult = await api.userController.image(options);
			await ApiResponder.binary(res, result);
		} catch (e) {
			await ApiResponder.error(res, e);
		}
	});

	router.get('/root/image', apiCheck('/root/image'), async (req, res) => {
		try {
			const options: JamRequest<JamParameters.Image> = {query: req.query, user: req.user, client: req.client};
			const result: IApiBinaryResult = await api.rootController.image(options);
			await ApiResponder.binary(res, result);
		} catch (e) {
			await ApiResponder.error(res, e);
		}
	});

	router.get('/image/:id-:size.:format', apiCheck('/image/{id}-{size}.{format}'), async (req, res) => {
		try {
			const options: JamRequest<JamParameters.Image> = {query: req.params, user: req.user, client: req.client};
			const result: IApiBinaryResult = await api.imageController.image(options);
			await ApiResponder.binary(res, result);
		} catch (e) {
			await ApiResponder.error(res, e);
		}
	});

	router.get('/image/:id-:size', apiCheck('/image/{id}-{size}'), async (req, res) => {
		try {
			const options: JamRequest<JamParameters.PathImageSize> = {query: req.params, user: req.user, client: req.client};
			const result: IApiBinaryResult = await api.imageController.image(options);
			await ApiResponder.binary(res, result);
		} catch (e) {
			await ApiResponder.error(res, e);
		}
	});

	router.get('/image/:id.:format', apiCheck('/image/{id}.{format}'), async (req, res) => {
		try {
			const options: JamRequest<JamParameters.PathImageFormat> = {query: req.params, user: req.user, client: req.client};
			const result: IApiBinaryResult = await api.imageController.image(options);
			await ApiResponder.binary(res, result);
		} catch (e) {
			await ApiResponder.error(res, e);
		}
	});

	router.get('/image/:id', apiCheck('/image/{id}'), async (req, res) => {
		try {
			const options: JamRequest<JamParameters.ID> = {query: req.params, user: req.user, client: req.client};
			const result: IApiBinaryResult = await api.imageController.image(options);
			await ApiResponder.binary(res, result);
		} catch (e) {
			await ApiResponder.error(res, e);
		}
	});

	router.get('/stream/:id.:format', apiCheck('/stream/{id}.{format}'), async (req, res) => {
		try {
			const options: JamRequest<JamParameters.PathStream> = {query: req.params, user: req.user, client: req.client};
			const result: IApiBinaryResult = await api.streamController.stream(options);
			await ApiResponder.binary(res, result);
		} catch (e) {
			await ApiResponder.error(res, e);
		}
	});

	router.get('/stream/:id', apiCheck('/stream/{id}'), async (req, res) => {
		try {
			const options: JamRequest<JamParameters.ID> = {query: req.params, user: req.user, client: req.client};
			const result: IApiBinaryResult = await api.streamController.stream(options);
			await ApiResponder.binary(res, result);
		} catch (e) {
			await ApiResponder.error(res, e);
		}
	});

	router.get('/waveform/:id.:format', apiCheck('/waveform/{id}.{format}'), async (req, res) => {
		try {
			const options: JamRequest<JamParameters.Waveform> = {query: req.params, user: req.user, client: req.client};
			const result: IApiBinaryResult = await api.waveformController.waveform(options);
			await ApiResponder.binary(res, result);
		} catch (e) {
			await ApiResponder.error(res, e);
		}
	});

	router.get('/download/:id', apiCheck('/download/{id}'), async (req, res) => {
		try {
			const options: JamRequest<JamParameters.ID> = {query: req.params, user: req.user, client: req.client};
			const result: IApiBinaryResult = await api.downloadController.download(options);
			await ApiResponder.binary(res, result);
		} catch (e) {
			await ApiResponder.error(res, e);
		}
	});

	router.get('/download/:id.:format', apiCheck('/download/{id}.{format}'), async (req, res) => {
		try {
			const options: JamRequest<JamParameters.Download> = {query: req.params, user: req.user, client: req.client};
			const result: IApiBinaryResult = await api.downloadController.download(options);
			await ApiResponder.binary(res, result);
		} catch (e) {
			await ApiResponder.error(res, e);
		}
	});

	router.post('/track/bookmark/delete', apiCheck('/track/bookmark/delete'), async (req, res) => {
		try {
			const options: JamRequest<JamParameters.ID> = {query: req.body, user: req.user, client: req.client};
			await api.trackController.bookmarkDelete(options);
			await ApiResponder.ok(res);
		} catch (e) {
			await ApiResponder.error(res, e);
		}
	});

	router.post('/chat/delete', apiCheck('/chat/delete'), async (req, res) => {
		try {
			const options: JamRequest<JamParameters.ChatDelete> = {query: req.body, user: req.user, client: req.client};
			await api.chatController.delete(options);
			await ApiResponder.ok(res);
		} catch (e) {
			await ApiResponder.error(res, e);
		}
	});

	router.post('/playlist/delete', apiCheck('/playlist/delete'), async (req, res) => {
		try {
			const options: JamRequest<JamParameters.ID> = {query: req.body, user: req.user, client: req.client};
			await api.playlistController.delete(options);
			await ApiResponder.ok(res);
		} catch (e) {
			await ApiResponder.error(res, e);
		}
	});

	router.post('/chat/create', apiCheck('/chat/create'), async (req, res) => {
		try {
			const options: JamRequest<JamParameters.ChatNew> = {query: req.body, user: req.user, client: req.client};
			await api.chatController.create(options);
			await ApiResponder.ok(res);
		} catch (e) {
			await ApiResponder.error(res, e);
		}
	});

	router.post('/track/fav/update', apiCheck('/track/fav/update'), async (req, res) => {
		try {
			const options: JamRequest<JamParameters.Fav> = {query: req.body, user: req.user, client: req.client};
			await api.trackController.favUpdate(options);
			await ApiResponder.ok(res);
		} catch (e) {
			await ApiResponder.error(res, e);
		}
	});

	router.post('/track/rate/update', apiCheck('/track/rate/update'), async (req, res) => {
		try {
			const options: JamRequest<JamParameters.Rate> = {query: req.body, user: req.user, client: req.client};
			await api.trackController.rateUpdate(options);
			await ApiResponder.ok(res);
		} catch (e) {
			await ApiResponder.error(res, e);
		}
	});

	router.post('/folder/fav/update', apiCheck('/folder/fav/update'), async (req, res) => {
		try {
			const options: JamRequest<JamParameters.Fav> = {query: req.body, user: req.user, client: req.client};
			await api.folderController.favUpdate(options);
			await ApiResponder.ok(res);
		} catch (e) {
			await ApiResponder.error(res, e);
		}
	});

	router.post('/folder/rate/update', apiCheck('/folder/rate/update'), async (req, res) => {
		try {
			const options: JamRequest<JamParameters.Rate> = {query: req.body, user: req.user, client: req.client};
			await api.folderController.rateUpdate(options);
			await ApiResponder.ok(res);
		} catch (e) {
			await ApiResponder.error(res, e);
		}
	});

	router.post('/track/bookmark/create', apiCheck('/track/bookmark/create'), async (req, res) => {
		try {
			const options: JamRequest<JamParameters.BookmarkCreate> = {query: req.body, user: req.user, client: req.client};
			const result: Jam.TrackBookmark = await api.trackController.bookmarkCreate(options);
			await ApiResponder.data(res, result);
		} catch (e) {
			await ApiResponder.error(res, e);
		}
	});

	router.post('/album/fav/update', apiCheck('/album/fav/update'), async (req, res) => {
		try {
			const options: JamRequest<JamParameters.Fav> = {query: req.body, user: req.user, client: req.client};
			await api.albumController.favUpdate(options);
			await ApiResponder.ok(res);
		} catch (e) {
			await ApiResponder.error(res, e);
		}
	});

	router.post('/album/rate/update', apiCheck('/album/rate/update'), async (req, res) => {
		try {
			const options: JamRequest<JamParameters.Rate> = {query: req.body, user: req.user, client: req.client};
			await api.albumController.rateUpdate(options);
			await ApiResponder.ok(res);
		} catch (e) {
			await ApiResponder.error(res, e);
		}
	});

	router.post('/artist/fav/update', apiCheck('/artist/fav/update'), async (req, res) => {
		try {
			const options: JamRequest<JamParameters.Fav> = {query: req.body, user: req.user, client: req.client};
			await api.artistController.favUpdate(options);
			await ApiResponder.ok(res);
		} catch (e) {
			await ApiResponder.error(res, e);
		}
	});

	router.post('/artist/rate/update', apiCheck('/artist/rate/update'), async (req, res) => {
		try {
			const options: JamRequest<JamParameters.Rate> = {query: req.body, user: req.user, client: req.client};
			await api.artistController.rateUpdate(options);
			await ApiResponder.ok(res);
		} catch (e) {
			await ApiResponder.error(res, e);
		}
	});

	router.post('/episode/fav/update', apiCheck('/episode/fav/update'), async (req, res) => {
		try {
			const options: JamRequest<JamParameters.Fav> = {query: req.body, user: req.user, client: req.client};
			await api.episodeController.favUpdate(options);
			await ApiResponder.ok(res);
		} catch (e) {
			await ApiResponder.error(res, e);
		}
	});

	router.post('/episode/rate/update', apiCheck('/episode/rate/update'), async (req, res) => {
		try {
			const options: JamRequest<JamParameters.Rate> = {query: req.body, user: req.user, client: req.client};
			await api.episodeController.rateUpdate(options);
			await ApiResponder.ok(res);
		} catch (e) {
			await ApiResponder.error(res, e);
		}
	});

	router.post('/podcast/fav/update', apiCheck('/podcast/fav/update'), async (req, res) => {
		try {
			const options: JamRequest<JamParameters.Fav> = {query: req.body, user: req.user, client: req.client};
			await api.podcastController.favUpdate(options);
			await ApiResponder.ok(res);
		} catch (e) {
			await ApiResponder.error(res, e);
		}
	});

	router.post('/podcast/rate/update', apiCheck('/podcast/rate/update'), async (req, res) => {
		try {
			const options: JamRequest<JamParameters.Rate> = {query: req.body, user: req.user, client: req.client};
			await api.podcastController.rateUpdate(options);
			await ApiResponder.ok(res);
		} catch (e) {
			await ApiResponder.error(res, e);
		}
	});

	router.post('/playlist/create', apiCheck('/playlist/create'), async (req, res) => {
		try {
			const options: JamRequest<JamParameters.PlaylistNew> = {query: req.body, user: req.user, client: req.client};
			const result: Jam.Playlist = await api.playlistController.create(options);
			await ApiResponder.data(res, result);
		} catch (e) {
			await ApiResponder.error(res, e);
		}
	});

	router.post('/playlist/update', apiCheck('/playlist/update'), async (req, res) => {
		try {
			const options: JamRequest<JamParameters.PlaylistUpdate> = {query: req.body, user: req.user, client: req.client};
			await api.playlistController.update(options);
			await ApiResponder.ok(res);
		} catch (e) {
			await ApiResponder.error(res, e);
		}
	});

	router.post('/playlist/fav/update', apiCheck('/playlist/fav/update'), async (req, res) => {
		try {
			const options: JamRequest<JamParameters.Fav> = {query: req.body, user: req.user, client: req.client};
			await api.playlistController.favUpdate(options);
			await ApiResponder.ok(res);
		} catch (e) {
			await ApiResponder.error(res, e);
		}
	});

	router.post('/playlist/rate/update', apiCheck('/playlist/rate/update'), async (req, res) => {
		try {
			const options: JamRequest<JamParameters.Rate> = {query: req.body, user: req.user, client: req.client};
			await api.playlistController.rateUpdate(options);
			await ApiResponder.ok(res);
		} catch (e) {
			await ApiResponder.error(res, e);
		}
	});

	router.post('/user/playqueue/update', apiCheck('/user/playqueue/update'), async (req, res) => {
		try {
			const options: JamRequest<JamParameters.PlayQueueSet> = {query: req.body, user: req.user, client: req.client};
			await api.userController.playqueueUpdate(options);
			await ApiResponder.ok(res);
		} catch (e) {
			await ApiResponder.error(res, e);
		}
	});

	router.post('/user/imageUpload/update', image, uploadAutoRemove, apiCheck('/user/imageUpload/update'), async (req, res) => {
		try {
			const options: JamRequest<JamParameters.ID> = {query: req.body, user: req.user, client: req.client, file: req.file ? req.file.path : undefined};
			await api.userController.imageUploadUpdate(options);
			await ApiResponder.ok(res);
		} catch (e) {
			await ApiResponder.error(res, e);
		}
	});
}

export function registerAdminApi(router: express.Router, api: JamController, image: express.RequestHandler, uploadAutoRemove: express.RequestHandler): void {
	router.get('/episode/retrieve', apiCheck('/episode/retrieve'), async (req, res) => {
		try {
			const options: JamRequest<JamParameters.ID> = {query: req.query, user: req.user, client: req.client};
			await api.episodeController.retrieve(options);
			await ApiResponder.ok(res);
		} catch (e) {
			await ApiResponder.error(res, e);
		}
	});

	router.get('/user/search', apiCheck('/user/search'), async (req, res) => {
		try {
			const options: JamRequest<JamParameters.UserSearch> = {query: req.query, user: req.user, client: req.client};
			const result: Array<Jam.User> = await api.userController.search(options);
			await ApiResponder.data(res, result);
		} catch (e) {
			await ApiResponder.error(res, e);
		}
	});

	router.get('/user/id', apiCheck('/user/id'), async (req, res) => {
		try {
			const options: JamRequest<JamParameters.ID> = {query: req.query, user: req.user, client: req.client};
			const result: Jam.User = await api.userController.id(options);
			await ApiResponder.data(res, result);
		} catch (e) {
			await ApiResponder.error(res, e);
		}
	});

	router.get('/user/ids', apiCheck('/user/ids'), async (req, res) => {
		try {
			const options: JamRequest<JamParameters.IDs> = {query: req.query, user: req.user, client: req.client};
			const result: Array<Jam.User> = await api.userController.ids(options);
			await ApiResponder.data(res, result);
		} catch (e) {
			await ApiResponder.error(res, e);
		}
	});

	router.get('/root/scan', apiCheck('/root/scan'), async (req, res) => {
		try {
			const options: JamRequest<JamParameters.ID> = {query: req.query, user: req.user, client: req.client};
			await api.rootController.scan(options);
			await ApiResponder.ok(res);
		} catch (e) {
			await ApiResponder.error(res, e);
		}
	});

	router.get('/root/scanAll', apiCheck('/root/scanAll'), async (req, res) => {
		try {
			const options: JamRequest<{}> = {query: req.query, user: req.user, client: req.client};
			await api.rootController.scanAll(options);
			await ApiResponder.ok(res);
		} catch (e) {
			await ApiResponder.error(res, e);
		}
	});

	router.post('/podcast/delete', apiCheck('/podcast/delete'), async (req, res) => {
		try {
			const options: JamRequest<JamParameters.ID> = {query: req.body, user: req.user, client: req.client};
			await api.podcastController.delete(options);
			await ApiResponder.ok(res);
		} catch (e) {
			await ApiResponder.error(res, e);
		}
	});

	router.post('/user/delete', apiCheck('/user/delete'), async (req, res) => {
		try {
			const options: JamRequest<JamParameters.ID> = {query: req.body, user: req.user, client: req.client};
			await api.userController.delete(options);
			await ApiResponder.ok(res);
		} catch (e) {
			await ApiResponder.error(res, e);
		}
	});

	router.post('/root/delete', apiCheck('/root/delete'), async (req, res) => {
		try {
			const options: JamRequest<JamParameters.ID> = {query: req.body, user: req.user, client: req.client};
			await api.rootController.delete(options);
			await ApiResponder.ok(res);
		} catch (e) {
			await ApiResponder.error(res, e);
		}
	});

	router.post('/track/tagID3/update', apiCheck('/track/tagID3/update'), async (req, res) => {
		try {
			const options: JamRequest<JamParameters.TagID3Update> = {query: req.body, user: req.user, client: req.client};
			await api.trackController.tagID3Update(options);
			await ApiResponder.ok(res);
		} catch (e) {
			await ApiResponder.error(res, e);
		}
	});

	router.post('/track/tagID3s/update', apiCheck('/track/tagID3s/update'), async (req, res) => {
		try {
			const options: JamRequest<JamParameters.TagID3sUpdate> = {query: req.body, user: req.user, client: req.client};
			await api.trackController.tagID3sUpdate(options);
			await ApiResponder.ok(res);
		} catch (e) {
			await ApiResponder.error(res, e);
		}
	});

	router.post('/folder/imageUpload/update', image, uploadAutoRemove, apiCheck('/folder/imageUpload/update'), async (req, res) => {
		try {
			const options: JamRequest<JamParameters.ID> = {query: req.body, user: req.user, client: req.client, file: req.file ? req.file.path : undefined};
			await api.folderController.imageUploadUpdate(options);
			await ApiResponder.ok(res);
		} catch (e) {
			await ApiResponder.error(res, e);
		}
	});

	router.post('/folder/imageUrl/update', apiCheck('/folder/imageUrl/update'), async (req, res) => {
		try {
			const options: JamRequest<JamParameters.FolderEditImg> = {query: req.body, user: req.user, client: req.client};
			await api.folderController.imageUrlUpdate(options);
			await ApiResponder.ok(res);
		} catch (e) {
			await ApiResponder.error(res, e);
		}
	});

	router.post('/folder/name/update', apiCheck('/folder/name/update'), async (req, res) => {
		try {
			const options: JamRequest<JamParameters.FolderEditName> = {query: req.body, user: req.user, client: req.client};
			await api.folderController.nameUpdate(options);
			await ApiResponder.ok(res);
		} catch (e) {
			await ApiResponder.error(res, e);
		}
	});

	router.post('/podcast/create', apiCheck('/podcast/create'), async (req, res) => {
		try {
			const options: JamRequest<JamParameters.PodcastNew> = {query: req.body, user: req.user, client: req.client};
			const result: Jam.Podcast = await api.podcastController.create(options);
			await ApiResponder.data(res, result);
		} catch (e) {
			await ApiResponder.error(res, e);
		}
	});

	router.post('/user/create', apiCheck('/user/create'), async (req, res) => {
		try {
			const options: JamRequest<JamParameters.UserNew> = {query: req.body, user: req.user, client: req.client};
			const result: Jam.User = await api.userController.create(options);
			await ApiResponder.data(res, result);
		} catch (e) {
			await ApiResponder.error(res, e);
		}
	});

	router.post('/user/update', apiCheck('/user/update'), async (req, res) => {
		try {
			const options: JamRequest<JamParameters.UserUpdate> = {query: req.body, user: req.user, client: req.client};
			await api.userController.update(options);
			await ApiResponder.ok(res);
		} catch (e) {
			await ApiResponder.error(res, e);
		}
	});

	router.post('/root/create', apiCheck('/root/create'), async (req, res) => {
		try {
			const options: JamRequest<JamParameters.RootNew> = {query: req.body, user: req.user, client: req.client};
			const result: Jam.Root = await api.rootController.create(options);
			await ApiResponder.data(res, result);
		} catch (e) {
			await ApiResponder.error(res, e);
		}
	});

	router.post('/root/update', apiCheck('/root/update'), async (req, res) => {
		try {
			const options: JamRequest<JamParameters.RootUpdate> = {query: req.body, user: req.user, client: req.client};
			await api.rootController.update(options);
			await ApiResponder.ok(res);
		} catch (e) {
			await ApiResponder.error(res, e);
		}
	});
}
