export enum RootScanStrategy {
	auto = 'auto',
	artistalbum = 'artistalbum',
	compilation = 'compilation',
	audiobook = 'audiobook'
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
	series = 'series'
}

export const AlbumTypesArtistMusic = [AlbumType.album, AlbumType.live, AlbumType.bootleg, AlbumType.ep, AlbumType.single];

export enum ImageFormatType {
	png = 'png',
	jpeg = 'jpeg',
	tiff = 'tiff'
}

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

export enum PodcastStatus {
	'new' = 'new',
	downloading = 'downloading',
	completed = 'completed',
	error = 'error',
	deleted = 'deleted'
}

export enum FolderType {
	unknown = 'unknown',
	artist = 'artist',
	collection = 'collection',
	album = 'album',
	multialbum = 'multialbum',
	extras = 'extras'
}

export const FolderTypesAlbum = [FolderType.album, FolderType.multialbum];

export enum MetaDataType {
	musicbrainz = 'musicbrainz',
	wikipedia = 'wikipedia',
	wikidata = 'wikidata',
	acoustid = 'acoustid',
	acousticbrainz = 'acousticbrainz',
	coverartarchive = 'coverartarchive',
	lastfm = 'lastfm',
	lyrics = 'lyrics'
}

export enum SessionMode {
	browser = 'browser',
	jwt = 'jwt'
}

export enum DBObjectType {
	root = 'root',
	user = 'user',
	folder = 'folder',
	artwork = 'artwork',
	track = 'track',
	state = 'state',
	playlist = 'playlist',
	playlistentry = 'playlistentry',
	podcast = 'podcast',
	episode = 'episode',
	bookmark = 'bookmark',
	album = 'album',
	artist = 'artist',
	playqueue = 'playqueue',
	playqueueentry = 'playqueueentry',
	radio = 'radio',
	metadata = 'metadata',
	settings = 'settings',
	session = 'session',
	tag = 'tag',
	series = 'series'
}

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

export enum TagFormatType {
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

export enum UserRole {
	admin = 'admin',
	stream = 'stream',
	upload = 'upload',
	podcast = 'podcast'
}

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

export enum FileTyp {
	unknown = 'unknown',
	audio = 'audio',
	image = 'image',
	tag = 'tag',
	backup = 'backup',
	other = 'other'
}

export enum WaveformFormatType {
	svg = 'svg',
	json = 'json',
	dat = 'dat'
}

export const WaveformFormatTypes = [WaveformFormatType.svg, WaveformFormatType.json, WaveformFormatType.dat];

export enum ListType {
	random = 'random',
	highest = 'highest',
	avghighest = 'avghighest',
	frequent = 'frequent',
	faved = 'faved',
	recent = 'recent'
}

export enum FolderHealthID {
	albumTagsExists = 'folder.album.tags.exists',
	albumMBIDExists = 'folder.album.mbid.exists',
	albumTracksComplete = 'folder.album.tracks.complete',
	albumNameConform = 'folder.album.name.conform',
	albumImageExists = 'folder.album.image.exists',
	albumImageValid = 'folder.album.image.valid',
	albumImageQuality = 'folder.album.image.quality',
	artistNameConform = 'folder.artist.name.conform',
	artistImageExists = 'folder.artist.image.exists',
	artistImageValid = 'folder.artist.image.valid'
}

export enum DownloadFormatType {
	zip = 'zip',
	tar = 'tar'
}

export const DownloadFormatTypes = [DownloadFormatType.zip, DownloadFormatType.tar];

export enum LastFMLookupType {
	album = 'album',
	albumToptracks = 'album-toptracks',
	artist = 'artist',
	track = 'track',
	trackSimilar = 'track-similar',
	artistToptracks = 'artist-toptracks'
}

export enum CoverArtArchiveLookupType {
	release = 'release',
	releaseGroup = 'release-group'
}

export enum MusicBrainzLookupType {
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

export enum MusicBrainzSearchType {
	artist = 'artist',
	label = 'label',
	recording = 'recording',
	release = 'release',
	releaseGroup = 'release-group',
	work = 'work',
	area = 'area'
}

export enum JamObjectType {
	root = 'root',
	user = 'user',
	folder = 'folder',
	track = 'track',
	state = 'state',
	artwork = 'artwork',
	playlist = 'playlist',
	podcast = 'podcast',
	episode = 'episode',
	series = 'series',
	bookmark = 'bookmark',
	album = 'album',
	artist = 'artist',
	playqueue = 'playqueue',
	radio = 'radio'
}

export enum TrackOrderFields {
	default = 'default',
	created = 'created',
	updated = 'updated',
	trackNr = 'trackNr',
	discNr = 'discNr',
	seriesNr = 'seriesNr',
	album = 'album',
	title = 'title',
	parent = 'parent'
}

export enum EpisodeOrderFields {
	default = 'default',
	created = 'created',
	updated = 'updated',
	name = 'name',
	status = 'status',
	date = 'date'
}

export enum BookmarkOrderFields {
	default = 'default',
	created = 'created',
	updated = 'updated',
	media = 'media',
	position = 'position',
}

export enum DefaultOrderFields {
	default = 'default',
	created = 'created',
	updated = 'updated',
	name = 'name',
}

export enum SessionOrderFields {
	default = 'default',
	expires = 'expires'
}

export enum FolderOrderFields {
	default = 'default',
	created = 'created',
	updated = 'updated',
	level = 'level',
	name = 'name',
	title = 'title',
	year = 'year'
}

export enum PlaylistEntryOrderFields {
	default = 'default',
	created = 'created',
	updated = 'updated',
	position = 'position'
}

export enum PlayQueueEntryOrderFields {
	default = 'default',
	created = 'created',
	updated = 'updated',
	position = 'position'
}

export enum PodcastOrderFields {
	default = 'default',
	created = 'created',
	updated = 'updated',
	name = 'name',
	lastCheck = 'lastCheck'
}

export enum AlbumOrderFields {
	default = 'default',
	created = 'created',
	updated = 'updated',
	name = 'name',
	artist = 'artist',
	year = 'year',
	seriesNr = 'seriesNr',
	duration = 'duration',
	albumType = 'albumType'
}

export enum ArtistOrderFields {
	default = 'default',
	created = 'created',
	updated = 'updated',
	name = 'name',
	nameSort = 'nameSort'
}
