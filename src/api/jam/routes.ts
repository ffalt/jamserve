// THIS FILE IS GENERATED, DO NOT EDIT MANUALLY

import {Jam} from '../../model/jam-rest-data';
import {MusicBrainz} from '../../model/musicbrainz-rest-data';
import {Acoustid} from '../../model/acoustid-rest-data';
import {LastFM} from '../../model/lastfm-rest-data';
import {JamParameters} from '../../model/jam-rest-params';
import {JamController, JamRequest} from './api';
import {ApiResponder} from './response';
import express from 'express';
import {IApiBinaryResult} from '../../typings';

export type RegisterCallback = (req: express.Request, res: express.Response) => Promise<void>;
export interface Register {
	get: (name: string, execute: RegisterCallback, apiCheckName?: string, roles?: Array<string>) => void;
	post: (name: string, execute: RegisterCallback, apiCheckName?: string, roles?: Array<string>) => void;
	upload: (name: string, field: string, execute: RegisterCallback, apiCheckName?: string, roles?: Array<string>) => void;
}

export function registerPublicApi(register: Register, api: JamController): void {
	register.get('/ping', async (req, res) => {
		const options: JamRequest<{}> = {query: req.query, user: req.user, client: req.client};
		const result: Jam.Ping = await api.ping(options);
		await ApiResponder.data(res, result);
	});

	register.get('/session', async (req, res) => {
		const options: JamRequest<{}> = {query: req.query, user: req.user, client: req.client};
		const result: Jam.Session = await api.session(options);
		await ApiResponder.data(res, result);
	});
}

export function registerAccessControlApi(register: Register, api: JamController): void {
	register.get('/lastfm/lookup', async (req, res) => {
		const options: JamRequest<JamParameters.LastFMLookup> = {query: req.query, user: req.user, client: req.client};
		const result: LastFM.Result = await api.metadataController.lastfmLookup(options);
		await ApiResponder.data(res, result);
	});

	register.get('/acoustid/lookup', async (req, res) => {
		const options: JamRequest<JamParameters.AcoustidLookup> = {query: req.query, user: req.user, client: req.client};
		const result: Array<Acoustid.Result> = await api.metadataController.acoustidLookup(options);
		await ApiResponder.data(res, result);
	});

	register.get('/brainz/lookup', async (req, res) => {
		const options: JamRequest<JamParameters.BrainzLookup> = {query: req.query, user: req.user, client: req.client};
		const result: MusicBrainz.Response = await api.metadataController.brainzLookup(options);
		await ApiResponder.data(res, result);
	});

	register.get('/brainz/search', async (req, res) => {
		const options: JamRequest<JamParameters.BrainzSearch> = {query: req.query, user: req.user, client: req.client};
		const result: MusicBrainz.Response = await api.metadataController.brainzSearch(options);
		await ApiResponder.data(res, result);
	});

	register.get('/autocomplete', async (req, res) => {
		const options: JamRequest<JamParameters.AutoComplete> = {query: req.query, user: req.user, client: req.client};
		const result: Jam.AutoComplete = await api.autocompleteController.autocomplete(options);
		await ApiResponder.data(res, result);
	});

	register.get('/genre/list', async (req, res) => {
		const options: JamRequest<JamParameters.Genres> = {query: req.query, user: req.user, client: req.client};
		const result: Array<Jam.Genre> = await api.genreController.list(options);
		await ApiResponder.data(res, result);
	});

	register.get('/nowPlaying/list', async (req, res) => {
		const options: JamRequest<{}> = {query: req.query, user: req.user, client: req.client};
		const result: Array<Jam.NowPlaying> = await api.nowPlayingController.list(options);
		await ApiResponder.data(res, result);
	});

	register.get('/chat/list', async (req, res) => {
		const options: JamRequest<JamParameters.Chat> = {query: req.query, user: req.user, client: req.client};
		const result: Array<Jam.ChatMessage> = await api.chatController.list(options);
		await ApiResponder.data(res, result);
	});

	register.get('/folder/index', async (req, res) => {
		const options: JamRequest<JamParameters.Index> = {query: req.query, user: req.user, client: req.client};
		const result: Jam.FolderIndex = await api.folderController.index(options);
		await ApiResponder.data(res, result);
	});

	register.get('/folder/id', async (req, res) => {
		const options: JamRequest<JamParameters.Folder> = {query: req.query, user: req.user, client: req.client};
		const result: Jam.Folder = await api.folderController.id(options);
		await ApiResponder.data(res, result);
	});

	register.get('/folder/ids', async (req, res) => {
		const options: JamRequest<JamParameters.Folders> = {query: req.query, user: req.user, client: req.client};
		const result: Array<Jam.Folder> = await api.folderController.ids(options);
		await ApiResponder.data(res, result);
	});

	register.get('/folder/children', async (req, res) => {
		const options: JamRequest<JamParameters.FolderChildren> = {query: req.query, user: req.user, client: req.client};
		const result: Jam.FolderChildren = await api.folderController.children(options);
		await ApiResponder.data(res, result);
	});

	register.get('/folder/tracks', async (req, res) => {
		const options: JamRequest<JamParameters.FolderTracks> = {query: req.query, user: req.user, client: req.client};
		const result: Array<Jam.Track> = await api.folderController.tracks(options);
		await ApiResponder.data(res, result);
	});

	register.get('/folder/subfolders', async (req, res) => {
		const options: JamRequest<JamParameters.FolderSubFolders> = {query: req.query, user: req.user, client: req.client};
		const result: Array<Jam.Folder> = await api.folderController.subfolders(options);
		await ApiResponder.data(res, result);
	});

	register.get('/folder/artist/similar', async (req, res) => {
		const options: JamRequest<JamParameters.Folder> = {query: req.query, user: req.user, client: req.client};
		const result: Array<Jam.Folder> = await api.folderController.artistSimilar(options);
		await ApiResponder.data(res, result);
	});

	register.get('/folder/artist/info', async (req, res) => {
		const options: JamRequest<JamParameters.ArtistInfo> = {query: req.query, user: req.user, client: req.client};
		const result: Jam.ArtistFolderInfo = await api.folderController.artistInfo(options);
		await ApiResponder.data(res, result);
	});

	register.get('/folder/album/info', async (req, res) => {
		const options: JamRequest<JamParameters.AlbumInfo> = {query: req.query, user: req.user, client: req.client};
		const result: Jam.AlbumFolderInfo = await api.folderController.albumInfo(options);
		await ApiResponder.data(res, result);
	});

	register.get('/folder/list', async (req, res) => {
		const options: JamRequest<JamParameters.FolderList> = {query: req.query, user: req.user, client: req.client};
		const result: Array<Jam.Folder> = await api.folderController.list(options);
		await ApiResponder.data(res, result);
	});

	register.get('/folder/search', async (req, res) => {
		const options: JamRequest<JamParameters.FolderSearch> = {query: req.query, user: req.user, client: req.client};
		const result: Array<Jam.Folder> = await api.folderController.search(options);
		await ApiResponder.data(res, result);
	});

	register.get('/folder/state', async (req, res) => {
		const options: JamRequest<JamParameters.ID> = {query: req.query, user: req.user, client: req.client};
		const result: Jam.State = await api.folderController.state(options);
		await ApiResponder.data(res, result);
	});

	register.get('/folder/states', async (req, res) => {
		const options: JamRequest<JamParameters.IDs> = {query: req.query, user: req.user, client: req.client};
		const result: Jam.States = await api.folderController.states(options);
		await ApiResponder.data(res, result);
	});

	register.get('/folder/artist/similar/tracks', async (req, res) => {
		const options: JamRequest<JamParameters.SimilarTracks> = {query: req.query, user: req.user, client: req.client};
		const result: Array<Jam.Track> = await api.folderController.artistSimilarTracks(options);
		await ApiResponder.data(res, result);
	});

	register.get('/track/id', async (req, res) => {
		const options: JamRequest<JamParameters.Track> = {query: req.query, user: req.user, client: req.client};
		const result: Jam.Track = await api.trackController.id(options);
		await ApiResponder.data(res, result);
	});

	register.get('/track/ids', async (req, res) => {
		const options: JamRequest<JamParameters.Tracks> = {query: req.query, user: req.user, client: req.client};
		const result: Array<Jam.Track> = await api.trackController.ids(options);
		await ApiResponder.data(res, result);
	});

	register.get('/track/tagID3', async (req, res) => {
		const options: JamRequest<JamParameters.ID> = {query: req.query, user: req.user, client: req.client};
		const result: Jam.ID3Tag = await api.trackController.tagID3(options);
		await ApiResponder.data(res, result);
	});

	register.get('/track/tagID3s', async (req, res) => {
		const options: JamRequest<JamParameters.IDs> = {query: req.query, user: req.user, client: req.client};
		const result: Jam.ID3Tags = await api.trackController.tagID3s(options);
		await ApiResponder.data(res, result);
	});

	register.get('/track/search', async (req, res) => {
		const options: JamRequest<JamParameters.TrackSearch> = {query: req.query, user: req.user, client: req.client};
		const result: Array<Jam.Track> = await api.trackController.search(options);
		await ApiResponder.data(res, result);
	});

	register.get('/track/state', async (req, res) => {
		const options: JamRequest<JamParameters.ID> = {query: req.query, user: req.user, client: req.client};
		const result: Jam.State = await api.trackController.state(options);
		await ApiResponder.data(res, result);
	});

	register.get('/track/states', async (req, res) => {
		const options: JamRequest<JamParameters.IDs> = {query: req.query, user: req.user, client: req.client};
		const result: Jam.States = await api.trackController.states(options);
		await ApiResponder.data(res, result);
	});

	register.get('/track/list', async (req, res) => {
		const options: JamRequest<JamParameters.TrackList> = {query: req.query, user: req.user, client: req.client};
		const result: Array<Jam.Track> = await api.trackController.list(options);
		await ApiResponder.data(res, result);
	});

	register.get('/track/similar', async (req, res) => {
		const options: JamRequest<JamParameters.SimilarTracks> = {query: req.query, user: req.user, client: req.client};
		const result: Array<Jam.Track> = await api.trackController.similar(options);
		await ApiResponder.data(res, result);
	});

	register.get('/episode/id', async (req, res) => {
		const options: JamRequest<JamParameters.Episode> = {query: req.query, user: req.user, client: req.client};
		const result: Jam.PodcastEpisode = await api.episodeController.id(options);
		await ApiResponder.data(res, result);
	});

	register.get('/episode/ids', async (req, res) => {
		const options: JamRequest<JamParameters.Episodes> = {query: req.query, user: req.user, client: req.client};
		const result: Array<Jam.PodcastEpisode> = await api.episodeController.ids(options);
		await ApiResponder.data(res, result);
	});

	register.get('/episode/search', async (req, res) => {
		const options: JamRequest<JamParameters.EpisodeSearch> = {query: req.query, user: req.user, client: req.client};
		const result: Array<Jam.PodcastEpisode> = await api.episodeController.search(options);
		await ApiResponder.data(res, result);
	});

	register.get('/episode/retrieve', async (req, res) => {
		const options: JamRequest<JamParameters.ID> = {query: req.query, user: req.user, client: req.client};
		await api.episodeController.retrieve(options);
		await ApiResponder.ok(res);
	}, '/episode/retrieve', ['podcast']);

	register.get('/episode/state', async (req, res) => {
		const options: JamRequest<JamParameters.ID> = {query: req.query, user: req.user, client: req.client};
		const result: Jam.State = await api.episodeController.state(options);
		await ApiResponder.data(res, result);
	});

	register.get('/episode/states', async (req, res) => {
		const options: JamRequest<JamParameters.IDs> = {query: req.query, user: req.user, client: req.client};
		const result: Jam.States = await api.episodeController.states(options);
		await ApiResponder.data(res, result);
	});

	register.get('/episode/status', async (req, res) => {
		const options: JamRequest<JamParameters.ID> = {query: req.query, user: req.user, client: req.client};
		const result: Jam.PodcastEpisodeStatus = await api.episodeController.status(options);
		await ApiResponder.data(res, result);
	});

	register.get('/episode/list', async (req, res) => {
		const options: JamRequest<JamParameters.PodcastEpisodeList> = {query: req.query, user: req.user, client: req.client};
		const result: Array<Jam.PodcastEpisode> = await api.episodeController.list(options);
		await ApiResponder.data(res, result);
	});

	register.get('/podcast/id', async (req, res) => {
		const options: JamRequest<JamParameters.Podcast> = {query: req.query, user: req.user, client: req.client};
		const result: Jam.Podcast = await api.podcastController.id(options);
		await ApiResponder.data(res, result);
	});

	register.get('/podcast/ids', async (req, res) => {
		const options: JamRequest<JamParameters.Podcasts> = {query: req.query, user: req.user, client: req.client};
		const result: Array<Jam.Podcast> = await api.podcastController.ids(options);
		await ApiResponder.data(res, result);
	});

	register.get('/podcast/status', async (req, res) => {
		const options: JamRequest<JamParameters.ID> = {query: req.query, user: req.user, client: req.client};
		const result: Jam.PodcastStatus = await api.podcastController.status(options);
		await ApiResponder.data(res, result);
	});

	register.get('/podcast/search', async (req, res) => {
		const options: JamRequest<JamParameters.PodcastSearch> = {query: req.query, user: req.user, client: req.client};
		const result: Array<Jam.Podcast> = await api.podcastController.search(options);
		await ApiResponder.data(res, result);
	});

	register.get('/podcast/refreshAll', async (req, res) => {
		const options: JamRequest<{}> = {query: req.query, user: req.user, client: req.client};
		await api.podcastController.refreshAll(options);
		await ApiResponder.ok(res);
	}, '/podcast/refreshAll', ['podcast']);

	register.get('/podcast/refresh', async (req, res) => {
		const options: JamRequest<JamParameters.ID> = {query: req.query, user: req.user, client: req.client};
		await api.podcastController.refresh(options);
		await ApiResponder.ok(res);
	}, '/podcast/refresh', ['podcast']);

	register.get('/podcast/state', async (req, res) => {
		const options: JamRequest<JamParameters.ID> = {query: req.query, user: req.user, client: req.client};
		const result: Jam.State = await api.podcastController.state(options);
		await ApiResponder.data(res, result);
	});

	register.get('/podcast/states', async (req, res) => {
		const options: JamRequest<JamParameters.IDs> = {query: req.query, user: req.user, client: req.client};
		const result: Jam.States = await api.podcastController.states(options);
		await ApiResponder.data(res, result);
	});

	register.get('/podcast/list', async (req, res) => {
		const options: JamRequest<JamParameters.PodcastList> = {query: req.query, user: req.user, client: req.client};
		const result: Array<Jam.Podcast> = await api.podcastController.list(options);
		await ApiResponder.data(res, result);
	});

	register.get('/radio/id', async (req, res) => {
		const options: JamRequest<JamParameters.Radio> = {query: req.query, user: req.user, client: req.client};
		const result: Jam.Radio = await api.radioController.id(options);
		await ApiResponder.data(res, result);
	});

	register.get('/radio/ids', async (req, res) => {
		const options: JamRequest<JamParameters.Radios> = {query: req.query, user: req.user, client: req.client};
		const result: Array<Jam.Radio> = await api.radioController.ids(options);
		await ApiResponder.data(res, result);
	});

	register.get('/radio/search', async (req, res) => {
		const options: JamRequest<JamParameters.Radios> = {query: req.query, user: req.user, client: req.client};
		const result: Array<Jam.Radio> = await api.radioController.search(options);
		await ApiResponder.data(res, result);
	});

	register.get('/radio/state', async (req, res) => {
		const options: JamRequest<JamParameters.ID> = {query: req.query, user: req.user, client: req.client};
		const result: Jam.State = await api.radioController.state(options);
		await ApiResponder.data(res, result);
	});

	register.get('/radio/states', async (req, res) => {
		const options: JamRequest<JamParameters.IDs> = {query: req.query, user: req.user, client: req.client};
		const result: Jam.States = await api.radioController.states(options);
		await ApiResponder.data(res, result);
	});

	register.get('/artist/id', async (req, res) => {
		const options: JamRequest<JamParameters.Artist> = {query: req.query, user: req.user, client: req.client};
		const result: Jam.Artist = await api.artistController.id(options);
		await ApiResponder.data(res, result);
	});

	register.get('/artist/ids', async (req, res) => {
		const options: JamRequest<JamParameters.Artists> = {query: req.query, user: req.user, client: req.client};
		const result: Array<Jam.Artist> = await api.artistController.ids(options);
		await ApiResponder.data(res, result);
	});

	register.get('/artist/search', async (req, res) => {
		const options: JamRequest<JamParameters.ArtistSearch> = {query: req.query, user: req.user, client: req.client};
		const result: Array<Jam.Artist> = await api.artistController.search(options);
		await ApiResponder.data(res, result);
	});

	register.get('/artist/state', async (req, res) => {
		const options: JamRequest<JamParameters.ID> = {query: req.query, user: req.user, client: req.client};
		const result: Jam.State = await api.artistController.state(options);
		await ApiResponder.data(res, result);
	});

	register.get('/artist/states', async (req, res) => {
		const options: JamRequest<JamParameters.IDs> = {query: req.query, user: req.user, client: req.client};
		const result: Jam.States = await api.artistController.states(options);
		await ApiResponder.data(res, result);
	});

	register.get('/artist/list', async (req, res) => {
		const options: JamRequest<JamParameters.ArtistList> = {query: req.query, user: req.user, client: req.client};
		const result: Array<Jam.Artist> = await api.artistController.list(options);
		await ApiResponder.data(res, result);
	});

	register.get('/artist/similar/tracks', async (req, res) => {
		const options: JamRequest<JamParameters.SimilarTracks> = {query: req.query, user: req.user, client: req.client};
		const result: Array<Jam.Track> = await api.artistController.similarTracks(options);
		await ApiResponder.data(res, result);
	});

	register.get('/artist/similar', async (req, res) => {
		const options: JamRequest<JamParameters.Artist> = {query: req.query, user: req.user, client: req.client};
		const result: Array<Jam.Artist> = await api.artistController.similar(options);
		await ApiResponder.data(res, result);
	});

	register.get('/artist/index', async (req, res) => {
		const options: JamRequest<JamParameters.Index> = {query: req.query, user: req.user, client: req.client};
		const result: Jam.ArtistIndex = await api.artistController.index(options);
		await ApiResponder.data(res, result);
	});

	register.get('/artist/tracks', async (req, res) => {
		const options: JamRequest<JamParameters.Tracks> = {query: req.query, user: req.user, client: req.client};
		const result: Array<Jam.Track> = await api.artistController.tracks(options);
		await ApiResponder.data(res, result);
	});

	register.get('/album/id', async (req, res) => {
		const options: JamRequest<JamParameters.Album> = {query: req.query, user: req.user, client: req.client};
		const result: Jam.Album = await api.albumController.id(options);
		await ApiResponder.data(res, result);
	});

	register.get('/album/ids', async (req, res) => {
		const options: JamRequest<JamParameters.Albums> = {query: req.query, user: req.user, client: req.client};
		const result: Array<Jam.Album> = await api.albumController.ids(options);
		await ApiResponder.data(res, result);
	});

	register.get('/album/list', async (req, res) => {
		const options: JamRequest<JamParameters.AlbumList> = {query: req.query, user: req.user, client: req.client};
		const result: Array<Jam.Album> = await api.albumController.list(options);
		await ApiResponder.data(res, result);
	});

	register.get('/album/search', async (req, res) => {
		const options: JamRequest<JamParameters.AlbumSearch> = {query: req.query, user: req.user, client: req.client};
		const result: Array<Jam.Album> = await api.albumController.search(options);
		await ApiResponder.data(res, result);
	});

	register.get('/album/state', async (req, res) => {
		const options: JamRequest<JamParameters.ID> = {query: req.query, user: req.user, client: req.client};
		const result: Jam.State = await api.albumController.state(options);
		await ApiResponder.data(res, result);
	});

	register.get('/album/states', async (req, res) => {
		const options: JamRequest<JamParameters.IDs> = {query: req.query, user: req.user, client: req.client};
		const result: Jam.States = await api.albumController.states(options);
		await ApiResponder.data(res, result);
	});

	register.get('/album/similar/tracks', async (req, res) => {
		const options: JamRequest<JamParameters.SimilarTracks> = {query: req.query, user: req.user, client: req.client};
		const result: Array<Jam.Track> = await api.albumController.similarTracks(options);
		await ApiResponder.data(res, result);
	});

	register.get('/album/tracks', async (req, res) => {
		const options: JamRequest<JamParameters.Tracks> = {query: req.query, user: req.user, client: req.client};
		const result: Array<Jam.Track> = await api.albumController.tracks(options);
		await ApiResponder.data(res, result);
	});

	register.get('/playlist/id', async (req, res) => {
		const options: JamRequest<JamParameters.Playlist> = {query: req.query, user: req.user, client: req.client};
		const result: Jam.Playlist = await api.playlistController.id(options);
		await ApiResponder.data(res, result);
	});

	register.get('/playlist/ids', async (req, res) => {
		const options: JamRequest<JamParameters.Playlists> = {query: req.query, user: req.user, client: req.client};
		const result: Array<Jam.Playlist> = await api.playlistController.ids(options);
		await ApiResponder.data(res, result);
	});

	register.get('/playlist/search', async (req, res) => {
		const options: JamRequest<JamParameters.PlaylistSearch> = {query: req.query, user: req.user, client: req.client};
		const result: Array<Jam.Playlist> = await api.playlistController.search(options);
		await ApiResponder.data(res, result);
	});

	register.get('/playlist/state', async (req, res) => {
		const options: JamRequest<JamParameters.ID> = {query: req.query, user: req.user, client: req.client};
		const result: Jam.State = await api.playlistController.state(options);
		await ApiResponder.data(res, result);
	});

	register.get('/playlist/states', async (req, res) => {
		const options: JamRequest<JamParameters.IDs> = {query: req.query, user: req.user, client: req.client};
		const result: Jam.States = await api.playlistController.states(options);
		await ApiResponder.data(res, result);
	});

	register.get('/playlist/tracks', async (req, res) => {
		const options: JamRequest<JamParameters.Tracks> = {query: req.query, user: req.user, client: req.client};
		const result: Array<Jam.Track> = await api.playlistController.tracks(options);
		await ApiResponder.data(res, result);
	});

	register.get('/user/search', async (req, res) => {
		const options: JamRequest<JamParameters.UserSearch> = {query: req.query, user: req.user, client: req.client};
		const result: Array<Jam.User> = await api.userController.search(options);
		await ApiResponder.data(res, result);
	}, '/user/search', ['admin']);

	register.get('/user/id', async (req, res) => {
		const options: JamRequest<JamParameters.ID> = {query: req.query, user: req.user, client: req.client};
		const result: Jam.User = await api.userController.id(options);
		await ApiResponder.data(res, result);
	}, '/user/id', ['admin']);

	register.get('/user/ids', async (req, res) => {
		const options: JamRequest<JamParameters.IDs> = {query: req.query, user: req.user, client: req.client};
		const result: Array<Jam.User> = await api.userController.ids(options);
		await ApiResponder.data(res, result);
	}, '/user/ids', ['admin']);

	register.get('/playqueue/get', async (req, res) => {
		const options: JamRequest<JamParameters.PlayQueue> = {query: req.query, user: req.user, client: req.client};
		const result: Jam.PlayQueue = await api.playqueueController.get(options);
		await ApiResponder.data(res, result);
	});

	register.get('/root/search', async (req, res) => {
		const options: JamRequest<JamParameters.RootSearch> = {query: req.query, user: req.user, client: req.client};
		const result: Array<Jam.Root> = await api.rootController.search(options);
		await ApiResponder.data(res, result);
	});

	register.get('/root/id', async (req, res) => {
		const options: JamRequest<JamParameters.ID> = {query: req.query, user: req.user, client: req.client};
		const result: Jam.Root = await api.rootController.id(options);
		await ApiResponder.data(res, result);
	});

	register.get('/root/ids', async (req, res) => {
		const options: JamRequest<JamParameters.IDs> = {query: req.query, user: req.user, client: req.client};
		const result: Array<Jam.Root> = await api.rootController.ids(options);
		await ApiResponder.data(res, result);
	});

	register.get('/root/scan', async (req, res) => {
		const options: JamRequest<JamParameters.ID> = {query: req.query, user: req.user, client: req.client};
		await api.rootController.scan(options);
		await ApiResponder.ok(res);
	}, '/root/scan', ['admin']);

	register.get('/root/scanAll', async (req, res) => {
		const options: JamRequest<{}> = {query: req.query, user: req.user, client: req.client};
		await api.rootController.scanAll(options);
		await ApiResponder.ok(res);
	}, '/root/scanAll', ['admin']);

	register.get('/root/status', async (req, res) => {
		const options: JamRequest<JamParameters.ID> = {query: req.query, user: req.user, client: req.client};
		const result: Jam.RootStatus = await api.rootController.status(options);
		await ApiResponder.data(res, result);
	});

	register.get('/folder/download', async (req, res) => {
		const options: JamRequest<JamParameters.Download> = {query: req.query, user: req.user, client: req.client};
		const result: IApiBinaryResult = await api.folderController.download(options);
		await ApiResponder.binary(res, result);
	}, '/folder/download', ['stream']);

	register.get('/folder/image', async (req, res) => {
		const options: JamRequest<JamParameters.Image> = {query: req.query, user: req.user, client: req.client};
		const result: IApiBinaryResult = await api.folderController.image(options);
		await ApiResponder.binary(res, result);
	});

	register.get('/track/stream', async (req, res) => {
		const options: JamRequest<JamParameters.Stream> = {query: req.query, user: req.user, client: req.client};
		const result: IApiBinaryResult = await api.trackController.stream(options);
		await ApiResponder.binary(res, result);
	}, '/track/stream', ['stream']);

	register.get('/track/download', async (req, res) => {
		const options: JamRequest<JamParameters.Download> = {query: req.query, user: req.user, client: req.client};
		const result: IApiBinaryResult = await api.trackController.download(options);
		await ApiResponder.binary(res, result);
	}, '/track/download', ['stream']);

	register.get('/track/image', async (req, res) => {
		const options: JamRequest<JamParameters.Image> = {query: req.query, user: req.user, client: req.client};
		const result: IApiBinaryResult = await api.trackController.image(options);
		await ApiResponder.binary(res, result);
	});

	register.get('/episode/stream', async (req, res) => {
		const options: JamRequest<JamParameters.Stream> = {query: req.query, user: req.user, client: req.client};
		const result: IApiBinaryResult = await api.episodeController.stream(options);
		await ApiResponder.binary(res, result);
	}, '/episode/stream', ['stream']);

	register.get('/episode/download', async (req, res) => {
		const options: JamRequest<JamParameters.Download> = {query: req.query, user: req.user, client: req.client};
		const result: IApiBinaryResult = await api.episodeController.download(options);
		await ApiResponder.binary(res, result);
	}, '/episode/download', ['stream']);

	register.get('/episode/image', async (req, res) => {
		const options: JamRequest<JamParameters.Image> = {query: req.query, user: req.user, client: req.client};
		const result: IApiBinaryResult = await api.episodeController.image(options);
		await ApiResponder.binary(res, result);
	});

	register.get('/podcast/image', async (req, res) => {
		const options: JamRequest<JamParameters.Image> = {query: req.query, user: req.user, client: req.client};
		const result: IApiBinaryResult = await api.podcastController.image(options);
		await ApiResponder.binary(res, result);
	});

	register.get('/podcast/download', async (req, res) => {
		const options: JamRequest<JamParameters.Download> = {query: req.query, user: req.user, client: req.client};
		const result: IApiBinaryResult = await api.podcastController.download(options);
		await ApiResponder.binary(res, result);
	}, '/podcast/download', ['stream']);

	register.get('/artist/image', async (req, res) => {
		const options: JamRequest<JamParameters.Image> = {query: req.query, user: req.user, client: req.client};
		const result: IApiBinaryResult = await api.artistController.image(options);
		await ApiResponder.binary(res, result);
	});

	register.get('/artist/download', async (req, res) => {
		const options: JamRequest<JamParameters.Download> = {query: req.query, user: req.user, client: req.client};
		const result: IApiBinaryResult = await api.artistController.download(options);
		await ApiResponder.binary(res, result);
	}, '/artist/download', ['stream']);

	register.get('/album/image', async (req, res) => {
		const options: JamRequest<JamParameters.Image> = {query: req.query, user: req.user, client: req.client};
		const result: IApiBinaryResult = await api.albumController.image(options);
		await ApiResponder.binary(res, result);
	});

	register.get('/album/download', async (req, res) => {
		const options: JamRequest<JamParameters.Download> = {query: req.query, user: req.user, client: req.client};
		const result: IApiBinaryResult = await api.albumController.download(options);
		await ApiResponder.binary(res, result);
	}, '/album/download', ['stream']);

	register.get('/bookmark/list', async (req, res) => {
		const options: JamRequest<JamParameters.BookmarkList> = {query: req.query, user: req.user, client: req.client};
		const result: Array<Jam.Bookmark> = await api.bookmarkController.list(options);
		await ApiResponder.data(res, result);
	});

	register.get('/playlist/image', async (req, res) => {
		const options: JamRequest<JamParameters.Image> = {query: req.query, user: req.user, client: req.client};
		const result: IApiBinaryResult = await api.playlistController.image(options);
		await ApiResponder.binary(res, result);
	});

	register.get('/playlist/download', async (req, res) => {
		const options: JamRequest<JamParameters.Download> = {query: req.query, user: req.user, client: req.client};
		const result: IApiBinaryResult = await api.playlistController.download(options);
		await ApiResponder.binary(res, result);
	}, '/playlist/download', ['stream']);

	register.get('/user/image', async (req, res) => {
		const options: JamRequest<JamParameters.Image> = {query: req.query, user: req.user, client: req.client};
		const result: IApiBinaryResult = await api.userController.image(options);
		await ApiResponder.binary(res, result);
	});

	register.get('/root/image', async (req, res) => {
		const options: JamRequest<JamParameters.Image> = {query: req.query, user: req.user, client: req.client};
		const result: IApiBinaryResult = await api.rootController.image(options);
		await ApiResponder.binary(res, result);
	});

	register.get('/image/:id-:size.:format', async (req, res) => {
		const options: JamRequest<JamParameters.Image> = {query: req.params, user: req.user, client: req.client};
		const result: IApiBinaryResult = await api.imageController.image(options);
		await ApiResponder.binary(res, result);
	}, '/image/{id}-{size}.{format}');

	register.get('/image/:id-:size', async (req, res) => {
		const options: JamRequest<JamParameters.PathImageSize> = {query: req.params, user: req.user, client: req.client};
		const result: IApiBinaryResult = await api.imageController.image(options);
		await ApiResponder.binary(res, result);
	}, '/image/{id}-{size}');

	register.get('/image/:id.:format', async (req, res) => {
		const options: JamRequest<JamParameters.PathImageFormat> = {query: req.params, user: req.user, client: req.client};
		const result: IApiBinaryResult = await api.imageController.image(options);
		await ApiResponder.binary(res, result);
	}, '/image/{id}.{format}');

	register.get('/image/:id', async (req, res) => {
		const options: JamRequest<JamParameters.ID> = {query: req.params, user: req.user, client: req.client};
		const result: IApiBinaryResult = await api.imageController.image(options);
		await ApiResponder.binary(res, result);
	}, '/image/{id}');

	register.get('/stream/:id.:format', async (req, res) => {
		const options: JamRequest<JamParameters.PathStream> = {query: req.params, user: req.user, client: req.client};
		const result: IApiBinaryResult = await api.streamController.stream(options);
		await ApiResponder.binary(res, result);
	}, '/stream/{id}.{format}', ['stream']);

	register.get('/stream/:id', async (req, res) => {
		const options: JamRequest<JamParameters.ID> = {query: req.params, user: req.user, client: req.client};
		const result: IApiBinaryResult = await api.streamController.stream(options);
		await ApiResponder.binary(res, result);
	}, '/stream/{id}', ['stream']);

	register.get('/waveform/:id.:format', async (req, res) => {
		const options: JamRequest<JamParameters.Waveform> = {query: req.params, user: req.user, client: req.client};
		const result: IApiBinaryResult = await api.waveformController.waveform(options);
		await ApiResponder.binary(res, result);
	}, '/waveform/{id}.{format}', ['stream']);

	register.get('/download/:id', async (req, res) => {
		const options: JamRequest<JamParameters.ID> = {query: req.params, user: req.user, client: req.client};
		const result: IApiBinaryResult = await api.downloadController.download(options);
		await ApiResponder.binary(res, result);
	}, '/download/{id}', ['stream']);

	register.get('/download/:id.:format', async (req, res) => {
		const options: JamRequest<JamParameters.Download> = {query: req.params, user: req.user, client: req.client};
		const result: IApiBinaryResult = await api.downloadController.download(options);
		await ApiResponder.binary(res, result);
	}, '/download/{id}.{format}', ['stream']);

	register.post('/bookmark/delete', async (req, res) => {
		const options: JamRequest<JamParameters.ID> = {query: req.body, user: req.user, client: req.client};
		await api.bookmarkController.delete(options);
		await ApiResponder.ok(res);
	});

	register.post('/podcast/delete', async (req, res) => {
		const options: JamRequest<JamParameters.ID> = {query: req.body, user: req.user, client: req.client};
		await api.podcastController.delete(options);
		await ApiResponder.ok(res);
	}, '/podcast/delete', ['podcast']);

	register.post('/chat/delete', async (req, res) => {
		const options: JamRequest<JamParameters.ChatDelete> = {query: req.body, user: req.user, client: req.client};
		await api.chatController.delete(options);
		await ApiResponder.ok(res);
	});

	register.post('/playlist/delete', async (req, res) => {
		const options: JamRequest<JamParameters.ID> = {query: req.body, user: req.user, client: req.client};
		await api.playlistController.delete(options);
		await ApiResponder.ok(res);
	});

	register.post('/user/delete', async (req, res) => {
		const options: JamRequest<JamParameters.ID> = {query: req.body, user: req.user, client: req.client};
		await api.userController.delete(options);
		await ApiResponder.ok(res);
	}, '/user/delete', ['admin']);

	register.post('/root/delete', async (req, res) => {
		const options: JamRequest<JamParameters.ID> = {query: req.body, user: req.user, client: req.client};
		await api.rootController.delete(options);
		await ApiResponder.ok(res);
	}, '/root/delete', ['admin']);

	register.post('/radio/delete', async (req, res) => {
		const options: JamRequest<JamParameters.ID> = {query: req.body, user: req.user, client: req.client};
		await api.radioController.delete(options);
		await ApiResponder.ok(res);
	}, '/radio/delete', ['admin']);

	register.post('/chat/create', async (req, res) => {
		const options: JamRequest<JamParameters.ChatNew> = {query: req.body, user: req.user, client: req.client};
		await api.chatController.create(options);
		await ApiResponder.ok(res);
	});

	register.post('/track/fav/update', async (req, res) => {
		const options: JamRequest<JamParameters.Fav> = {query: req.body, user: req.user, client: req.client};
		await api.trackController.favUpdate(options);
		await ApiResponder.ok(res);
	});

	register.post('/track/rate/update', async (req, res) => {
		const options: JamRequest<JamParameters.Rate> = {query: req.body, user: req.user, client: req.client};
		await api.trackController.rateUpdate(options);
		await ApiResponder.ok(res);
	});

	register.post('/track/tagID3/update', async (req, res) => {
		const options: JamRequest<JamParameters.TagID3Update> = {query: req.body, user: req.user, client: req.client};
		await api.trackController.tagID3Update(options);
		await ApiResponder.ok(res);
	}, '/track/tagID3/update', ['admin']);

	register.post('/track/tagID3s/update', async (req, res) => {
		const options: JamRequest<JamParameters.TagID3sUpdate> = {query: req.body, user: req.user, client: req.client};
		await api.trackController.tagID3sUpdate(options);
		await ApiResponder.ok(res);
	}, '/track/tagID3s/update', ['admin']);

	register.post('/radio/update', async (req, res) => {
		const options: JamRequest<JamParameters.RadioUpdate> = {query: req.body, user: req.user, client: req.client};
		await api.radioController.update(options);
		await ApiResponder.ok(res);
	}, '/radio/update', ['admin']);

	register.upload('/folder/imageUpload/update', 'image', async (req, res) => {
		const options: JamRequest<JamParameters.ID> = {query: req.body, user: req.user, client: req.client, file: req.file ? req.file.path : undefined};
		await api.folderController.imageUploadUpdate(options);
		await ApiResponder.ok(res);
	}, '/folder/imageUpload/update', ['admin']);

	register.post('/folder/imageUrl/update', async (req, res) => {
		const options: JamRequest<JamParameters.FolderEditImg> = {query: req.body, user: req.user, client: req.client};
		await api.folderController.imageUrlUpdate(options);
		await ApiResponder.ok(res);
	}, '/folder/imageUrl/update', ['admin']);

	register.post('/folder/name/update', async (req, res) => {
		const options: JamRequest<JamParameters.FolderEditName> = {query: req.body, user: req.user, client: req.client};
		await api.folderController.nameUpdate(options);
		await ApiResponder.ok(res);
	}, '/folder/name/update', ['admin']);

	register.post('/folder/fav/update', async (req, res) => {
		const options: JamRequest<JamParameters.Fav> = {query: req.body, user: req.user, client: req.client};
		await api.folderController.favUpdate(options);
		await ApiResponder.ok(res);
	});

	register.post('/folder/rate/update', async (req, res) => {
		const options: JamRequest<JamParameters.Rate> = {query: req.body, user: req.user, client: req.client};
		await api.folderController.rateUpdate(options);
		await ApiResponder.ok(res);
	});

	register.post('/album/fav/update', async (req, res) => {
		const options: JamRequest<JamParameters.Fav> = {query: req.body, user: req.user, client: req.client};
		await api.albumController.favUpdate(options);
		await ApiResponder.ok(res);
	});

	register.post('/album/rate/update', async (req, res) => {
		const options: JamRequest<JamParameters.Rate> = {query: req.body, user: req.user, client: req.client};
		await api.albumController.rateUpdate(options);
		await ApiResponder.ok(res);
	});

	register.post('/artist/fav/update', async (req, res) => {
		const options: JamRequest<JamParameters.Fav> = {query: req.body, user: req.user, client: req.client};
		await api.artistController.favUpdate(options);
		await ApiResponder.ok(res);
	});

	register.post('/artist/rate/update', async (req, res) => {
		const options: JamRequest<JamParameters.Rate> = {query: req.body, user: req.user, client: req.client};
		await api.artistController.rateUpdate(options);
		await ApiResponder.ok(res);
	});

	register.post('/episode/fav/update', async (req, res) => {
		const options: JamRequest<JamParameters.Fav> = {query: req.body, user: req.user, client: req.client};
		await api.episodeController.favUpdate(options);
		await ApiResponder.ok(res);
	});

	register.post('/episode/rate/update', async (req, res) => {
		const options: JamRequest<JamParameters.Rate> = {query: req.body, user: req.user, client: req.client};
		await api.episodeController.rateUpdate(options);
		await ApiResponder.ok(res);
	});

	register.post('/bookmark/create', async (req, res) => {
		const options: JamRequest<JamParameters.BookmarkCreate> = {query: req.body, user: req.user, client: req.client};
		const result: Jam.Bookmark = await api.bookmarkController.create(options);
		await ApiResponder.data(res, result);
	});

	register.post('/radio/create', async (req, res) => {
		const options: JamRequest<JamParameters.RadioNew> = {query: req.body, user: req.user, client: req.client};
		const result: Jam.Radio = await api.radioController.create(options);
		await ApiResponder.data(res, result);
	}, '/radio/create', ['admin']);

	register.post('/podcast/create', async (req, res) => {
		const options: JamRequest<JamParameters.PodcastNew> = {query: req.body, user: req.user, client: req.client};
		const result: Jam.Podcast = await api.podcastController.create(options);
		await ApiResponder.data(res, result);
	}, '/podcast/create', ['podcast']);

	register.post('/podcast/fav/update', async (req, res) => {
		const options: JamRequest<JamParameters.Fav> = {query: req.body, user: req.user, client: req.client};
		await api.podcastController.favUpdate(options);
		await ApiResponder.ok(res);
	});

	register.post('/podcast/rate/update', async (req, res) => {
		const options: JamRequest<JamParameters.Rate> = {query: req.body, user: req.user, client: req.client};
		await api.podcastController.rateUpdate(options);
		await ApiResponder.ok(res);
	});

	register.post('/playlist/create', async (req, res) => {
		const options: JamRequest<JamParameters.PlaylistNew> = {query: req.body, user: req.user, client: req.client};
		const result: Jam.Playlist = await api.playlistController.create(options);
		await ApiResponder.data(res, result);
	});

	register.post('/playlist/update', async (req, res) => {
		const options: JamRequest<JamParameters.PlaylistUpdate> = {query: req.body, user: req.user, client: req.client};
		await api.playlistController.update(options);
		await ApiResponder.ok(res);
	});

	register.post('/playlist/fav/update', async (req, res) => {
		const options: JamRequest<JamParameters.Fav> = {query: req.body, user: req.user, client: req.client};
		await api.playlistController.favUpdate(options);
		await ApiResponder.ok(res);
	});

	register.post('/playlist/rate/update', async (req, res) => {
		const options: JamRequest<JamParameters.Rate> = {query: req.body, user: req.user, client: req.client};
		await api.playlistController.rateUpdate(options);
		await ApiResponder.ok(res);
	});

	register.post('/playqueue/update', async (req, res) => {
		const options: JamRequest<JamParameters.PlayQueueSet> = {query: req.body, user: req.user, client: req.client};
		await api.playqueueController.update(options);
		await ApiResponder.ok(res);
	});

	register.post('/playqueue/delete', async (req, res) => {
		const options: JamRequest<{}> = {query: req.body, user: req.user, client: req.client};
		await api.playqueueController.delete(options);
		await ApiResponder.ok(res);
	});

	register.post('/user/create', async (req, res) => {
		const options: JamRequest<JamParameters.UserNew> = {query: req.body, user: req.user, client: req.client};
		const result: Jam.User = await api.userController.create(options);
		await ApiResponder.data(res, result);
	}, '/user/create', ['admin']);

	register.post('/user/update', async (req, res) => {
		const options: JamRequest<JamParameters.UserUpdate> = {query: req.body, user: req.user, client: req.client};
		await api.userController.update(options);
		await ApiResponder.ok(res);
	}, '/user/update', ['admin']);

	register.post('/user/password/update', async (req, res) => {
		const options: JamRequest<JamParameters.UserPasswordUpdate> = {query: req.body, user: req.user, client: req.client};
		await api.userController.passwordUpdate(options);
		await ApiResponder.ok(res);
	});

	register.post('/user/email/update', async (req, res) => {
		const options: JamRequest<JamParameters.UserEmailUpdate> = {query: req.body, user: req.user, client: req.client};
		await api.userController.emailUpdate(options);
		await ApiResponder.ok(res);
	});

	register.upload('/user/imageUpload/update', 'image', async (req, res) => {
		const options: JamRequest<JamParameters.ID> = {query: req.body, user: req.user, client: req.client, file: req.file ? req.file.path : undefined};
		await api.userController.imageUploadUpdate(options);
		await ApiResponder.ok(res);
	});

	register.post('/root/create', async (req, res) => {
		const options: JamRequest<JamParameters.RootNew> = {query: req.body, user: req.user, client: req.client};
		const result: Jam.Root = await api.rootController.create(options);
		await ApiResponder.data(res, result);
	}, '/root/create', ['admin']);

	register.post('/root/update', async (req, res) => {
		const options: JamRequest<JamParameters.RootUpdate> = {query: req.body, user: req.user, client: req.client};
		await api.rootController.update(options);
		await ApiResponder.ok(res);
	}, '/root/update', ['admin']);
}
