import path from 'path';
import {JamServe} from '../../model/jamserve';
import {Engine} from '../../engine/engine';
import {DBObjectType, FolderType} from '../../types';
import {getFolderProblems} from '../../io/components/health';
import {fileSuffix} from '../../utils/fs-utils';
import {APIVERSION, FORMAT} from './format';
import {BaseStore} from '../../store/store';
import {JamParameters} from '../../model/jam-rest-params-0.1.0';
import {Jam} from '../../model/jam-rest-data-0.1.0';
import {paginate} from '../../utils/paginate';
import {randomItems} from '../../utils/random';
import {PreTranscoder, Transcoder} from '../../audio/transcoder';
import {IApiBinaryResult} from '../../typings';
import {MusicBrainz} from '../../model/musicbrainz-rest-data-2.0';
import {Acoustid} from '../../model/acoustid-rest-data-2.0';
import {LastFM} from '../../model/lastfm-rest-data-2.0';
import {GenericError, InvalidParamError, NotFoundError, UnauthError} from './error';
import {PodcastStatus} from '../../utils/feed';

export interface ApiOptions<T> {
	query: T;
	user: JamServe.User;
	client?: string;
	file?: string;
}

abstract class APIJamObj<OBJREQUEST extends JamParameters.ID | INCLUDE, OBJLISTREQUEST extends JamParameters.IDs | INCLUDE, INCLUDE, JAMQUERY extends JamServe.SearchQuery, S extends JamParameters.SearchQuery | INCLUDE, DBOBJECT extends JamServe.DBObject, RESULTOBJ extends { id: string }> {
	engine: Engine;
	objstore: BaseStore<DBOBJECT, JamServe.SearchQuery>;
	type: DBObjectType;
	api: ApiJam;

	protected constructor(engine: Engine, objstore: BaseStore<DBOBJECT, JamServe.SearchQuery>, type: DBObjectType, api: ApiJam) {
		this.engine = engine;
		this.objstore = objstore;
		this.type = type;
		this.api = api;
	}

	abstract async prepare(item: DBOBJECT, includes: INCLUDE, user: JamServe.User): Promise<RESULTOBJ>;

	abstract translateQuery(query: S, user: JamServe.User): JAMQUERY;

	async byID(id?: string): Promise<DBOBJECT> {
		if (!id) {
			return Promise.reject(InvalidParamError());
		}
		const obj = await this.objstore.byId(id);
		if (!obj) {
			return Promise.reject(NotFoundError());
		}
		return obj;
	}

	async byIDs(ids: Array<string>): Promise<Array<DBOBJECT>> {
		if (!ids) {
			return Promise.reject(InvalidParamError());
		}
		return await this.objstore.byIds(ids);
	}

	async getList(listQuery: JamParameters.List, jamquery: S, includes: INCLUDE, user: JamServe.User): Promise<Array<RESULTOBJ>> {
		const query = this.translateQuery(jamquery, user);
		let ids: Array<string> = [];
		switch (listQuery.list) {
			case 'random':
				ids = await this.objstore.searchIDs(Object.assign(query, {amount: -1, offset: 0}));
				ids = randomItems<string>(ids, listQuery.amount || 20);
				break;
			case 'highest':
				ids = await this.engine.getFilteredListHighestRated(this.type, query, user, this.objstore);
				ids = paginate(ids, listQuery.amount, listQuery.offset);
				break;
			case 'avghighest':
				ids = await this.engine.getFilteredListAvgHighest(this.type, query, user, this.objstore);
				ids = paginate(ids, listQuery.amount, listQuery.offset);
				break;
			case 'frequent':
				ids = await this.engine.getFilteredListFrequentlyPlayed(this.type, query, user, this.objstore);
				ids = paginate(ids, listQuery.amount, listQuery.offset);
				break;
			case 'faved':
				ids = await this.engine.getFilteredListFaved(this.type, query, user, this.objstore);
				ids = paginate(ids, listQuery.amount, listQuery.offset);
				break;
			case 'recent':
				ids = await this.engine.getFilteredListRecentlyPlayed(this.type, query, user, this.objstore);
				ids = paginate(ids, listQuery.amount, listQuery.offset);
				break;
			default:
				return Promise.reject(InvalidParamError('Unknown List Type'));
		}
		return this.prepareListByIDs(ids, includes, user);
	}

	defaultTrackSort(tracks: Array<JamServe.Track>): Array<JamServe.Track> {
		return tracks.sort((a, b) => {
				if (a.tag.track !== undefined && b.tag.track !== undefined) {
					const res = a.tag.track - b.tag.track;
					if (res !== 0) {
						return res;
					}
				}
				return a.name.localeCompare(b.name);
			}
		);
	}

	defaultEpisodesSort(episodes: Array<JamServe.Episode>): Array<JamServe.Episode> {
		return episodes.sort((a, b) => {
				if (!a.tag) {
					return -1;
				}
				if (!b.tag) {
					return 1;
				}
				if (a.tag.track !== undefined && b.tag.track !== undefined) {
					const res = a.tag.track - b.tag.track;
					if (res !== 0) {
						return res;
					}
				}
				return a.title.localeCompare(b.title);
			}
		);
	}

	async prepareList(items: Array<DBOBJECT>, includes: INCLUDE, user: JamServe.User): Promise<Array<RESULTOBJ>> {
		const result: Array<RESULTOBJ> = [];
		for (const item of items) {
			const r = await this.prepare(item, includes, user);
			result.push(r);
		}
		return result;
	}

	async prepareListByIDs(ids: Array<string>, includes: INCLUDE, user: JamServe.User): Promise<Array<RESULTOBJ>> {
		const list = await this.objstore.byIds(ids);
		const result = await this.prepareList(list, includes, user);
		return result.sort((a, b) => {
			return ids.indexOf(a.id) - ids.indexOf(b.id);
		});
	}

	async id(req: ApiOptions<OBJREQUEST>): Promise<RESULTOBJ> {
		const item = await this.byID((<JamParameters.ID>req.query).id);
		return this.prepare(item, <INCLUDE>req.query, req.user);
	}

	async ids(req: ApiOptions<OBJLISTREQUEST>): Promise<Array<RESULTOBJ>> {
		const items = await this.byIDs((<JamParameters.IDs>req.query).ids);
		return this.prepareList(items, <INCLUDE>req.query, req.user);
	}

	async state(req: ApiOptions<JamParameters.ID>): Promise<Jam.State> {
		const item = await this.byID(req.query.id);
		const state = await this.engine.store.state.findOrCreate(item.id, req.user.id, this.type);
		return FORMAT.packState(state);
	}

	async states(req: ApiOptions<JamParameters.IDs>): Promise<Jam.States> {
		const items = await this.byIDs(req.query.ids);
		const states = await this.engine.store.state.findOrCreateMulti(items.map(item => item.id), req.user.id, this.type);
		return FORMAT.packStates(states);
	}

	async favUpdate(req: ApiOptions<JamParameters.Fav>): Promise<Jam.State> {
		const item = await this.byID(req.query.id);
		const state = await this.engine.fav(item.id, this.type, req.user.id, req.query.remove ? req.query.remove : false);
		return FORMAT.packState(state);
	}

	async rateUpdate(req: ApiOptions<JamParameters.Rate>): Promise<Jam.State> {
		const rating = req.query.rating || 0;
		if ((rating < 0) || (rating > 5)) {
			return Promise.reject(InvalidParamError());
		}
		const item = await this.byID(req.query.id);
		const state = await this.engine.rate(item.id, this.type, req.user.id, rating);
		return FORMAT.packState(state);
	}

	async search(req: ApiOptions<S>): Promise<Array<RESULTOBJ>> {
		const list = await this.objstore.search(this.translateQuery(req.query, req.user));
		return this.prepareList(list, <INCLUDE>req.query, req.user);
	}

	async image(req: ApiOptions<JamParameters.Image>): Promise<IApiBinaryResult> {
		const item = await this.byID(req.query.id);
		return await this.engine.getObjImage(item, req.query.size, req.query.format);
	}

	async download(req: ApiOptions<JamParameters.Download>): Promise<IApiBinaryResult> {
		const item = await this.byID(req.query.id);
		return await this.engine.getObjDownload(item, req.query.format, req.user);
	}

}

class APIJamPodcast extends APIJamObj<JamParameters.Podcast, JamParameters.Podcasts, JamParameters.IncludesPodcast, JamServe.SearchQueryPodcast, JamParameters.PodcastSearch, JamServe.Podcast, Jam.Podcast> {

	constructor(engine: Engine, api: ApiJam) {
		super(engine, engine.store.podcast, DBObjectType.podcast, api);
	}

	async prepare(podcast: JamServe.Podcast, includes: JamParameters.IncludesPodcast, user: JamServe.User): Promise<Jam.Podcast> {
		const result = FORMAT.packPodcast(podcast, this.engine.podcasts.isDownloadingPodcast(podcast.id) ? PodcastStatus.downloading : podcast.status);
		if (includes.podcastState) {
			const state = await this.engine.store.state.findOrCreate(podcast.id, user.id, DBObjectType.podcast);
			result.state = FORMAT.packState(state);
		}
		if (includes.podcastEpisodes) {
			let episodes = await this.engine.store.episode.search({podcastID: podcast.id});
			episodes = this.defaultEpisodesSort(episodes);
			result.episodes = await this.api.episode.prepareList(episodes, includes, user);
		}
		return result;
	}

	translateQuery(query: JamParameters.PodcastSearch, user: JamServe.User): JamServe.SearchQueryPodcast {
		return {
			url: query.url,
			title: query.title,
			status: query.status,
			offset: query.offset,
			amount: query.amount,
			sorts: query.sortField ? [{field: query.sortField, descending: !!query.sortDescending}] : undefined
		};
	}

	async tracks(req: ApiOptions<JamParameters.Tracks>): Promise<Array<Jam.PodcastEpisode>> {
		const episodes = await this.engine.store.episode.search({podcastIDs: req.query.ids});
		return this.api.episode.prepareList(episodes, req.query, req.user);
	}

	async refreshAll(req: ApiOptions<{}>): Promise<void> {
		this.engine.podcasts.refreshPodcasts(); // do not wait
	}

	async refresh(req: ApiOptions<JamParameters.ID>): Promise<void> {
		const podcast = await this.byID(req.query.id);
		this.engine.podcasts.refreshPodcast(podcast); // do not wait
	}

	async create(req: ApiOptions<JamParameters.PodcastNew>): Promise<Jam.Podcast> {
		const podcast = await this.engine.podcasts.addPodcast(req.query.url);
		return this.prepare(podcast, {}, req.user);
	}

	async delete(req: ApiOptions<JamParameters.ID>): Promise<void> {
		const podcast = await this.byID(req.query.id);
		await this.engine.podcasts.removePodcast(podcast);
	}

	async status(req: ApiOptions<JamParameters.ID>): Promise<Jam.PodcastStatus> {
		const podcast = await this.byID(req.query.id);
		return {
			lastCheck: podcast.lastCheck,
			status: this.engine.podcasts.isDownloadingPodcast(podcast.id) ? PodcastStatus.downloading : podcast.status
		};
	}
}

class APIJamEpisode extends APIJamObj<JamParameters.Episode, JamParameters.Episodes, JamParameters.IncludesEpisode, JamServe.SearchQueryPodcastEpisode, JamParameters.EpisodeSearch, JamServe.Episode, Jam.PodcastEpisode> {

	constructor(engine: Engine, api: ApiJam) {
		super(engine, engine.store.episode, DBObjectType.episode, api);
	}

	async prepare(episode: JamServe.Episode, includes: JamParameters.IncludesEpisode, user: JamServe.User): Promise<Jam.PodcastEpisode> {
		const result = FORMAT.packPodcastEpisode(episode, includes,
			this.engine.podcasts.isDownloadingPodcastEpisode(episode.id) ? PodcastStatus.downloading : episode.status
		);
		if (includes.trackState) {
			const state = await this.engine.store.state.findOrCreate(episode.id, user.id, DBObjectType.episode);
			result.state = FORMAT.packState(state);
		}
		return result;
	}

	translateQuery(query: JamParameters.EpisodeSearch, user: JamServe.User): JamServe.SearchQueryPodcastEpisode {
		return {
			title: query.title,
			podcastID: query.podcastID,
			status: query.status,
			offset: query.offset,
			amount: query.amount,
			sorts: query.sortField ? [{field: query.sortField, descending: !!query.sortDescending}] : undefined
		};
	}

	async retrieve(req: ApiOptions<JamParameters.ID>): Promise<void> {
		const episode = await this.byID(req.query.id);
		if (!episode.path) {
			this.engine.podcasts.downloadPodcastEpisode(episode); // do not wait
		}
	}

	async stream(req: ApiOptions<JamParameters.Stream>): Promise<IApiBinaryResult> {
		const episode = await this.byID(req.query.id);
		if (!episode || !episode.path || !episode.media) {
			return Promise.reject(GenericError('Podcast episode not ready'));
		}
		const filename = episode.path;
		let format = req.query.format || 'mp3';
		if (format[0] === '.') {
			format = format.slice(1);
		}
		const maxBitRate = req.query.maxBitRate || 0;
		if (Transcoder.needsTranscoding(episode.media.format || fileSuffix(filename), format, maxBitRate)) {
			if (!Transcoder.validTranscoding(episode.media, format)) {
				return Promise.reject(InvalidParamError('Unsupported transcoding format'));
			}
			return {pipe: new PreTranscoder(filename, format, maxBitRate)};
		} else {
			return {file: {filename, name: (episode.id + '.' + format)}};
		}
	}

	async status(req: ApiOptions<JamParameters.ID>): Promise<Jam.PodcastEpisodeStatus> {
		const episode = await this.byID(req.query.id);
		return {
			status: this.engine.podcasts.isDownloadingPodcastEpisode(episode.id) ? PodcastStatus.downloading : episode.status
		};
	}

}

class APIJamAlbum extends APIJamObj<JamParameters.Album, JamParameters.Albums, JamParameters.IncludesAlbum, JamServe.SearchQueryAlbum, JamParameters.AlbumSearch, JamServe.Album, Jam.Album> {

	constructor(engine: Engine, api: ApiJam) {
		super(engine, engine.store.album, DBObjectType.album, api);
	}

	async prepare(album: JamServe.Album, includes: JamParameters.IncludesAlbum, user: JamServe.User): Promise<Jam.Album> {
		const result = FORMAT.packAlbum(album, includes);
		if (includes.albumState) {
			result.state = await this.engine.store.state.findOrCreate(album.id, user.id, DBObjectType.album);
		}
		if (includes.albumInfo) {
			const info = await this.engine.meta.getAlbumInfo(album);
			result.info = FORMAT.packAlbumInfo(info);
		}
		if (includes.albumTracks) {
			let tracks = await this.engine.store.track.byIds(album.trackIDs);
			tracks = this.defaultTrackSort(tracks);
			result.tracks = await this.api.track.prepareList(tracks, includes, user);
		}
		return result;
	}

	translateQuery(query: JamParameters.AlbumSearch, user: JamServe.User): JamServe.SearchQueryAlbum {
		return {
			name: query.name,
			rootID: query.rootID,
			artist: query.artist,
			artistID: query.artistID,
			trackID: query.trackID,
			mbAlbumID: query.mbAlbumID,
			mbArtistID: query.mbArtistID,
			genre: query.genre,
			newerThan: query.newerThan,
			fromYear: query.fromYear,
			toYear: query.toYear,
			offset: query.offset,
			amount: query.amount,
			sorts: query.sortField ? [{field: query.sortField, descending: !!query.sortDescending}] : undefined
		};
	}

	async similarTracks(req: ApiOptions<JamParameters.SimilarTracks>): Promise<Array<Jam.Track>> {
		const album = await this.byID(req.query.id);
		const tracks = await this.engine.meta.getAlbumSimilarTracks(album);
		return this.api.track.prepareList(paginate(tracks, req.query.amount, req.query.offset), req.query, req.user);
	}

	async list(req: ApiOptions<JamParameters.AlbumList>): Promise<Array<Jam.Album>> {
		return this.getList(req.query, req.query, req.query, req.user);
	}

	async tracks(req: ApiOptions<JamParameters.Tracks>): Promise<Array<Jam.Track>> {
		const albums = await this.byIDs(req.query.ids);
		let trackIDs: Array<string> = [];
		albums.forEach(album => {
			trackIDs = trackIDs.concat(album.trackIDs);
		});
		return this.api.track.prepareListByIDs(trackIDs, req.query, req.user);
	}

}

class APIJamArtist extends APIJamObj<JamParameters.Artist, JamParameters.Artists, JamParameters.IncludesArtist, JamServe.SearchQueryArtist, JamParameters.ArtistSearch, JamServe.Artist, Jam.Artist> {

	constructor(engine: Engine, api: ApiJam) {
		super(engine, engine.store.artist, DBObjectType.artist, api);
	}

	async prepare(artist: JamServe.Artist, includes: JamParameters.IncludesArtist, user: JamServe.User): Promise<Jam.Artist> {
		const result = FORMAT.packArtist(artist, includes);
		if (includes.artistState) {
			const state = await this.engine.store.state.findOrCreate(artist.id, user.id, DBObjectType.artist);
			result.state = FORMAT.packState(state);
		}
		if (includes.artistInfo) {
			const infos = await this.engine.meta.getArtistInfos(artist, false, !!includes.artistInfoSimilar);
			result.info = FORMAT.packArtistInfo(infos.info);
			if (includes.artistInfoSimilar) {
				const similar: Array<{ id: string, name: string }> = [];
				(infos.similar || []).forEach(sim => {
					if (sim.artist) {
						similar.push({id: sim.artist.id, name: sim.artist.name});
					}
				});
				result.info.similar = similar;
			}
		}
		if (includes.artistTracks) {
			const tracks = await this.engine.store.track.byIds(artist.trackIDs);
			result.tracks = await this.api.track.prepareList(tracks, includes, user);
		}
		if (includes.artistAlbums) {
			const albums = await this.engine.store.album.byIds(artist.albumIDs);
			result.albums = await this.api.album.prepareList(albums, includes, user);
		}
		return result;
	}

	translateQuery(query: JamParameters.ArtistSearch, user: JamServe.User): JamServe.SearchQueryArtist {
		return {
			name: query.name,
			rootID: query.rootID,
			albumID: query.albumID,
			mbArtistID: query.mbArtistID,
			genre: query.genre,
			newerThan: query.newerThan,
			fromYear: query.fromYear,
			toYear: query.toYear,
			offset: query.offset,
			amount: query.amount,
			sorts: query.sortField ? [{field: query.sortField, descending: !!query.sortDescending}] : undefined
		};
	}

	async similar(req: ApiOptions<JamParameters.Artist>): Promise<Array<Jam.Artist>> {
		const artist = await this.byID(req.query.id);
		const artistInfo = await this.engine.meta.getArtistInfos(artist, false, true);
		const list = (artistInfo.similar || []).filter(s => !!s.artist).map(s => <JamServe.Artist>s.artist);
		return this.prepareList(list, req.query, req.user);
	}

	async similarTracks(req: ApiOptions<JamParameters.SimilarTracks>): Promise<Array<Jam.Track>> {
		const artist = await this.byID(req.query.id);
		const tracks = await this.engine.meta.getArtistSimilarTracks(artist);
		return this.api.track.prepareList(paginate(tracks, req.query.amount, req.query.offset), req.query, req.user);
	}

	async list(req: ApiOptions<JamParameters.ArtistList>): Promise<Array<Jam.Artist>> {
		return this.getList(req.query, req.query, req.query, req.user);
	}

	async index(req: ApiOptions<JamParameters.Index>): Promise<Jam.ArtistIndex> {
		const artistIndex = await this.engine.index.getArtistIndex(this.engine.io.scanning);
		return FORMAT.packArtistIndex(this.engine.index.filterArtistIndex(req.query.rootID, artistIndex));
	}

	async tracks(req: ApiOptions<JamParameters.Tracks>): Promise<Array<Jam.Track>> {
		const artists = await this.byIDs(req.query.ids);
		let trackIDs: Array<string> = [];
		artists.forEach(artist => {
			trackIDs = trackIDs.concat(artist.trackIDs);
		});
		return this.api.track.prepareListByIDs(trackIDs, req.query, req.user);
	}

}

class APiJamPlaylist extends APIJamObj<JamParameters.Playlist, JamParameters.Playlists, JamParameters.IncludesPlaylist, JamServe.SearchQueryPlaylist, JamParameters.PlaylistSearch, JamServe.Playlist, Jam.Playlist> {

	constructor(engine: Engine, api: ApiJam) {
		super(engine, engine.store.playlist, DBObjectType.playlist, api);
	}

	// TODO: filter none public playlist in base api functions?

	async prepare(playlist: JamServe.Playlist, includes: JamParameters.IncludesPlaylist, user: JamServe.User): Promise<Jam.Playlist> {
		const result = FORMAT.packPlaylist(playlist, includes);
		if (includes.playlistState) {
			const state = await this.engine.store.state.findOrCreate(playlist.id, user.id, DBObjectType.artist);
			result.state = FORMAT.packState(state);
		}
		if (includes.playlistTracks) {
			const tracks = await this.engine.store.track.byIds(playlist.trackIDs);
			result.tracks = await this.api.track.prepareList(tracks, includes, user);
		}
		return result;
	}

	translateQuery(query: JamParameters.PlaylistSearch, user: JamServe.User): JamServe.SearchQueryPlaylist {
		return {
			name: query.name,
			userID: user.id,
			isPublic: query.isPublic,
			offset: query.offset,
			amount: query.amount,
			sorts: query.sortField ? [{field: query.sortField, descending: !!query.sortDescending}] : undefined
		};
	}

	async create(req: ApiOptions<JamParameters.PlaylistNew>): Promise<Jam.Playlist> {
		const playlist = await this.engine.playlists.createPlaylist(req.query.name, req.query.comment, req.query.isPublic === undefined ? false : req.query.isPublic, req.user.id, req.query.trackIDs || []);
		return this.prepare(playlist, {playlistTracksIDs: true}, req.user);
	}

	async update(req: ApiOptions<JamParameters.PlaylistUpdate>): Promise<void> {
		const playlist = await this.byID(req.query.id);
		if (playlist.userID !== req.user.id) {
			return Promise.reject(UnauthError());
		}
		playlist.name = req.query.name || playlist.name;
		playlist.comment = req.query.comment || playlist.comment;
		playlist.isPublic = req.query.isPublic === undefined ? playlist.isPublic : req.query.isPublic;
		playlist.changed = Date.now();
		playlist.trackIDs = req.query.trackIDs || [];
		await this.engine.playlists.updatePlaylist(playlist);
	}

	async tracks(req: ApiOptions<JamParameters.Tracks>): Promise<Array<Jam.Track>> {
		let playlists = await this.byIDs(req.query.ids);
		playlists = playlists.filter(playlist => playlist.userID === req.user.id);
		let trackIDs: Array<string> = [];
		playlists.forEach(playlist => {
			trackIDs = trackIDs.concat(playlist.trackIDs);
		});
		return this.api.track.prepareListByIDs(trackIDs, req.query, req.user);
	}

	async delete(req: ApiOptions<JamParameters.ID>): Promise<void> {
		const playlist = await this.byID(req.query.id);
		if (playlist.userID !== req.user.id) {
			return Promise.reject(UnauthError());
		}
		await this.engine.playlists.removePlaylist(playlist);
	}

}

class APIJamTrack extends APIJamObj<JamParameters.Track, JamParameters.Tracks, JamParameters.IncludesTrack, JamServe.SearchQueryTrack, JamParameters.TrackSearch, JamServe.Track, Jam.Track> {

	constructor(engine: Engine, api: ApiJam) {
		super(engine, engine.store.track, DBObjectType.track, api);
	}

	async prepare(track: JamServe.Track, includes: JamParameters.IncludesTrack, user: JamServe.User): Promise<Jam.Track> {
		const result = FORMAT.packTrack(track, includes);
		if (includes.trackID3) {
			result.tagID3 = await this.engine.audio.readID3v2(path.join(track.path, track.name));
		}
		if (includes.trackState) {
			const state = await this.engine.store.state.findOrCreate(track.id, user.id, DBObjectType.track);
			result.state = FORMAT.packState(state);
		}
		return result;
	}

	translateQuery(query: JamParameters.TrackSearch, user: JamServe.User): JamServe.SearchQueryTrack {
		return {
			rootID: query.rootID,
			parentID: query.parentID,
			artist: query.artist,
			title: query.title,
			album: query.album,
			genre: query.genre,
			newerThan: query.newerThan,
			fromYear: query.fromYear,
			toYear: query.toYear,
			offset: query.offset,
			amount: query.amount,
			sorts: query.sortField ? [{field: query.sortField, descending: !!query.sortDescending}] : undefined
		};
	}

	// more track api

	async tagID3(req: ApiOptions<JamParameters.ID>): Promise<Jam.ID3Tag> {
		const track = await this.byID(req.query.id);
		return this.engine.audio.readID3v2(path.join(track.path, track.name));
	}

	async tagID3s(req: ApiOptions<JamParameters.IDs>): Promise<Jam.ID3Tags> {
		let tracks = await this.byIDs(req.query.ids);
		tracks = this.defaultTrackSort(tracks);
		const result: Jam.ID3Tags = {};
		for (const track of tracks) {
			result[track.id] = await this.engine.audio.readID3v2(path.join(track.path, track.name));
		}
		return result;
	}

	async tagID3Update(req: ApiOptions<JamParameters.TagID3Update>): Promise<void> {
		const track = await this.byID(req.query.id);
		await this.engine.audio.saveID3v2(path.join(track.path, track.name), req.query.tag);
		this.engine.io.rescanTracks([track]); // do not wait
	}

	async tagID3sUpdate(req: ApiOptions<JamParameters.TagID3sUpdate>): Promise<void> {
		const tracks = await this.byIDs(req.query.tagID3s.map(tagID3 => tagID3.id));
		const list: Array<{ track?: JamServe.Track; tag: Jam.ID3Tag }> = req.query.tagID3s.map(tagID3 => {
			return {track: tracks.find(t => t.id === tagID3.id), tag: tagID3.tag};
		});
		for (const item of list) {
			if (!item.track) {
				return Promise.reject(NotFoundError());
			}
			await this.engine.audio.saveID3v2(path.join(item.track.path, item.track.name), item.tag);
		}
		this.engine.io.rescanTracks(tracks); // do not wait
	}

	async prepareBookmark(bookmark: JamServe.Bookmark, includes: JamParameters.IncludesBookmark, user: JamServe.User): Promise<Jam.TrackBookmark> {
		const result = FORMAT.packBookmark(bookmark);
		if (includes.bookmarkTrack && bookmark.destID) {
			const track = await this.engine.store.track.byId(bookmark.destID);
			if (track) {
				result.track = await this.prepare(track, includes, user);
			}
		}
		return result;
	}


	async bookmarkCreate(req: ApiOptions<JamParameters.BookmarkCreate>): Promise<Jam.TrackBookmark> {
		const track = await this.byID(req.query.id);
		const bookmark = await this.engine.trackBookmarkCreate(track, req.user, req.query.position || 0, req.query.comment);
		return this.prepareBookmark(bookmark, {}, req.user);
	}

	async bookmarkDelete(req: ApiOptions<JamParameters.ID>): Promise<void> {
		await this.engine.trackBookmarkRemove(req.query.id, req.user);
	}

	async bookmarkList(req: ApiOptions<JamParameters.BookmarkList>): Promise<Array<Jam.TrackBookmark>> {
		const bookmarks = await this.engine.store.bookmark.search({userID: req.user.id});
		const result = bookmarks.map(bookmark => FORMAT.packBookmark(bookmark));
		if (req.query.bookmarkTrack) {
			const entries = await this.engine.store.track.byIds(bookmarks.map(b => b.destID));
			const tracks = await this.prepareList(entries, req.query, req.user);
			result.forEach(bookmark => {
				bookmark.track = tracks.find(t => t.id === bookmark.trackID);
			});
		}
		return result;
	}

	async stream(req: ApiOptions<JamParameters.Stream>): Promise<IApiBinaryResult> {
		const track = await this.byID(req.query.id);
		const filename = path.join(track.path, track.name);
		let format = req.query.format || 'mp3';
		if (format[0] === '.') {
			format = format.slice(1);
		}
		const maxBitRate = req.query.maxBitRate || 0;
		if (Transcoder.needsTranscoding(track.media.format || fileSuffix(filename), format, maxBitRate)) {
			if (!Transcoder.validTranscoding(track.media, format)) {
				return Promise.reject(InvalidParamError('Unsupported transcoding format'));
			}
			return {pipe: new PreTranscoder(filename, format, maxBitRate)};
		} else {
			return {file: {filename, name: track.id + '.' + format}};
		}
	}

	async similar(req: ApiOptions<JamParameters.SimilarTracks>): Promise<Array<Jam.Track>> {
		const track = await this.byID(req.query.id);
		const tracks = await this.engine.meta.getTrackSimilarTracks(track);
		return this.prepareList(paginate(tracks, req.query.amount, req.query.offset), req.query, req.user);
	}

	async list(req: ApiOptions<JamParameters.TrackList>): Promise<Array<Jam.Track>> {
		return this.getList(req.query, req.query, req.query, req.user);
	}

}

class APIJamFolder extends APIJamObj<JamParameters.Folder, JamParameters.Folders, JamParameters.IncludesFolderChildren, JamServe.SearchQueryFolder, JamParameters.FolderSearch, JamServe.Folder, Jam.Folder> {

	constructor(engine: Engine, api: ApiJam) {
		super(engine, engine.store.folder, DBObjectType.folder, api);
	}

	async prepare(folder: JamServe.Folder, includes: JamParameters.IncludesFolderChildren, user: JamServe.User): Promise<Jam.Folder> {
		const result = FORMAT.packFolder(folder, includes);
		if (includes.folderChildren || includes.folderTracks) {
			let tracks = await this.engine.store.track.search({parentID: folder.id});
			tracks = this.defaultTrackSort(tracks);
			result.tracks = await this.api.track.prepareList(tracks, includes, user);
		}
		if (includes.folderChildren || includes.folderSubfolders) {
			const folders = await this.engine.store.folder.search({parentID: folder.id, sorts: [{field: 'name', descending: false}]});
			// TODO: introduce children includes?
			result.folders = await this.prepareList(folders, {folderState: includes.folderState, folderHealth: includes.folderHealth, folderTag: includes.folderTag}, user);
		}
		if (includes.folderState) {
			const state = await this.engine.store.state.findOrCreate(folder.id, user.id, DBObjectType.folder);
			result.state = FORMAT.packState(state);
		}
		if (includes.folderInfo) {
			if (folder.tag.type === FolderType.artist) {
				const infos = await this.engine.meta.getFolderArtistInfo(folder, false, !!includes.folderInfoSimilar);
				result.artistInfo = FORMAT.packArtistFolderInfo(infos.info);
				if (includes.folderInfoSimilar) {
					const similar: Array<{ id: string, name: string }> = [];
					(infos.similar || []).forEach(sim => {
						if (sim.folder) {
							similar.push({id: sim.folder.id, name: sim.folder.tag && sim.folder.tag.artist ? sim.folder.tag.artist : path.basename(sim.folder.path)});
						}
					});
					result.artistInfo.similar = similar;
				}
			} else {
				const info = await this.engine.meta.getFolderInfo(folder);
				result.albumInfo = FORMAT.packAlbumFolderInfo(info);
			}
		}
		if (includes.folderHealth) {
			const problems = await getFolderProblems(folder);
			result.health = {problems};
		}
		if (includes.folderParents) {
			result.parents = await this.engine.getFolderParents(folder);
		}
		return result;
	}

	translateQuery(query: JamParameters.FolderSearch, user: JamServe.User): JamServe.SearchQueryFolder {
		return {
			rootID: query.rootID,
			parentID: query.parentID,
			artist: query.artist,
			title: query.title,
			album: query.album,
			genre: query.genre,
			newerThan: query.newerThan,
			fromYear: query.fromYear,
			toYear: query.toYear,
			offset: query.offset,
			amount: query.amount,
			types: query.type ? [query.type] : undefined,
			sorts: query.sortField ? [{field: query.sortField, descending: !!query.sortDescending}] : undefined
		};
	}

	/* more folder api */

	async subfolders(req: ApiOptions<JamParameters.FolderSubFolders>): Promise<Array<Jam.Folder>> {
		const list = await this.engine.store.folder.search({parentID: req.query.id});
		return this.prepareList(list, req.query, req.user);
	}

	async tracks(req: ApiOptions<JamParameters.FolderTracks>): Promise<Array<Jam.Track>> {
		const folders = await this.byIDs(req.query.ids);
		const trackQuery: JamServe.SearchQueryTrack = req.query.recursive ? {inPaths: folders.map(folder => folder.path)} : {parentIDs: folders.map(folder => folder.id)};
		const tracks = await this.engine.store.track.search(trackQuery);
		return this.api.track.prepareList(this.defaultTrackSort(tracks), req.query, req.user);
	}

	async children(req: ApiOptions<JamParameters.FolderChildren>): Promise<Jam.FolderChildren> {
		const folders = await this.engine.store.folder.search({parentID: req.query.id});
		let tracks = await this.engine.store.track.search({parentID: req.query.id});
		tracks = this.defaultTrackSort(tracks);
		const resultTracks = await this.api.track.prepareList(tracks, req.query, req.user);
		const resultFolders = await this.prepareList(folders, req.query, req.user);
		return {folders: resultFolders, tracks: resultTracks};
	}

	async imageUrlUpdate(req: ApiOptions<JamParameters.FolderEditImg>): Promise<void> {
		const folder = await this.byID(req.query.id);
		await this.engine.downloadFolderImage(folder, req.query.url);
	}

	async imageUploadUpdate(req: ApiOptions<JamParameters.ID>): Promise<void> {
		if (!req.file) {
			return Promise.reject(InvalidParamError('Image upload failed'));
		}
		const folder = await this.byID(req.query.id);
		await this.engine.setFolderImage(folder, req.file);
	}

	async nameUpdate(req: ApiOptions<JamParameters.FolderEditName>): Promise<void> {
		const folder = await this.byID(req.query.id);
		await this.engine.renameFolder(folder, req.query.name);
	}

	async artistInfo(req: ApiOptions<JamParameters.ArtistInfo>): Promise<Jam.ArtistFolderInfo> {
		const folder = await this.byID(req.query.id);
		const artistInfo = await this.engine.meta.getFolderArtistInfo(folder, false, req.query.similar);
		const result = FORMAT.packArtistFolderInfo(artistInfo.info);
		if (req.query.similar) {
			const list = (artistInfo.similar || []).filter(s => !!s.folder).map(s => <JamServe.Folder>s.folder);
			result.similar = await this.prepareList(list, {}, req.user);
		}
		return result;
	}

	async artistSimilar(req: ApiOptions<JamParameters.Folder>): Promise<Array<Jam.Folder>> {
		const folder = await this.byID(req.query.id);
		const artistInfo = await this.engine.meta.getFolderArtistInfo(folder, false, true);
		const list = (artistInfo.similar || []).filter(s => !!s.folder).map(s => <JamServe.Folder>s.folder);
		return this.prepareList(list, req.query, req.user);
	}

	async albumInfo(req: ApiOptions<JamParameters.AlbumInfo>): Promise<Jam.AlbumFolderInfo> {
		const folder = await this.byID(req.query.id);
		const info = await this.engine.meta.getFolderInfo(folder);
		return FORMAT.packAlbumFolderInfo(info);
	}

	async artistSimilarTracks(req: ApiOptions<JamParameters.SimilarTracks>): Promise<Array<Jam.Track>> {
		const folder = await this.byID(req.query.id);
		const tracks = await this.engine.meta.getFolderSimilarTracks(folder);
		return this.api.track.prepareList(paginate(tracks, req.query.amount, req.query.offset), req.query, req.user);
	}

	async list(req: ApiOptions<JamParameters.FolderList>): Promise<Array<Jam.Folder>> {
		return this.getList(req.query, req.query, req.query, req.user);
	}

	async index(req: ApiOptions<JamParameters.Index>): Promise<Jam.FolderIndex> {
		const folderIndex = await this.engine.index.getFolderIndex(this.engine.io.scanning);
		return FORMAT.packFolderIndex(this.engine.index.filterFolderIndex(req.query.rootID, folderIndex));
	}

}

class APIJamRoot extends APIJamObj<JamParameters.ID, JamParameters.IDs, {}, JamServe.SearchQueryRoot, JamParameters.Paginate, JamServe.Root, Jam.Root> {

	constructor(engine: Engine, api: ApiJam) {
		super(engine, engine.store.root, DBObjectType.root, api);
	}

	async prepare(root: JamServe.Root, includes: {}, user: JamServe.User): Promise<Jam.Root> {
		return FORMAT.packRoot(root, this.engine.io.getRootState(root.id));
	}

	translateQuery(query: JamParameters.Paginate, user: JamServe.User): JamServe.SearchQueryRoot {
		return {
			offset: query.offset,
			amount: query.amount,
			// sorts: query.sortField ? [{field: query.sortField, descending: !!query.sortDescending}] : undefined
		};
	}

	async create(req: ApiOptions<JamParameters.RootNew>): Promise<Jam.Root> {
		const root: JamServe.Root = {
			id: '',
			created: Date.now(),
			type: DBObjectType.root,
			name: req.query.name,
			path: req.query.path
		};
		root.id = await this.engine.roots.createRoot(root);
		return this.prepare(root, {}, req.user);
	}

	async update(req: ApiOptions<JamParameters.RootUpdate>): Promise<Jam.Root> {
		const root = await this.byID(req.query.id);
		root.name = req.query.name;
		root.path = req.query.path;
		await this.engine.roots.updateRoot(root);
		return this.prepare(root, {}, req.user);
	}

	async delete(req: ApiOptions<JamParameters.ID>): Promise<void> {
		const root = await this.byID(req.query.id);
		await this.engine.roots.removeRoot(root);
	}

	async scanAll(req: ApiOptions<{}>): Promise<void> {
		this.engine.refresh(); // do not wait
	}

	async scan(req: ApiOptions<JamParameters.ID>): Promise<void> {
		const root = await this.byID(req.query.id);
		this.engine.refreshRoot(root); // do not wait
	}

}

class APIJamUser extends APIJamObj<JamParameters.ID, JamParameters.IDs, {}, JamServe.SearchQueryUser, JamParameters.UserSearch, JamServe.User, Jam.User> {

	constructor(engine: Engine, api: ApiJam) {
		super(engine, engine.store.user, DBObjectType.user, api);
	}

	async prepare(item: JamServe.User, includes: {}, user: JamServe.User): Promise<Jam.User> {
		return FORMAT.packUser(item);
	}

	translateQuery(query: JamParameters.UserSearch, user: JamServe.User): JamServe.SearchQueryUser {
		return {
			name: query.name,
			isAdmin: query.isAdmin,
			offset: query.offset,
			amount: query.amount,
			sorts: query.sortField ? [{field: query.sortField, descending: !!query.sortDescending}] : undefined
		};
	}

	async create(req: ApiOptions<JamParameters.UserNew>): Promise<Jam.User> {
		const u: JamServe.User = {
			id: '',
			name: req.query.name || '',
			pass: '',
			email: '',
			type: DBObjectType.user,
			created: Date.now(),
			ldapAuthenticated: false,
			scrobblingEnabled: false,
			roles: {
				adminRole: req.query.roleAdmin !== undefined ? req.query.roleAdmin : false,
				streamRole: req.query.roleStream !== undefined ? req.query.roleStream : true,
				uploadRole: req.query.roleUpload !== undefined ? req.query.roleUpload : false,
				podcastRole: req.query.rolePodcast !== undefined ? req.query.rolePodcast : false,
				// settingsRole: false,
				// jukeboxRole: false,
				// downloadRole: false,
				// playlistRole: false,
				// coverArtRole: false,
				// commentRole: false,
				// shareRole: false,
				// videoConversionRole: false
			}
		};
		u.id = await this.engine.users.createUser(u);
		return this.prepare(u, {}, req.user);
	}

	async update(req: ApiOptions<JamParameters.UserUpdate>): Promise<Jam.User> {
		const u = await this.byID(req.query.id);
		if (req.query.name) {
			if (req.query.name !== u.name) {
				const u2 = await this.engine.store.user.get(req.query.name);
				if (u2) {
					return Promise.reject(GenericError('Username already exists'));
				}
			}
			u.name = req.query.name.trim();
		}
		if (req.query.email) {
			u.email = req.query.email.trim();
		}
		if (req.query.roleAdmin !== undefined) {
			u.roles.adminRole = req.query.roleAdmin;
		}
		if (req.query.rolePodcast !== undefined) {
			u.roles.podcastRole = req.query.rolePodcast;
		}
		if (req.query.roleStream !== undefined) {
			u.roles.streamRole = req.query.roleStream;
		}
		if (req.query.roleUpload !== undefined) {
			u.roles.uploadRole = req.query.roleUpload;
		}
		await this.engine.users.updateUser(u);
		return this.prepare(u, {}, req.user);
	}

	async playqueueUpdate(req: ApiOptions<JamParameters.PlayQueueSet>): Promise<void> {
		await this.engine.playqueues.saveQueue(req.user.id, req.query.trackIDs, req.query.currentID, req.query.position, req.client);
	}

	async playqueue(req: ApiOptions<JamParameters.IncludesPlayQueue>): Promise<Jam.PlayQueue> {
		const playQueue = await this.engine.playqueues.getQueueOrCreate(req.user.id, req.client);
		const result = FORMAT.packPlayQueue(playQueue, req.query);
		if (req.query.playQueueTracks) {
			const entries = await this.engine.store.track.byIds(playQueue.trackIDs);
			result.tracks = await this.api.track.prepareList(entries, req.query, req.user);
		}
		return result;
	}

	async delete(req: ApiOptions<JamParameters.ID>): Promise<void> {
		const u = await this.byID(req.query.id);
		await this.engine.users.deleteUser(u);
	}

	async imageUploadUpdate(req: ApiOptions<JamParameters.ID>): Promise<void> {
		if (!req.file) {
			return Promise.reject(InvalidParamError('Image upload failed'));
		}
		const u = await this.byID(req.query.id);
		if (u.id !== req.user.id && !req.user.roles.adminRole) {
			return Promise.reject(UnauthError());
		}
		await this.engine.users.setUserImage(u, req.file);
	}

}

class APiJamChat {
	engine: Engine;
	api: ApiJam;

	constructor(engine: Engine, api: ApiJam) {
		this.engine = engine;
		this.api = api;
	}

	async list(req: ApiOptions<JamParameters.Chat>): Promise<Array<Jam.ChatMessage>> {
		const messages = await this.engine.chat.get(req.query.since);
		return messages.map(msg => FORMAT.packChatMessage(msg));
	}

	async create(req: ApiOptions<JamParameters.ChatNew>): Promise<void> {
		await this.engine.chat.add(req.query.message, req.user);
	}

	async delete(req: ApiOptions<JamParameters.ChatDelete>): Promise<void> {
		const message = await this.engine.chat.find(req.query.time);
		if (!message) {
			return Promise.reject(NotFoundError());
		}
		if (message.userID !== req.user.id) {
			return Promise.reject(UnauthError());
		}
		await this.engine.chat.remove(message);
	}

}

class APiJamMetadata {
	engine: Engine;
	api: ApiJam;
	private cache: { [key: string]: any } = {};

	constructor(engine: Engine, api: ApiJam) {
		this.engine = engine;
		this.api = api;
	}

	async genreList(req: ApiOptions<JamParameters.Genres>): Promise<Array<Jam.Genre>> {
		const genres = await this.engine.genres.getGenres(req.query.rootID, false);
		return genres.map(genre => FORMAT.packGenre(genre));
	}

	async brainzSearch(req: ApiOptions<JamParameters.BrainzSearch>): Promise<MusicBrainz.Response> {
		const query = Object.assign({}, req.query);
		delete query.type;
		const key = 'search-' + req.query.type + JSON.stringify(query);
		if (this.cache[key]) {
			console.log('serving from cache search');
			return this.cache[key];
		}
		const brainz = await this.engine.audio.musicbrainzSearch(req.query.type, query);
		this.cache[key] = brainz;
		return brainz;
	}

	async acoustidLookup(req: ApiOptions<JamParameters.AcoustidLookup>): Promise<Array<Acoustid.Result>> {
		const key = 'acoustid-' + req.query.id + req.query.inc;
		if (this.cache[key]) {
			console.log('serving from cache acoustid');
			return this.cache[key];
		}
		const track = await this.api.track.byID(req.query.id);
		const acoustid = await this.engine.audio.acoustidLookup(path.join(track.path, track.name), req.query.inc);
		this.cache[key] = acoustid;
		return acoustid;
	}

	async lastfmLookup(req: ApiOptions<JamParameters.LastFMLookup>): Promise<LastFM.Result> {
		const key = 'lastfm-' + req.query.type + req.query.id;
		if (this.cache[key]) {
			console.log('serving from cache lastfm');
			return this.cache[key];
		}
		const lastfm = await this.engine.audio.lastFMLookup(req.query.type, req.query.id);
		this.cache[key] = lastfm;
		return lastfm;
	}

	async brainzLookup(req: ApiOptions<JamParameters.BrainzLookup>): Promise<MusicBrainz.Response> {
		const key = 'lookup-' + req.query.type + req.query.id + req.query.inc;
		if (this.cache[key]) {
			console.log('serving from cache lookup');
			return this.cache[key];
		}
		const brainz = await this.engine.audio.musicbrainzLookup(req.query.type, req.query.id, req.query.inc);
		this.cache[key] = brainz;
		return brainz;
	}
}

export class ApiJam {
	private readonly engine: Engine;
	podcast: APIJamPodcast;
	episode: APIJamEpisode;
	album: APIJamAlbum;
	track: APIJamTrack;
	artist: APIJamArtist;
	folder: APIJamFolder;
	root: APIJamRoot;
	user: APIJamUser;
	chat: APiJamChat;
	playlist: APiJamPlaylist;
	metadata: APiJamMetadata;

	constructor(engine: Engine) {
		this.engine = engine;
		this.podcast = new APIJamPodcast(engine, this);
		this.episode = new APIJamEpisode(engine, this);
		this.album = new APIJamAlbum(engine, this);
		this.track = new APIJamTrack(engine, this);
		this.artist = new APIJamArtist(engine, this);
		this.folder = new APIJamFolder(engine, this);
		this.root = new APIJamRoot(engine, this);
		this.user = new APIJamUser(engine, this);
		this.playlist = new APiJamPlaylist(engine, this);
		this.metadata = new APiJamMetadata(engine, this);
		this.chat = new APiJamChat(engine, this);
	}

	async ping(req: ApiOptions<{}>): Promise<Jam.Ping> {
		return {version: APIVERSION};
	}

	async session(req: ApiOptions<{}>): Promise<Jam.Session> {
		if (req.user) {
			return {version: APIVERSION, allowedCookieDomains: this.engine.config.server.session.allowedCookieDomains, user: FORMAT.packUser(req.user)};
		} else {
			return {version: APIVERSION, allowedCookieDomains: this.engine.config.server.session.allowedCookieDomains};
		}
	}

	async nowPlaying(req: ApiOptions<{}>): Promise<Array<Jam.NowPlaying>> {
		const list = await this.engine.nowPlaying.getNowPlaying();
		return list.map(entry => FORMAT.packNowPlaying(entry));
	}

	async genreList(req: ApiOptions<JamParameters.Genres>): Promise<Array<Jam.Genre>> {
		const genres = await this.engine.genres.getGenres(req.query.rootID, false);
		return genres.map(genre => FORMAT.packGenre(genre));
	}

	async image(req: ApiOptions<JamParameters.Image>): Promise<IApiBinaryResult> {
		const id = req.query.id;
		if (!id || id.length === 0) {
			return Promise.reject(InvalidParamError());
		}
		const obj = await this.engine.store.findInAll(id);
		if (!obj) {
			return Promise.reject(NotFoundError());
		}
		const result = await this.engine.getObjImage(obj, req.query.size, req.query.format);
		if (!result) {
			return Promise.reject(NotFoundError());
		}
		return result;
	}

	async stream(req: ApiOptions<JamParameters.PathStream>): Promise<IApiBinaryResult> {
		const id = req.query.id;
		if (!id || id.length === 0) {
			return Promise.reject(InvalidParamError());
		}
		const obj = await this.engine.store.findInAll(id);
		if (!obj) {
			return Promise.reject(NotFoundError());
		}
		const result = await this.engine.getObjStream(obj, req.query.format, undefined, req.user);
		if (!result) {
			return Promise.reject(NotFoundError());
		}
		return result;
	}

	async download(req: ApiOptions<JamParameters.Download>): Promise<IApiBinaryResult> {
		const id = req.query.id;
		if (!id || id.length === 0) {
			return Promise.reject(InvalidParamError());
		}
		const obj = await this.engine.store.findInAll(id);
		if (!obj) {
			return Promise.reject(NotFoundError());
		}
		const result = await this.engine.getObjDownload(obj, req.query.format, req.user);
		if (!result) {
			return Promise.reject(NotFoundError());
		}
		return result;
	}


}
