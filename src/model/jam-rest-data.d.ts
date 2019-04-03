import {MusicBrainz} from './musicbrainz-rest-data';
import {LastFM} from './lastfm-rest-data';
import {Acoustid} from './acoustid-rest-data';
import {AcousticBrainz} from './acousticbrainz-rest-data';
import {CoverArtArchive} from './coverartarchive-rest-data';
import {ID3v2Frames} from './id3v2-frames';

export declare namespace Jam {

	export type AlbumType = 'unknown' | 'album' | 'compilation' | 'audiobook';
	export type FolderType = 'unknown' | 'artist' | 'collection' | 'album' | 'multialbum' | 'extras';
	export type PodcastStatusType = 'new' | 'downloading' | 'completed' | 'error';
	export type PodcastEpisodeStatusType = 'new' | 'downloading' | 'completed' | 'error' | 'deleted';
	export type ArtworkImageType = 'front' | 'back' | 'booklet' | 'medium' | 'tray' | 'obi' | 'spine' | 'track' | 'liner' | 'sticker' | 'poster' | 'watermark' | 'raw' | 'unedited' | 'other' | 'artist';
	export type RootScanStrategy = 'auto' | 'artistalbum' | 'compilation' | 'audiobook';

	export interface Ping {
		version: Version;
	}

	export type Version = string; // \d+\.\d+\.\d+

	export interface Session {
		version: Version;
		user?: SessionUser;
		jwt?: string;
		allowedCookieDomains: Array<string>;
	}

	export interface Base {
		id: string;
		state?: State;
		name: string;
		created: number;
	}

	export interface RootStatus {
		lastScan: number;
		error?: string;
		scanning?: boolean;
	}

	export interface Root extends Base {
		path: string;
		status: RootStatus;
		strategy: RootScanStrategy;
	}

	export interface TrackMBTag {
		trackID?: string;
		recordingID?: string;
		releaseTrackID?: string;
		releaseGroupID?: string;
		releaseID?: string;
		artistID?: string;
	}

	export interface TrackTag {
		title?: string;
		album?: string;
		artist?: string;
		genre?: string;
		year?: number;
		trackNr?: number;
		disc?: number;
		musicbrainz?: TrackMBTag;
	}

	export interface TrackMedia {
		bitRate: number;
		format: string;
		channels: number;
		sampleRate: number;
	}

	export interface Bookmark {
		id: string;
		track?: Track;
		trackID: string;
		position: number;
		comment?: string;
		created: number;
		changed: number;
	}

	export interface NowPlaying {
		username: string;
		minutesAgo: number;
		track?: Track;
	}

	export interface Track extends Base {
		duration: number;
		tag?: TrackTag;
		tagRaw?: RawTag;
		media?: TrackMedia;
		parentID: string;
		artistID?: string;
		albumID?: string;
	}

	export interface PodcastEpisode extends Track {
		podcastID: string;
		status: PodcastEpisodeStatusType;
		date: number;
		summary?: string;
		guid?: string;
		author?: string;
		link?: string;
		errorMessage?: string;
	}

	export interface PodcastEpisodeStatus {
		status: PodcastEpisodeStatusType;
	}

	export interface PodcastStatus {
		status: PodcastStatusType;
		lastCheck?: number;
	}

	export interface Podcast extends Base {
		url: string;
		status: PodcastStatusType;
		lastCheck?: number;
		errorMessage?: string;
		description?: string;
		episodes?: Array<PodcastEpisode>;
	}

	export interface Radio extends Base {
		url: string;
		homepage?: string;
		created: number;
		changed: number;
	}

	export interface RawTag {
		version: number;
		frames: ID3v2Frames.Frames;
	}

	export interface State {
		played?: number;
		lastplayed?: number;
		faved?: number;
		rated?: number;
	}

	export interface States {
		[id: string]: State;
	}

	export interface RawTags {
		[trackID: string]: RawTag;
	}

	export interface Folder extends Base {
		parentID?: string;
		level: number;
		type: FolderType;
		trackCount?: number;
		folderCount?: number;
		tag?: FolderTag;
		info?: ExtendedInfo;
		folders?: Array<Folder>;
		tracks?: Array<Track>;
		parents?: Array<FolderParent>;
		artworks?: Array<ArtworkImage>;
		similar?: Array<Folder>;
	}

	export interface FolderHealth {
		folder: Folder;
		health: Array<HealthHint>;
	}

	export interface FolderParent {
		id: string;
		name: string;
	}

	export interface ArtworkImage {
		id: string;
		name: string;
		types: Array<ArtworkImageType>;
		size: number;
	}

	export interface FolderMBTag {
		artistID?: string;
		releaseID?: string;
		releaseGroupID?: string;
	}

	export interface FolderTag {
		album?: string;
		albumType?: AlbumType;
		artist?: string;
		artistSort?: string;
		genre?: string;
		year?: number;
		musicbrainz?: FolderMBTag;
	}

	export interface HealthHint {
		id: string;
		name: string;
		details?: string;
	}

	export interface FolderChildren {
		folders?: Array<Folder>;
		tracks?: Array<Track>;
	}

	export interface AlbumTag {
		duration: number;
		created: number;
		genre?: string;
		year?: number;
		musicbrainz?: {
			artistID?: string;
			albumID?: string;
		};
	}

	export interface ExtendedInfo {
		description: string;
		source: string;
		license: string;
		url: string;
		licenseUrl: string;
	}

	export interface Info {
		info?: ExtendedInfo;
	}

	export interface Album extends Base {
		artist?: string;
		tag?: AlbumTag;
		albumType: AlbumType;
		trackCount: number;
		artistID: string;
		trackIDs?: Array<string>;
		tracks?: Array<Track>;
		info?: ExtendedInfo;
	}

	export interface Artist extends Base {
		albumCount: number;
		trackCount: number;
		musicbrainz?: {
			artistID?: string;
		};
		albumTypes: Array<AlbumType>;
		tracks?: Array<Track>;
		trackIDs?: Array<string>;
		albumIDs?: Array<string>;
		albums?: Array<Album>;
		similar?: Array<Artist>;
		info?: ExtendedInfo;
	}

	export interface Playlist extends Base {
		userID: string;
		isPublic: boolean;
		comment?: string;
		duration: number;
		trackCount: number;
		changed: number;
		tracks?: Array<Track>;
		trackIDs?: Array<string>;
	}

	export interface FolderIndexEntry {
		name: string;
		folderID: string;
		trackCount: number;
	}

	export interface FolderIndexGroup {
		name: string;
		entries: Array<FolderIndexEntry>;
	}

	export interface FolderIndex {
		lastModified: number;
		groups: Array<FolderIndexGroup>;
	}

	export interface ArtistIndexEntry {
		name: string;
		artistID: string;
		trackCount: number;
	}

	export interface ArtistIndexGroup {
		name: string;
		entries: Array<ArtistIndexEntry>;
	}

	export interface ArtistIndex {
		lastModified: number;
		groups: Array<ArtistIndexGroup>;
	}

	export interface Stats {
		rootID?: string;
		track: number;
		folder: number;
		artist: number;
		artistTypes: {
			album: number;
			compilation: number;
			audiobook: number;
		};
		album: number;
		albumTypes: {
			album: number;
			compilation: number;
			audiobook: number;
		};
	}

	export interface Roles {
		stream?: boolean;
		upload?: boolean;
		podcast?: boolean;
		admin?: boolean;
		// coverArt?: boolean;
		// settings?: boolean;
		// download?: boolean;
		// playlist?: boolean;
		// comment?: boolean;
		// jukebox?: boolean;
		// share?: boolean;
		// videoConversion?: boolean;
	}

	export interface SessionUser extends Base {
		roles: Roles;
	}

	export interface User extends Base {
		email: string;
		roles: Roles;
	}

	export interface Genre {
		name: string;
		trackCount: number;
		albumCount: number;
		artistCount: number;
	}

	export interface ChatMessage {
		username: string;
		userID: string;
		time: number;
		message: string;
	}

	export interface PlayQueue {
		trackIDs?: Array<string>;
		tracks?: Array<Track>;
		currentID?: string;
		position?: number;
		changed: number;
		changedBy: string;
	}

	export interface AutoComplete {
		tracks?: Array<{ id: string; name: string; }>;
		artists?: Array<{ id: string; name: string; }>;
		albums?: Array<{ id: string; name: string; }>;
		folders?: Array<{ id: string; name: string; }>;
		playlists?: Array<{ id: string; name: string; }>;
		podcasts?: Array<{ id: string; name: string; }>;
		episodes?: Array<{ id: string; name: string; }>;
	}

	export interface AdminSettingsChat {
		maxMessages: number;
		maxAge: {
			value: number;
			unit: string;
		};
	}

	export interface AdminSettingsIndex {
		ignoreArticles: Array<string>;
	}

	export interface AdminSettingsLibrary {
		scanAtStart: boolean;
		audioBookGenreNames: Array<string>;
	}

	export interface AdminSettings {
		chat: AdminSettingsChat;
		index: AdminSettingsIndex;
		library: AdminSettingsLibrary;
	}

	export interface ChangeQueueInfo {
		id: string;
		pos: number;
	}

	export type CoverArtArchiveResponse = CoverArtArchive.Response;
	export type AcousticBrainzResponse = AcousticBrainz.Response;
	export type MusicBrainzResponse = MusicBrainz.Response;

	export interface WikipediaSummary {
		title: string;
		summary: string;
		url: string;
	}

	export interface WikipediaResponse {
		summary?: WikipediaSummary;
	}

	export type LastFMResponse = LastFM.Result;
	export type AcoustidResponse = Acoustid.Result;

	export interface ExternalFormats {
		coverartarchive: CoverArtArchiveResponse;
		acousticbrainz: AcousticBrainzResponse;
		musicbrainz: MusicBrainzResponse;
		lastfm: LastFMResponse;
		acoustid: AcoustidResponse;
	}

}
