// THIS FILE IS GENERATED, DO NOT EDIT MANUALLY

import express from 'express';
import {Jam} from '../../model/jam-rest-data';
import {JamParameters} from '../../model/jam-rest-params';
import {ApiBinaryResult} from '../../typings';
import {JamApi, JamRequest} from './api';
import {UserRequest} from './login';
import {ApiResponder} from './response';

export type JamApiRole = 'admin' | 'podcast' | 'stream';
export type RegisterCallback = (req: UserRequest, res: express.Response) => Promise<void>;
export interface Register {
	get(name: string, execute: RegisterCallback, roles?: Array<JamApiRole>, apiCheckName?: string): void;
	post(name: string, execute: RegisterCallback, roles?: Array<JamApiRole>, apiCheckName?: string): void;
	upload(name: string, field: string, execute: RegisterCallback, roles?: Array<JamApiRole>, apiCheckName?: string): void;
}

export function registerPublicApi(register: Register, api: JamApi): void {
	register.get('/ping', async (req, res) => {
		const options: JamRequest<{}> = {query: req.query, user: req.user, client: req.client};
		const result: Jam.Ping = await api.sessionController.ping(options);
		ApiResponder.data(req, res, result);
	});
	register.get('/session', async (req, res) => {
		const options: JamRequest<{}> = {query: req.query, user: req.user, client: req.client};
		const result: Jam.Session = await api.sessionController.session(options);
		ApiResponder.data(req, res, result);
	});
}

export function registerAccessControlApi(register: Register, api: JamApi): void {
	register.get('/lastfm/lookup', async (req, res) => {
		const options: JamRequest<JamParameters.LastFMLookup> = {query: req.query, user: req.user, client: req.client};
		const result: Jam.LastFMResponse = await api.metadataController.lastfmLookup(options);
		ApiResponder.data(req, res, result);
	});
	register.get('/lyricsovh/search', async (req, res) => {
		const options: JamRequest<JamParameters.LyricsOVHSearch> = {query: req.query, user: req.user, client: req.client};
		const result: Jam.LyricsOVHResponse = await api.metadataController.lyricsovhSearch(options);
		ApiResponder.data(req, res, result);
	});
	register.get('/acoustid/lookup', async (req, res) => {
		const options: JamRequest<JamParameters.AcoustidLookup> = {query: req.query, user: req.user, client: req.client};
		const result: Array<Jam.AcoustidResponse> = await api.metadataController.acoustidLookup(options);
		ApiResponder.data(req, res, result);
	});
	register.get('/musicbrainz/lookup', async (req, res) => {
		const options: JamRequest<JamParameters.MusicBrainzLookup> = {query: req.query, user: req.user, client: req.client};
		const result: Jam.MusicBrainzResponse = await api.metadataController.musicbrainzLookup(options);
		ApiResponder.data(req, res, result);
	});
	register.get('/musicbrainz/search', async (req, res) => {
		const options: JamRequest<JamParameters.MusicBrainzSearch> = {query: req.query, user: req.user, client: req.client};
		const result: Jam.MusicBrainzResponse = await api.metadataController.musicbrainzSearch(options);
		ApiResponder.data(req, res, result);
	});
	register.get('/acousticbrainz/lookup', async (req, res) => {
		const options: JamRequest<JamParameters.AcousticBrainzLookup> = {query: req.query, user: req.user, client: req.client};
		const result: Jam.AcousticBrainzResponse = await api.metadataController.acousticbrainzLookup(options);
		ApiResponder.data(req, res, result);
	});
	register.get('/coverartarchive/lookup', async (req, res) => {
		const options: JamRequest<JamParameters.CoverArtArchiveLookup> = {query: req.query, user: req.user, client: req.client};
		const result: Jam.CoverArtArchiveResponse = await api.metadataController.coverartarchiveLookup(options);
		ApiResponder.data(req, res, result);
	});
	register.get('/wikipedia/summary', async (req, res) => {
		const options: JamRequest<JamParameters.WikipediaSummary> = {query: req.query, user: req.user, client: req.client};
		const result: Jam.WikipediaSummaryResponse = await api.metadataController.wikipediaSummary(options);
		ApiResponder.data(req, res, result);
	});
	register.get('/wikidata/summary', async (req, res) => {
		const options: JamRequest<JamParameters.WikidataSummary> = {query: req.query, user: req.user, client: req.client};
		const result: Jam.WikipediaSummaryResponse = await api.metadataController.wikidataSummary(options);
		ApiResponder.data(req, res, result);
	});
	register.get('/wikidata/lookup', async (req, res) => {
		const options: JamRequest<JamParameters.WikidataLookup> = {query: req.query, user: req.user, client: req.client};
		const result: Jam.WikidataLookupResponse = await api.metadataController.wikidataLookup(options);
		ApiResponder.data(req, res, result);
	});
	register.get('/autocomplete', async (req, res) => {
		const options: JamRequest<JamParameters.AutoComplete> = {query: req.query, user: req.user, client: req.client};
		const result: Jam.AutoComplete = await api.autocompleteController.autocomplete(options);
		ApiResponder.data(req, res, result);
	});
	register.get('/genre/list', async (req, res) => {
		const options: JamRequest<JamParameters.Genres> = {query: req.query, user: req.user, client: req.client};
		const result: Jam.GenreList = await api.genreController.list(options);
		ApiResponder.data(req, res, result);
	});
	register.get('/stats', async (req, res) => {
		const options: JamRequest<JamParameters.Stats> = {query: req.query, user: req.user, client: req.client};
		const result: Jam.Stats = await api.statsController.get(options);
		ApiResponder.data(req, res, result);
	});
	register.get('/nowPlaying/list', async (req, res) => {
		const options: JamRequest<JamParameters.NowPlaying> = {query: req.query, user: req.user, client: req.client};
		const result: Jam.NowPlayingList = await api.nowPlayingController.list(options);
		ApiResponder.data(req, res, result);
	});
	register.get('/chat/list', async (req, res) => {
		const options: JamRequest<JamParameters.Chat> = {query: req.query, user: req.user, client: req.client};
		const result: Array<Jam.ChatMessage> = await api.chatController.list(options);
		ApiResponder.data(req, res, result);
	});
	register.get('/folder/index', async (req, res) => {
		const options: JamRequest<JamParameters.FolderIndex> = {query: req.query, user: req.user, client: req.client};
		const result: Jam.FolderIndex = await api.folderController.index(options);
		ApiResponder.data(req, res, result);
	});
	register.get('/folder/id', async (req, res) => {
		const options: JamRequest<JamParameters.Folder> = {query: req.query, user: req.user, client: req.client};
		const result: Jam.Folder = await api.folderController.id(options);
		ApiResponder.data(req, res, result);
	});
	register.get('/folder/ids', async (req, res) => {
		const options: JamRequest<JamParameters.Folders> = {query: req.query, user: req.user, client: req.client};
		const result: Array<Jam.Folder> = await api.folderController.ids(options);
		ApiResponder.data(req, res, result);
	});
	register.get('/folder/tracks', async (req, res) => {
		const options: JamRequest<JamParameters.FolderTracks> = {query: req.query, user: req.user, client: req.client};
		const result: Jam.TrackList = await api.folderController.tracks(options);
		ApiResponder.data(req, res, result);
	});
	register.get('/folder/subfolders', async (req, res) => {
		const options: JamRequest<JamParameters.FolderSubFolders> = {query: req.query, user: req.user, client: req.client};
		const result: Jam.FolderList = await api.folderController.subfolders(options);
		ApiResponder.data(req, res, result);
	});
	register.get('/folder/artist/similar', async (req, res) => {
		const options: JamRequest<JamParameters.SimilarFolders> = {query: req.query, user: req.user, client: req.client};
		const result: Jam.FolderList = await api.folderController.artistSimilar(options);
		ApiResponder.data(req, res, result);
	});
	register.get('/folder/artist/info', async (req, res) => {
		const options: JamRequest<JamParameters.ID> = {query: req.query, user: req.user, client: req.client};
		const result: Jam.Info = await api.folderController.artistInfo(options);
		ApiResponder.data(req, res, result);
	});
	register.get('/folder/album/info', async (req, res) => {
		const options: JamRequest<JamParameters.ID> = {query: req.query, user: req.user, client: req.client};
		const result: Jam.Info = await api.folderController.albumInfo(options);
		ApiResponder.data(req, res, result);
	});
	register.get('/folder/list', async (req, res) => {
		const options: JamRequest<JamParameters.FolderList> = {query: req.query, user: req.user, client: req.client};
		const result: Jam.FolderList = await api.folderController.list(options);
		ApiResponder.data(req, res, result);
	});
	register.get('/folder/search', async (req, res) => {
		const options: JamRequest<JamParameters.FolderSearch> = {query: req.query, user: req.user, client: req.client};
		const result: Jam.FolderList = await api.folderController.search(options);
		ApiResponder.data(req, res, result);
	});
	register.get('/folder/health', async (req, res) => {
		const options: JamRequest<JamParameters.FolderHealth> = {query: req.query, user: req.user, client: req.client};
		const result: Array<Jam.FolderHealth> = await api.folderController.health(options);
		ApiResponder.data(req, res, result);
	}, ['admin']);
	register.get('/folder/state', async (req, res) => {
		const options: JamRequest<JamParameters.ID> = {query: req.query, user: req.user, client: req.client};
		const result: Jam.State = await api.folderController.state(options);
		ApiResponder.data(req, res, result);
	});
	register.get('/folder/states', async (req, res) => {
		const options: JamRequest<JamParameters.IDs> = {query: req.query, user: req.user, client: req.client};
		const result: Jam.States = await api.folderController.states(options);
		ApiResponder.data(req, res, result);
	});
	register.get('/folder/artist/similar/tracks', async (req, res) => {
		const options: JamRequest<JamParameters.SimilarTracks> = {query: req.query, user: req.user, client: req.client};
		const result: Jam.TrackList = await api.folderController.artistSimilarTracks(options);
		ApiResponder.data(req, res, result);
	});
	register.get('/folder/artworks', async (req, res) => {
		const options: JamRequest<JamParameters.ID> = {query: req.query, user: req.user, client: req.client};
		const result: Array<Jam.ArtworkImage> = await api.folderController.artworks(options);
		ApiResponder.data(req, res, result);
	});
	register.get('/track/id', async (req, res) => {
		const options: JamRequest<JamParameters.Track> = {query: req.query, user: req.user, client: req.client};
		const result: Jam.Track = await api.trackController.id(options);
		ApiResponder.data(req, res, result);
	});
	register.get('/track/ids', async (req, res) => {
		const options: JamRequest<JamParameters.Tracks> = {query: req.query, user: req.user, client: req.client};
		const result: Array<Jam.Track> = await api.trackController.ids(options);
		ApiResponder.data(req, res, result);
	});
	register.get('/track/rawTag', async (req, res) => {
		const options: JamRequest<JamParameters.ID> = {query: req.query, user: req.user, client: req.client};
		const result: Jam.RawTag = await api.trackController.rawTag(options);
		ApiResponder.data(req, res, result);
	});
	register.get('/track/rawTags', async (req, res) => {
		const options: JamRequest<JamParameters.IDs> = {query: req.query, user: req.user, client: req.client};
		const result: Jam.RawTags = await api.trackController.rawTags(options);
		ApiResponder.data(req, res, result);
	});
	register.get('/track/search', async (req, res) => {
		const options: JamRequest<JamParameters.TrackSearch> = {query: req.query, user: req.user, client: req.client};
		const result: Jam.TrackList = await api.trackController.search(options);
		ApiResponder.data(req, res, result);
	});
	register.get('/track/state', async (req, res) => {
		const options: JamRequest<JamParameters.ID> = {query: req.query, user: req.user, client: req.client};
		const result: Jam.State = await api.trackController.state(options);
		ApiResponder.data(req, res, result);
	});
	register.get('/track/states', async (req, res) => {
		const options: JamRequest<JamParameters.IDs> = {query: req.query, user: req.user, client: req.client};
		const result: Jam.States = await api.trackController.states(options);
		ApiResponder.data(req, res, result);
	});
	register.get('/track/list', async (req, res) => {
		const options: JamRequest<JamParameters.TrackList> = {query: req.query, user: req.user, client: req.client};
		const result: Jam.TrackList = await api.trackController.list(options);
		ApiResponder.data(req, res, result);
	});
	register.get('/track/similar', async (req, res) => {
		const options: JamRequest<JamParameters.SimilarTracks> = {query: req.query, user: req.user, client: req.client};
		const result: Jam.TrackList = await api.trackController.similar(options);
		ApiResponder.data(req, res, result);
	});
	register.get('/track/health', async (req, res) => {
		const options: JamRequest<JamParameters.TrackHealth> = {query: req.query, user: req.user, client: req.client};
		const result: Array<Jam.TrackHealth> = await api.trackController.health(options);
		ApiResponder.data(req, res, result);
	}, ['admin']);
	register.get('/track/lyrics', async (req, res) => {
		const options: JamRequest<JamParameters.ID> = {query: req.query, user: req.user, client: req.client};
		const result: Jam.TrackLyrics = await api.trackController.lyrics(options);
		ApiResponder.data(req, res, result);
	});
	register.get('/episode/id', async (req, res) => {
		const options: JamRequest<JamParameters.Episode> = {query: req.query, user: req.user, client: req.client};
		const result: Jam.PodcastEpisode = await api.episodeController.id(options);
		ApiResponder.data(req, res, result);
	});
	register.get('/episode/ids', async (req, res) => {
		const options: JamRequest<JamParameters.Episodes> = {query: req.query, user: req.user, client: req.client};
		const result: Array<Jam.PodcastEpisode> = await api.episodeController.ids(options);
		ApiResponder.data(req, res, result);
	});
	register.get('/episode/search', async (req, res) => {
		const options: JamRequest<JamParameters.EpisodeSearch> = {query: req.query, user: req.user, client: req.client};
		const result: Jam.PodcastEpisodeList = await api.episodeController.search(options);
		ApiResponder.data(req, res, result);
	});
	register.get('/episode/retrieve', async (req, res) => {
		const options: JamRequest<JamParameters.ID> = {query: req.query, user: req.user, client: req.client};
		await api.episodeController.retrieve(options);
		ApiResponder.ok(req, res);
	}, ['podcast']);
	register.get('/episode/state', async (req, res) => {
		const options: JamRequest<JamParameters.ID> = {query: req.query, user: req.user, client: req.client};
		const result: Jam.State = await api.episodeController.state(options);
		ApiResponder.data(req, res, result);
	});
	register.get('/episode/states', async (req, res) => {
		const options: JamRequest<JamParameters.IDs> = {query: req.query, user: req.user, client: req.client};
		const result: Jam.States = await api.episodeController.states(options);
		ApiResponder.data(req, res, result);
	});
	register.get('/episode/status', async (req, res) => {
		const options: JamRequest<JamParameters.ID> = {query: req.query, user: req.user, client: req.client};
		const result: Jam.PodcastEpisodeStatus = await api.episodeController.status(options);
		ApiResponder.data(req, res, result);
	});
	register.get('/episode/list', async (req, res) => {
		const options: JamRequest<JamParameters.PodcastEpisodeList> = {query: req.query, user: req.user, client: req.client};
		const result: Jam.PodcastEpisodeList = await api.episodeController.list(options);
		ApiResponder.data(req, res, result);
	});
	register.get('/podcast/id', async (req, res) => {
		const options: JamRequest<JamParameters.Podcast> = {query: req.query, user: req.user, client: req.client};
		const result: Jam.Podcast = await api.podcastController.id(options);
		ApiResponder.data(req, res, result);
	});
	register.get('/podcast/ids', async (req, res) => {
		const options: JamRequest<JamParameters.Podcasts> = {query: req.query, user: req.user, client: req.client};
		const result: Array<Jam.Podcast> = await api.podcastController.ids(options);
		ApiResponder.data(req, res, result);
	});
	register.get('/podcast/status', async (req, res) => {
		const options: JamRequest<JamParameters.ID> = {query: req.query, user: req.user, client: req.client};
		const result: Jam.PodcastStatus = await api.podcastController.status(options);
		ApiResponder.data(req, res, result);
	});
	register.get('/podcast/search', async (req, res) => {
		const options: JamRequest<JamParameters.PodcastSearch> = {query: req.query, user: req.user, client: req.client};
		const result: Jam.PodcastList = await api.podcastController.search(options);
		ApiResponder.data(req, res, result);
	});
	register.get('/podcast/episodes', async (req, res) => {
		const options: JamRequest<JamParameters.PodcastEpisodes> = {query: req.query, user: req.user, client: req.client};
		const result: Jam.PodcastEpisodeList = await api.podcastController.episodes(options);
		ApiResponder.data(req, res, result);
	});
	register.get('/podcast/refreshAll', async (req, res) => {
		const options: JamRequest<{}> = {query: req.query, user: req.user, client: req.client};
		await api.podcastController.refreshAll(options);
		ApiResponder.ok(req, res);
	}, ['podcast']);
	register.get('/podcast/refresh', async (req, res) => {
		const options: JamRequest<JamParameters.ID> = {query: req.query, user: req.user, client: req.client};
		await api.podcastController.refresh(options);
		ApiResponder.ok(req, res);
	}, ['podcast']);
	register.get('/podcast/state', async (req, res) => {
		const options: JamRequest<JamParameters.ID> = {query: req.query, user: req.user, client: req.client};
		const result: Jam.State = await api.podcastController.state(options);
		ApiResponder.data(req, res, result);
	});
	register.get('/podcast/states', async (req, res) => {
		const options: JamRequest<JamParameters.IDs> = {query: req.query, user: req.user, client: req.client};
		const result: Jam.States = await api.podcastController.states(options);
		ApiResponder.data(req, res, result);
	});
	register.get('/podcast/list', async (req, res) => {
		const options: JamRequest<JamParameters.PodcastList> = {query: req.query, user: req.user, client: req.client};
		const result: Jam.PodcastList = await api.podcastController.list(options);
		ApiResponder.data(req, res, result);
	});
	register.get('/radio/id', async (req, res) => {
		const options: JamRequest<JamParameters.Radio> = {query: req.query, user: req.user, client: req.client};
		const result: Jam.Radio = await api.radioController.id(options);
		ApiResponder.data(req, res, result);
	});
	register.get('/radio/ids', async (req, res) => {
		const options: JamRequest<JamParameters.Radios> = {query: req.query, user: req.user, client: req.client};
		const result: Array<Jam.Radio> = await api.radioController.ids(options);
		ApiResponder.data(req, res, result);
	});
	register.get('/radio/search', async (req, res) => {
		const options: JamRequest<JamParameters.RadioSearch> = {query: req.query, user: req.user, client: req.client};
		const result: Jam.RadioList = await api.radioController.search(options);
		ApiResponder.data(req, res, result);
	});
	register.get('/radio/state', async (req, res) => {
		const options: JamRequest<JamParameters.ID> = {query: req.query, user: req.user, client: req.client};
		const result: Jam.State = await api.radioController.state(options);
		ApiResponder.data(req, res, result);
	});
	register.get('/radio/states', async (req, res) => {
		const options: JamRequest<JamParameters.IDs> = {query: req.query, user: req.user, client: req.client};
		const result: Jam.States = await api.radioController.states(options);
		ApiResponder.data(req, res, result);
	});
	register.get('/artist/id', async (req, res) => {
		const options: JamRequest<JamParameters.Artist> = {query: req.query, user: req.user, client: req.client};
		const result: Jam.Artist = await api.artistController.id(options);
		ApiResponder.data(req, res, result);
	});
	register.get('/artist/ids', async (req, res) => {
		const options: JamRequest<JamParameters.Artists> = {query: req.query, user: req.user, client: req.client};
		const result: Array<Jam.Artist> = await api.artistController.ids(options);
		ApiResponder.data(req, res, result);
	});
	register.get('/artist/search', async (req, res) => {
		const options: JamRequest<JamParameters.ArtistSearch> = {query: req.query, user: req.user, client: req.client};
		const result: Jam.ArtistList = await api.artistController.search(options);
		ApiResponder.data(req, res, result);
	});
	register.get('/artist/state', async (req, res) => {
		const options: JamRequest<JamParameters.ID> = {query: req.query, user: req.user, client: req.client};
		const result: Jam.State = await api.artistController.state(options);
		ApiResponder.data(req, res, result);
	});
	register.get('/artist/states', async (req, res) => {
		const options: JamRequest<JamParameters.IDs> = {query: req.query, user: req.user, client: req.client};
		const result: Jam.States = await api.artistController.states(options);
		ApiResponder.data(req, res, result);
	});
	register.get('/artist/list', async (req, res) => {
		const options: JamRequest<JamParameters.ArtistList> = {query: req.query, user: req.user, client: req.client};
		const result: Jam.ArtistList = await api.artistController.list(options);
		ApiResponder.data(req, res, result);
	});
	register.get('/artist/similar/tracks', async (req, res) => {
		const options: JamRequest<JamParameters.SimilarTracks> = {query: req.query, user: req.user, client: req.client};
		const result: Jam.TrackList = await api.artistController.similarTracks(options);
		ApiResponder.data(req, res, result);
	});
	register.get('/artist/similar', async (req, res) => {
		const options: JamRequest<JamParameters.SimilarArtists> = {query: req.query, user: req.user, client: req.client};
		const result: Jam.ArtistList = await api.artistController.similar(options);
		ApiResponder.data(req, res, result);
	});
	register.get('/artist/index', async (req, res) => {
		const options: JamRequest<JamParameters.ArtistIndex> = {query: req.query, user: req.user, client: req.client};
		const result: Jam.ArtistIndex = await api.artistController.index(options);
		ApiResponder.data(req, res, result);
	});
	register.get('/artist/tracks', async (req, res) => {
		const options: JamRequest<JamParameters.ArtistTracks> = {query: req.query, user: req.user, client: req.client};
		const result: Jam.TrackList = await api.artistController.tracks(options);
		ApiResponder.data(req, res, result);
	});
	register.get('/artist/albums', async (req, res) => {
		const options: JamRequest<JamParameters.ArtistAlbums> = {query: req.query, user: req.user, client: req.client};
		const result: Jam.AlbumList = await api.artistController.albums(options);
		ApiResponder.data(req, res, result);
	});
	register.get('/artist/info', async (req, res) => {
		const options: JamRequest<JamParameters.ID> = {query: req.query, user: req.user, client: req.client};
		const result: Jam.Info = await api.artistController.info(options);
		ApiResponder.data(req, res, result);
	});
	register.get('/album/id', async (req, res) => {
		const options: JamRequest<JamParameters.Album> = {query: req.query, user: req.user, client: req.client};
		const result: Jam.Album = await api.albumController.id(options);
		ApiResponder.data(req, res, result);
	});
	register.get('/album/ids', async (req, res) => {
		const options: JamRequest<JamParameters.Albums> = {query: req.query, user: req.user, client: req.client};
		const result: Array<Jam.Album> = await api.albumController.ids(options);
		ApiResponder.data(req, res, result);
	});
	register.get('/album/list', async (req, res) => {
		const options: JamRequest<JamParameters.AlbumList> = {query: req.query, user: req.user, client: req.client};
		const result: Jam.AlbumList = await api.albumController.list(options);
		ApiResponder.data(req, res, result);
	});
	register.get('/album/search', async (req, res) => {
		const options: JamRequest<JamParameters.AlbumSearch> = {query: req.query, user: req.user, client: req.client};
		const result: Jam.AlbumList = await api.albumController.search(options);
		ApiResponder.data(req, res, result);
	});
	register.get('/album/index', async (req, res) => {
		const options: JamRequest<JamParameters.AlbumIndex> = {query: req.query, user: req.user, client: req.client};
		const result: Jam.AlbumIndex = await api.albumController.index(options);
		ApiResponder.data(req, res, result);
	});
	register.get('/album/state', async (req, res) => {
		const options: JamRequest<JamParameters.ID> = {query: req.query, user: req.user, client: req.client};
		const result: Jam.State = await api.albumController.state(options);
		ApiResponder.data(req, res, result);
	});
	register.get('/album/states', async (req, res) => {
		const options: JamRequest<JamParameters.IDs> = {query: req.query, user: req.user, client: req.client};
		const result: Jam.States = await api.albumController.states(options);
		ApiResponder.data(req, res, result);
	});
	register.get('/album/similar/tracks', async (req, res) => {
		const options: JamRequest<JamParameters.SimilarTracks> = {query: req.query, user: req.user, client: req.client};
		const result: Jam.TrackList = await api.albumController.similarTracks(options);
		ApiResponder.data(req, res, result);
	});
	register.get('/album/tracks', async (req, res) => {
		const options: JamRequest<JamParameters.AlbumTracks> = {query: req.query, user: req.user, client: req.client};
		const result: Jam.TrackList = await api.albumController.tracks(options);
		ApiResponder.data(req, res, result);
	});
	register.get('/album/info', async (req, res) => {
		const options: JamRequest<JamParameters.ID> = {query: req.query, user: req.user, client: req.client};
		const result: Jam.Info = await api.albumController.info(options);
		ApiResponder.data(req, res, result);
	});
	register.get('/playlist/id', async (req, res) => {
		const options: JamRequest<JamParameters.Playlist> = {query: req.query, user: req.user, client: req.client};
		const result: Jam.Playlist = await api.playlistController.id(options);
		ApiResponder.data(req, res, result);
	});
	register.get('/playlist/ids', async (req, res) => {
		const options: JamRequest<JamParameters.Playlists> = {query: req.query, user: req.user, client: req.client};
		const result: Array<Jam.Playlist> = await api.playlistController.ids(options);
		ApiResponder.data(req, res, result);
	});
	register.get('/playlist/search', async (req, res) => {
		const options: JamRequest<JamParameters.PlaylistSearch> = {query: req.query, user: req.user, client: req.client};
		const result: Jam.PlaylistList = await api.playlistController.search(options);
		ApiResponder.data(req, res, result);
	});
	register.get('/playlist/state', async (req, res) => {
		const options: JamRequest<JamParameters.ID> = {query: req.query, user: req.user, client: req.client};
		const result: Jam.State = await api.playlistController.state(options);
		ApiResponder.data(req, res, result);
	});
	register.get('/playlist/states', async (req, res) => {
		const options: JamRequest<JamParameters.IDs> = {query: req.query, user: req.user, client: req.client};
		const result: Jam.States = await api.playlistController.states(options);
		ApiResponder.data(req, res, result);
	});
	register.get('/playlist/tracks', async (req, res) => {
		const options: JamRequest<JamParameters.PlaylistTracks> = {query: req.query, user: req.user, client: req.client};
		const result: Jam.TrackList = await api.playlistController.tracks(options);
		ApiResponder.data(req, res, result);
	});
	register.get('/playlist/list', async (req, res) => {
		const options: JamRequest<JamParameters.PlaylistList> = {query: req.query, user: req.user, client: req.client};
		const result: Jam.PlaylistList = await api.playlistController.list(options);
		ApiResponder.data(req, res, result);
	});
	register.get('/user/id', async (req, res) => {
		const options: JamRequest<JamParameters.ID> = {query: req.query, user: req.user, client: req.client};
		const result: Jam.User = await api.userController.id(options);
		ApiResponder.data(req, res, result);
	}, ['admin']);
	register.get('/user/ids', async (req, res) => {
		const options: JamRequest<JamParameters.IDs> = {query: req.query, user: req.user, client: req.client};
		const result: Array<Jam.User> = await api.userController.ids(options);
		ApiResponder.data(req, res, result);
	}, ['admin']);
	register.get('/user/search', async (req, res) => {
		const options: JamRequest<JamParameters.UserSearch> = {query: req.query, user: req.user, client: req.client};
		const result: Jam.UserList = await api.userController.search(options);
		ApiResponder.data(req, res, result);
	}, ['admin']);
	register.get('/user/sessions/list', async (req, res) => {
		const options: JamRequest<{}> = {query: req.query, user: req.user, client: req.client};
		const result: Array<Jam.UserSession> = await api.sessionController.sessions(options);
		ApiResponder.data(req, res, result);
	});
	register.get('/playqueue/get', async (req, res) => {
		const options: JamRequest<JamParameters.PlayQueue> = {query: req.query, user: req.user, client: req.client};
		const result: Jam.PlayQueue = await api.playqueueController.get(options);
		ApiResponder.data(req, res, result);
	});
	register.get('/bookmark/id', async (req, res) => {
		const options: JamRequest<JamParameters.Bookmark> = {query: req.query, user: req.user, client: req.client};
		const result: Jam.Bookmark = await api.bookmarkController.id(options);
		ApiResponder.data(req, res, result);
	});
	register.get('/bookmark/ids', async (req, res) => {
		const options: JamRequest<JamParameters.Bookmarks> = {query: req.query, user: req.user, client: req.client};
		const result: Jam.BookmarkList = await api.bookmarkController.ids(options);
		ApiResponder.data(req, res, result);
	});
	register.get('/bookmark/list', async (req, res) => {
		const options: JamRequest<JamParameters.BookmarkList> = {query: req.query, user: req.user, client: req.client};
		const result: Jam.BookmarkList = await api.bookmarkController.list(options);
		ApiResponder.data(req, res, result);
	});
	register.get('/bookmark/byTrack/list', async (req, res) => {
		const options: JamRequest<JamParameters.BookmarkListByTrack> = {query: req.query, user: req.user, client: req.client};
		const result: Jam.BookmarkList = await api.bookmarkController.byTrackList(options);
		ApiResponder.data(req, res, result);
	});
	register.get('/root/id', async (req, res) => {
		const options: JamRequest<JamParameters.ID> = {query: req.query, user: req.user, client: req.client};
		const result: Jam.Root = await api.rootController.id(options);
		ApiResponder.data(req, res, result);
	});
	register.get('/root/ids', async (req, res) => {
		const options: JamRequest<JamParameters.IDs> = {query: req.query, user: req.user, client: req.client};
		const result: Array<Jam.Root> = await api.rootController.ids(options);
		ApiResponder.data(req, res, result);
	});
	register.get('/root/search', async (req, res) => {
		const options: JamRequest<JamParameters.RootSearch> = {query: req.query, user: req.user, client: req.client};
		const result: Jam.RootList = await api.rootController.search(options);
		ApiResponder.data(req, res, result);
	});
	register.get('/root/status', async (req, res) => {
		const options: JamRequest<JamParameters.ID> = {query: req.query, user: req.user, client: req.client};
		const result: Jam.RootStatus = await api.rootController.status(options);
		ApiResponder.data(req, res, result);
	});
	register.get('/admin/settings', async (req, res) => {
		const options: JamRequest<{}> = {query: req.query, user: req.user, client: req.client};
		const result: Jam.AdminSettings = await api.settingsController.admin(options);
		ApiResponder.data(req, res, result);
	}, ['admin']);
	register.get('/admin/queue/id', async (req, res) => {
		const options: JamRequest<JamParameters.ID> = {query: req.query, user: req.user, client: req.client};
		const result: Jam.AdminChangeQueueInfo = await api.rootController.queueId(options);
		ApiResponder.data(req, res, result);
	}, ['admin']);
	register.get('/folder/download', async (req, res) => {
		const options: JamRequest<JamParameters.Download> = {query: req.query, user: req.user, client: req.client};
		const result: ApiBinaryResult = await api.folderController.download(options);
		ApiResponder.binary(req, res, result);
	}, ['stream']);
	register.get('/folder/image', async (req, res) => {
		const options: JamRequest<JamParameters.Image> = {query: req.query, user: req.user, client: req.client};
		const result: ApiBinaryResult = await api.folderController.image(options);
		ApiResponder.binary(req, res, result);
	});
	register.get('/folder/artwork/image', async (req, res) => {
		const options: JamRequest<JamParameters.Image> = {query: req.query, user: req.user, client: req.client};
		const result: ApiBinaryResult = await api.folderController.artworkImage(options);
		ApiResponder.binary(req, res, result);
	});
	register.get('/track/stream', async (req, res) => {
		const options: JamRequest<JamParameters.Stream> = {query: req.query, user: req.user, client: req.client};
		const result: ApiBinaryResult = await api.trackController.stream(options);
		ApiResponder.binary(req, res, result);
	}, ['stream']);
	register.get('/track/download', async (req, res) => {
		const options: JamRequest<JamParameters.Download> = {query: req.query, user: req.user, client: req.client};
		const result: ApiBinaryResult = await api.trackController.download(options);
		ApiResponder.binary(req, res, result);
	}, ['stream']);
	register.get('/track/image', async (req, res) => {
		const options: JamRequest<JamParameters.Image> = {query: req.query, user: req.user, client: req.client};
		const result: ApiBinaryResult = await api.trackController.image(options);
		ApiResponder.binary(req, res, result);
	});
	register.get('/episode/stream', async (req, res) => {
		const options: JamRequest<JamParameters.Stream> = {query: req.query, user: req.user, client: req.client};
		const result: ApiBinaryResult = await api.episodeController.stream(options);
		ApiResponder.binary(req, res, result);
	}, ['stream']);
	register.get('/episode/download', async (req, res) => {
		const options: JamRequest<JamParameters.Download> = {query: req.query, user: req.user, client: req.client};
		const result: ApiBinaryResult = await api.episodeController.download(options);
		ApiResponder.binary(req, res, result);
	}, ['stream']);
	register.get('/episode/image', async (req, res) => {
		const options: JamRequest<JamParameters.Image> = {query: req.query, user: req.user, client: req.client};
		const result: ApiBinaryResult = await api.episodeController.image(options);
		ApiResponder.binary(req, res, result);
	});
	register.get('/podcast/image', async (req, res) => {
		const options: JamRequest<JamParameters.Image> = {query: req.query, user: req.user, client: req.client};
		const result: ApiBinaryResult = await api.podcastController.image(options);
		ApiResponder.binary(req, res, result);
	});
	register.get('/podcast/download', async (req, res) => {
		const options: JamRequest<JamParameters.Download> = {query: req.query, user: req.user, client: req.client};
		const result: ApiBinaryResult = await api.podcastController.download(options);
		ApiResponder.binary(req, res, result);
	}, ['stream']);
	register.get('/artist/image', async (req, res) => {
		const options: JamRequest<JamParameters.Image> = {query: req.query, user: req.user, client: req.client};
		const result: ApiBinaryResult = await api.artistController.image(options);
		ApiResponder.binary(req, res, result);
	});
	register.get('/artist/download', async (req, res) => {
		const options: JamRequest<JamParameters.Download> = {query: req.query, user: req.user, client: req.client};
		const result: ApiBinaryResult = await api.artistController.download(options);
		ApiResponder.binary(req, res, result);
	}, ['stream']);
	register.get('/album/image', async (req, res) => {
		const options: JamRequest<JamParameters.Image> = {query: req.query, user: req.user, client: req.client};
		const result: ApiBinaryResult = await api.albumController.image(options);
		ApiResponder.binary(req, res, result);
	});
	register.get('/album/download', async (req, res) => {
		const options: JamRequest<JamParameters.Download> = {query: req.query, user: req.user, client: req.client};
		const result: ApiBinaryResult = await api.albumController.download(options);
		ApiResponder.binary(req, res, result);
	}, ['stream']);
	register.get('/playlist/image', async (req, res) => {
		const options: JamRequest<JamParameters.Image> = {query: req.query, user: req.user, client: req.client};
		const result: ApiBinaryResult = await api.playlistController.image(options);
		ApiResponder.binary(req, res, result);
	});
	register.get('/playlist/download', async (req, res) => {
		const options: JamRequest<JamParameters.Download> = {query: req.query, user: req.user, client: req.client};
		const result: ApiBinaryResult = await api.playlistController.download(options);
		ApiResponder.binary(req, res, result);
	}, ['stream']);
	register.get('/user/image', async (req, res) => {
		const options: JamRequest<JamParameters.Image> = {query: req.query, user: req.user, client: req.client};
		const result: ApiBinaryResult = await api.userController.image(options);
		ApiResponder.binary(req, res, result);
	});
	register.get('/root/image', async (req, res) => {
		const options: JamRequest<JamParameters.Image> = {query: req.query, user: req.user, client: req.client};
		const result: ApiBinaryResult = await api.rootController.image(options);
		ApiResponder.binary(req, res, result);
	});
	register.get('/image/:pathParameter', async (req, res) => {
		const options: JamRequest<{pathParameter: string}> = {query: req.params, user: req.user, client: req.client};
		const result: ApiBinaryResult = await api.imageController.imageByPathParameter(options);
		ApiResponder.binary(req, res, result);
	}, [], 'image/{pathParameter}');
	register.get('/stream/:pathParameter', async (req, res) => {
		const options: JamRequest<{pathParameter: string}> = {query: req.params, user: req.user, client: req.client};
		const result: ApiBinaryResult = await api.streamController.streamByPathParameter(options);
		ApiResponder.binary(req, res, result);
	}, ['stream'], 'stream/{pathParameter}');
	register.get('/waveform/:pathParameter', async (req, res) => {
		const options: JamRequest<{pathParameter: string}> = {query: req.params, user: req.user, client: req.client};
		const result: ApiBinaryResult = await api.waveformController.waveformByPathParameter(options);
		ApiResponder.binary(req, res, result);
	}, ['stream'], 'waveform/{pathParameter}');
	register.get('/waveform_svg/:pathParameter', async (req, res) => {
		const options: JamRequest<{pathParameter: string}> = {query: req.params, user: req.user, client: req.client};
		const result: ApiBinaryResult = await api.waveformController.svgByPathParameter(options);
		ApiResponder.binary(req, res, result);
	}, ['stream'], 'waveform_svg/{pathParameter}');
	register.get('/download/:pathParameter', async (req, res) => {
		const options: JamRequest<{pathParameter: string}> = {query: req.params, user: req.user, client: req.client};
		const result: ApiBinaryResult = await api.downloadController.downloadByPathParameter(options);
		ApiResponder.binary(req, res, result);
	}, ['stream'], 'download/{pathParameter}');
	register.post('/bookmark/create', async (req, res) => {
		const options: JamRequest<JamParameters.BookmarkCreate> = {query: req.body, user: req.user, client: req.client};
		const result: Jam.Bookmark = await api.bookmarkController.create(options);
		ApiResponder.data(req, res, result);
	});
	register.post('/bookmark/delete', async (req, res) => {
		const options: JamRequest<JamParameters.BookmarkDelete> = {query: req.body, user: req.user, client: req.client};
		await api.bookmarkController.delete(options);
		ApiResponder.ok(req, res);
	});
	register.post('/bookmark/byTrack/delete', async (req, res) => {
		const options: JamRequest<JamParameters.BookmarkTrackDelete> = {query: req.body, user: req.user, client: req.client};
		await api.bookmarkController.byTrackDelete(options);
		ApiResponder.ok(req, res);
	});
	register.post('/chat/create', async (req, res) => {
		const options: JamRequest<JamParameters.ChatNew> = {query: req.body, user: req.user, client: req.client};
		await api.chatController.create(options);
		ApiResponder.ok(req, res);
	});
	register.post('/chat/delete', async (req, res) => {
		const options: JamRequest<JamParameters.ChatDelete> = {query: req.body, user: req.user, client: req.client};
		await api.chatController.delete(options);
		ApiResponder.ok(req, res);
	});
	register.post('/radio/create', async (req, res) => {
		const options: JamRequest<JamParameters.RadioNew> = {query: req.body, user: req.user, client: req.client};
		const result: Jam.Radio = await api.radioController.create(options);
		ApiResponder.data(req, res, result);
	}, ['admin']);
	register.post('/radio/update', async (req, res) => {
		const options: JamRequest<JamParameters.RadioUpdate> = {query: req.body, user: req.user, client: req.client};
		await api.radioController.update(options);
		ApiResponder.ok(req, res);
	}, ['admin']);
	register.post('/radio/delete', async (req, res) => {
		const options: JamRequest<JamParameters.ID> = {query: req.body, user: req.user, client: req.client};
		await api.radioController.delete(options);
		ApiResponder.ok(req, res);
	}, ['admin']);
	register.post('/track/fav/update', async (req, res) => {
		const options: JamRequest<JamParameters.Fav> = {query: req.body, user: req.user, client: req.client};
		await api.trackController.favUpdate(options);
		ApiResponder.ok(req, res);
	});
	register.post('/track/rate/update', async (req, res) => {
		const options: JamRequest<JamParameters.Rate> = {query: req.body, user: req.user, client: req.client};
		await api.trackController.rateUpdate(options);
		ApiResponder.ok(req, res);
	});
	register.post('/track/rawTag/update', async (req, res) => {
		const options: JamRequest<JamParameters.RawTagUpdate> = {query: req.body, user: req.user, client: req.client};
		const result: Jam.AdminChangeQueueInfo = await api.trackController.rawTagUpdate(options);
		ApiResponder.data(req, res, result);
	}, ['admin']);
	register.post('/track/name/update', async (req, res) => {
		const options: JamRequest<JamParameters.TrackEditName> = {query: req.body, user: req.user, client: req.client};
		const result: Jam.AdminChangeQueueInfo = await api.trackController.nameUpdate(options);
		ApiResponder.data(req, res, result);
	}, ['admin']);
	register.post('/track/parent/update', async (req, res) => {
		const options: JamRequest<JamParameters.TrackMoveParent> = {query: req.body, user: req.user, client: req.client};
		const result: Jam.AdminChangeQueueInfo = await api.trackController.parentUpdate(options);
		ApiResponder.data(req, res, result);
	}, ['admin']);
	register.post('/track/delete', async (req, res) => {
		const options: JamRequest<JamParameters.ID> = {query: req.body, user: req.user, client: req.client};
		const result: Jam.AdminChangeQueueInfo = await api.trackController.delete(options);
		ApiResponder.data(req, res, result);
	}, ['admin']);
	register.post('/track/fix', async (req, res) => {
		const options: JamRequest<JamParameters.TrackFix> = {query: req.body, user: req.user, client: req.client};
		const result: Jam.AdminChangeQueueInfo = await api.trackController.fix(options);
		ApiResponder.data(req, res, result);
	}, ['admin']);
	register.post('/folder/artwork/create', async (req, res) => {
		const options: JamRequest<JamParameters.FolderArtworkNew> = {query: req.body, user: req.user, client: req.client};
		const result: Jam.AdminChangeQueueInfo = await api.folderController.artworkCreate(options);
		ApiResponder.data(req, res, result);
	}, ['admin']);
	register.post('/folder/artwork/delete', async (req, res) => {
		const options: JamRequest<JamParameters.ID> = {query: req.body, user: req.user, client: req.client};
		const result: Jam.AdminChangeQueueInfo = await api.folderController.artworkDelete(options);
		ApiResponder.data(req, res, result);
	}, ['admin']);
	register.post('/folder/artwork/name/update', async (req, res) => {
		const options: JamRequest<JamParameters.FolderArtworkEditName> = {query: req.body, user: req.user, client: req.client};
		const result: Jam.AdminChangeQueueInfo = await api.folderController.artworkNameUpdate(options);
		ApiResponder.data(req, res, result);
	}, ['admin']);
	register.upload('/folder/artworkUpload/create', 'image', async (req, res) => {
		const options: JamRequest<JamParameters.FolderArtworkUpload> = {query: req.body, user: req.user, client: req.client, file: req.file ? req.file.path : undefined, fileType: req.file ? req.file.mimetype : undefined};
		const result: Jam.AdminChangeQueueInfo = await api.folderController.artworkUploadCreate(options);
		ApiResponder.data(req, res, result);
	}, ['admin']);
	register.upload('/folder/artworkUpload/update', 'image', async (req, res) => {
		const options: JamRequest<JamParameters.ID> = {query: req.body, user: req.user, client: req.client, file: req.file ? req.file.path : undefined, fileType: req.file ? req.file.mimetype : undefined};
		const result: Jam.AdminChangeQueueInfo = await api.folderController.artworkUploadUpdate(options);
		ApiResponder.data(req, res, result);
	}, ['admin']);
	register.post('/folder/name/update', async (req, res) => {
		const options: JamRequest<JamParameters.FolderEditName> = {query: req.body, user: req.user, client: req.client};
		const result: Jam.AdminChangeQueueInfo = await api.folderController.nameUpdate(options);
		ApiResponder.data(req, res, result);
	}, ['admin']);
	register.post('/folder/fav/update', async (req, res) => {
		const options: JamRequest<JamParameters.Fav> = {query: req.body, user: req.user, client: req.client};
		await api.folderController.favUpdate(options);
		ApiResponder.ok(req, res);
	});
	register.post('/folder/rate/update', async (req, res) => {
		const options: JamRequest<JamParameters.Rate> = {query: req.body, user: req.user, client: req.client};
		await api.folderController.rateUpdate(options);
		ApiResponder.ok(req, res);
	});
	register.post('/folder/parent/update', async (req, res) => {
		const options: JamRequest<JamParameters.FolderMoveParent> = {query: req.body, user: req.user, client: req.client};
		const result: Jam.AdminChangeQueueInfo = await api.folderController.parentUpdate(options);
		ApiResponder.data(req, res, result);
	}, ['admin']);
	register.post('/folder/delete', async (req, res) => {
		const options: JamRequest<JamParameters.ID> = {query: req.body, user: req.user, client: req.client};
		const result: Jam.AdminChangeQueueInfo = await api.folderController.delete(options);
		ApiResponder.data(req, res, result);
	}, ['admin']);
	register.post('/folder/create', async (req, res) => {
		const options: JamRequest<JamParameters.FolderCreate> = {query: req.body, user: req.user, client: req.client};
		const result: Jam.AdminChangeQueueInfo = await api.folderController.create(options);
		ApiResponder.data(req, res, result);
	}, ['admin']);
	register.post('/album/fav/update', async (req, res) => {
		const options: JamRequest<JamParameters.Fav> = {query: req.body, user: req.user, client: req.client};
		await api.albumController.favUpdate(options);
		ApiResponder.ok(req, res);
	});
	register.post('/album/rate/update', async (req, res) => {
		const options: JamRequest<JamParameters.Rate> = {query: req.body, user: req.user, client: req.client};
		await api.albumController.rateUpdate(options);
		ApiResponder.ok(req, res);
	});
	register.post('/artist/fav/update', async (req, res) => {
		const options: JamRequest<JamParameters.Fav> = {query: req.body, user: req.user, client: req.client};
		await api.artistController.favUpdate(options);
		ApiResponder.ok(req, res);
	});
	register.post('/artist/rate/update', async (req, res) => {
		const options: JamRequest<JamParameters.Rate> = {query: req.body, user: req.user, client: req.client};
		await api.artistController.rateUpdate(options);
		ApiResponder.ok(req, res);
	});
	register.post('/episode/fav/update', async (req, res) => {
		const options: JamRequest<JamParameters.Fav> = {query: req.body, user: req.user, client: req.client};
		await api.episodeController.favUpdate(options);
		ApiResponder.ok(req, res);
	});
	register.post('/episode/rate/update', async (req, res) => {
		const options: JamRequest<JamParameters.Rate> = {query: req.body, user: req.user, client: req.client};
		await api.episodeController.rateUpdate(options);
		ApiResponder.ok(req, res);
	});
	register.post('/podcast/create', async (req, res) => {
		const options: JamRequest<JamParameters.PodcastNew> = {query: req.body, user: req.user, client: req.client};
		const result: Jam.Podcast = await api.podcastController.create(options);
		ApiResponder.data(req, res, result);
	}, ['podcast']);
	register.post('/podcast/fav/update', async (req, res) => {
		const options: JamRequest<JamParameters.Fav> = {query: req.body, user: req.user, client: req.client};
		await api.podcastController.favUpdate(options);
		ApiResponder.ok(req, res);
	});
	register.post('/podcast/rate/update', async (req, res) => {
		const options: JamRequest<JamParameters.Rate> = {query: req.body, user: req.user, client: req.client};
		await api.podcastController.rateUpdate(options);
		ApiResponder.ok(req, res);
	});
	register.post('/podcast/delete', async (req, res) => {
		const options: JamRequest<JamParameters.ID> = {query: req.body, user: req.user, client: req.client};
		await api.podcastController.delete(options);
		ApiResponder.ok(req, res);
	}, ['podcast']);
	register.post('/playlist/create', async (req, res) => {
		const options: JamRequest<JamParameters.PlaylistNew> = {query: req.body, user: req.user, client: req.client};
		const result: Jam.Playlist = await api.playlistController.create(options);
		ApiResponder.data(req, res, result);
	});
	register.post('/playlist/update', async (req, res) => {
		const options: JamRequest<JamParameters.PlaylistUpdate> = {query: req.body, user: req.user, client: req.client};
		await api.playlistController.update(options);
		ApiResponder.ok(req, res);
	});
	register.post('/playlist/fav/update', async (req, res) => {
		const options: JamRequest<JamParameters.Fav> = {query: req.body, user: req.user, client: req.client};
		await api.playlistController.favUpdate(options);
		ApiResponder.ok(req, res);
	});
	register.post('/playlist/rate/update', async (req, res) => {
		const options: JamRequest<JamParameters.Rate> = {query: req.body, user: req.user, client: req.client};
		await api.playlistController.rateUpdate(options);
		ApiResponder.ok(req, res);
	});
	register.post('/playlist/delete', async (req, res) => {
		const options: JamRequest<JamParameters.ID> = {query: req.body, user: req.user, client: req.client};
		await api.playlistController.delete(options);
		ApiResponder.ok(req, res);
	});
	register.post('/playqueue/update', async (req, res) => {
		const options: JamRequest<JamParameters.PlayQueueSet> = {query: req.body, user: req.user, client: req.client};
		await api.playqueueController.update(options);
		ApiResponder.ok(req, res);
	});
	register.post('/playqueue/delete', async (req, res) => {
		const options: JamRequest<{}> = {query: req.body, user: req.user, client: req.client};
		await api.playqueueController.delete(options);
		ApiResponder.ok(req, res);
	});
	register.post('/user/create', async (req, res) => {
		const options: JamRequest<JamParameters.UserNew> = {query: req.body, user: req.user, client: req.client};
		const result: Jam.User = await api.userController.create(options);
		ApiResponder.data(req, res, result);
	}, ['admin']);
	register.post('/user/update', async (req, res) => {
		const options: JamRequest<JamParameters.UserUpdate> = {query: req.body, user: req.user, client: req.client};
		await api.userController.update(options);
		ApiResponder.ok(req, res);
	}, ['admin']);
	register.post('/user/password/update', async (req, res) => {
		const options: JamRequest<JamParameters.UserPasswordUpdate> = {query: req.body, user: req.user, client: req.client};
		await api.userController.passwordUpdate(options);
		ApiResponder.ok(req, res);
	});
	register.post('/user/email/update', async (req, res) => {
		const options: JamRequest<JamParameters.UserEmailUpdate> = {query: req.body, user: req.user, client: req.client};
		await api.userController.emailUpdate(options);
		ApiResponder.ok(req, res);
	});
	register.post('/user/image/random', async (req, res) => {
		const options: JamRequest<JamParameters.UserImageRandom> = {query: req.body, user: req.user, client: req.client};
		await api.userController.imageRandom(options);
		ApiResponder.ok(req, res);
	});
	register.upload('/user/imageUpload/update', 'image', async (req, res) => {
		const options: JamRequest<JamParameters.ID> = {query: req.body, user: req.user, client: req.client, file: req.file ? req.file.path : undefined, fileType: req.file ? req.file.mimetype : undefined};
		await api.userController.imageUploadUpdate(options);
		ApiResponder.ok(req, res);
	});
	register.post('/user/delete', async (req, res) => {
		const options: JamRequest<JamParameters.ID> = {query: req.body, user: req.user, client: req.client};
		await api.userController.delete(options);
		ApiResponder.ok(req, res);
	}, ['admin']);
	register.post('/user/sessions/delete', async (req, res) => {
		const options: JamRequest<JamParameters.ID> = {query: req.body, user: req.user, client: req.client};
		await api.sessionController.delete(options);
		ApiResponder.ok(req, res);
	});
	register.post('/user/sessions/subsonic/view', async (req, res) => {
		const options: JamRequest<JamParameters.SubsonicToken> = {query: req.body, user: req.user, client: req.client};
		const result: Jam.SubsonicToken = await api.userController.subsonicView(options);
		ApiResponder.data(req, res, result);
	});
	register.post('/user/sessions/subsonic/generate', async (req, res) => {
		const options: JamRequest<JamParameters.SubsonicToken> = {query: req.body, user: req.user, client: req.client};
		const result: Jam.SubsonicToken = await api.userController.subsonicGenerate(options);
		ApiResponder.data(req, res, result);
	});
	register.post('/root/create', async (req, res) => {
		const options: JamRequest<JamParameters.RootNew> = {query: req.body, user: req.user, client: req.client};
		const result: Jam.AdminChangeQueueInfo = await api.rootController.create(options);
		ApiResponder.data(req, res, result);
	}, ['admin']);
	register.post('/root/update', async (req, res) => {
		const options: JamRequest<JamParameters.RootUpdate> = {query: req.body, user: req.user, client: req.client};
		const result: Jam.AdminChangeQueueInfo = await api.rootController.update(options);
		ApiResponder.data(req, res, result);
	}, ['admin']);
	register.post('/root/delete', async (req, res) => {
		const options: JamRequest<JamParameters.ID> = {query: req.body, user: req.user, client: req.client};
		const result: Jam.AdminChangeQueueInfo = await api.rootController.delete(options);
		ApiResponder.data(req, res, result);
	}, ['admin']);
	register.post('/root/scan', async (req, res) => {
		const options: JamRequest<JamParameters.ID> = {query: req.body, user: req.user, client: req.client};
		const result: Jam.AdminChangeQueueInfo = await api.rootController.scan(options);
		ApiResponder.data(req, res, result);
	}, ['admin']);
	register.post('/root/scanAll', async (req, res) => {
		const options: JamRequest<{}> = {query: req.body, user: req.user, client: req.client};
		const result: Array<Jam.AdminChangeQueueInfo> = await api.rootController.scanAll(options);
		ApiResponder.data(req, res, result);
	}, ['admin']);
	register.post('/admin/settings/update', async (req, res) => {
		const options: JamRequest<Jam.AdminSettings> = {query: req.body, user: req.user, client: req.client};
		await api.settingsController.adminUpdate(options);
		ApiResponder.ok(req, res);
	}, ['admin']);
}
