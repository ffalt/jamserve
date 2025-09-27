var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { SubsonicObjectParametersType } from '../decorators/subsonic-object-parameters-type.js';
import { SubsonicObjectField } from '../decorators/subsonic-object-field.js';
let SubsonicParameterID = class SubsonicParameterID {
};
__decorate([
    SubsonicObjectField({ description: 'The item ID', isID: true }),
    __metadata("design:type", String)
], SubsonicParameterID.prototype, "id", void 0);
SubsonicParameterID = __decorate([
    SubsonicObjectParametersType()
], SubsonicParameterID);
export { SubsonicParameterID };
let SubsonicParameterMusicFolderID = class SubsonicParameterMusicFolderID {
};
__decorate([
    SubsonicObjectField({ description: 'Only return results from the music folder with the given ID', isID: true, nullable: true }),
    __metadata("design:type", String)
], SubsonicParameterMusicFolderID.prototype, "musicFolderId", void 0);
SubsonicParameterMusicFolderID = __decorate([
    SubsonicObjectParametersType()
], SubsonicParameterMusicFolderID);
export { SubsonicParameterMusicFolderID };
let SubsonicParameterIndexes = class SubsonicParameterIndexes {
};
__decorate([
    SubsonicObjectField({ nullable: true, isID: true, description: 'Only return results from the music folder with the given ID' }),
    __metadata("design:type", String)
], SubsonicParameterIndexes.prototype, "musicFolderId", void 0);
__decorate([
    SubsonicObjectField({ nullable: true, description: 'If specified, only return a result if the artist collection has changed since the given time (in milliseconds since 1 Jan 1970).', min: 0, example: 1727432363956 }),
    __metadata("design:type", Number)
], SubsonicParameterIndexes.prototype, "ifModifiedSince", void 0);
SubsonicParameterIndexes = __decorate([
    SubsonicObjectParametersType()
], SubsonicParameterIndexes);
export { SubsonicParameterIndexes };
let SubsonicParameterInternetRadioCreate = class SubsonicParameterInternetRadioCreate {
};
__decorate([
    SubsonicObjectField({ description: 'The stream URL for the station.', example: 'https://stream.example.com/stream.m3u' }),
    __metadata("design:type", String)
], SubsonicParameterInternetRadioCreate.prototype, "streamUrl", void 0);
__decorate([
    SubsonicObjectField({ description: 'The user-defined name for the station.', example: 'Best songs' }),
    __metadata("design:type", String)
], SubsonicParameterInternetRadioCreate.prototype, "name", void 0);
__decorate([
    SubsonicObjectField({ nullable: true, description: 'The home page URL for the station.', example: 'https://stream.example.com/index.html' }),
    __metadata("design:type", String)
], SubsonicParameterInternetRadioCreate.prototype, "homepageUrl", void 0);
SubsonicParameterInternetRadioCreate = __decorate([
    SubsonicObjectParametersType()
], SubsonicParameterInternetRadioCreate);
export { SubsonicParameterInternetRadioCreate };
let SubsonicParameterInternetRadioUpdate = class SubsonicParameterInternetRadioUpdate {
};
__decorate([
    SubsonicObjectField({ description: 'The ID for the station.', isID: true }),
    __metadata("design:type", String)
], SubsonicParameterInternetRadioUpdate.prototype, "id", void 0);
__decorate([
    SubsonicObjectField({ description: 'The stream URL for the station.', example: 'https://stream.example.com/stream.m3u' }),
    __metadata("design:type", String)
], SubsonicParameterInternetRadioUpdate.prototype, "streamUrl", void 0);
__decorate([
    SubsonicObjectField({ description: 'The user-defined name for the station.', example: 'Best songs' }),
    __metadata("design:type", String)
], SubsonicParameterInternetRadioUpdate.prototype, "name", void 0);
__decorate([
    SubsonicObjectField({ nullable: true, description: 'The home page URL for the station.', example: 'https://stream.example.com/index.html' }),
    __metadata("design:type", String)
], SubsonicParameterInternetRadioUpdate.prototype, "homepageUrl", void 0);
SubsonicParameterInternetRadioUpdate = __decorate([
    SubsonicObjectParametersType()
], SubsonicParameterInternetRadioUpdate);
export { SubsonicParameterInternetRadioUpdate };
let SubsonicParameterAlbumList = class SubsonicParameterAlbumList {
};
__decorate([
    SubsonicObjectField({ description: 'The list type.' }),
    __metadata("design:type", String)
], SubsonicParameterAlbumList.prototype, "type", void 0);
__decorate([
    SubsonicObjectField({ nullable: true, description: 'The number of albums to return.', min: 0, max: 500, example: 10, defaultValue: 10 }),
    __metadata("design:type", Number)
], SubsonicParameterAlbumList.prototype, "size", void 0);
__decorate([
    SubsonicObjectField({ nullable: true, description: 'The list offset. Useful if you for example want to page through the list of newest albums.', min: 0, example: 10, defaultValue: 0 }),
    __metadata("design:type", Number)
], SubsonicParameterAlbumList.prototype, "offset", void 0);
__decorate([
    SubsonicObjectField({ nullable: true, description: 'The name of the genre, e.g., "Rock"' }),
    __metadata("design:type", String)
], SubsonicParameterAlbumList.prototype, "genre", void 0);
__decorate([
    SubsonicObjectField({ nullable: true, description: 'The first year in the range. If fromYear > toYear a reverse chronological list is returned.', min: 0, example: 2000 }),
    __metadata("design:type", Number)
], SubsonicParameterAlbumList.prototype, "fromYear", void 0);
__decorate([
    SubsonicObjectField({ nullable: true, description: 'The last year in the range.', min: 0, example: 2001 }),
    __metadata("design:type", Number)
], SubsonicParameterAlbumList.prototype, "toYear", void 0);
SubsonicParameterAlbumList = __decorate([
    SubsonicObjectParametersType()
], SubsonicParameterAlbumList);
export { SubsonicParameterAlbumList };
let SubsonicParameterAlbumList2 = class SubsonicParameterAlbumList2 {
};
__decorate([
    SubsonicObjectField({ description: 'The list type.' }),
    __metadata("design:type", String)
], SubsonicParameterAlbumList2.prototype, "type", void 0);
__decorate([
    SubsonicObjectField({ nullable: true, description: 'The number of albums to return.', min: 0, max: 500, example: 10, defaultValue: 10 }),
    __metadata("design:type", Number)
], SubsonicParameterAlbumList2.prototype, "size", void 0);
__decorate([
    SubsonicObjectField({ nullable: true, description: 'The list offset. Useful if you for example want to page through the list of newest albums.', min: 0, example: 10, defaultValue: 0 }),
    __metadata("design:type", Number)
], SubsonicParameterAlbumList2.prototype, "offset", void 0);
__decorate([
    SubsonicObjectField({ nullable: true, description: 'The name of the genre, e.g., "Rock"' }),
    __metadata("design:type", String)
], SubsonicParameterAlbumList2.prototype, "genre", void 0);
__decorate([
    SubsonicObjectField({ nullable: true, description: 'The first year in the range. If fromYear > toYear a reverse chronological list is returned.', min: 0, example: 2000 }),
    __metadata("design:type", Number)
], SubsonicParameterAlbumList2.prototype, "fromYear", void 0);
__decorate([
    SubsonicObjectField({ nullable: true, description: 'The last year in the range.', min: 0, example: 2001 }),
    __metadata("design:type", Number)
], SubsonicParameterAlbumList2.prototype, "toYear", void 0);
__decorate([
    SubsonicObjectField({ nullable: true, isID: true, description: 'Only return results from the music folder with the given ID' }),
    __metadata("design:type", String)
], SubsonicParameterAlbumList2.prototype, "musicFolderId", void 0);
SubsonicParameterAlbumList2 = __decorate([
    SubsonicObjectParametersType()
], SubsonicParameterAlbumList2);
export { SubsonicParameterAlbumList2 };
let SubsonicParameterCoverArt = class SubsonicParameterCoverArt {
};
__decorate([
    SubsonicObjectField({ description: 'The ID of a song, album or artist.', isID: true }),
    __metadata("design:type", String)
], SubsonicParameterCoverArt.prototype, "id", void 0);
__decorate([
    SubsonicObjectField({ nullable: true, description: 'If specified, scale image to this size.', min: 10, example: 300 }),
    __metadata("design:type", Number)
], SubsonicParameterCoverArt.prototype, "size", void 0);
SubsonicParameterCoverArt = __decorate([
    SubsonicObjectParametersType()
], SubsonicParameterCoverArt);
export { SubsonicParameterCoverArt };
let SubsonicParameterUsername = class SubsonicParameterUsername {
};
__decorate([
    SubsonicObjectField({ description: 'The name of the user to retrieve. You can only retrieve your own user unless you have admin privileges.' }),
    __metadata("design:type", String)
], SubsonicParameterUsername.prototype, "username", void 0);
SubsonicParameterUsername = __decorate([
    SubsonicObjectParametersType()
], SubsonicParameterUsername);
export { SubsonicParameterUsername };
let SubsonicParameterArtistInfo = class SubsonicParameterArtistInfo {
};
__decorate([
    SubsonicObjectField({ description: 'The ID of a song, album or artist.', isID: true }),
    __metadata("design:type", String)
], SubsonicParameterArtistInfo.prototype, "id", void 0);
__decorate([
    SubsonicObjectField({ nullable: true, description: 'Max number of similar artists to return.', min: 0, example: 10, defaultValue: 20 }),
    __metadata("design:type", Number)
], SubsonicParameterArtistInfo.prototype, "count", void 0);
__decorate([
    SubsonicObjectField({ nullable: true, description: 'Whether to return artists that are not present in the media library.', defaultValue: false }),
    __metadata("design:type", Boolean)
], SubsonicParameterArtistInfo.prototype, "includeNotPresent", void 0);
SubsonicParameterArtistInfo = __decorate([
    SubsonicObjectParametersType()
], SubsonicParameterArtistInfo);
export { SubsonicParameterArtistInfo };
let SubsonicParameterTopSongs = class SubsonicParameterTopSongs {
};
__decorate([
    SubsonicObjectField({ description: 'The artist name' }),
    __metadata("design:type", String)
], SubsonicParameterTopSongs.prototype, "artist", void 0);
__decorate([
    SubsonicObjectField({ nullable: true, description: 'Max number of songs to return.', min: 0, example: 10, defaultValue: 50 }),
    __metadata("design:type", Number)
], SubsonicParameterTopSongs.prototype, "count", void 0);
SubsonicParameterTopSongs = __decorate([
    SubsonicObjectParametersType()
], SubsonicParameterTopSongs);
export { SubsonicParameterTopSongs };
let SubsonicParameterSimilarSongs = class SubsonicParameterSimilarSongs {
};
__decorate([
    SubsonicObjectField({ description: 'The ID of a song, album or artist.', isID: true }),
    __metadata("design:type", String)
], SubsonicParameterSimilarSongs.prototype, "id", void 0);
__decorate([
    SubsonicObjectField({ nullable: true, description: 'Max number of songs to return.', min: 0, example: 10, defaultValue: 50 }),
    __metadata("design:type", Number)
], SubsonicParameterSimilarSongs.prototype, "count", void 0);
SubsonicParameterSimilarSongs = __decorate([
    SubsonicObjectParametersType()
], SubsonicParameterSimilarSongs);
export { SubsonicParameterSimilarSongs };
let SubsonicParameterDownload = class SubsonicParameterDownload {
};
__decorate([
    SubsonicObjectField({ description: 'A string which uniquely identifies the file to download', isID: true }),
    __metadata("design:type", String)
], SubsonicParameterDownload.prototype, "id", void 0);
SubsonicParameterDownload = __decorate([
    SubsonicObjectParametersType()
], SubsonicParameterDownload);
export { SubsonicParameterDownload };
let SubsonicParameterStream = class SubsonicParameterStream {
};
__decorate([
    SubsonicObjectField({ description: 'A string which uniquely identifies the file to stream', isID: true }),
    __metadata("design:type", String)
], SubsonicParameterStream.prototype, "id", void 0);
__decorate([
    SubsonicObjectField({ nullable: true, description: 'If specified, the server will attempt to limit the bitrate to this value, in kilobits per second. If set to zero, no limit is imposed.', min: 0 }),
    __metadata("design:type", Number)
], SubsonicParameterStream.prototype, "maxBitRate", void 0);
__decorate([
    SubsonicObjectField({ nullable: true, description: 'Only applicable to video streaming. If specified, start streaming at the given offset (in seconds) into the video. Typically used to implement video skipping.', min: 0 }),
    __metadata("design:type", Number)
], SubsonicParameterStream.prototype, "timeOffset", void 0);
__decorate([
    SubsonicObjectField({ nullable: true, description: 'Only applicable to video streaming. Requested video size specified as WxH, for instance "640x480".' }),
    __metadata("design:type", String)
], SubsonicParameterStream.prototype, "size", void 0);
__decorate([
    SubsonicObjectField({
        nullable: true,
        description: 'Only applicable to video streaming. Subsonic can optimize videos for streaming by converting them to MP4. If a conversion exists for the video in question, then setting this parameter to "true" will cause the converted video to be returned instead of the original',
        defaultValue: false
    }),
    __metadata("design:type", Boolean)
], SubsonicParameterStream.prototype, "converted", void 0);
__decorate([
    SubsonicObjectField({ nullable: true, description: 'if true, the Content-Length HTTP header will be set to an estimated value for transcoded or downsampled media.', defaultValue: false }),
    __metadata("design:type", Boolean)
], SubsonicParameterStream.prototype, "estimateContentLength", void 0);
__decorate([
    SubsonicObjectField({
        nullable: true,
        description: 'Specifies the preferred target format (e.g., "mp3" or "flv") in case there are multiple applicable transcodings. Starting with 1.9.0 you can use the special value "raw" to disable transcoding.'
    }),
    __metadata("design:type", String)
], SubsonicParameterStream.prototype, "format", void 0);
SubsonicParameterStream = __decorate([
    SubsonicObjectParametersType()
], SubsonicParameterStream);
export { SubsonicParameterStream };
let SubsonicParameterRate = class SubsonicParameterRate {
};
__decorate([
    SubsonicObjectField({ description: 'A string which uniquely identifies the file (song) or folder (album/artist) to rate', isID: true }),
    __metadata("design:type", String)
], SubsonicParameterRate.prototype, "id", void 0);
__decorate([
    SubsonicObjectField({ nullable: true, description: 'The rating between 1 and 5 (inclusive), or 0 to remove the rating.', min: 0, max: 5 }),
    __metadata("design:type", Number)
], SubsonicParameterRate.prototype, "rating", void 0);
SubsonicParameterRate = __decorate([
    SubsonicObjectParametersType()
], SubsonicParameterRate);
export { SubsonicParameterRate };
let SubsonicParameterChangePassword = class SubsonicParameterChangePassword {
};
__decorate([
    SubsonicObjectField({ description: 'The name of the user which should change its password.' }),
    __metadata("design:type", String)
], SubsonicParameterChangePassword.prototype, "username", void 0);
__decorate([
    SubsonicObjectField({ description: 'The new password of the new user, either in clear text of hex-encoded.' }),
    __metadata("design:type", String)
], SubsonicParameterChangePassword.prototype, "password", void 0);
SubsonicParameterChangePassword = __decorate([
    SubsonicObjectParametersType()
], SubsonicParameterChangePassword);
export { SubsonicParameterChangePassword };
let SubsonicParameterChatMessages = class SubsonicParameterChatMessages {
};
__decorate([
    SubsonicObjectField({ nullable: true, description: 'Only return messages newer than this time (in millis since Jan 1 1970).', min: 0, example: 1727432363956 }),
    __metadata("design:type", Number)
], SubsonicParameterChatMessages.prototype, "since", void 0);
SubsonicParameterChatMessages = __decorate([
    SubsonicObjectParametersType()
], SubsonicParameterChatMessages);
export { SubsonicParameterChatMessages };
let SubsonicParameterChatMessage = class SubsonicParameterChatMessage {
};
__decorate([
    SubsonicObjectField({ description: 'The chat message.' }),
    __metadata("design:type", String)
], SubsonicParameterChatMessage.prototype, "message", void 0);
SubsonicParameterChatMessage = __decorate([
    SubsonicObjectParametersType()
], SubsonicParameterChatMessage);
export { SubsonicParameterChatMessage };
let SubsonicParameterState = class SubsonicParameterState {
};
__decorate([
    SubsonicObjectField(() => [String], {
        nullable: true, description: 'The ID of the file (song) or folder (album/artist) to star. Multiple parameters allowed.',
        isID: true
    }),
    __metadata("design:type", Object)
], SubsonicParameterState.prototype, "id", void 0);
__decorate([
    SubsonicObjectField(() => [String], {
        nullable: true,
        description: 'The ID of an album to star. Use this rather than id if the client accesses the media collection according to ID3 tags rather than file structure. Multiple parameters allowed.',
        isID: true
    }),
    __metadata("design:type", Object)
], SubsonicParameterState.prototype, "albumId", void 0);
__decorate([
    SubsonicObjectField(() => [String], {
        nullable: true,
        description: 'The ID of an artist to star. Use this rather than id if the client accesses the media collection according to ID3 tags rather than file structure. Multiple parameters allowed.',
        isID: true
    }),
    __metadata("design:type", Object)
], SubsonicParameterState.prototype, "artistId", void 0);
SubsonicParameterState = __decorate([
    SubsonicObjectParametersType()
], SubsonicParameterState);
export { SubsonicParameterState };
let SubsonicParameterPlaylists = class SubsonicParameterPlaylists {
};
__decorate([
    SubsonicObjectField({ nullable: true, description: 'If specified, return playlists for this user rather than for the authenticated user. The authenticated user must have admin role if this parameter is used.' }),
    __metadata("design:type", String)
], SubsonicParameterPlaylists.prototype, "username", void 0);
SubsonicParameterPlaylists = __decorate([
    SubsonicObjectParametersType()
], SubsonicParameterPlaylists);
export { SubsonicParameterPlaylists };
let SubsonicParameterPlaylistCreate = class SubsonicParameterPlaylistCreate {
};
__decorate([
    SubsonicObjectField({ nullable: true, description: 'The playlist ID. (if updating)', isID: true }),
    __metadata("design:type", String)
], SubsonicParameterPlaylistCreate.prototype, "playlistId", void 0);
__decorate([
    SubsonicObjectField({ nullable: true, description: 'The human-readable name of the playlist.' }),
    __metadata("design:type", String)
], SubsonicParameterPlaylistCreate.prototype, "name", void 0);
__decorate([
    SubsonicObjectField(() => [String], {
        description: 'ID of a song in the playlist. Use one songId parameter for each song in the playlist.',
        nullable: true,
        isID: true
    }),
    __metadata("design:type", Object)
], SubsonicParameterPlaylistCreate.prototype, "songId", void 0);
SubsonicParameterPlaylistCreate = __decorate([
    SubsonicObjectParametersType()
], SubsonicParameterPlaylistCreate);
export { SubsonicParameterPlaylistCreate };
let SubsonicParameterPlaylistUpdate = class SubsonicParameterPlaylistUpdate {
};
__decorate([
    SubsonicObjectField({ description: 'The playlist ID.', isID: true }),
    __metadata("design:type", String)
], SubsonicParameterPlaylistUpdate.prototype, "playlistId", void 0);
__decorate([
    SubsonicObjectField({ nullable: true, description: 'The human-readable name of the playlist.' }),
    __metadata("design:type", String)
], SubsonicParameterPlaylistUpdate.prototype, "name", void 0);
__decorate([
    SubsonicObjectField({ nullable: true, description: 'The playlist comment.' }),
    __metadata("design:type", String)
], SubsonicParameterPlaylistUpdate.prototype, "comment", void 0);
__decorate([
    SubsonicObjectField({ nullable: true, description: 'true if the playlist should be visible to all users, false otherwise.', defaultValue: false }),
    __metadata("design:type", Boolean)
], SubsonicParameterPlaylistUpdate.prototype, "public", void 0);
__decorate([
    SubsonicObjectField(() => [String], {
        nullable: true,
        description: 'Add this song with this ID to the playlist. Multiple parameters allowed.',
        isID: true
    }),
    __metadata("design:type", Object)
], SubsonicParameterPlaylistUpdate.prototype, "songIdToAdd", void 0);
__decorate([
    SubsonicObjectField(() => [Number], {
        nullable: true,
        description: 'Remove the song at this position in the playlist. Multiple parameters allowed.'
    }),
    __metadata("design:type", Object)
], SubsonicParameterPlaylistUpdate.prototype, "songIndexToRemove", void 0);
SubsonicParameterPlaylistUpdate = __decorate([
    SubsonicObjectParametersType()
], SubsonicParameterPlaylistUpdate);
export { SubsonicParameterPlaylistUpdate };
let SubsonicParameterPodcastChannel = class SubsonicParameterPodcastChannel {
};
__decorate([
    SubsonicObjectField({ description: 'The URL of the Podcast to add.' }),
    __metadata("design:type", String)
], SubsonicParameterPodcastChannel.prototype, "url", void 0);
SubsonicParameterPodcastChannel = __decorate([
    SubsonicObjectParametersType()
], SubsonicParameterPodcastChannel);
export { SubsonicParameterPodcastChannel };
let SubsonicParameterPodcastChannels = class SubsonicParameterPodcastChannels {
};
__decorate([
    SubsonicObjectField({ nullable: true, description: 'If specified, only return the Podcast channel with this ID', isID: true }),
    __metadata("design:type", String)
], SubsonicParameterPodcastChannels.prototype, "id", void 0);
__decorate([
    SubsonicObjectField({ nullable: true, description: 'Whether to include Podcast episodes in the returned result.', defaultValue: true }),
    __metadata("design:type", Boolean)
], SubsonicParameterPodcastChannels.prototype, "includeEpisodes", void 0);
SubsonicParameterPodcastChannels = __decorate([
    SubsonicObjectParametersType()
], SubsonicParameterPodcastChannels);
export { SubsonicParameterPodcastChannels };
let SubsonicParameterPodcastEpisodesNewest = class SubsonicParameterPodcastEpisodesNewest {
};
__decorate([
    SubsonicObjectField({ nullable: true, description: 'The maximum number of episodes to return.', min: 0, example: 10, defaultValue: 20 }),
    __metadata("design:type", Number)
], SubsonicParameterPodcastEpisodesNewest.prototype, "count", void 0);
__decorate([
    SubsonicObjectField({ nullable: true, description: 'Search result offset. Used for paging.', min: 0, example: 10, defaultValue: 0 }),
    __metadata("design:type", Number)
], SubsonicParameterPodcastEpisodesNewest.prototype, "offset", void 0);
SubsonicParameterPodcastEpisodesNewest = __decorate([
    SubsonicObjectParametersType()
], SubsonicParameterPodcastEpisodesNewest);
export { SubsonicParameterPodcastEpisodesNewest };
let SubsonicParameterCreateUser = class SubsonicParameterCreateUser {
};
__decorate([
    SubsonicObjectField({ description: 'The name of the new user.' }),
    __metadata("design:type", String)
], SubsonicParameterCreateUser.prototype, "username", void 0);
__decorate([
    SubsonicObjectField({ nullable: true, description: 'The password of the new user, either in clear text of hex-encoded.' }),
    __metadata("design:type", String)
], SubsonicParameterCreateUser.prototype, "password", void 0);
__decorate([
    SubsonicObjectField({ nullable: true, description: 'The email address of the new user.' }),
    __metadata("design:type", String)
], SubsonicParameterCreateUser.prototype, "email", void 0);
__decorate([
    SubsonicObjectField({ nullable: true, description: 'Whether the user is authenicated in LDAP.', defaultValue: false }),
    __metadata("design:type", Boolean)
], SubsonicParameterCreateUser.prototype, "ldapAuthenticated", void 0);
__decorate([
    SubsonicObjectField({ nullable: true, description: 'Whether the user is administrator.', defaultValue: false }),
    __metadata("design:type", Boolean)
], SubsonicParameterCreateUser.prototype, "adminRole", void 0);
__decorate([
    SubsonicObjectField({ nullable: true, description: 'Whether the user is allowed to change personal settings and password.', defaultValue: false }),
    __metadata("design:type", Boolean)
], SubsonicParameterCreateUser.prototype, "settingsRole", void 0);
__decorate([
    SubsonicObjectField({ nullable: true, description: 'Whether the user is allowed to play files.', defaultValue: false }),
    __metadata("design:type", Boolean)
], SubsonicParameterCreateUser.prototype, "streamRole", void 0);
__decorate([
    SubsonicObjectField({ nullable: true, description: 'Whether the user is allowed to play files in jukebox mode.', defaultValue: false }),
    __metadata("design:type", Boolean)
], SubsonicParameterCreateUser.prototype, "jukeboxRole", void 0);
__decorate([
    SubsonicObjectField({ nullable: true, description: 'Whether the user is allowed to download files.', defaultValue: false }),
    __metadata("design:type", Boolean)
], SubsonicParameterCreateUser.prototype, "downloadRole", void 0);
__decorate([
    SubsonicObjectField({ nullable: true, description: 'Whether the user is allowed to upload files.', defaultValue: false }),
    __metadata("design:type", Boolean)
], SubsonicParameterCreateUser.prototype, "uploadRole", void 0);
__decorate([
    SubsonicObjectField({ nullable: true, description: 'Whether the user is allowed to change cover art and tags.', defaultValue: false }),
    __metadata("design:type", Boolean)
], SubsonicParameterCreateUser.prototype, "coverArtRole", void 0);
__decorate([
    SubsonicObjectField({ nullable: true, description: 'Whether the user is allowed to create and edit comments and ratings.', defaultValue: false }),
    __metadata("design:type", Boolean)
], SubsonicParameterCreateUser.prototype, "commentRole", void 0);
__decorate([
    SubsonicObjectField({ nullable: true, description: 'Whether the user is allowed to administrate Podcasts.', defaultValue: false }),
    __metadata("design:type", Boolean)
], SubsonicParameterCreateUser.prototype, "podcastRole", void 0);
__decorate([
    SubsonicObjectField({ nullable: true, description: 'Whether the user is allowed to create and delete playlists.', defaultValue: false }),
    __metadata("design:type", Boolean)
], SubsonicParameterCreateUser.prototype, "playlistRole", void 0);
__decorate([
    SubsonicObjectField({ nullable: true, description: 'Whether the user is allowed to share files with anyone.', defaultValue: false }),
    __metadata("design:type", Boolean)
], SubsonicParameterCreateUser.prototype, "shareRole", void 0);
__decorate([
    SubsonicObjectField({ nullable: true, description: 'Whether the user is allowed to start video conversions.', defaultValue: false }),
    __metadata("design:type", Boolean)
], SubsonicParameterCreateUser.prototype, "videoConversionRole", void 0);
__decorate([
    SubsonicObjectField(() => [String], {
        nullable: true,
        isID: true,
        description: 'IDs of the music folders the user is allowed access to. Include the parameter once for each folder.'
    }),
    __metadata("design:type", Object)
], SubsonicParameterCreateUser.prototype, "musicFolderId", void 0);
SubsonicParameterCreateUser = __decorate([
    SubsonicObjectParametersType()
], SubsonicParameterCreateUser);
export { SubsonicParameterCreateUser };
let SubsonicParameterUpdateUser = class SubsonicParameterUpdateUser {
};
__decorate([
    SubsonicObjectField({ description: 'The name of the user.' }),
    __metadata("design:type", String)
], SubsonicParameterUpdateUser.prototype, "username", void 0);
__decorate([
    SubsonicObjectField({ nullable: true, description: 'The password of the user, either in clear text of hex-encoded.' }),
    __metadata("design:type", String)
], SubsonicParameterUpdateUser.prototype, "password", void 0);
__decorate([
    SubsonicObjectField({ nullable: true, description: 'The email address of the user.' }),
    __metadata("design:type", String)
], SubsonicParameterUpdateUser.prototype, "email", void 0);
__decorate([
    SubsonicObjectField({ nullable: true, description: 'Whether the user is authenicated in LDAP.', defaultValue: false }),
    __metadata("design:type", Boolean)
], SubsonicParameterUpdateUser.prototype, "ldapAuthenticated", void 0);
__decorate([
    SubsonicObjectField({ nullable: true, description: 'Whether the user is administrator.', defaultValue: false }),
    __metadata("design:type", Boolean)
], SubsonicParameterUpdateUser.prototype, "adminRole", void 0);
__decorate([
    SubsonicObjectField({ nullable: true, description: 'Whether the user is allowed to change personal settings and password.', defaultValue: false }),
    __metadata("design:type", Boolean)
], SubsonicParameterUpdateUser.prototype, "settingsRole", void 0);
__decorate([
    SubsonicObjectField({ nullable: true, description: 'Whether the user is allowed to play files.', defaultValue: false }),
    __metadata("design:type", Boolean)
], SubsonicParameterUpdateUser.prototype, "streamRole", void 0);
__decorate([
    SubsonicObjectField({ nullable: true, description: 'Whether the user is allowed to play files in jukebox mode.', defaultValue: false }),
    __metadata("design:type", Boolean)
], SubsonicParameterUpdateUser.prototype, "jukeboxRole", void 0);
__decorate([
    SubsonicObjectField({ nullable: true, description: 'Whether the user is allowed to download files.', defaultValue: false }),
    __metadata("design:type", Boolean)
], SubsonicParameterUpdateUser.prototype, "downloadRole", void 0);
__decorate([
    SubsonicObjectField({ nullable: true, description: 'Whether the user is allowed to upload files.', defaultValue: false }),
    __metadata("design:type", Boolean)
], SubsonicParameterUpdateUser.prototype, "uploadRole", void 0);
__decorate([
    SubsonicObjectField({ nullable: true, description: 'Whether the user is allowed to change cover art and tags.', defaultValue: false }),
    __metadata("design:type", Boolean)
], SubsonicParameterUpdateUser.prototype, "coverArtRole", void 0);
__decorate([
    SubsonicObjectField({ nullable: true, description: 'Whether the user is allowed to create and edit comments and ratings.', defaultValue: false }),
    __metadata("design:type", Boolean)
], SubsonicParameterUpdateUser.prototype, "commentRole", void 0);
__decorate([
    SubsonicObjectField({ nullable: true, description: 'Whether the user is allowed to administrate Podcasts.', defaultValue: false }),
    __metadata("design:type", Boolean)
], SubsonicParameterUpdateUser.prototype, "podcastRole", void 0);
__decorate([
    SubsonicObjectField({ nullable: true, description: 'Whether the user is allowed to create and delete playlists.', defaultValue: false }),
    __metadata("design:type", Boolean)
], SubsonicParameterUpdateUser.prototype, "playlistRole", void 0);
__decorate([
    SubsonicObjectField({ nullable: true, description: 'Whether the user is allowed to share files with anyone.', defaultValue: false }),
    __metadata("design:type", Boolean)
], SubsonicParameterUpdateUser.prototype, "shareRole", void 0);
__decorate([
    SubsonicObjectField({ nullable: true, description: 'Whether the user is allowed to start video conversions.', defaultValue: false }),
    __metadata("design:type", Boolean)
], SubsonicParameterUpdateUser.prototype, "videoConversionRole", void 0);
__decorate([
    SubsonicObjectField(() => [String], {
        nullable: true, isID: true,
        description: 'IDs of the music folders the user is allowed access to. Include the parameter once for each folder.'
    }),
    __metadata("design:type", Object)
], SubsonicParameterUpdateUser.prototype, "musicFolderId", void 0);
__decorate([
    SubsonicObjectField({
        nullable: true,
        description: 'The maximum bit rate (in Kbps) for the user. Audio streams of higher bit rates are automatically downsampled to this bit rate. Legal values: 0 (no limit), 32, 40, 48, 56, 64, 80, 96, 112, 128, 160, 192, 224, 256, 320.'
    }),
    __metadata("design:type", Number)
], SubsonicParameterUpdateUser.prototype, "maxBitRate", void 0);
SubsonicParameterUpdateUser = __decorate([
    SubsonicObjectParametersType()
], SubsonicParameterUpdateUser);
export { SubsonicParameterUpdateUser };
let SubsonicParameterBookmark = class SubsonicParameterBookmark {
};
__decorate([
    SubsonicObjectField({ description: 'ID of the media file to bookmark. If a bookmark already exists for this file it will be overwritten.', isID: true }),
    __metadata("design:type", String)
], SubsonicParameterBookmark.prototype, "id", void 0);
__decorate([
    SubsonicObjectField({ description: 'The position (in milliseconds) within the media file.', min: 0 }),
    __metadata("design:type", Number)
], SubsonicParameterBookmark.prototype, "position", void 0);
__decorate([
    SubsonicObjectField({ nullable: true, description: 'A user-defined comment.' }),
    __metadata("design:type", String)
], SubsonicParameterBookmark.prototype, "comment", void 0);
SubsonicParameterBookmark = __decorate([
    SubsonicObjectParametersType()
], SubsonicParameterBookmark);
export { SubsonicParameterBookmark };
let SubsonicParameterRandomSong = class SubsonicParameterRandomSong {
};
__decorate([
    SubsonicObjectField({ nullable: true, description: 'The number of songs to return.', min: 0, max: 500, example: 10, defaultValue: 10 }),
    __metadata("design:type", Number)
], SubsonicParameterRandomSong.prototype, "size", void 0);
__decorate([
    SubsonicObjectField({ nullable: true, isID: true, description: 'Only return songs in the music folder with the given ID.' }),
    __metadata("design:type", String)
], SubsonicParameterRandomSong.prototype, "musicFolderId", void 0);
__decorate([
    SubsonicObjectField({ nullable: true, description: 'Only returns songs belonging to this genre. e.g., "Rock"' }),
    __metadata("design:type", String)
], SubsonicParameterRandomSong.prototype, "genre", void 0);
__decorate([
    SubsonicObjectField({ nullable: true, description: 'Only return songs published after or in this year.', min: 0, example: 2000 }),
    __metadata("design:type", Number)
], SubsonicParameterRandomSong.prototype, "fromYear", void 0);
__decorate([
    SubsonicObjectField({ nullable: true, description: 'Only return songs published before or in this year.', min: 0, example: 2001 }),
    __metadata("design:type", Number)
], SubsonicParameterRandomSong.prototype, "toYear", void 0);
SubsonicParameterRandomSong = __decorate([
    SubsonicObjectParametersType()
], SubsonicParameterRandomSong);
export { SubsonicParameterRandomSong };
let SubsonicParameterSearch = class SubsonicParameterSearch {
};
__decorate([
    SubsonicObjectField({ nullable: true, description: 'Searches all fields.' }),
    __metadata("design:type", String)
], SubsonicParameterSearch.prototype, "any", void 0);
__decorate([
    SubsonicObjectField({ nullable: true, description: 'Artist to search for.' }),
    __metadata("design:type", String)
], SubsonicParameterSearch.prototype, "artist", void 0);
__decorate([
    SubsonicObjectField({ nullable: true, description: 'Album to search for.' }),
    __metadata("design:type", String)
], SubsonicParameterSearch.prototype, "album", void 0);
__decorate([
    SubsonicObjectField({ nullable: true, description: 'Song title to search for.' }),
    __metadata("design:type", String)
], SubsonicParameterSearch.prototype, "title", void 0);
__decorate([
    SubsonicObjectField({ nullable: true, description: 'Maximum number of results to return.', min: 0, example: 10, defaultValue: 20 }),
    __metadata("design:type", Number)
], SubsonicParameterSearch.prototype, "count", void 0);
__decorate([
    SubsonicObjectField({ nullable: true, description: 'Search result offset. Used for paging.', min: 0, example: 10, defaultValue: 0 }),
    __metadata("design:type", Number)
], SubsonicParameterSearch.prototype, "offset", void 0);
__decorate([
    SubsonicObjectField({ nullable: true, description: 'Only return matches that are newer than this. Given as milliseconds since 1970.', min: 0 }),
    __metadata("design:type", Number)
], SubsonicParameterSearch.prototype, "newerThan", void 0);
SubsonicParameterSearch = __decorate([
    SubsonicObjectParametersType()
], SubsonicParameterSearch);
export { SubsonicParameterSearch };
let SubsonicParameterSearch2 = class SubsonicParameterSearch2 {
};
__decorate([
    SubsonicObjectField({ nullable: true, description: 'Search query.' }),
    __metadata("design:type", String)
], SubsonicParameterSearch2.prototype, "query", void 0);
__decorate([
    SubsonicObjectField({ nullable: true, description: 'Maximum number of artists to return.', min: 0, example: 10, defaultValue: 20 }),
    __metadata("design:type", Number)
], SubsonicParameterSearch2.prototype, "artistCount", void 0);
__decorate([
    SubsonicObjectField({ nullable: true, description: 'Search result offset for artists. Used for paging.', min: 0, example: 10, defaultValue: 0 }),
    __metadata("design:type", Number)
], SubsonicParameterSearch2.prototype, "artistOffset", void 0);
__decorate([
    SubsonicObjectField({ nullable: true, description: 'Maximum number of albums to return.', min: 0, example: 10, defaultValue: 20 }),
    __metadata("design:type", Number)
], SubsonicParameterSearch2.prototype, "albumCount", void 0);
__decorate([
    SubsonicObjectField({ nullable: true, description: 'Search result offset for albums. Used for paging.', min: 0, example: 10, defaultValue: 0 }),
    __metadata("design:type", Number)
], SubsonicParameterSearch2.prototype, "albumOffset", void 0);
__decorate([
    SubsonicObjectField({ nullable: true, description: 'Maximum number of songs to return.', min: 0, example: 10, defaultValue: 20 }),
    __metadata("design:type", Number)
], SubsonicParameterSearch2.prototype, "songCount", void 0);
__decorate([
    SubsonicObjectField({ nullable: true, description: 'Search result offset for songs. Used for paging.', min: 0, example: 10, defaultValue: 0 }),
    __metadata("design:type", Number)
], SubsonicParameterSearch2.prototype, "songOffset", void 0);
__decorate([
    SubsonicObjectField({ nullable: true, isID: true, description: 'Only return songs in the music folder with the given ID.' }),
    __metadata("design:type", String)
], SubsonicParameterSearch2.prototype, "musicFolderId", void 0);
SubsonicParameterSearch2 = __decorate([
    SubsonicObjectParametersType()
], SubsonicParameterSearch2);
export { SubsonicParameterSearch2 };
let SubsonicParameterLyrics = class SubsonicParameterLyrics {
};
__decorate([
    SubsonicObjectField({ nullable: true, description: 'Search lyrics by artist.' }),
    __metadata("design:type", String)
], SubsonicParameterLyrics.prototype, "artist", void 0);
__decorate([
    SubsonicObjectField({ nullable: true, description: 'Search lyrics by song title.' }),
    __metadata("design:type", String)
], SubsonicParameterLyrics.prototype, "title", void 0);
SubsonicParameterLyrics = __decorate([
    SubsonicObjectParametersType()
], SubsonicParameterLyrics);
export { SubsonicParameterLyrics };
let SubsonicParameterLyricsByID = class SubsonicParameterLyricsByID {
};
__decorate([
    SubsonicObjectField({ description: 'The ID of the current playing song.', isID: true }),
    __metadata("design:type", String)
], SubsonicParameterLyricsByID.prototype, "id", void 0);
SubsonicParameterLyricsByID = __decorate([
    SubsonicObjectParametersType()
], SubsonicParameterLyricsByID);
export { SubsonicParameterLyricsByID };
let SubsonicParameterPlayQueue = class SubsonicParameterPlayQueue {
};
__decorate([
    SubsonicObjectField(() => [String], {
        description: 'ID of a song in the play queue. Use one id parameter for each song in the play queue.',
        isID: true
    }),
    __metadata("design:type", Object)
], SubsonicParameterPlayQueue.prototype, "id", void 0);
__decorate([
    SubsonicObjectField({ nullable: true, description: 'The ID of the current playing song.', isID: true }),
    __metadata("design:type", String)
], SubsonicParameterPlayQueue.prototype, "current", void 0);
__decorate([
    SubsonicObjectField({ nullable: true, description: 'The position in milliseconds within the currently playing song.', min: 0 }),
    __metadata("design:type", Number)
], SubsonicParameterPlayQueue.prototype, "position", void 0);
SubsonicParameterPlayQueue = __decorate([
    SubsonicObjectParametersType()
], SubsonicParameterPlayQueue);
export { SubsonicParameterPlayQueue };
let SubsonicParameterSongsByGenre = class SubsonicParameterSongsByGenre {
};
__decorate([
    SubsonicObjectField({ description: 'The genre.' }),
    __metadata("design:type", String)
], SubsonicParameterSongsByGenre.prototype, "genre", void 0);
__decorate([
    SubsonicObjectField({ nullable: true, description: 'The maximum number of songs to return.', min: 0, max: 500, example: 10, defaultValue: 10 }),
    __metadata("design:type", Number)
], SubsonicParameterSongsByGenre.prototype, "count", void 0);
__decorate([
    SubsonicObjectField({ nullable: true, description: 'The offset. Useful if you want to page through the songs in a genre.', min: 0, example: 10, defaultValue: 0 }),
    __metadata("design:type", Number)
], SubsonicParameterSongsByGenre.prototype, "offset", void 0);
__decorate([
    SubsonicObjectField({ nullable: true, description: 'Only return albums in the music folder with the given ID.', isID: true }),
    __metadata("design:type", String)
], SubsonicParameterSongsByGenre.prototype, "musicFolderId", void 0);
SubsonicParameterSongsByGenre = __decorate([
    SubsonicObjectParametersType()
], SubsonicParameterSongsByGenre);
export { SubsonicParameterSongsByGenre };
let SubsonicParameterScrobble = class SubsonicParameterScrobble {
};
__decorate([
    SubsonicObjectField({ description: 'A string which uniquely identifies the file to scrobble.', isID: true }),
    __metadata("design:type", String)
], SubsonicParameterScrobble.prototype, "id", void 0);
__decorate([
    SubsonicObjectField({ nullable: true, description: 'The time (in milliseconds since 1 Jan 1970) at which the song was listened to.', min: 0 }),
    __metadata("design:type", Number)
], SubsonicParameterScrobble.prototype, "time", void 0);
__decorate([
    SubsonicObjectField({ nullable: true, description: 'Whether this is a "submission" or a "now playing" notification.', defaultValue: false }),
    __metadata("design:type", Boolean)
], SubsonicParameterScrobble.prototype, "submission", void 0);
SubsonicParameterScrobble = __decorate([
    SubsonicObjectParametersType()
], SubsonicParameterScrobble);
export { SubsonicParameterScrobble };
let SubsonicParameterCaptions = class SubsonicParameterCaptions {
};
__decorate([
    SubsonicObjectField({ description: 'The ID of the video.', isID: true }),
    __metadata("design:type", String)
], SubsonicParameterCaptions.prototype, "id", void 0);
__decorate([
    SubsonicObjectField({ nullable: true, description: 'Preferred captions format ("srt" or "vtt").' }),
    __metadata("design:type", String)
], SubsonicParameterCaptions.prototype, "format", void 0);
SubsonicParameterCaptions = __decorate([
    SubsonicObjectParametersType()
], SubsonicParameterCaptions);
export { SubsonicParameterCaptions };
let SubsonicParameterShare = class SubsonicParameterShare {
};
__decorate([
    SubsonicObjectField({ description: 'ID of a song, album or video to share. Use one id parameter for each entry to share.', isID: true }),
    __metadata("design:type", String)
], SubsonicParameterShare.prototype, "id", void 0);
__decorate([
    SubsonicObjectField({ nullable: true, description: 'A user-defined description that will be displayed to people visiting the shared media..' }),
    __metadata("design:type", String)
], SubsonicParameterShare.prototype, "description", void 0);
__decorate([
    SubsonicObjectField({ nullable: true, description: 'The time at which the share expires. Given as milliseconds since 1970.', min: 0 }),
    __metadata("design:type", Number)
], SubsonicParameterShare.prototype, "expires", void 0);
SubsonicParameterShare = __decorate([
    SubsonicObjectParametersType()
], SubsonicParameterShare);
export { SubsonicParameterShare };
let SubsonicParameterHLS = class SubsonicParameterHLS {
};
__decorate([
    SubsonicObjectField({ description: 'A string which uniquely identifies the media file to stream.', isID: true }),
    __metadata("design:type", String)
], SubsonicParameterHLS.prototype, "id", void 0);
__decorate([
    SubsonicObjectField({
        nullable: true,
        description: 'If specified, the server will attempt to limit the bitrate to this value, in kilobits per second. If this parameter is specified more than once, ' +
            'the server will create a variant playlist, suitable for adaptive bitrate streaming. ' +
            'The playlist will support streaming at all the specified bitrates. The server will automatically choose video dimensions that are suitable for the given bitrates. ' +
            'You may explicitly request a certain width (480) and height (360) like so: bitRate=1000@480x360'
    }),
    __metadata("design:type", String)
], SubsonicParameterHLS.prototype, "bitRate", void 0);
__decorate([
    SubsonicObjectField({ nullable: true, description: 'The ID of the audio track to use. See getVideoInfo for how to get the list of available audio tracks for a video.', isID: true }),
    __metadata("design:type", String)
], SubsonicParameterHLS.prototype, "audioTrack", void 0);
SubsonicParameterHLS = __decorate([
    SubsonicObjectParametersType()
], SubsonicParameterHLS);
export { SubsonicParameterHLS };
let SubsonicParameterJukebox = class SubsonicParameterJukebox {
};
__decorate([
    SubsonicObjectField({ description: 'The operation to perform.' }),
    __metadata("design:type", String)
], SubsonicParameterJukebox.prototype, "action", void 0);
__decorate([
    SubsonicObjectField({ nullable: true, description: 'Used by skip and remove. Zero-based index of the song to skip to or remove.', min: 0 }),
    __metadata("design:type", Number)
], SubsonicParameterJukebox.prototype, "index", void 0);
__decorate([
    SubsonicObjectField({ nullable: true, description: 'Used by skip. Start playing this many seconds into the track.', min: 0, example: 10 }),
    __metadata("design:type", Number)
], SubsonicParameterJukebox.prototype, "offset", void 0);
__decorate([
    SubsonicObjectField({
        isID: true,
        description: 'Used by add and set. ID of song to add to the jukebox playlist. Use multiple id parameters to add many songs in the same request. ' +
            '(set is similar to a clear followed by a add, but will not change the currently playing track.)'
    }),
    __metadata("design:type", String)
], SubsonicParameterJukebox.prototype, "id", void 0);
__decorate([
    SubsonicObjectField(() => Number, { nullable: true, description: ' Used by setGain to control the playback volume. A float value between 0.0 and 1.0.', min: 0, max: 1 }),
    __metadata("design:type", Number)
], SubsonicParameterJukebox.prototype, "gain", void 0);
SubsonicParameterJukebox = __decorate([
    SubsonicObjectParametersType()
], SubsonicParameterJukebox);
export { SubsonicParameterJukebox };
//# sourceMappingURL=subsonic-rest-parameters.js.map