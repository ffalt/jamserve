import {Subsonic} from '../../model/subsonic-rest-data-1.16.0';
import {SubsonicParameters} from '../../model/subsonic-rest-params-1.16.0';
import {SubsonicApi, ApiOptions} from './api';
import {ApiResponder} from './response';
import express from 'express';
import {IApiBinaryResult} from '../../typings';
import {apiCheck} from './check';

export interface SubsonicRolesHandler {
	podcast: express.RequestHandler;
	share: express.RequestHandler;
	admin: express.RequestHandler;
	jukebox: express.RequestHandler;
}

export function registerApi(router: express.Router, api: SubsonicApi, roles: SubsonicRolesHandler): void {
	router.all('/addChatMessage.view', apiCheck('/addChatMessage.view'), async (req, res) => {
		try {
			const options: ApiOptions<SubsonicParameters.ChatMessage> = {query: req.query, user: req.user, client: req.client};
			await api.addChatMessage(options);
			await ApiResponder.ok(req, res);
		} catch (e) {
			await ApiResponder.error(req, res, e);
		}
	});

	router.all('/changePassword.view', apiCheck('/changePassword.view'), async (req, res) => {
		try {
			const options: ApiOptions<SubsonicParameters.ChangePassword> = {query: req.query, user: req.user, client: req.client};
			await api.changePassword(options);
			await ApiResponder.ok(req, res);
		} catch (e) {
			await ApiResponder.error(req, res, e);
		}
	});

	router.all('/createBookmark.view', apiCheck('/createBookmark.view'), async (req, res) => {
		try {
			const options: ApiOptions<SubsonicParameters.Bookmark> = {query: req.query, user: req.user, client: req.client};
			await api.createBookmark(options);
			await ApiResponder.ok(req, res);
		} catch (e) {
			await ApiResponder.error(req, res, e);
		}
	});

	router.all('/createPlaylist.view', apiCheck('/createPlaylist.view'), async (req, res) => {
		try {
			const options: ApiOptions<SubsonicParameters.PlaylistCreate> = {query: req.query, user: req.user, client: req.client};
			const result: { playlist: Subsonic.PlaylistWithSongs } = await api.createPlaylist(options);
			await ApiResponder.data(req, res, result);
		} catch (e) {
			await ApiResponder.error(req, res, e);
		}
	});

	router.all('/createPodcastChannel.view', roles.podcast, apiCheck('/createPodcastChannel.view'), async (req, res) => {
		try {
			const options: ApiOptions<SubsonicParameters.PodcastChannel> = {query: req.query, user: req.user, client: req.client};
			await api.createPodcastChannel(options);
			await ApiResponder.ok(req, res);
		} catch (e) {
			await ApiResponder.error(req, res, e);
		}
	});

	router.all('/createShare.view', roles.share, apiCheck('/createShare.view'), async (req, res) => {
		try {
			const options: ApiOptions<SubsonicParameters.Share> = {query: req.query, user: req.user, client: req.client};
			await api.createShare(options);
			await ApiResponder.ok(req, res);
		} catch (e) {
			await ApiResponder.error(req, res, e);
		}
	});

	router.all('/createUser.view', roles.admin, apiCheck('/createUser.view'), async (req, res) => {
		try {
			const options: ApiOptions<SubsonicParameters.CreateUser> = {query: req.query, user: req.user, client: req.client};
			await api.createUser(options);
			await ApiResponder.ok(req, res);
		} catch (e) {
			await ApiResponder.error(req, res, e);
		}
	});

	router.all('/deleteBookmark.view', apiCheck('/deleteBookmark.view'), async (req, res) => {
		try {
			const options: ApiOptions<SubsonicParameters.ID> = {query: req.query, user: req.user, client: req.client};
			await api.deleteBookmark(options);
			await ApiResponder.ok(req, res);
		} catch (e) {
			await ApiResponder.error(req, res, e);
		}
	});

	router.all('/deleteInternetRadioStation.view', roles.admin, apiCheck('/deleteInternetRadioStation.view'), async (req, res) => {
		try {
			const options: ApiOptions<SubsonicParameters.ID> = {query: req.query, user: req.user, client: req.client};
			await api.deleteInternetRadioStation(options);
			await ApiResponder.ok(req, res);
		} catch (e) {
			await ApiResponder.error(req, res, e);
		}
	});

	router.all('/deletePlaylist.view', apiCheck('/deletePlaylist.view'), async (req, res) => {
		try {
			const options: ApiOptions<SubsonicParameters.ID> = {query: req.query, user: req.user, client: req.client};
			await api.deletePlaylist(options);
			await ApiResponder.ok(req, res);
		} catch (e) {
			await ApiResponder.error(req, res, e);
		}
	});

	router.all('/deletePodcastChannel.view', roles.podcast, apiCheck('/deletePodcastChannel.view'), async (req, res) => {
		try {
			const options: ApiOptions<SubsonicParameters.ID> = {query: req.query, user: req.user, client: req.client};
			await api.deletePodcastChannel(options);
			await ApiResponder.ok(req, res);
		} catch (e) {
			await ApiResponder.error(req, res, e);
		}
	});

	router.all('/deletePodcastEpisode.view', roles.podcast, apiCheck('/deletePodcastEpisode.view'), async (req, res) => {
		try {
			const options: ApiOptions<SubsonicParameters.ID> = {query: req.query, user: req.user, client: req.client};
			await api.deletePodcastEpisode(options);
			await ApiResponder.ok(req, res);
		} catch (e) {
			await ApiResponder.error(req, res, e);
		}
	});

	router.all('/deleteShare.view', apiCheck('/deleteShare.view'), async (req, res) => {
		try {
			const options: ApiOptions<SubsonicParameters.ID> = {query: req.query, user: req.user, client: req.client};
			await api.deleteShare(options);
			await ApiResponder.ok(req, res);
		} catch (e) {
			await ApiResponder.error(req, res, e);
		}
	});

	router.all('/deleteUser.view', roles.admin, apiCheck('/deleteUser.view'), async (req, res) => {
		try {
			const options: ApiOptions<SubsonicParameters.Username> = {query: req.query, user: req.user, client: req.client};
			await api.deleteUser(options);
			await ApiResponder.ok(req, res);
		} catch (e) {
			await ApiResponder.error(req, res, e);
		}
	});

	router.all('/downloadPodcastEpisode.view', roles.podcast, apiCheck('/downloadPodcastEpisode.view'), async (req, res) => {
		try {
			const options: ApiOptions<SubsonicParameters.ID> = {query: req.query, user: req.user, client: req.client};
			await api.downloadPodcastEpisode(options);
			await ApiResponder.ok(req, res);
		} catch (e) {
			await ApiResponder.error(req, res, e);
		}
	});

	router.all('/getAlbum.view', apiCheck('/getAlbum.view'), async (req, res) => {
		try {
			const options: ApiOptions<SubsonicParameters.ID> = {query: req.query, user: req.user, client: req.client};
			const result: { album: Subsonic.AlbumWithSongsID3 } = await api.getAlbum(options);
			await ApiResponder.data(req, res, result);
		} catch (e) {
			await ApiResponder.error(req, res, e);
		}
	});

	router.all('/getAlbumInfo.view', apiCheck('/getAlbumInfo.view'), async (req, res) => {
		try {
			const options: ApiOptions<SubsonicParameters.ID> = {query: req.query, user: req.user, client: req.client};
			const result: { albumInfo: Subsonic.AlbumInfo } = await api.getAlbumInfo(options);
			await ApiResponder.data(req, res, result);
		} catch (e) {
			await ApiResponder.error(req, res, e);
		}
	});

	router.all('/getAlbumInfo2.view', apiCheck('/getAlbumInfo2.view'), async (req, res) => {
		try {
			const options: ApiOptions<SubsonicParameters.ID> = {query: req.query, user: req.user, client: req.client};
			const result: { albumInfo: Subsonic.AlbumInfo } = await api.getAlbumInfo2(options);
			await ApiResponder.data(req, res, result);
		} catch (e) {
			await ApiResponder.error(req, res, e);
		}
	});

	router.all('/getAlbumList.view', apiCheck('/getAlbumList.view'), async (req, res) => {
		try {
			const options: ApiOptions<SubsonicParameters.AlbumList> = {query: req.query, user: req.user, client: req.client};
			const result: { albumList: Subsonic.AlbumList } = await api.getAlbumList(options);
			await ApiResponder.data(req, res, result);
		} catch (e) {
			await ApiResponder.error(req, res, e);
		}
	});

	router.all('/getAlbumList2.view', apiCheck('/getAlbumList2.view'), async (req, res) => {
		try {
			const options: ApiOptions<SubsonicParameters.AlbumList2> = {query: req.query, user: req.user, client: req.client};
			const result: { albumList2: Subsonic.AlbumList2 } = await api.getAlbumList2(options);
			await ApiResponder.data(req, res, result);
		} catch (e) {
			await ApiResponder.error(req, res, e);
		}
	});

	router.all('/getArtist.view', apiCheck('/getArtist.view'), async (req, res) => {
		try {
			const options: ApiOptions<SubsonicParameters.ID> = {query: req.query, user: req.user, client: req.client};
			const result: { artist: Subsonic.ArtistWithAlbumsID3 } = await api.getArtist(options);
			await ApiResponder.data(req, res, result);
		} catch (e) {
			await ApiResponder.error(req, res, e);
		}
	});

	router.all('/getArtistInfo.view', apiCheck('/getArtistInfo.view'), async (req, res) => {
		try {
			const options: ApiOptions<SubsonicParameters.ArtistInfo> = {query: req.query, user: req.user, client: req.client};
			const result: { artistInfo: Subsonic.ArtistInfo } = await api.getArtistInfo(options);
			await ApiResponder.data(req, res, result);
		} catch (e) {
			await ApiResponder.error(req, res, e);
		}
	});

	router.all('/getArtistInfo2.view', apiCheck('/getArtistInfo2.view'), async (req, res) => {
		try {
			const options: ApiOptions<SubsonicParameters.ArtistInfo> = {query: req.query, user: req.user, client: req.client};
			const result: { artistInfo2: Subsonic.ArtistInfo2 } = await api.getArtistInfo2(options);
			await ApiResponder.data(req, res, result);
		} catch (e) {
			await ApiResponder.error(req, res, e);
		}
	});

	router.all('/getArtists.view', apiCheck('/getArtists.view'), async (req, res) => {
		try {
			const options: ApiOptions<SubsonicParameters.MusicFolderID> = {query: req.query, user: req.user, client: req.client};
			const result: { artists: Subsonic.ArtistsID3 } = await api.getArtists(options);
			await ApiResponder.data(req, res, result);
		} catch (e) {
			await ApiResponder.error(req, res, e);
		}
	});

	router.all('/getBookmarks.view', apiCheck('/getBookmarks.view'), async (req, res) => {
		try {
			const options: ApiOptions<{}> = {query: req.query, user: req.user, client: req.client};
			const result: { bookmarks: Subsonic.Bookmarks } = await api.getBookmarks(options);
			await ApiResponder.data(req, res, result);
		} catch (e) {
			await ApiResponder.error(req, res, e);
		}
	});

	router.all('/getChatMessages.view', apiCheck('/getChatMessages.view'), async (req, res) => {
		try {
			const options: ApiOptions<SubsonicParameters.ChatMessages> = {query: req.query, user: req.user, client: req.client};
			const result: { chatMessages: Subsonic.ChatMessages } = await api.getChatMessages(options);
			await ApiResponder.data(req, res, result);
		} catch (e) {
			await ApiResponder.error(req, res, e);
		}
	});

	router.all('/getGenres.view', apiCheck('/getGenres.view'), async (req, res) => {
		try {
			const options: ApiOptions<{}> = {query: req.query, user: req.user, client: req.client};
			const result: { genres: Subsonic.Genres } = await api.getGenres(options);
			await ApiResponder.data(req, res, result);
		} catch (e) {
			await ApiResponder.error(req, res, e);
		}
	});

	router.all('/getIndexes.view', apiCheck('/getIndexes.view'), async (req, res) => {
		try {
			const options: ApiOptions<SubsonicParameters.Indexes> = {query: req.query, user: req.user, client: req.client};
			const result: { indexes: Subsonic.Indexes } = await api.getIndexes(options);
			await ApiResponder.data(req, res, result);
		} catch (e) {
			await ApiResponder.error(req, res, e);
		}
	});

	router.all('/getInternetRadioStations.view', apiCheck('/getInternetRadioStations.view'), async (req, res) => {
		try {
			const options: ApiOptions<{}> = {query: req.query, user: req.user, client: req.client};
			const result: { internetRadioStations: Subsonic.InternetRadioStations } = await api.getInternetRadioStations(options);
			await ApiResponder.data(req, res, result);
		} catch (e) {
			await ApiResponder.error(req, res, e);
		}
	});

	router.all('/createInternetRadioStation.view', roles.admin, apiCheck('/createInternetRadioStation.view'), async (req, res) => {
		try {
			const options: ApiOptions<SubsonicParameters.InternetRadioCreate> = {query: req.query, user: req.user, client: req.client};
			await api.createInternetRadioStation(options);
			await ApiResponder.ok(req, res);
		} catch (e) {
			await ApiResponder.error(req, res, e);
		}
	});

	router.all('/updateInternetRadioStation.view', roles.admin, apiCheck('/updateInternetRadioStation.view'), async (req, res) => {
		try {
			const options: ApiOptions<SubsonicParameters.InternetRadioUpdate> = {query: req.query, user: req.user, client: req.client};
			await api.updateInternetRadioStation(options);
			await ApiResponder.ok(req, res);
		} catch (e) {
			await ApiResponder.error(req, res, e);
		}
	});

	router.all('/getLicense.view', apiCheck('/getLicense.view'), async (req, res) => {
		try {
			const options: ApiOptions<{}> = {query: req.query, user: req.user, client: req.client};
			const result: { license: Subsonic.License } = await api.getLicense(options);
			await ApiResponder.data(req, res, result);
		} catch (e) {
			await ApiResponder.error(req, res, e);
		}
	});

	router.all('/getLyrics.view', apiCheck('/getLyrics.view'), async (req, res) => {
		try {
			const options: ApiOptions<SubsonicParameters.Lyrics> = {query: req.query, user: req.user, client: req.client};
			const result: { lyrics: Subsonic.Lyrics } = await api.getLyrics(options);
			await ApiResponder.data(req, res, result);
		} catch (e) {
			await ApiResponder.error(req, res, e);
		}
	});

	router.all('/getMusicDirectory.view', apiCheck('/getMusicDirectory.view'), async (req, res) => {
		try {
			const options: ApiOptions<SubsonicParameters.ID> = {query: req.query, user: req.user, client: req.client};
			const result: { directory: Subsonic.Directory } = await api.getMusicDirectory(options);
			await ApiResponder.data(req, res, result);
		} catch (e) {
			await ApiResponder.error(req, res, e);
		}
	});

	router.all('/getMusicFolders.view', apiCheck('/getMusicFolders.view'), async (req, res) => {
		try {
			const options: ApiOptions<{}> = {query: req.query, user: req.user, client: req.client};
			const result: { musicFolders: Subsonic.MusicFolders } = await api.getMusicFolders(options);
			await ApiResponder.data(req, res, result);
		} catch (e) {
			await ApiResponder.error(req, res, e);
		}
	});

	router.all('/getNewestPodcasts.view', apiCheck('/getNewestPodcasts.view'), async (req, res) => {
		try {
			const options: ApiOptions<SubsonicParameters.PodcastEpisodesNewest> = {query: req.query, user: req.user, client: req.client};
			const result: { newestPodcasts: Subsonic.NewestPodcasts } = await api.getNewestPodcasts(options);
			await ApiResponder.data(req, res, result);
		} catch (e) {
			await ApiResponder.error(req, res, e);
		}
	});

	router.all('/getNowPlaying.view', apiCheck('/getNowPlaying.view'), async (req, res) => {
		try {
			const options: ApiOptions<{}> = {query: req.query, user: req.user, client: req.client};
			const result: { nowPlaying: Subsonic.NowPlaying } = await api.getNowPlaying(options);
			await ApiResponder.data(req, res, result);
		} catch (e) {
			await ApiResponder.error(req, res, e);
		}
	});

	router.all('/getPlaylist.view', apiCheck('/getPlaylist.view'), async (req, res) => {
		try {
			const options: ApiOptions<SubsonicParameters.ID> = {query: req.query, user: req.user, client: req.client};
			const result: { playlist: Subsonic.PlaylistWithSongs } = await api.getPlaylist(options);
			await ApiResponder.data(req, res, result);
		} catch (e) {
			await ApiResponder.error(req, res, e);
		}
	});

	router.all('/getPlaylists.view', apiCheck('/getPlaylists.view'), async (req, res) => {
		try {
			const options: ApiOptions<SubsonicParameters.Playlists> = {query: req.query, user: req.user, client: req.client};
			const result: { playlists: Subsonic.Playlists } = await api.getPlaylists(options);
			await ApiResponder.data(req, res, result);
		} catch (e) {
			await ApiResponder.error(req, res, e);
		}
	});

	router.all('/getPlayQueue.view', apiCheck('/getPlayQueue.view'), async (req, res) => {
		try {
			const options: ApiOptions<{}> = {query: req.query, user: req.user, client: req.client};
			const result: { playQueue: Subsonic.PlayQueue } = await api.getPlayQueue(options);
			await ApiResponder.data(req, res, result);
		} catch (e) {
			await ApiResponder.error(req, res, e);
		}
	});

	router.all('/getPodcasts.view', apiCheck('/getPodcasts.view'), async (req, res) => {
		try {
			const options: ApiOptions<SubsonicParameters.PodcastChannels> = {query: req.query, user: req.user, client: req.client};
			const result: { podcasts: Subsonic.Podcasts } = await api.getPodcasts(options);
			await ApiResponder.data(req, res, result);
		} catch (e) {
			await ApiResponder.error(req, res, e);
		}
	});

	router.all('/getRandomSongs.view', apiCheck('/getRandomSongs.view'), async (req, res) => {
		try {
			const options: ApiOptions<SubsonicParameters.RandomSong> = {query: req.query, user: req.user, client: req.client};
			const result: { randomSongs: Subsonic.Songs } = await api.getRandomSongs(options);
			await ApiResponder.data(req, res, result);
		} catch (e) {
			await ApiResponder.error(req, res, e);
		}
	});

	router.all('/getScanStatus.view', apiCheck('/getScanStatus.view'), async (req, res) => {
		try {
			const options: ApiOptions<{}> = {query: req.query, user: req.user, client: req.client};
			const result: { scanStatus: Subsonic.ScanStatus } = await api.getScanStatus(options);
			await ApiResponder.data(req, res, result);
		} catch (e) {
			await ApiResponder.error(req, res, e);
		}
	});

	router.all('/startScan.view', apiCheck('/startScan.view'), async (req, res) => {
		try {
			const options: ApiOptions<{}> = {query: req.query, user: req.user, client: req.client};
			await api.startScan(options);
			await ApiResponder.ok(req, res);
		} catch (e) {
			await ApiResponder.error(req, res, e);
		}
	});

	router.all('/getShares.view', apiCheck('/getShares.view'), async (req, res) => {
		try {
			const options: ApiOptions<{}> = {query: req.query, user: req.user, client: req.client};
			const result: { shares: Subsonic.Shares } = await api.getShares(options);
			await ApiResponder.data(req, res, result);
		} catch (e) {
			await ApiResponder.error(req, res, e);
		}
	});

	router.all('/getSimilarSongs.view', apiCheck('/getSimilarSongs.view'), async (req, res) => {
		try {
			const options: ApiOptions<SubsonicParameters.SimilarSongs> = {query: req.query, user: req.user, client: req.client};
			const result: { similarSongs: Subsonic.SimilarSongs } = await api.getSimilarSongs(options);
			await ApiResponder.data(req, res, result);
		} catch (e) {
			await ApiResponder.error(req, res, e);
		}
	});

	router.all('/getSimilarSongs2.view', apiCheck('/getSimilarSongs2.view'), async (req, res) => {
		try {
			const options: ApiOptions<SubsonicParameters.SimilarSongs> = {query: req.query, user: req.user, client: req.client};
			const result: { similarSongs2: Subsonic.SimilarSongs2 } = await api.getSimilarSongs2(options);
			await ApiResponder.data(req, res, result);
		} catch (e) {
			await ApiResponder.error(req, res, e);
		}
	});

	router.all('/getSong.view', apiCheck('/getSong.view'), async (req, res) => {
		try {
			const options: ApiOptions<SubsonicParameters.ID> = {query: req.query, user: req.user, client: req.client};
			const result: { song: Subsonic.Child } = await api.getSong(options);
			await ApiResponder.data(req, res, result);
		} catch (e) {
			await ApiResponder.error(req, res, e);
		}
	});

	router.all('/getSongsByGenre.view', apiCheck('/getSongsByGenre.view'), async (req, res) => {
		try {
			const options: ApiOptions<SubsonicParameters.SongsByGenre> = {query: req.query, user: req.user, client: req.client};
			const result: { songsByGenre: Subsonic.Songs } = await api.getSongsByGenre(options);
			await ApiResponder.data(req, res, result);
		} catch (e) {
			await ApiResponder.error(req, res, e);
		}
	});

	router.all('/getStarred.view', apiCheck('/getStarred.view'), async (req, res) => {
		try {
			const options: ApiOptions<SubsonicParameters.MusicFolderID> = {query: req.query, user: req.user, client: req.client};
			const result: { starred: Subsonic.Starred } = await api.getStarred(options);
			await ApiResponder.data(req, res, result);
		} catch (e) {
			await ApiResponder.error(req, res, e);
		}
	});

	router.all('/getStarred2.view', apiCheck('/getStarred2.view'), async (req, res) => {
		try {
			const options: ApiOptions<SubsonicParameters.MusicFolderID> = {query: req.query, user: req.user, client: req.client};
			const result: { starred2: Subsonic.Starred2 } = await api.getStarred2(options);
			await ApiResponder.data(req, res, result);
		} catch (e) {
			await ApiResponder.error(req, res, e);
		}
	});

	router.all('/getTopSongs.view', apiCheck('/getTopSongs.view'), async (req, res) => {
		try {
			const options: ApiOptions<SubsonicParameters.TopSongs> = {query: req.query, user: req.user, client: req.client};
			const result: { topSongs: Subsonic.TopSongs } = await api.getTopSongs(options);
			await ApiResponder.data(req, res, result);
		} catch (e) {
			await ApiResponder.error(req, res, e);
		}
	});

	router.all('/getUser.view', apiCheck('/getUser.view'), async (req, res) => {
		try {
			const options: ApiOptions<SubsonicParameters.Username> = {query: req.query, user: req.user, client: req.client};
			const result: { user: Subsonic.User } = await api.getUser(options);
			await ApiResponder.data(req, res, result);
		} catch (e) {
			await ApiResponder.error(req, res, e);
		}
	});

	router.all('/getUsers.view', roles.admin, apiCheck('/getUsers.view'), async (req, res) => {
		try {
			const options: ApiOptions<{}> = {query: req.query, user: req.user, client: req.client};
			const result: { users: Subsonic.Users } = await api.getUsers(options);
			await ApiResponder.data(req, res, result);
		} catch (e) {
			await ApiResponder.error(req, res, e);
		}
	});

	router.all('/getVideoInfo.view', apiCheck('/getVideoInfo.view'), async (req, res) => {
		try {
			const options: ApiOptions<SubsonicParameters.ID> = {query: req.query, user: req.user, client: req.client};
			const result: { videoInfo: Subsonic.VideoInfo } = await api.getVideoInfo(options);
			await ApiResponder.data(req, res, result);
		} catch (e) {
			await ApiResponder.error(req, res, e);
		}
	});

	router.all('/getVideos.view', apiCheck('/getVideos.view'), async (req, res) => {
		try {
			const options: ApiOptions<{}> = {query: req.query, user: req.user, client: req.client};
			const result: { videos: Subsonic.Videos } = await api.getVideos(options);
			await ApiResponder.data(req, res, result);
		} catch (e) {
			await ApiResponder.error(req, res, e);
		}
	});

	router.all('/jukeboxControl.view', roles.jukebox, apiCheck('/jukeboxControl.view'), async (req, res) => {
		try {
			const options: ApiOptions<SubsonicParameters.Jukebox> = {query: req.query, user: req.user, client: req.client};
			const result: { jukeboxStatus: Subsonic.JukeboxStatus } = await api.jukeboxControl(options);
			await ApiResponder.data(req, res, result);
		} catch (e) {
			await ApiResponder.error(req, res, e);
		}
	});

	router.all('/ping.view', apiCheck('/ping.view'), async (req, res) => {
		try {
			const options: ApiOptions<{}> = {query: req.query, user: req.user, client: req.client};
			await api.ping(options);
			await ApiResponder.ok(req, res);
		} catch (e) {
			await ApiResponder.error(req, res, e);
		}
	});

	router.all('/refreshPodcasts.view', roles.podcast, apiCheck('/refreshPodcasts.view'), async (req, res) => {
		try {
			const options: ApiOptions<{}> = {query: req.query, user: req.user, client: req.client};
			await api.refreshPodcasts(options);
			await ApiResponder.ok(req, res);
		} catch (e) {
			await ApiResponder.error(req, res, e);
		}
	});

	router.all('/savePlayQueue.view', apiCheck('/savePlayQueue.view'), async (req, res) => {
		try {
			const options: ApiOptions<SubsonicParameters.PlayQueue> = {query: req.query, user: req.user, client: req.client};
			await api.savePlayQueue(options);
			await ApiResponder.ok(req, res);
		} catch (e) {
			await ApiResponder.error(req, res, e);
		}
	});

	router.all('/scrobble.view', apiCheck('/scrobble.view'), async (req, res) => {
		try {
			const options: ApiOptions<SubsonicParameters.Scrobble> = {query: req.query, user: req.user, client: req.client};
			await api.scrobble(options);
			await ApiResponder.ok(req, res);
		} catch (e) {
			await ApiResponder.error(req, res, e);
		}
	});

	router.all('/search.view', apiCheck('/search.view'), async (req, res) => {
		try {
			const options: ApiOptions<SubsonicParameters.Search> = {query: req.query, user: req.user, client: req.client};
			const result: { searchResult: Subsonic.SearchResult } = await api.search(options);
			await ApiResponder.data(req, res, result);
		} catch (e) {
			await ApiResponder.error(req, res, e);
		}
	});

	router.all('/search2.view', apiCheck('/search2.view'), async (req, res) => {
		try {
			const options: ApiOptions<SubsonicParameters.Search2> = {query: req.query, user: req.user, client: req.client};
			const result: { searchResult2: Subsonic.SearchResult2 } = await api.search2(options);
			await ApiResponder.data(req, res, result);
		} catch (e) {
			await ApiResponder.error(req, res, e);
		}
	});

	router.all('/search3.view', apiCheck('/search3.view'), async (req, res) => {
		try {
			const options: ApiOptions<SubsonicParameters.Search2> = {query: req.query, user: req.user, client: req.client};
			const result: { searchResult3: Subsonic.SearchResult3 } = await api.search3(options);
			await ApiResponder.data(req, res, result);
		} catch (e) {
			await ApiResponder.error(req, res, e);
		}
	});

	router.all('/setRating.view', apiCheck('/setRating.view'), async (req, res) => {
		try {
			const options: ApiOptions<SubsonicParameters.Rate> = {query: req.query, user: req.user, client: req.client};
			await api.setRating(options);
			await ApiResponder.ok(req, res);
		} catch (e) {
			await ApiResponder.error(req, res, e);
		}
	});

	router.all('/star.view', apiCheck('/star.view'), async (req, res) => {
		try {
			const options: ApiOptions<SubsonicParameters.State> = {query: req.query, user: req.user, client: req.client};
			await api.star(options);
			await ApiResponder.ok(req, res);
		} catch (e) {
			await ApiResponder.error(req, res, e);
		}
	});

	router.all('/unstar.view', apiCheck('/unstar.view'), async (req, res) => {
		try {
			const options: ApiOptions<SubsonicParameters.State> = {query: req.query, user: req.user, client: req.client};
			await api.unstar(options);
			await ApiResponder.ok(req, res);
		} catch (e) {
			await ApiResponder.error(req, res, e);
		}
	});

	router.all('/updatePlaylist.view', apiCheck('/updatePlaylist.view'), async (req, res) => {
		try {
			const options: ApiOptions<SubsonicParameters.PlaylistUpdate> = {query: req.query, user: req.user, client: req.client};
			await api.updatePlaylist(options);
			await ApiResponder.ok(req, res);
		} catch (e) {
			await ApiResponder.error(req, res, e);
		}
	});

	router.all('/updateShare.view', apiCheck('/updateShare.view'), async (req, res) => {
		try {
			const options: ApiOptions<SubsonicParameters.Share> = {query: req.query, user: req.user, client: req.client};
			await api.updateShare(options);
			await ApiResponder.ok(req, res);
		} catch (e) {
			await ApiResponder.error(req, res, e);
		}
	});

	router.all('/updateUser.view', roles.admin, apiCheck('/updateUser.view'), async (req, res) => {
		try {
			const options: ApiOptions<SubsonicParameters.UpdateUser> = {query: req.query, user: req.user, client: req.client};
			await api.updateUser(options);
			await ApiResponder.ok(req, res);
		} catch (e) {
			await ApiResponder.error(req, res, e);
		}
	});

	router.all('/getAvatar.view', apiCheck('/getAvatar.view'), async (req, res) => {
		try {
			const options: ApiOptions<SubsonicParameters.Username> = {query: req.query, user: req.user, client: req.client};
			const result: IApiBinaryResult = await api.getAvatar(options);
			await ApiResponder.binary(req, res, result);
		} catch (e) {
			await ApiResponder.error(req, res, e);
		}
	});

	router.all('/getCaptions.view', apiCheck('/getCaptions.view'), async (req, res) => {
		try {
			const options: ApiOptions<SubsonicParameters.Captions> = {query: req.query, user: req.user, client: req.client};
			const result: IApiBinaryResult = await api.getCaptions(options);
			await ApiResponder.binary(req, res, result);
		} catch (e) {
			await ApiResponder.error(req, res, e);
		}
	});

	router.all('/getCoverArt.view', apiCheck('/getCoverArt.view'), async (req, res) => {
		try {
			const options: ApiOptions<SubsonicParameters.CoverArt> = {query: req.query, user: req.user, client: req.client};
			const result: IApiBinaryResult = await api.getCoverArt(options);
			await ApiResponder.binary(req, res, result);
		} catch (e) {
			await ApiResponder.error(req, res, e);
		}
	});

	router.all('/hls.view', apiCheck('/hls.view'), async (req, res) => {
		try {
			const options: ApiOptions<SubsonicParameters.HLS> = {query: req.query, user: req.user, client: req.client};
			const result: IApiBinaryResult = await api.hls(options);
			await ApiResponder.binary(req, res, result);
		} catch (e) {
			await ApiResponder.error(req, res, e);
		}
	});

	router.all('/stream.view', apiCheck('/stream.view'), async (req, res) => {
		try {
			const options: ApiOptions<SubsonicParameters.Stream> = {query: req.query, user: req.user, client: req.client};
			const result: IApiBinaryResult = await api.stream(options);
			await ApiResponder.binary(req, res, result);
		} catch (e) {
			await ApiResponder.error(req, res, e);
		}
	});

	router.all('/download.view', apiCheck('/download.view'), async (req, res) => {
		try {
			const options: ApiOptions<SubsonicParameters.Download> = {query: req.query, user: req.user, client: req.client};
			const result: IApiBinaryResult = await api.download(options);
			await ApiResponder.binary(req, res, result);
		} catch (e) {
			await ApiResponder.error(req, res, e);
		}
	});
}
