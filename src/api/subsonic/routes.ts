// THIS FILE IS GENERATED, DO NOT EDIT MANUALLY

import express from 'express';
import {Subsonic} from '../../model/subsonic-rest-data';
import {SubsonicParameters} from '../../model/subsonic-rest-params';
import {ApiBinaryResult} from '../../typings';
import {SubsonicApi} from './api';
import {ApiOptions} from './base';
import {UserRequest} from './login';
import {ApiResponder} from './response';

export type SubSonicRole = 'podcast' | 'share' | 'admin' | 'jukebox';
export type RegisterCallback = (req: UserRequest, res: express.Response) => Promise<void>;
export interface Register {
	all(name: string, execute: RegisterCallback, roles?: Array<SubSonicRole>): void;
}

export function registerApi(register: Register, api: SubsonicApi): void {
	register.all('/addChatMessage.view', async (req, res) => {
		const options: ApiOptions<SubsonicParameters.ChatMessage> = {query: req.query, user: req.user, client: req.client};
		await api.chat.addChatMessage(options);
		ApiResponder.ok(req, res);
	});
	register.all('/changePassword.view', async (req, res) => {
		const options: ApiOptions<SubsonicParameters.ChangePassword> = {query: req.query, user: req.user, client: req.client};
		await api.user.changePassword(options);
		ApiResponder.ok(req, res);
	});
	register.all('/createBookmark.view', async (req, res) => {
		const options: ApiOptions<SubsonicParameters.Bookmark> = {query: req.query, user: req.user, client: req.client};
		await api.bookmarks.createBookmark(options);
		ApiResponder.ok(req, res);
	});
	register.all('/createPlaylist.view', async (req, res) => {
		const options: ApiOptions<SubsonicParameters.PlaylistCreate> = {query: req.query, user: req.user, client: req.client};
		const result: { playlist: Subsonic.PlaylistWithSongs } = await api.playlists.createPlaylist(options);
		ApiResponder.data(req, res, result);
	});
	register.all('/createPodcastChannel.view', async (req, res) => {
		const options: ApiOptions<SubsonicParameters.PodcastChannel> = {query: req.query, user: req.user, client: req.client};
		await api.podcast.createPodcastChannel(options);
		ApiResponder.ok(req, res);
	}, ['podcast']);
	register.all('/createShare.view', async (req, res) => {
		const options: ApiOptions<SubsonicParameters.Share> = {query: req.query, user: req.user, client: req.client};
		await api.sharing.createShare(options);
		ApiResponder.ok(req, res);
	}, ['share']);
	register.all('/createUser.view', async (req, res) => {
		const options: ApiOptions<SubsonicParameters.CreateUser> = {query: req.query, user: req.user, client: req.client};
		await api.user.createUser(options);
		ApiResponder.ok(req, res);
	}, ['admin']);
	register.all('/deleteBookmark.view', async (req, res) => {
		const options: ApiOptions<SubsonicParameters.ID> = {query: req.query, user: req.user, client: req.client};
		await api.bookmarks.deleteBookmark(options);
		ApiResponder.ok(req, res);
	});
	register.all('/deleteInternetRadioStation.view', async (req, res) => {
		const options: ApiOptions<SubsonicParameters.ID> = {query: req.query, user: req.user, client: req.client};
		await api.internetradio.deleteInternetRadioStation(options);
		ApiResponder.ok(req, res);
	}, ['admin']);
	register.all('/deletePlaylist.view', async (req, res) => {
		const options: ApiOptions<SubsonicParameters.ID> = {query: req.query, user: req.user, client: req.client};
		await api.playlists.deletePlaylist(options);
		ApiResponder.ok(req, res);
	});
	register.all('/deletePodcastChannel.view', async (req, res) => {
		const options: ApiOptions<SubsonicParameters.ID> = {query: req.query, user: req.user, client: req.client};
		await api.podcast.deletePodcastChannel(options);
		ApiResponder.ok(req, res);
	}, ['podcast']);
	register.all('/deletePodcastEpisode.view', async (req, res) => {
		const options: ApiOptions<SubsonicParameters.ID> = {query: req.query, user: req.user, client: req.client};
		await api.podcast.deletePodcastEpisode(options);
		ApiResponder.ok(req, res);
	}, ['podcast']);
	register.all('/deleteShare.view', async (req, res) => {
		const options: ApiOptions<SubsonicParameters.ID> = {query: req.query, user: req.user, client: req.client};
		await api.sharing.deleteShare(options);
		ApiResponder.ok(req, res);
	});
	register.all('/deleteUser.view', async (req, res) => {
		const options: ApiOptions<SubsonicParameters.Username> = {query: req.query, user: req.user, client: req.client};
		await api.user.deleteUser(options);
		ApiResponder.ok(req, res);
	}, ['admin']);
	register.all('/downloadPodcastEpisode.view', async (req, res) => {
		const options: ApiOptions<SubsonicParameters.ID> = {query: req.query, user: req.user, client: req.client};
		await api.podcast.downloadPodcastEpisode(options);
		ApiResponder.ok(req, res);
	}, ['podcast']);
	register.all('/getAlbum.view', async (req, res) => {
		const options: ApiOptions<SubsonicParameters.ID> = {query: req.query, user: req.user, client: req.client};
		const result: { album: Subsonic.AlbumWithSongsID3 } = await api.browsing.getAlbum(options);
		ApiResponder.data(req, res, result);
	});
	register.all('/getAlbumInfo.view', async (req, res) => {
		const options: ApiOptions<SubsonicParameters.ID> = {query: req.query, user: req.user, client: req.client};
		const result: { albumInfo: Subsonic.AlbumInfo } = await api.browsing.getAlbumInfo(options);
		ApiResponder.data(req, res, result);
	});
	register.all('/getAlbumInfo2.view', async (req, res) => {
		const options: ApiOptions<SubsonicParameters.ID> = {query: req.query, user: req.user, client: req.client};
		const result: { albumInfo: Subsonic.AlbumInfo } = await api.browsing.getAlbumInfo2(options);
		ApiResponder.data(req, res, result);
	});
	register.all('/getAlbumList.view', async (req, res) => {
		const options: ApiOptions<SubsonicParameters.AlbumList> = {query: req.query, user: req.user, client: req.client};
		const result: { albumList: Subsonic.AlbumList } = await api.lists.getAlbumList(options);
		ApiResponder.data(req, res, result);
	});
	register.all('/getAlbumList2.view', async (req, res) => {
		const options: ApiOptions<SubsonicParameters.AlbumList2> = {query: req.query, user: req.user, client: req.client};
		const result: { albumList2: Subsonic.AlbumList2 } = await api.lists.getAlbumList2(options);
		ApiResponder.data(req, res, result);
	});
	register.all('/getArtist.view', async (req, res) => {
		const options: ApiOptions<SubsonicParameters.ID> = {query: req.query, user: req.user, client: req.client};
		const result: { artist: Subsonic.ArtistWithAlbumsID3 } = await api.browsing.getArtist(options);
		ApiResponder.data(req, res, result);
	});
	register.all('/getArtistInfo.view', async (req, res) => {
		const options: ApiOptions<SubsonicParameters.ArtistInfo> = {query: req.query, user: req.user, client: req.client};
		const result: { artistInfo: Subsonic.ArtistInfo } = await api.browsing.getArtistInfo(options);
		ApiResponder.data(req, res, result);
	});
	register.all('/getArtistInfo2.view', async (req, res) => {
		const options: ApiOptions<SubsonicParameters.ArtistInfo> = {query: req.query, user: req.user, client: req.client};
		const result: { artistInfo2: Subsonic.ArtistInfo2 } = await api.browsing.getArtistInfo2(options);
		ApiResponder.data(req, res, result);
	});
	register.all('/getArtists.view', async (req, res) => {
		const options: ApiOptions<SubsonicParameters.MusicFolderID> = {query: req.query, user: req.user, client: req.client};
		const result: { artists: Subsonic.ArtistsID3 } = await api.browsing.getArtists(options);
		ApiResponder.data(req, res, result);
	});
	register.all('/getBookmarks.view', async (req, res) => {
		const options: ApiOptions<{}> = {query: req.query, user: req.user, client: req.client};
		const result: { bookmarks: Subsonic.Bookmarks } = await api.bookmarks.getBookmarks(options);
		ApiResponder.data(req, res, result);
	});
	register.all('/getChatMessages.view', async (req, res) => {
		const options: ApiOptions<SubsonicParameters.ChatMessages> = {query: req.query, user: req.user, client: req.client};
		const result: { chatMessages: Subsonic.ChatMessages } = await api.chat.getChatMessages(options);
		ApiResponder.data(req, res, result);
	});
	register.all('/getGenres.view', async (req, res) => {
		const options: ApiOptions<{}> = {query: req.query, user: req.user, client: req.client};
		const result: { genres: Subsonic.Genres } = await api.browsing.getGenres(options);
		ApiResponder.data(req, res, result);
	});
	register.all('/getIndexes.view', async (req, res) => {
		const options: ApiOptions<SubsonicParameters.Indexes> = {query: req.query, user: req.user, client: req.client};
		const result: { indexes: Subsonic.Indexes } = await api.browsing.getIndexes(options);
		ApiResponder.data(req, res, result);
	});
	register.all('/getInternetRadioStations.view', async (req, res) => {
		const options: ApiOptions<{}> = {query: req.query, user: req.user, client: req.client};
		const result: { internetRadioStations: Subsonic.InternetRadioStations } = await api.internetradio.getInternetRadioStations(options);
		ApiResponder.data(req, res, result);
	});
	register.all('/createInternetRadioStation.view', async (req, res) => {
		const options: ApiOptions<SubsonicParameters.InternetRadioCreate> = {query: req.query, user: req.user, client: req.client};
		await api.internetradio.createInternetRadioStation(options);
		ApiResponder.ok(req, res);
	}, ['admin']);
	register.all('/updateInternetRadioStation.view', async (req, res) => {
		const options: ApiOptions<SubsonicParameters.InternetRadioUpdate> = {query: req.query, user: req.user, client: req.client};
		await api.internetradio.updateInternetRadioStation(options);
		ApiResponder.ok(req, res);
	}, ['admin']);
	register.all('/getLicense.view', async (req, res) => {
		const options: ApiOptions<{}> = {query: req.query, user: req.user, client: req.client};
		const result: { license: Subsonic.License } = await api.system.getLicense(options);
		ApiResponder.data(req, res, result);
	});
	register.all('/getLyrics.view', async (req, res) => {
		const options: ApiOptions<SubsonicParameters.Lyrics> = {query: req.query, user: req.user, client: req.client};
		const result: { lyrics: Subsonic.Lyrics } = await api.mediaretrieval.getLyrics(options);
		ApiResponder.data(req, res, result);
	});
	register.all('/getMusicDirectory.view', async (req, res) => {
		const options: ApiOptions<SubsonicParameters.ID> = {query: req.query, user: req.user, client: req.client};
		const result: { directory: Subsonic.Directory } = await api.browsing.getMusicDirectory(options);
		ApiResponder.data(req, res, result);
	});
	register.all('/getMusicFolders.view', async (req, res) => {
		const options: ApiOptions<{}> = {query: req.query, user: req.user, client: req.client};
		const result: { musicFolders: Subsonic.MusicFolders } = await api.browsing.getMusicFolders(options);
		ApiResponder.data(req, res, result);
	});
	register.all('/getNewestPodcasts.view', async (req, res) => {
		const options: ApiOptions<SubsonicParameters.PodcastEpisodesNewest> = {query: req.query, user: req.user, client: req.client};
		const result: { newestPodcasts: Subsonic.NewestPodcasts } = await api.podcast.getNewestPodcasts(options);
		ApiResponder.data(req, res, result);
	});
	register.all('/getNowPlaying.view', async (req, res) => {
		const options: ApiOptions<{}> = {query: req.query, user: req.user, client: req.client};
		const result: { nowPlaying: Subsonic.NowPlaying } = await api.lists.getNowPlaying(options);
		ApiResponder.data(req, res, result);
	});
	register.all('/getPlaylist.view', async (req, res) => {
		const options: ApiOptions<SubsonicParameters.ID> = {query: req.query, user: req.user, client: req.client};
		const result: { playlist: Subsonic.PlaylistWithSongs } = await api.playlists.getPlaylist(options);
		ApiResponder.data(req, res, result);
	});
	register.all('/getPlaylists.view', async (req, res) => {
		const options: ApiOptions<SubsonicParameters.Playlists> = {query: req.query, user: req.user, client: req.client};
		const result: { playlists: Subsonic.Playlists } = await api.playlists.getPlaylists(options);
		ApiResponder.data(req, res, result);
	});
	register.all('/getPlayQueue.view', async (req, res) => {
		const options: ApiOptions<{}> = {query: req.query, user: req.user, client: req.client};
		const result: { playQueue: Subsonic.PlayQueue } = await api.bookmarks.getPlayQueue(options);
		ApiResponder.data(req, res, result);
	});
	register.all('/getPodcasts.view', async (req, res) => {
		const options: ApiOptions<SubsonicParameters.PodcastChannels> = {query: req.query, user: req.user, client: req.client};
		const result: { podcasts: Subsonic.Podcasts } = await api.podcast.getPodcasts(options);
		ApiResponder.data(req, res, result);
	});
	register.all('/getRandomSongs.view', async (req, res) => {
		const options: ApiOptions<SubsonicParameters.RandomSong> = {query: req.query, user: req.user, client: req.client};
		const result: { randomSongs: Subsonic.Songs } = await api.lists.getRandomSongs(options);
		ApiResponder.data(req, res, result);
	});
	register.all('/getScanStatus.view', async (req, res) => {
		const options: ApiOptions<{}> = {query: req.query, user: req.user, client: req.client};
		const result: { scanStatus: Subsonic.ScanStatus } = await api.library.getScanStatus(options);
		ApiResponder.data(req, res, result);
	});
	register.all('/startScan.view', async (req, res) => {
		const options: ApiOptions<{}> = {query: req.query, user: req.user, client: req.client};
		await api.library.startScan(options);
		ApiResponder.ok(req, res);
	});
	register.all('/getShares.view', async (req, res) => {
		const options: ApiOptions<{}> = {query: req.query, user: req.user, client: req.client};
		const result: { shares: Subsonic.Shares } = await api.sharing.getShares(options);
		ApiResponder.data(req, res, result);
	});
	register.all('/getSimilarSongs.view', async (req, res) => {
		const options: ApiOptions<SubsonicParameters.SimilarSongs> = {query: req.query, user: req.user, client: req.client};
		const result: { similarSongs: Subsonic.SimilarSongs } = await api.browsing.getSimilarSongs(options);
		ApiResponder.data(req, res, result);
	});
	register.all('/getSimilarSongs2.view', async (req, res) => {
		const options: ApiOptions<SubsonicParameters.SimilarSongs> = {query: req.query, user: req.user, client: req.client};
		const result: { similarSongs2: Subsonic.SimilarSongs2 } = await api.browsing.getSimilarSongs2(options);
		ApiResponder.data(req, res, result);
	});
	register.all('/getSong.view', async (req, res) => {
		const options: ApiOptions<SubsonicParameters.ID> = {query: req.query, user: req.user, client: req.client};
		const result: { song: Subsonic.Child } = await api.browsing.getSong(options);
		ApiResponder.data(req, res, result);
	});
	register.all('/getSongsByGenre.view', async (req, res) => {
		const options: ApiOptions<SubsonicParameters.SongsByGenre> = {query: req.query, user: req.user, client: req.client};
		const result: { songsByGenre: Subsonic.Songs } = await api.lists.getSongsByGenre(options);
		ApiResponder.data(req, res, result);
	});
	register.all('/getStarred.view', async (req, res) => {
		const options: ApiOptions<SubsonicParameters.MusicFolderID> = {query: req.query, user: req.user, client: req.client};
		const result: { starred: Subsonic.Starred } = await api.lists.getStarred(options);
		ApiResponder.data(req, res, result);
	});
	register.all('/getStarred2.view', async (req, res) => {
		const options: ApiOptions<SubsonicParameters.MusicFolderID> = {query: req.query, user: req.user, client: req.client};
		const result: { starred2: Subsonic.Starred2 } = await api.lists.getStarred2(options);
		ApiResponder.data(req, res, result);
	});
	register.all('/getTopSongs.view', async (req, res) => {
		const options: ApiOptions<SubsonicParameters.TopSongs> = {query: req.query, user: req.user, client: req.client};
		const result: { topSongs: Subsonic.TopSongs } = await api.browsing.getTopSongs(options);
		ApiResponder.data(req, res, result);
	});
	register.all('/getUser.view', async (req, res) => {
		const options: ApiOptions<SubsonicParameters.Username> = {query: req.query, user: req.user, client: req.client};
		const result: { user: Subsonic.User } = await api.user.getUser(options);
		ApiResponder.data(req, res, result);
	});
	register.all('/getUsers.view', async (req, res) => {
		const options: ApiOptions<{}> = {query: req.query, user: req.user, client: req.client};
		const result: { users: Subsonic.Users } = await api.user.getUsers(options);
		ApiResponder.data(req, res, result);
	}, ['admin']);
	register.all('/getVideoInfo.view', async (req, res) => {
		const options: ApiOptions<SubsonicParameters.ID> = {query: req.query, user: req.user, client: req.client};
		const result: { videoInfo: Subsonic.VideoInfo } = await api.browsing.getVideoInfo(options);
		ApiResponder.data(req, res, result);
	});
	register.all('/getVideos.view', async (req, res) => {
		const options: ApiOptions<{}> = {query: req.query, user: req.user, client: req.client};
		const result: { videos: Subsonic.Videos } = await api.browsing.getVideos(options);
		ApiResponder.data(req, res, result);
	});
	register.all('/jukeboxControl.view', async (req, res) => {
		const options: ApiOptions<SubsonicParameters.Jukebox> = {query: req.query, user: req.user, client: req.client};
		const result: { jukeboxStatus: Subsonic.JukeboxStatus } = await api.system.jukeboxControl(options);
		ApiResponder.data(req, res, result);
	}, ['jukebox']);
	register.all('/ping.view', async (req, res) => {
		const options: ApiOptions<{}> = {query: req.query, user: req.user, client: req.client};
		await api.system.ping(options);
		ApiResponder.ok(req, res);
	});
	register.all('/refreshPodcasts.view', async (req, res) => {
		const options: ApiOptions<{}> = {query: req.query, user: req.user, client: req.client};
		await api.podcast.refreshPodcasts(options);
		ApiResponder.ok(req, res);
	}, ['podcast']);
	register.all('/savePlayQueue.view', async (req, res) => {
		const options: ApiOptions<SubsonicParameters.PlayQueue> = {query: req.query, user: req.user, client: req.client};
		await api.bookmarks.savePlayQueue(options);
		ApiResponder.ok(req, res);
	});
	register.all('/scrobble.view', async (req, res) => {
		const options: ApiOptions<SubsonicParameters.Scrobble> = {query: req.query, user: req.user, client: req.client};
		await api.annotation.scrobble(options);
		ApiResponder.ok(req, res);
	});
	register.all('/search.view', async (req, res) => {
		const options: ApiOptions<SubsonicParameters.Search> = {query: req.query, user: req.user, client: req.client};
		const result: { searchResult: Subsonic.SearchResult } = await api.searching.search(options);
		ApiResponder.data(req, res, result);
	});
	register.all('/search2.view', async (req, res) => {
		const options: ApiOptions<SubsonicParameters.Search2> = {query: req.query, user: req.user, client: req.client};
		const result: { searchResult2: Subsonic.SearchResult2 } = await api.searching.search2(options);
		ApiResponder.data(req, res, result);
	});
	register.all('/search3.view', async (req, res) => {
		const options: ApiOptions<SubsonicParameters.Search2> = {query: req.query, user: req.user, client: req.client};
		const result: { searchResult3: Subsonic.SearchResult3 } = await api.searching.search3(options);
		ApiResponder.data(req, res, result);
	});
	register.all('/setRating.view', async (req, res) => {
		const options: ApiOptions<SubsonicParameters.Rate> = {query: req.query, user: req.user, client: req.client};
		await api.annotation.setRating(options);
		ApiResponder.ok(req, res);
	});
	register.all('/star.view', async (req, res) => {
		const options: ApiOptions<SubsonicParameters.State> = {query: req.query, user: req.user, client: req.client};
		await api.annotation.star(options);
		ApiResponder.ok(req, res);
	});
	register.all('/unstar.view', async (req, res) => {
		const options: ApiOptions<SubsonicParameters.State> = {query: req.query, user: req.user, client: req.client};
		await api.annotation.unstar(options);
		ApiResponder.ok(req, res);
	});
	register.all('/updatePlaylist.view', async (req, res) => {
		const options: ApiOptions<SubsonicParameters.PlaylistUpdate> = {query: req.query, user: req.user, client: req.client};
		await api.playlists.updatePlaylist(options);
		ApiResponder.ok(req, res);
	});
	register.all('/updateShare.view', async (req, res) => {
		const options: ApiOptions<SubsonicParameters.Share> = {query: req.query, user: req.user, client: req.client};
		await api.sharing.updateShare(options);
		ApiResponder.ok(req, res);
	});
	register.all('/updateUser.view', async (req, res) => {
		const options: ApiOptions<SubsonicParameters.UpdateUser> = {query: req.query, user: req.user, client: req.client};
		await api.user.updateUser(options);
		ApiResponder.ok(req, res);
	}, ['admin']);
	register.all('/getAvatar.view', async (req, res) => {
		const options: ApiOptions<SubsonicParameters.Username> = {query: req.query, user: req.user, client: req.client};
		const result: ApiBinaryResult = await api.mediaretrieval.getAvatar(options);
		ApiResponder.binary(req, res, result);
	});
	register.all('/getCaptions.view', async (req, res) => {
		const options: ApiOptions<SubsonicParameters.Captions> = {query: req.query, user: req.user, client: req.client};
		const result: ApiBinaryResult = await api.mediaretrieval.getCaptions(options);
		ApiResponder.binary(req, res, result);
	});
	register.all('/getCoverArt.view', async (req, res) => {
		const options: ApiOptions<SubsonicParameters.CoverArt> = {query: req.query, user: req.user, client: req.client};
		const result: ApiBinaryResult = await api.mediaretrieval.getCoverArt(options);
		ApiResponder.binary(req, res, result);
	});
	register.all('/hls.view', async (req, res) => {
		const options: ApiOptions<SubsonicParameters.HLS> = {query: req.query, user: req.user, client: req.client};
		const result: ApiBinaryResult = await api.mediaretrieval.hls(options);
		ApiResponder.binary(req, res, result);
	});
	register.all('/stream.view', async (req, res) => {
		const options: ApiOptions<SubsonicParameters.Stream> = {query: req.query, user: req.user, client: req.client};
		const result: ApiBinaryResult = await api.mediaretrieval.stream(options);
		ApiResponder.binary(req, res, result);
	});
	register.all('/download.view', async (req, res) => {
		const options: ApiOptions<SubsonicParameters.Download> = {query: req.query, user: req.user, client: req.client};
		const result: ApiBinaryResult = await api.mediaretrieval.download(options);
		ApiResponder.binary(req, res, result);
	});
}
