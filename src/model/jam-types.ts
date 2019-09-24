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
	mp3: 'audio/mpeg',
	m4a: 'audio/mp4',
	mp4: 'audio/mp4',
	ogg: 'audio/ogg',
	oga: 'audio/ogg',
	flv: 'aaudio/x-flv',
	flac: 'audio/flac',
	webma: 'audio/webm',
	webm: 'audio/webm',
	wav: 'audio/wav'
};

export enum AudioFormatType {
	mp3 = 'mp3',
	m4a = 'm4a',
	mp4 = 'mp4',
	ogg = 'ogg',
	oga = 'oga',
	flv = 'flv',
	flac = 'flac',
	webma = 'webma',
	wav = 'wav'
}

export const VideoMimeTypes: { [ext: string]: string } = {
	mp4: 'audio/mp4',
	m4v: 'audio/mp4',
	ogv: 'audio/ogg',
	webmv: 'audio/webm',
	webm: 'audio/webm'
};

export enum FolderType {
	unknown = 'unknown',
	artist = 'artist',
	collection = 'collection',
	album = 'album',
	multialbum = 'multialbum',
	extras = 'extras'
}

export enum PodcastStatus {
	'new' = 'new',
	downloading = 'downloading',
	completed = 'completed',
	error = 'error',
	deleted = 'deleted'
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
	live = 'live',
	bootleg = 'bootleg',
	soundtrack = 'soundtrack',
	audiobook = 'audiobook',
	ep = 'ep',
	single = 'single',
	audiodrama = 'audiodrama'
}

export const AlbumTypesArtistMusic = [AlbumType.album, AlbumType.live, AlbumType.bootleg, AlbumType.ep, AlbumType.single];

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

export const enum MusicBrainzAlbumPrimaryType {
	album = 'Album',
	single = 'Single',
	ep = 'EP',
	broadcast = 'Broadcast',
	other = 'Other'
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

export const MUSICBRAINZ_VARIOUS_ARTISTS_ID = '89ad4ac3-39f7-470e-963a-56509c546377';
export const MUSICBRAINZ_VARIOUS_ARTISTS_NAME = 'Various Artists';

export const cUnknownArtist = '[Unknown Artist]';
export const cUnknownAlbum = '[Unknown Album]';

export enum TrackHealthID {
	tagValuesExists = 'track.tag.values.exists',
	id3v2Exists = 'track.mp3.id3v2.exists',
	id3v2Valid = 'track.mp3.id3v2.valid',
	id3v2Garbage = 'track.mp3.id3v2.garbage.frames',
	mp3HeaderExists = 'track.mp3.vbr.header.exists',
	mp3HeaderValid = 'track.mp3.vbr.header.valid',
	mp3MediaValid = 'track.mp3.media.valid',
	flacMediaValid = 'track.flac.media.valid',
	id3v2NoId3v1 = 'track.mp3.id3v2.no.id3v1',
	mp3Garbage = 'track.mp3.garbage.data'
}

export enum FolderHealthID {
	albumTagsExists = 'folder.album.tags.exists',
	albumMBIDExists = 'folder.album.mbid.exists',
	albumTracksComplete = 'folder.album.tracks.complete',
	albumNameConform = 'folder.album.name.conform',
	albumImageExists = 'folder.album.image.exists',
	albumImageValid = 'folder.album.image.valid',
	artistNameConform = 'folder.artist.name.conform',
	artistImageExists = 'folder.artist.image.exists',
	artistImageValid = 'folder.artist.image.valid'
}

export const DownloadFormats = ['zip', 'tar'];
export const DefaultDownloadFormat = 'zip';
export const WaveformFormats = ['svg', 'json', 'dat'];
export const WaveformDefaultFormat = 'svg';
