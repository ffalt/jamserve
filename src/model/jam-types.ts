export enum JamObjectType {
	root = 'root',
	user = 'user',
	folder = 'folder',
	track = 'track',
	state = 'state',
	playlist = 'playlist',
	podcast = 'podcast',
	episode = 'episode',
	bookmark = 'bookmark',
	album = 'album',
	artist = 'artist',
	playqueue = 'playqueue',
	radio = 'radio'
}

export enum RootScanStrategy {
	auto = 'auto',
	artistalbum = 'artistalbum',
	compilation = 'compilation',
	audiobook = 'audiobook'
}

export const AudioMimeTypes: { [ext: string]: string } = {
	'mp3': 'audio/mpeg',
	'm4a': 'audio/mp4',
	'ogg': 'audio/ogg',
	'oga': 'audio/ogg',
	'flv': 'aaudio/x-flv',
	'flac': 'audio/flac',
	'webma': 'audio/webm',
	'webm': 'audio/webm',
	'wav': 'audio/wav'
};

export enum AudioFormatType {
	mp3 = 'mp3',
	m4a = 'm4a',
	ogg = 'ogg',
	oga = 'oga',
	flv = 'flv',
	flac = 'flac',
	webma = 'webma',
	wav = 'wav'
}

export const VideoMimeTypes: { [ext: string]: string } = {
	'mp4': 'audio/mp4',
	'm4v': 'audio/mp4',
	'ogv': 'audio/ogg',
	'webmv': 'audio/webm',
	'webm': 'audio/webm'
};

export enum FolderType {
	unknown = 'unknown',
	artist = 'artist',
	collection = 'collection',
	album = 'album',
	multialbum = 'multialbum',
	extras = 'extras',
}

export enum PodcastStatus {
	'new' = 'new',
	downloading = 'downloading',
	completed = 'completed',
	error = 'error',
	deleted = 'deleted',
	// skipped = 'skipped'
}

export const FolderTypeImageName: { [foldertype: string]: string } = {
	unknown: 'folder',
	artist: 'artist',
	collection: 'folder',
	album: 'cover',
	multialbum: 'cover',
	extras: 'folder'
};

export enum ArtworkImageType {
	front = 'front',
	back = 'back',
	booklet = 'booklet',
	medium = 'medium',
	tray = 'tray',
	obi = 'obi',
	spine = 'spine',
	track = 'track',
	liner = 'liner',
	sticker = 'sticker',
	poster = 'poster',
	watermark = 'watermark',
	raw = 'raw',
	unedited = 'unedited',
	other = 'other',
	artist = 'artist'
}

export const FolderTypesAlbum = [FolderType.album, FolderType.multialbum];

export enum DatabaseQuerySortType {
	ascending, descending
}

export enum AlbumType {
	unknown = 'unknown',
	album = 'album',
	compilation = 'compilation',
	audiobook = 'audiobook'
}

export enum FileTyp {
	UNKNOWN = 'unknown',
	AUDIO = 'audio',
	IMAGE = 'image',
	TAG = 'tag',
	BACKUP = 'backup',
	OTHER = 'other'
}

export enum LastFMLookupType {
	album = 'album',
	albumToptracks = 'album-toptracks',
	artist = 'artist',
	track = 'track',
	trackSimilar = 'track-similar',
	artistToptracks = 'artist-toptracks'
}

export const enum MusicBrainzLookupType {
	area = 'area',
	artist = 'artist',
	collection = 'collection',
	event = 'event',
	instrument = 'instrument',
	label = 'label',
	place = 'place',
	recording = 'recording',
	release = 'release',
	releaseGroup = 'release-group',
	series = 'series',
	work = 'work',
	url = 'url'
}

export const enum MusicBrainzSearchType {
	artist = 'artist',
	label = 'label',
	recording = 'recording',
	release = 'release',
	releaseGroup = 'release-group',
	work = 'work',
	area = 'area'
}

export const enum CoverArtArchiveLookupType {
	release = 'release',
	releaseGroup = 'release-group'
}

export const enum TrackTagFormatType {
	none = 'none',
	ffmpeg = 'ffmpeg',
	id3v20 = 'id3v20',
	id3v21 = 'id3v21',
	id3v22 = 'id3v22',
	id3v23 = 'id3v23',
	id3v24 = 'id3v24',
	id3v1 = 'id3v1',
	vorbis = 'vorbis'
}

export const TrackTagRawFormatTypes = [TrackTagFormatType.id3v20, TrackTagFormatType.id3v21, TrackTagFormatType.id3v22, TrackTagFormatType.id3v23, TrackTagFormatType.id3v24, TrackTagFormatType.vorbis];

export const enum MusicBrainzAlbumPrimaryType {
	album = 'Album',
	single = 'Single',
	ep = 'EP',
	broadcast = 'Broadcast',
	other = 'Other',
}

export const enum MusicBrainzAlbumSecondaryType {
	compilation = 'Compilation',
	soundtrack = 'Soundtrack',
	spokenword = 'Spokenword',
	interview = 'Interview',
	audiobook = 'Audiobook',
	audiodrama = 'Audio drama',
	live = 'Live',
	remix = 'Remix',
	djmix = 'DJ-mix',
	mixtape = 'Mixtape'
}

export const MusicBrainz_VARIOUS_ARTISTS_ID = '89ad4ac3-39f7-470e-963a-56509c546377';
export const MusicBrainz_VARIOUS_ARTISTS_NAME = 'Various Artists';
