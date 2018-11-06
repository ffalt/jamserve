import {Jam} from '../../model/jam-rest-data-0.1.0';
import {MusicBrainz} from '../../model/musicbrainz-rest-data-2.0';
import {Acoustid} from '../../model/acoustid-rest-data-2.0';
import {LastFM} from '../../model/lastfm-rest-data-2.0';
import {JamParameters} from '../../model/jam-rest-params-0.1.0';
import {ApiJam, ApiOptions} from './api';
import {ApiResponder} from './response';
import express from 'express';
import {IApiBinaryResult} from '../../typings';
import {apiCheck} from './check';

export function registerPublicApi(router: express.Router, api: ApiJam): void {
	router.get('/ping', apiCheck('/ping'), async (req, res) => {
		try {
			const options: ApiOptions<{}> = {query: req.query, user: req.user, client: req.client};
			const result: Jam.Ping = await api.ping(options);
			await ApiResponder.data(res, result);
		} catch (e) {
			await ApiResponder.error(res, e);
		}
	});

	router.get('/session', apiCheck('/session'), async (req, res) => {
		try {
			const options: ApiOptions<{}> = {query: req.query, user: req.user, client: req.client};
			const result: Jam.Session = await api.session(options);
			await ApiResponder.data(res, result);
		} catch (e) {
			await ApiResponder.error(res, e);
		}
	});
}

export function registerUserApi(router: express.Router, api: ApiJam, image: express.RequestHandler, uploadAutoRemove: express.RequestHandler): void {
	router.get('/lastfm/lookup', apiCheck('/lastfm/lookup'), async (req, res) => {
		try {
			const options: ApiOptions<JamParameters.LastFMLookup> = {query: req.query, user: req.user, client: req.client};
			const result: LastFM.Result = await api.metadata.lastfmLookup(options);
			await ApiResponder.data(res, result);
		} catch (e) {
			await ApiResponder.error(res, e);
		}
	});

	router.get('/acoustid/lookup', apiCheck('/acoustid/lookup'), async (req, res) => {
		try {
			const options: ApiOptions<JamParameters.AcoustidLookup> = {query: req.query, user: req.user, client: req.client};
			const result: Array<Acoustid.Result> = await api.metadata.acoustidLookup(options);
			await ApiResponder.data(res, result);
		} catch (e) {
			await ApiResponder.error(res, e);
		}
	});

	router.get('/brainz/lookup', apiCheck('/brainz/lookup'), async (req, res) => {
		try {
			const options: ApiOptions<JamParameters.BrainzLookup> = {query: req.query, user: req.user, client: req.client};
			const result: MusicBrainz.Response = await api.metadata.brainzLookup(options);
			await ApiResponder.data(res, result);
		} catch (e) {
			await ApiResponder.error(res, e);
		}
	});

	router.get('/brainz/search', apiCheck('/brainz/search'), async (req, res) => {
		try {
			const options: ApiOptions<JamParameters.BrainzSearch> = {query: req.query, user: req.user, client: req.client};
			const result: MusicBrainz.Response = await api.metadata.brainzSearch(options);
			await ApiResponder.data(res, result);
		} catch (e) {
			await ApiResponder.error(res, e);
		}
	});

	router.get('/genre/list', apiCheck('/genre/list'), async (req, res) => {
		try {
			const options: ApiOptions<JamParameters.Genres> = {query: req.query, user: req.user, client: req.client};
			const result: Array<Jam.Genre> = await api.genreList(options);
			await ApiResponder.data(res, result);
		} catch (e) {
			await ApiResponder.error(res, e);
		}
	});

	router.get('/nowPlaying', apiCheck('/nowPlaying'), async (req, res) => {
		try {
			const options: ApiOptions<{}> = {query: req.query, user: req.user, client: req.client};
			const result: Array<Jam.NowPlaying> = await api.nowPlaying(options);
			await ApiResponder.data(res, result);
		} catch (e) {
			await ApiResponder.error(res, e);
		}
	});

	router.get('/chat/list', apiCheck('/chat/list'), async (req, res) => {
		try {
			const options: ApiOptions<JamParameters.Chat> = {query: req.query, user: req.user, client: req.client};
			const result: Array<Jam.ChatMessage> = await api.chat.list(options);
			await ApiResponder.data(res, result);
		} catch (e) {
			await ApiResponder.error(res, e);
		}
	});

	router.get('/folder/index', apiCheck('/folder/index'), async (req, res) => {
		try {
			const options: ApiOptions<JamParameters.Index> = {query: req.query, user: req.user, client: req.client};
			const result: Jam.FolderIndex = await api.folder.index(options);
			await ApiResponder.data(res, result);
		} catch (e) {
			await ApiResponder.error(res, e);
		}
	});

	router.get('/folder/id', apiCheck('/folder/id'), async (req, res) => {
		try {
			const options: ApiOptions<JamParameters.Folder> = {query: req.query, user: req.user, client: req.client};
			const result: Jam.Folder = await api.folder.id(options);
			await ApiResponder.data(res, result);
		} catch (e) {
			await ApiResponder.error(res, e);
		}
	});

	router.get('/folder/ids', apiCheck('/folder/ids'), async (req, res) => {
		try {
			const options: ApiOptions<JamParameters.Folders> = {query: req.query, user: req.user, client: req.client};
			const result: Array<Jam.Folder> = await api.folder.ids(options);
			await ApiResponder.data(res, result);
		} catch (e) {
			await ApiResponder.error(res, e);
		}
	});

	router.get('/folder/children', apiCheck('/folder/children'), async (req, res) => {
		try {
			const options: ApiOptions<JamParameters.FolderChildren> = {query: req.query, user: req.user, client: req.client};
			const result: Jam.FolderChildren = await api.folder.children(options);
			await ApiResponder.data(res, result);
		} catch (e) {
			await ApiResponder.error(res, e);
		}
	});

	router.get('/folder/tracks', apiCheck('/folder/tracks'), async (req, res) => {
		try {
			const options: ApiOptions<JamParameters.FolderTracks> = {query: req.query, user: req.user, client: req.client};
			const result: Array<Jam.Track> = await api.folder.tracks(options);
			await ApiResponder.data(res, result);
		} catch (e) {
			await ApiResponder.error(res, e);
		}
	});

	router.get('/folder/subfolders', apiCheck('/folder/subfolders'), async (req, res) => {
		try {
			const options: ApiOptions<JamParameters.FolderSubFolders> = {query: req.query, user: req.user, client: req.client};
			const result: Array<Jam.Folder> = await api.folder.subfolders(options);
			await ApiResponder.data(res, result);
		} catch (e) {
			await ApiResponder.error(res, e);
		}
	});

	router.get('/folder/artist/similar', apiCheck('/folder/artist/similar'), async (req, res) => {
		try {
			const options: ApiOptions<JamParameters.Folder> = {query: req.query, user: req.user, client: req.client};
			const result: Array<Jam.Folder> = await api.folder.artistSimilar(options);
			await ApiResponder.data(res, result);
		} catch (e) {
			await ApiResponder.error(res, e);
		}
	});

	router.get('/folder/artist/info', apiCheck('/folder/artist/info'), async (req, res) => {
		try {
			const options: ApiOptions<JamParameters.ArtistInfo> = {query: req.query, user: req.user, client: req.client};
			const result: Jam.ArtistFolderInfo = await api.folder.artistInfo(options);
			await ApiResponder.data(res, result);
		} catch (e) {
			await ApiResponder.error(res, e);
		}
	});

	router.get('/folder/album/info', apiCheck('/folder/album/info'), async (req, res) => {
		try {
			const options: ApiOptions<JamParameters.AlbumInfo> = {query: req.query, user: req.user, client: req.client};
			const result: Jam.AlbumFolderInfo = await api.folder.albumInfo(options);
			await ApiResponder.data(res, result);
		} catch (e) {
			await ApiResponder.error(res, e);
		}
	});

	router.get('/folder/list', apiCheck('/folder/list'), async (req, res) => {
		try {
			const options: ApiOptions<JamParameters.FolderList> = {query: req.query, user: req.user, client: req.client};
			const result: Array<Jam.Folder> = await api.folder.list(options);
			await ApiResponder.data(res, result);
		} catch (e) {
			await ApiResponder.error(res, e);
		}
	});

	router.get('/folder/search', apiCheck('/folder/search'), async (req, res) => {
		try {
			const options: ApiOptions<JamParameters.FolderSearch> = {query: req.query, user: req.user, client: req.client};
			const result: Array<Jam.Folder> = await api.folder.search(options);
			await ApiResponder.data(res, result);
		} catch (e) {
			await ApiResponder.error(res, e);
		}
	});

	router.get('/folder/state', apiCheck('/folder/state'), async (req, res) => {
		try {
			const options: ApiOptions<JamParameters.ID> = {query: req.query, user: req.user, client: req.client};
			const result: Jam.State = await api.folder.state(options);
			await ApiResponder.data(res, result);
		} catch (e) {
			await ApiResponder.error(res, e);
		}
	});

	router.get('/folder/states', apiCheck('/folder/states'), async (req, res) => {
		try {
			const options: ApiOptions<JamParameters.IDs> = {query: req.query, user: req.user, client: req.client};
			const result: Jam.States = await api.folder.states(options);
			await ApiResponder.data(res, result);
		} catch (e) {
			await ApiResponder.error(res, e);
		}
	});

	router.get('/folder/artist/similar/tracks', apiCheck('/folder/artist/similar/tracks'), async (req, res) => {
		try {
			const options: ApiOptions<JamParameters.SimilarTracks> = {query: req.query, user: req.user, client: req.client};
			const result: Array<Jam.Track> = await api.folder.artistSimilarTracks(options);
			await ApiResponder.data(res, result);
		} catch (e) {
			await ApiResponder.error(res, e);
		}
	});

	router.get('/track/id', apiCheck('/track/id'), async (req, res) => {
		try {
			const options: ApiOptions<JamParameters.Track> = {query: req.query, user: req.user, client: req.client};
			const result: Jam.Track = await api.track.id(options);
			await ApiResponder.data(res, result);
		} catch (e) {
			await ApiResponder.error(res, e);
		}
	});

	router.get('/track/ids', apiCheck('/track/ids'), async (req, res) => {
		try {
			const options: ApiOptions<JamParameters.Tracks> = {query: req.query, user: req.user, client: req.client};
			const result: Array<Jam.Track> = await api.track.ids(options);
			await ApiResponder.data(res, result);
		} catch (e) {
			await ApiResponder.error(res, e);
		}
	});

	router.get('/track/tagID3', apiCheck('/track/tagID3'), async (req, res) => {
		try {
			const options: ApiOptions<JamParameters.ID> = {query: req.query, user: req.user, client: req.client};
			const result: Jam.ID3Tag = await api.track.tagID3(options);
			await ApiResponder.data(res, result);
		} catch (e) {
			await ApiResponder.error(res, e);
		}
	});

	router.get('/track/tagID3s', apiCheck('/track/tagID3s'), async (req, res) => {
		try {
			const options: ApiOptions<JamParameters.IDs> = {query: req.query, user: req.user, client: req.client};
			const result: Jam.ID3Tags = await api.track.tagID3s(options);
			await ApiResponder.data(res, result);
		} catch (e) {
			await ApiResponder.error(res, e);
		}
	});

	router.get('/track/search', apiCheck('/track/search'), async (req, res) => {
		try {
			const options: ApiOptions<JamParameters.TrackSearch> = {query: req.query, user: req.user, client: req.client};
			const result: Array<Jam.Track> = await api.track.search(options);
			await ApiResponder.data(res, result);
		} catch (e) {
			await ApiResponder.error(res, e);
		}
	});

	router.get('/track/state', apiCheck('/track/state'), async (req, res) => {
		try {
			const options: ApiOptions<JamParameters.ID> = {query: req.query, user: req.user, client: req.client};
			const result: Jam.State = await api.track.state(options);
			await ApiResponder.data(res, result);
		} catch (e) {
			await ApiResponder.error(res, e);
		}
	});

	router.get('/track/states', apiCheck('/track/states'), async (req, res) => {
		try {
			const options: ApiOptions<JamParameters.IDs> = {query: req.query, user: req.user, client: req.client};
			const result: Jam.States = await api.track.states(options);
			await ApiResponder.data(res, result);
		} catch (e) {
			await ApiResponder.error(res, e);
		}
	});

	router.get('/track/list', apiCheck('/track/list'), async (req, res) => {
		try {
			const options: ApiOptions<JamParameters.TrackList> = {query: req.query, user: req.user, client: req.client};
			const result: Array<Jam.Track> = await api.track.list(options);
			await ApiResponder.data(res, result);
		} catch (e) {
			await ApiResponder.error(res, e);
		}
	});

	router.get('/track/similar', apiCheck('/track/similar'), async (req, res) => {
		try {
			const options: ApiOptions<JamParameters.SimilarTracks> = {query: req.query, user: req.user, client: req.client};
			const result: Array<Jam.Track> = await api.track.similar(options);
			await ApiResponder.data(res, result);
		} catch (e) {
			await ApiResponder.error(res, e);
		}
	});

	router.get('/track/bookmark/list', apiCheck('/track/bookmark/list'), async (req, res) => {
		try {
			const options: ApiOptions<JamParameters.BookmarkList> = {query: req.query, user: req.user, client: req.client};
			const result: Array<Jam.TrackBookmark> = await api.track.bookmarkList(options);
			await ApiResponder.data(res, result);
		} catch (e) {
			await ApiResponder.error(res, e);
		}
	});

	router.get('/episode/id', apiCheck('/episode/id'), async (req, res) => {
		try {
			const options: ApiOptions<JamParameters.Episode> = {query: req.query, user: req.user, client: req.client};
			const result: Jam.PodcastEpisode = await api.episode.id(options);
			await ApiResponder.data(res, result);
		} catch (e) {
			await ApiResponder.error(res, e);
		}
	});

	router.get('/episode/ids', apiCheck('/episode/ids'), async (req, res) => {
		try {
			const options: ApiOptions<JamParameters.Episodes> = {query: req.query, user: req.user, client: req.client};
			const result: Array<Jam.PodcastEpisode> = await api.episode.ids(options);
			await ApiResponder.data(res, result);
		} catch (e) {
			await ApiResponder.error(res, e);
		}
	});

	router.get('/episode/search', apiCheck('/episode/search'), async (req, res) => {
		try {
			const options: ApiOptions<JamParameters.EpisodeSearch> = {query: req.query, user: req.user, client: req.client};
			const result: Array<Jam.PodcastEpisode> = await api.episode.search(options);
			await ApiResponder.data(res, result);
		} catch (e) {
			await ApiResponder.error(res, e);
		}
	});

	router.get('/episode/state', apiCheck('/episode/state'), async (req, res) => {
		try {
			const options: ApiOptions<JamParameters.ID> = {query: req.query, user: req.user, client: req.client};
			const result: Jam.State = await api.episode.state(options);
			await ApiResponder.data(res, result);
		} catch (e) {
			await ApiResponder.error(res, e);
		}
	});

	router.get('/episode/states', apiCheck('/episode/states'), async (req, res) => {
		try {
			const options: ApiOptions<JamParameters.IDs> = {query: req.query, user: req.user, client: req.client};
			const result: Jam.States = await api.episode.states(options);
			await ApiResponder.data(res, result);
		} catch (e) {
			await ApiResponder.error(res, e);
		}
	});

	router.get('/episode/status', apiCheck('/episode/status'), async (req, res) => {
		try {
			const options: ApiOptions<JamParameters.ID> = {query: req.query, user: req.user, client: req.client};
			const result: Jam.PodcastEpisodeStatus = await api.episode.status(options);
			await ApiResponder.data(res, result);
		} catch (e) {
			await ApiResponder.error(res, e);
		}
	});

	router.get('/podcast/id', apiCheck('/podcast/id'), async (req, res) => {
		try {
			const options: ApiOptions<JamParameters.Podcast> = {query: req.query, user: req.user, client: req.client};
			const result: Jam.Podcast = await api.podcast.id(options);
			await ApiResponder.data(res, result);
		} catch (e) {
			await ApiResponder.error(res, e);
		}
	});

	router.get('/podcast/ids', apiCheck('/podcast/ids'), async (req, res) => {
		try {
			const options: ApiOptions<JamParameters.Podcasts> = {query: req.query, user: req.user, client: req.client};
			const result: Array<Jam.Podcast> = await api.podcast.ids(options);
			await ApiResponder.data(res, result);
		} catch (e) {
			await ApiResponder.error(res, e);
		}
	});

	router.get('/podcast/status', apiCheck('/podcast/status'), async (req, res) => {
		try {
			const options: ApiOptions<JamParameters.ID> = {query: req.query, user: req.user, client: req.client};
			const result: Jam.PodcastStatus = await api.podcast.status(options);
			await ApiResponder.data(res, result);
		} catch (e) {
			await ApiResponder.error(res, e);
		}
	});

	router.get('/podcast/search', apiCheck('/podcast/search'), async (req, res) => {
		try {
			const options: ApiOptions<JamParameters.PodcastSearch> = {query: req.query, user: req.user, client: req.client};
			const result: Array<Jam.Podcast> = await api.podcast.search(options);
			await ApiResponder.data(res, result);
		} catch (e) {
			await ApiResponder.error(res, e);
		}
	});

	router.get('/podcast/refreshAll', apiCheck('/podcast/refreshAll'), async (req, res) => {
		try {
			const options: ApiOptions<{}> = {query: req.query, user: req.user, client: req.client};
			await api.podcast.refreshAll(options);
			await ApiResponder.ok(res);
		} catch (e) {
			await ApiResponder.error(res, e);
		}
	});

	router.get('/podcast/refresh', apiCheck('/podcast/refresh'), async (req, res) => {
		try {
			const options: ApiOptions<JamParameters.ID> = {query: req.query, user: req.user, client: req.client};
			await api.podcast.refresh(options);
			await ApiResponder.ok(res);
		} catch (e) {
			await ApiResponder.error(res, e);
		}
	});

	router.get('/podcast/state', apiCheck('/podcast/state'), async (req, res) => {
		try {
			const options: ApiOptions<JamParameters.ID> = {query: req.query, user: req.user, client: req.client};
			const result: Jam.State = await api.podcast.state(options);
			await ApiResponder.data(res, result);
		} catch (e) {
			await ApiResponder.error(res, e);
		}
	});

	router.get('/podcast/states', apiCheck('/podcast/states'), async (req, res) => {
		try {
			const options: ApiOptions<JamParameters.IDs> = {query: req.query, user: req.user, client: req.client};
			const result: Jam.States = await api.podcast.states(options);
			await ApiResponder.data(res, result);
		} catch (e) {
			await ApiResponder.error(res, e);
		}
	});

	router.get('/artist/id', apiCheck('/artist/id'), async (req, res) => {
		try {
			const options: ApiOptions<JamParameters.Artist> = {query: req.query, user: req.user, client: req.client};
			const result: Jam.Artist = await api.artist.id(options);
			await ApiResponder.data(res, result);
		} catch (e) {
			await ApiResponder.error(res, e);
		}
	});

	router.get('/artist/ids', apiCheck('/artist/ids'), async (req, res) => {
		try {
			const options: ApiOptions<JamParameters.Artists> = {query: req.query, user: req.user, client: req.client};
			const result: Array<Jam.Artist> = await api.artist.ids(options);
			await ApiResponder.data(res, result);
		} catch (e) {
			await ApiResponder.error(res, e);
		}
	});

	router.get('/artist/search', apiCheck('/artist/search'), async (req, res) => {
		try {
			const options: ApiOptions<JamParameters.ArtistSearch> = {query: req.query, user: req.user, client: req.client};
			const result: Array<Jam.Artist> = await api.artist.search(options);
			await ApiResponder.data(res, result);
		} catch (e) {
			await ApiResponder.error(res, e);
		}
	});

	router.get('/artist/state', apiCheck('/artist/state'), async (req, res) => {
		try {
			const options: ApiOptions<JamParameters.ID> = {query: req.query, user: req.user, client: req.client};
			const result: Jam.State = await api.artist.state(options);
			await ApiResponder.data(res, result);
		} catch (e) {
			await ApiResponder.error(res, e);
		}
	});

	router.get('/artist/states', apiCheck('/artist/states'), async (req, res) => {
		try {
			const options: ApiOptions<JamParameters.IDs> = {query: req.query, user: req.user, client: req.client};
			const result: Jam.States = await api.artist.states(options);
			await ApiResponder.data(res, result);
		} catch (e) {
			await ApiResponder.error(res, e);
		}
	});

	router.get('/artist/list', apiCheck('/artist/list'), async (req, res) => {
		try {
			const options: ApiOptions<JamParameters.ArtistList> = {query: req.query, user: req.user, client: req.client};
			const result: Array<Jam.Artist> = await api.artist.list(options);
			await ApiResponder.data(res, result);
		} catch (e) {
			await ApiResponder.error(res, e);
		}
	});

	router.get('/artist/similar/tracks', apiCheck('/artist/similar/tracks'), async (req, res) => {
		try {
			const options: ApiOptions<JamParameters.SimilarTracks> = {query: req.query, user: req.user, client: req.client};
			const result: Array<Jam.Track> = await api.artist.similarTracks(options);
			await ApiResponder.data(res, result);
		} catch (e) {
			await ApiResponder.error(res, e);
		}
	});

	router.get('/artist/similar', apiCheck('/artist/similar'), async (req, res) => {
		try {
			const options: ApiOptions<JamParameters.Artist> = {query: req.query, user: req.user, client: req.client};
			const result: Array<Jam.Artist> = await api.artist.similar(options);
			await ApiResponder.data(res, result);
		} catch (e) {
			await ApiResponder.error(res, e);
		}
	});

	router.get('/artist/index', apiCheck('/artist/index'), async (req, res) => {
		try {
			const options: ApiOptions<JamParameters.Index> = {query: req.query, user: req.user, client: req.client};
			const result: Jam.ArtistIndex = await api.artist.index(options);
			await ApiResponder.data(res, result);
		} catch (e) {
			await ApiResponder.error(res, e);
		}
	});

	router.get('/artist/tracks', apiCheck('/artist/tracks'), async (req, res) => {
		try {
			const options: ApiOptions<JamParameters.Tracks> = {query: req.query, user: req.user, client: req.client};
			const result: Array<Jam.Track> = await api.artist.tracks(options);
			await ApiResponder.data(res, result);
		} catch (e) {
			await ApiResponder.error(res, e);
		}
	});

	router.get('/album/id', apiCheck('/album/id'), async (req, res) => {
		try {
			const options: ApiOptions<JamParameters.Album> = {query: req.query, user: req.user, client: req.client};
			const result: Jam.Album = await api.album.id(options);
			await ApiResponder.data(res, result);
		} catch (e) {
			await ApiResponder.error(res, e);
		}
	});

	router.get('/album/ids', apiCheck('/album/ids'), async (req, res) => {
		try {
			const options: ApiOptions<JamParameters.Albums> = {query: req.query, user: req.user, client: req.client};
			const result: Array<Jam.Album> = await api.album.ids(options);
			await ApiResponder.data(res, result);
		} catch (e) {
			await ApiResponder.error(res, e);
		}
	});

	router.get('/album/list', apiCheck('/album/list'), async (req, res) => {
		try {
			const options: ApiOptions<JamParameters.AlbumList> = {query: req.query, user: req.user, client: req.client};
			const result: Array<Jam.Album> = await api.album.list(options);
			await ApiResponder.data(res, result);
		} catch (e) {
			await ApiResponder.error(res, e);
		}
	});

	router.get('/album/search', apiCheck('/album/search'), async (req, res) => {
		try {
			const options: ApiOptions<JamParameters.AlbumSearch> = {query: req.query, user: req.user, client: req.client};
			const result: Array<Jam.Album> = await api.album.search(options);
			await ApiResponder.data(res, result);
		} catch (e) {
			await ApiResponder.error(res, e);
		}
	});

	router.get('/album/state', apiCheck('/album/state'), async (req, res) => {
		try {
			const options: ApiOptions<JamParameters.ID> = {query: req.query, user: req.user, client: req.client};
			const result: Jam.State = await api.album.state(options);
			await ApiResponder.data(res, result);
		} catch (e) {
			await ApiResponder.error(res, e);
		}
	});

	router.get('/album/states', apiCheck('/album/states'), async (req, res) => {
		try {
			const options: ApiOptions<JamParameters.IDs> = {query: req.query, user: req.user, client: req.client};
			const result: Jam.States = await api.album.states(options);
			await ApiResponder.data(res, result);
		} catch (e) {
			await ApiResponder.error(res, e);
		}
	});

	router.get('/album/similar/tracks', apiCheck('/album/similar/tracks'), async (req, res) => {
		try {
			const options: ApiOptions<JamParameters.SimilarTracks> = {query: req.query, user: req.user, client: req.client};
			const result: Array<Jam.Track> = await api.album.similarTracks(options);
			await ApiResponder.data(res, result);
		} catch (e) {
			await ApiResponder.error(res, e);
		}
	});

	router.get('/album/tracks', apiCheck('/album/tracks'), async (req, res) => {
		try {
			const options: ApiOptions<JamParameters.Tracks> = {query: req.query, user: req.user, client: req.client};
			const result: Array<Jam.Track> = await api.album.tracks(options);
			await ApiResponder.data(res, result);
		} catch (e) {
			await ApiResponder.error(res, e);
		}
	});

	router.get('/playlist/id', apiCheck('/playlist/id'), async (req, res) => {
		try {
			const options: ApiOptions<JamParameters.Playlist> = {query: req.query, user: req.user, client: req.client};
			const result: Jam.Playlist = await api.playlist.id(options);
			await ApiResponder.data(res, result);
		} catch (e) {
			await ApiResponder.error(res, e);
		}
	});

	router.get('/playlist/ids', apiCheck('/playlist/ids'), async (req, res) => {
		try {
			const options: ApiOptions<JamParameters.Playlists> = {query: req.query, user: req.user, client: req.client};
			const result: Array<Jam.Playlist> = await api.playlist.ids(options);
			await ApiResponder.data(res, result);
		} catch (e) {
			await ApiResponder.error(res, e);
		}
	});

	router.get('/playlist/search', apiCheck('/playlist/search'), async (req, res) => {
		try {
			const options: ApiOptions<JamParameters.PlaylistSearch> = {query: req.query, user: req.user, client: req.client};
			const result: Array<Jam.Playlist> = await api.playlist.search(options);
			await ApiResponder.data(res, result);
		} catch (e) {
			await ApiResponder.error(res, e);
		}
	});

	router.get('/playlist/state', apiCheck('/playlist/state'), async (req, res) => {
		try {
			const options: ApiOptions<JamParameters.ID> = {query: req.query, user: req.user, client: req.client};
			const result: Jam.State = await api.playlist.state(options);
			await ApiResponder.data(res, result);
		} catch (e) {
			await ApiResponder.error(res, e);
		}
	});

	router.get('/playlist/states', apiCheck('/playlist/states'), async (req, res) => {
		try {
			const options: ApiOptions<JamParameters.IDs> = {query: req.query, user: req.user, client: req.client};
			const result: Jam.States = await api.playlist.states(options);
			await ApiResponder.data(res, result);
		} catch (e) {
			await ApiResponder.error(res, e);
		}
	});

	router.get('/playlist/tracks', apiCheck('/playlist/tracks'), async (req, res) => {
		try {
			const options: ApiOptions<JamParameters.Tracks> = {query: req.query, user: req.user, client: req.client};
			const result: Array<Jam.Track> = await api.playlist.tracks(options);
			await ApiResponder.data(res, result);
		} catch (e) {
			await ApiResponder.error(res, e);
		}
	});

	router.get('/user/playqueue', apiCheck('/user/playqueue'), async (req, res) => {
		try {
			const options: ApiOptions<JamParameters.IncludesPlayQueue> = {query: req.query, user: req.user, client: req.client};
			const result: Jam.PlayQueue = await api.user.playqueue(options);
			await ApiResponder.data(res, result);
		} catch (e) {
			await ApiResponder.error(res, e);
		}
	});

	router.get('/root/search', apiCheck('/root/search'), async (req, res) => {
		try {
			const options: ApiOptions<JamParameters.RootSearch> = {query: req.query, user: req.user, client: req.client};
			const result: Array<Jam.Root> = await api.root.search(options);
			await ApiResponder.data(res, result);
		} catch (e) {
			await ApiResponder.error(res, e);
		}
	});

	router.get('/root/id', apiCheck('/root/id'), async (req, res) => {
		try {
			const options: ApiOptions<JamParameters.ID> = {query: req.query, user: req.user, client: req.client};
			const result: Jam.Root = await api.root.id(options);
			await ApiResponder.data(res, result);
		} catch (e) {
			await ApiResponder.error(res, e);
		}
	});

	router.get('/root/ids', apiCheck('/root/ids'), async (req, res) => {
		try {
			const options: ApiOptions<JamParameters.IDs> = {query: req.query, user: req.user, client: req.client};
			const result: Array<Jam.Root> = await api.root.ids(options);
			await ApiResponder.data(res, result);
		} catch (e) {
			await ApiResponder.error(res, e);
		}
	});

	router.get('/root/status', apiCheck('/root/status'), async (req, res) => {
		try {
			const options: ApiOptions<JamParameters.ID> = {query: req.query, user: req.user, client: req.client};
			const result: Jam.RootStatus = await api.root.status(options);
			await ApiResponder.data(res, result);
		} catch (e) {
			await ApiResponder.error(res, e);
		}
	});

	router.get('/folder/download', apiCheck('/folder/download'), async (req, res) => {
		try {
			const options: ApiOptions<JamParameters.Download> = {query: req.query, user: req.user, client: req.client};
			const result: IApiBinaryResult = await api.folder.download(options);
			await ApiResponder.binary(res, result);
		} catch (e) {
			await ApiResponder.error(res, e);
		}
	});

	router.get('/folder/image', apiCheck('/folder/image'), async (req, res) => {
		try {
			const options: ApiOptions<JamParameters.Image> = {query: req.query, user: req.user, client: req.client};
			const result: IApiBinaryResult = await api.folder.image(options);
			await ApiResponder.binary(res, result);
		} catch (e) {
			await ApiResponder.error(res, e);
		}
	});

	router.get('/track/stream', apiCheck('/track/stream'), async (req, res) => {
		try {
			const options: ApiOptions<JamParameters.Stream> = {query: req.query, user: req.user, client: req.client};
			const result: IApiBinaryResult = await api.track.stream(options);
			await ApiResponder.binary(res, result);
		} catch (e) {
			await ApiResponder.error(res, e);
		}
	});

	router.get('/track/download', apiCheck('/track/download'), async (req, res) => {
		try {
			const options: ApiOptions<JamParameters.Download> = {query: req.query, user: req.user, client: req.client};
			const result: IApiBinaryResult = await api.track.download(options);
			await ApiResponder.binary(res, result);
		} catch (e) {
			await ApiResponder.error(res, e);
		}
	});

	router.get('/track/image', apiCheck('/track/image'), async (req, res) => {
		try {
			const options: ApiOptions<JamParameters.Image> = {query: req.query, user: req.user, client: req.client};
			const result: IApiBinaryResult = await api.track.image(options);
			await ApiResponder.binary(res, result);
		} catch (e) {
			await ApiResponder.error(res, e);
		}
	});

	router.get('/episode/stream', apiCheck('/episode/stream'), async (req, res) => {
		try {
			const options: ApiOptions<JamParameters.Stream> = {query: req.query, user: req.user, client: req.client};
			const result: IApiBinaryResult = await api.episode.stream(options);
			await ApiResponder.binary(res, result);
		} catch (e) {
			await ApiResponder.error(res, e);
		}
	});

	router.get('/episode/download', apiCheck('/episode/download'), async (req, res) => {
		try {
			const options: ApiOptions<JamParameters.Download> = {query: req.query, user: req.user, client: req.client};
			const result: IApiBinaryResult = await api.episode.download(options);
			await ApiResponder.binary(res, result);
		} catch (e) {
			await ApiResponder.error(res, e);
		}
	});

	router.get('/episode/image', apiCheck('/episode/image'), async (req, res) => {
		try {
			const options: ApiOptions<JamParameters.Image> = {query: req.query, user: req.user, client: req.client};
			const result: IApiBinaryResult = await api.episode.image(options);
			await ApiResponder.binary(res, result);
		} catch (e) {
			await ApiResponder.error(res, e);
		}
	});

	router.get('/podcast/image', apiCheck('/podcast/image'), async (req, res) => {
		try {
			const options: ApiOptions<JamParameters.Image> = {query: req.query, user: req.user, client: req.client};
			const result: IApiBinaryResult = await api.podcast.image(options);
			await ApiResponder.binary(res, result);
		} catch (e) {
			await ApiResponder.error(res, e);
		}
	});

	router.get('/podcast/download', apiCheck('/podcast/download'), async (req, res) => {
		try {
			const options: ApiOptions<JamParameters.Download> = {query: req.query, user: req.user, client: req.client};
			const result: IApiBinaryResult = await api.podcast.download(options);
			await ApiResponder.binary(res, result);
		} catch (e) {
			await ApiResponder.error(res, e);
		}
	});

	router.get('/artist/image', apiCheck('/artist/image'), async (req, res) => {
		try {
			const options: ApiOptions<JamParameters.Image> = {query: req.query, user: req.user, client: req.client};
			const result: IApiBinaryResult = await api.artist.image(options);
			await ApiResponder.binary(res, result);
		} catch (e) {
			await ApiResponder.error(res, e);
		}
	});

	router.get('/artist/download', apiCheck('/artist/download'), async (req, res) => {
		try {
			const options: ApiOptions<JamParameters.Download> = {query: req.query, user: req.user, client: req.client};
			const result: IApiBinaryResult = await api.artist.download(options);
			await ApiResponder.binary(res, result);
		} catch (e) {
			await ApiResponder.error(res, e);
		}
	});

	router.get('/album/image', apiCheck('/album/image'), async (req, res) => {
		try {
			const options: ApiOptions<JamParameters.Image> = {query: req.query, user: req.user, client: req.client};
			const result: IApiBinaryResult = await api.album.image(options);
			await ApiResponder.binary(res, result);
		} catch (e) {
			await ApiResponder.error(res, e);
		}
	});

	router.get('/album/download', apiCheck('/album/download'), async (req, res) => {
		try {
			const options: ApiOptions<JamParameters.Download> = {query: req.query, user: req.user, client: req.client};
			const result: IApiBinaryResult = await api.album.download(options);
			await ApiResponder.binary(res, result);
		} catch (e) {
			await ApiResponder.error(res, e);
		}
	});

	router.get('/playlist/image', apiCheck('/playlist/image'), async (req, res) => {
		try {
			const options: ApiOptions<JamParameters.Image> = {query: req.query, user: req.user, client: req.client};
			const result: IApiBinaryResult = await api.playlist.image(options);
			await ApiResponder.binary(res, result);
		} catch (e) {
			await ApiResponder.error(res, e);
		}
	});

	router.get('/playlist/download', apiCheck('/playlist/download'), async (req, res) => {
		try {
			const options: ApiOptions<JamParameters.Download> = {query: req.query, user: req.user, client: req.client};
			const result: IApiBinaryResult = await api.playlist.download(options);
			await ApiResponder.binary(res, result);
		} catch (e) {
			await ApiResponder.error(res, e);
		}
	});

	router.get('/user/image', apiCheck('/user/image'), async (req, res) => {
		try {
			const options: ApiOptions<JamParameters.Image> = {query: req.query, user: req.user, client: req.client};
			const result: IApiBinaryResult = await api.user.image(options);
			await ApiResponder.binary(res, result);
		} catch (e) {
			await ApiResponder.error(res, e);
		}
	});

	router.get('/root/image', apiCheck('/root/image'), async (req, res) => {
		try {
			const options: ApiOptions<JamParameters.Image> = {query: req.query, user: req.user, client: req.client};
			const result: IApiBinaryResult = await api.root.image(options);
			await ApiResponder.binary(res, result);
		} catch (e) {
			await ApiResponder.error(res, e);
		}
	});

	router.get('/image/:id-:size.:format', apiCheck('/image/{id}-{size}.{format}'), async (req, res) => {
		try {
			const options: ApiOptions<JamParameters.Image> = {query: req.params, user: req.user, client: req.client};
			const result: IApiBinaryResult = await api.image(options);
			await ApiResponder.binary(res, result);
		} catch (e) {
			await ApiResponder.error(res, e);
		}
	});

	router.get('/image/:id-:size', apiCheck('/image/{id}-{size}'), async (req, res) => {
		try {
			const options: ApiOptions<JamParameters.PathImageSize> = {query: req.params, user: req.user, client: req.client};
			const result: IApiBinaryResult = await api.image(options);
			await ApiResponder.binary(res, result);
		} catch (e) {
			await ApiResponder.error(res, e);
		}
	});

	router.get('/image/:id.:format', apiCheck('/image/{id}.{format}'), async (req, res) => {
		try {
			const options: ApiOptions<JamParameters.PathImageFormat> = {query: req.params, user: req.user, client: req.client};
			const result: IApiBinaryResult = await api.image(options);
			await ApiResponder.binary(res, result);
		} catch (e) {
			await ApiResponder.error(res, e);
		}
	});

	router.get('/image/:id', apiCheck('/image/{id}'), async (req, res) => {
		try {
			const options: ApiOptions<JamParameters.ID> = {query: req.params, user: req.user, client: req.client};
			const result: IApiBinaryResult = await api.image(options);
			await ApiResponder.binary(res, result);
		} catch (e) {
			await ApiResponder.error(res, e);
		}
	});

	router.get('/stream/:id.:format', apiCheck('/stream/{id}.{format}'), async (req, res) => {
		try {
			const options: ApiOptions<JamParameters.PathStream> = {query: req.params, user: req.user, client: req.client};
			const result: IApiBinaryResult = await api.stream(options);
			await ApiResponder.binary(res, result);
		} catch (e) {
			await ApiResponder.error(res, e);
		}
	});

	router.get('/stream/:id', apiCheck('/stream/{id}'), async (req, res) => {
		try {
			const options: ApiOptions<JamParameters.ID> = {query: req.params, user: req.user, client: req.client};
			const result: IApiBinaryResult = await api.stream(options);
			await ApiResponder.binary(res, result);
		} catch (e) {
			await ApiResponder.error(res, e);
		}
	});

	router.get('/streamSVG/:id', apiCheck('/streamSVG/{id}'), async (req, res) => {
		try {
			const options: ApiOptions<JamParameters.ID> = {query: req.params, user: req.user, client: req.client};
			const result: IApiBinaryResult = await api.streamSVG(options);
			await ApiResponder.binary(res, result);
		} catch (e) {
			await ApiResponder.error(res, e);
		}
	});

	router.get('/download/:id', apiCheck('/download/{id}'), async (req, res) => {
		try {
			const options: ApiOptions<JamParameters.ID> = {query: req.params, user: req.user, client: req.client};
			const result: IApiBinaryResult = await api.download(options);
			await ApiResponder.binary(res, result);
		} catch (e) {
			await ApiResponder.error(res, e);
		}
	});

	router.get('/download/:id.:format', apiCheck('/download/{id}.{format}'), async (req, res) => {
		try {
			const options: ApiOptions<JamParameters.Download> = {query: req.params, user: req.user, client: req.client};
			const result: IApiBinaryResult = await api.download(options);
			await ApiResponder.binary(res, result);
		} catch (e) {
			await ApiResponder.error(res, e);
		}
	});

	router.post('/track/bookmark/delete', apiCheck('/track/bookmark/delete'), async (req, res) => {
		try {
			const options: ApiOptions<JamParameters.ID> = {query: req.body, user: req.user, client: req.client};
			await api.track.bookmarkDelete(options);
			await ApiResponder.ok(res);
		} catch (e) {
			await ApiResponder.error(res, e);
		}
	});

	router.post('/chat/delete', apiCheck('/chat/delete'), async (req, res) => {
		try {
			const options: ApiOptions<JamParameters.ChatDelete> = {query: req.body, user: req.user, client: req.client};
			await api.chat.delete(options);
			await ApiResponder.ok(res);
		} catch (e) {
			await ApiResponder.error(res, e);
		}
	});

	router.post('/playlist/delete', apiCheck('/playlist/delete'), async (req, res) => {
		try {
			const options: ApiOptions<JamParameters.ID> = {query: req.body, user: req.user, client: req.client};
			await api.playlist.delete(options);
			await ApiResponder.ok(res);
		} catch (e) {
			await ApiResponder.error(res, e);
		}
	});

	router.post('/chat/create', apiCheck('/chat/create'), async (req, res) => {
		try {
			const options: ApiOptions<JamParameters.ChatNew> = {query: req.body, user: req.user, client: req.client};
			await api.chat.create(options);
			await ApiResponder.ok(res);
		} catch (e) {
			await ApiResponder.error(res, e);
		}
	});

	router.post('/track/fav/update', apiCheck('/track/fav/update'), async (req, res) => {
		try {
			const options: ApiOptions<JamParameters.Fav> = {query: req.body, user: req.user, client: req.client};
			await api.track.favUpdate(options);
			await ApiResponder.ok(res);
		} catch (e) {
			await ApiResponder.error(res, e);
		}
	});

	router.post('/track/rate/update', apiCheck('/track/rate/update'), async (req, res) => {
		try {
			const options: ApiOptions<JamParameters.Rate> = {query: req.body, user: req.user, client: req.client};
			await api.track.rateUpdate(options);
			await ApiResponder.ok(res);
		} catch (e) {
			await ApiResponder.error(res, e);
		}
	});

	router.post('/folder/fav/update', apiCheck('/folder/fav/update'), async (req, res) => {
		try {
			const options: ApiOptions<JamParameters.Fav> = {query: req.body, user: req.user, client: req.client};
			await api.folder.favUpdate(options);
			await ApiResponder.ok(res);
		} catch (e) {
			await ApiResponder.error(res, e);
		}
	});

	router.post('/folder/rate/update', apiCheck('/folder/rate/update'), async (req, res) => {
		try {
			const options: ApiOptions<JamParameters.Rate> = {query: req.body, user: req.user, client: req.client};
			await api.folder.rateUpdate(options);
			await ApiResponder.ok(res);
		} catch (e) {
			await ApiResponder.error(res, e);
		}
	});

	router.post('/track/bookmark/create', apiCheck('/track/bookmark/create'), async (req, res) => {
		try {
			const options: ApiOptions<JamParameters.BookmarkCreate> = {query: req.body, user: req.user, client: req.client};
			const result: Jam.TrackBookmark = await api.track.bookmarkCreate(options);
			await ApiResponder.data(res, result);
		} catch (e) {
			await ApiResponder.error(res, e);
		}
	});

	router.post('/album/fav/update', apiCheck('/album/fav/update'), async (req, res) => {
		try {
			const options: ApiOptions<JamParameters.Fav> = {query: req.body, user: req.user, client: req.client};
			await api.album.favUpdate(options);
			await ApiResponder.ok(res);
		} catch (e) {
			await ApiResponder.error(res, e);
		}
	});

	router.post('/album/rate/update', apiCheck('/album/rate/update'), async (req, res) => {
		try {
			const options: ApiOptions<JamParameters.Rate> = {query: req.body, user: req.user, client: req.client};
			await api.album.rateUpdate(options);
			await ApiResponder.ok(res);
		} catch (e) {
			await ApiResponder.error(res, e);
		}
	});

	router.post('/artist/fav/update', apiCheck('/artist/fav/update'), async (req, res) => {
		try {
			const options: ApiOptions<JamParameters.Fav> = {query: req.body, user: req.user, client: req.client};
			await api.artist.favUpdate(options);
			await ApiResponder.ok(res);
		} catch (e) {
			await ApiResponder.error(res, e);
		}
	});

	router.post('/artist/rate/update', apiCheck('/artist/rate/update'), async (req, res) => {
		try {
			const options: ApiOptions<JamParameters.Rate> = {query: req.body, user: req.user, client: req.client};
			await api.artist.rateUpdate(options);
			await ApiResponder.ok(res);
		} catch (e) {
			await ApiResponder.error(res, e);
		}
	});

	router.post('/episode/fav/update', apiCheck('/episode/fav/update'), async (req, res) => {
		try {
			const options: ApiOptions<JamParameters.Fav> = {query: req.body, user: req.user, client: req.client};
			await api.episode.favUpdate(options);
			await ApiResponder.ok(res);
		} catch (e) {
			await ApiResponder.error(res, e);
		}
	});

	router.post('/episode/rate/update', apiCheck('/episode/rate/update'), async (req, res) => {
		try {
			const options: ApiOptions<JamParameters.Rate> = {query: req.body, user: req.user, client: req.client};
			await api.episode.rateUpdate(options);
			await ApiResponder.ok(res);
		} catch (e) {
			await ApiResponder.error(res, e);
		}
	});

	router.post('/podcast/fav/update', apiCheck('/podcast/fav/update'), async (req, res) => {
		try {
			const options: ApiOptions<JamParameters.Fav> = {query: req.body, user: req.user, client: req.client};
			await api.podcast.favUpdate(options);
			await ApiResponder.ok(res);
		} catch (e) {
			await ApiResponder.error(res, e);
		}
	});

	router.post('/podcast/rate/update', apiCheck('/podcast/rate/update'), async (req, res) => {
		try {
			const options: ApiOptions<JamParameters.Rate> = {query: req.body, user: req.user, client: req.client};
			await api.podcast.rateUpdate(options);
			await ApiResponder.ok(res);
		} catch (e) {
			await ApiResponder.error(res, e);
		}
	});

	router.post('/playlist/create', apiCheck('/playlist/create'), async (req, res) => {
		try {
			const options: ApiOptions<JamParameters.PlaylistNew> = {query: req.body, user: req.user, client: req.client};
			const result: Jam.Playlist = await api.playlist.create(options);
			await ApiResponder.data(res, result);
		} catch (e) {
			await ApiResponder.error(res, e);
		}
	});

	router.post('/playlist/update', apiCheck('/playlist/update'), async (req, res) => {
		try {
			const options: ApiOptions<JamParameters.PlaylistUpdate> = {query: req.body, user: req.user, client: req.client};
			await api.playlist.update(options);
			await ApiResponder.ok(res);
		} catch (e) {
			await ApiResponder.error(res, e);
		}
	});

	router.post('/playlist/fav/update', apiCheck('/playlist/fav/update'), async (req, res) => {
		try {
			const options: ApiOptions<JamParameters.Fav> = {query: req.body, user: req.user, client: req.client};
			await api.playlist.favUpdate(options);
			await ApiResponder.ok(res);
		} catch (e) {
			await ApiResponder.error(res, e);
		}
	});

	router.post('/playlist/rate/update', apiCheck('/playlist/rate/update'), async (req, res) => {
		try {
			const options: ApiOptions<JamParameters.Rate> = {query: req.body, user: req.user, client: req.client};
			await api.playlist.rateUpdate(options);
			await ApiResponder.ok(res);
		} catch (e) {
			await ApiResponder.error(res, e);
		}
	});

	router.post('/user/playqueue/update', apiCheck('/user/playqueue/update'), async (req, res) => {
		try {
			const options: ApiOptions<JamParameters.PlayQueueSet> = {query: req.body, user: req.user, client: req.client};
			await api.user.playqueueUpdate(options);
			await ApiResponder.ok(res);
		} catch (e) {
			await ApiResponder.error(res, e);
		}
	});

	router.post('/user/imageUpload/update', image, uploadAutoRemove, apiCheck('/user/imageUpload/update'), async (req, res) => {
		try {
			const options: ApiOptions<JamParameters.ID> = {query: req.body, user: req.user, client: req.client, file: req.file ? req.file.path : undefined};
			await api.user.imageUploadUpdate(options);
			await ApiResponder.ok(res);
		} catch (e) {
			await ApiResponder.error(res, e);
		}
	});
}

export function registerAdminApi(router: express.Router, api: ApiJam, image: express.RequestHandler, uploadAutoRemove: express.RequestHandler): void {
	router.get('/episode/retrieve', apiCheck('/episode/retrieve'), async (req, res) => {
		try {
			const options: ApiOptions<JamParameters.ID> = {query: req.query, user: req.user, client: req.client};
			await api.episode.retrieve(options);
			await ApiResponder.ok(res);
		} catch (e) {
			await ApiResponder.error(res, e);
		}
	});

	router.get('/user/search', apiCheck('/user/search'), async (req, res) => {
		try {
			const options: ApiOptions<JamParameters.UserSearch> = {query: req.query, user: req.user, client: req.client};
			const result: Array<Jam.User> = await api.user.search(options);
			await ApiResponder.data(res, result);
		} catch (e) {
			await ApiResponder.error(res, e);
		}
	});

	router.get('/user/id', apiCheck('/user/id'), async (req, res) => {
		try {
			const options: ApiOptions<JamParameters.ID> = {query: req.query, user: req.user, client: req.client};
			const result: Jam.User = await api.user.id(options);
			await ApiResponder.data(res, result);
		} catch (e) {
			await ApiResponder.error(res, e);
		}
	});

	router.get('/user/ids', apiCheck('/user/ids'), async (req, res) => {
		try {
			const options: ApiOptions<JamParameters.IDs> = {query: req.query, user: req.user, client: req.client};
			const result: Array<Jam.User> = await api.user.ids(options);
			await ApiResponder.data(res, result);
		} catch (e) {
			await ApiResponder.error(res, e);
		}
	});

	router.get('/root/scan', apiCheck('/root/scan'), async (req, res) => {
		try {
			const options: ApiOptions<JamParameters.ID> = {query: req.query, user: req.user, client: req.client};
			await api.root.scan(options);
			await ApiResponder.ok(res);
		} catch (e) {
			await ApiResponder.error(res, e);
		}
	});

	router.get('/root/scanAll', apiCheck('/root/scanAll'), async (req, res) => {
		try {
			const options: ApiOptions<{}> = {query: req.query, user: req.user, client: req.client};
			await api.root.scanAll(options);
			await ApiResponder.ok(res);
		} catch (e) {
			await ApiResponder.error(res, e);
		}
	});

	router.post('/podcast/delete', apiCheck('/podcast/delete'), async (req, res) => {
		try {
			const options: ApiOptions<JamParameters.ID> = {query: req.body, user: req.user, client: req.client};
			await api.podcast.delete(options);
			await ApiResponder.ok(res);
		} catch (e) {
			await ApiResponder.error(res, e);
		}
	});

	router.post('/user/delete', apiCheck('/user/delete'), async (req, res) => {
		try {
			const options: ApiOptions<JamParameters.ID> = {query: req.body, user: req.user, client: req.client};
			await api.user.delete(options);
			await ApiResponder.ok(res);
		} catch (e) {
			await ApiResponder.error(res, e);
		}
	});

	router.post('/root/delete', apiCheck('/root/delete'), async (req, res) => {
		try {
			const options: ApiOptions<JamParameters.ID> = {query: req.body, user: req.user, client: req.client};
			await api.root.delete(options);
			await ApiResponder.ok(res);
		} catch (e) {
			await ApiResponder.error(res, e);
		}
	});

	router.post('/track/tagID3/update', apiCheck('/track/tagID3/update'), async (req, res) => {
		try {
			const options: ApiOptions<JamParameters.TagID3Update> = {query: req.body, user: req.user, client: req.client};
			await api.track.tagID3Update(options);
			await ApiResponder.ok(res);
		} catch (e) {
			await ApiResponder.error(res, e);
		}
	});

	router.post('/track/tagID3s/update', apiCheck('/track/tagID3s/update'), async (req, res) => {
		try {
			const options: ApiOptions<JamParameters.TagID3sUpdate> = {query: req.body, user: req.user, client: req.client};
			await api.track.tagID3sUpdate(options);
			await ApiResponder.ok(res);
		} catch (e) {
			await ApiResponder.error(res, e);
		}
	});

	router.post('/folder/imageUpload/update', image, uploadAutoRemove, apiCheck('/folder/imageUpload/update'), async (req, res) => {
		try {
			const options: ApiOptions<JamParameters.ID> = {query: req.body, user: req.user, client: req.client, file: req.file ? req.file.path : undefined};
			await api.folder.imageUploadUpdate(options);
			await ApiResponder.ok(res);
		} catch (e) {
			await ApiResponder.error(res, e);
		}
	});

	router.post('/folder/imageUrl/update', apiCheck('/folder/imageUrl/update'), async (req, res) => {
		try {
			const options: ApiOptions<JamParameters.FolderEditImg> = {query: req.body, user: req.user, client: req.client};
			await api.folder.imageUrlUpdate(options);
			await ApiResponder.ok(res);
		} catch (e) {
			await ApiResponder.error(res, e);
		}
	});

	router.post('/folder/name/update', apiCheck('/folder/name/update'), async (req, res) => {
		try {
			const options: ApiOptions<JamParameters.FolderEditName> = {query: req.body, user: req.user, client: req.client};
			await api.folder.nameUpdate(options);
			await ApiResponder.ok(res);
		} catch (e) {
			await ApiResponder.error(res, e);
		}
	});

	router.post('/podcast/create', apiCheck('/podcast/create'), async (req, res) => {
		try {
			const options: ApiOptions<JamParameters.PodcastNew> = {query: req.body, user: req.user, client: req.client};
			const result: Jam.Podcast = await api.podcast.create(options);
			await ApiResponder.data(res, result);
		} catch (e) {
			await ApiResponder.error(res, e);
		}
	});

	router.post('/user/create', apiCheck('/user/create'), async (req, res) => {
		try {
			const options: ApiOptions<JamParameters.UserNew> = {query: req.body, user: req.user, client: req.client};
			const result: Jam.User = await api.user.create(options);
			await ApiResponder.data(res, result);
		} catch (e) {
			await ApiResponder.error(res, e);
		}
	});

	router.post('/user/update', apiCheck('/user/update'), async (req, res) => {
		try {
			const options: ApiOptions<JamParameters.UserUpdate> = {query: req.body, user: req.user, client: req.client};
			await api.user.update(options);
			await ApiResponder.ok(res);
		} catch (e) {
			await ApiResponder.error(res, e);
		}
	});

	router.post('/root/create', apiCheck('/root/create'), async (req, res) => {
		try {
			const options: ApiOptions<JamParameters.RootNew> = {query: req.body, user: req.user, client: req.client};
			const result: Jam.Root = await api.root.create(options);
			await ApiResponder.data(res, result);
		} catch (e) {
			await ApiResponder.error(res, e);
		}
	});

	router.post('/root/update', apiCheck('/root/update'), async (req, res) => {
		try {
			const options: ApiOptions<JamParameters.RootUpdate> = {query: req.body, user: req.user, client: req.client};
			await api.root.update(options);
			await ApiResponder.ok(res);
		} catch (e) {
			await ApiResponder.error(res, e);
		}
	});
}
