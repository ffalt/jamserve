export enum DBObjectType {
	root,
	user,
	folder,
	track,
	state,
	playlist,
	podcast,
	episode,
	bookmark,
	album,
	artist,
	playqueue,
	radio
}

export const AudioMimeTypes: { [ext: string]: string } = {
	'mp3': 'audio/mpeg',
	'm4a': 'audio/mp4',
	'ogg': 'audio/ogg',
	'oga': 'audio/ogg',
	'webma': 'audio/webm',
	'webm': 'audio/webm',
	'wav': 'audio/wav'
};

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
	multiartist = 'multiartist',
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
	multiartist: 'folder',
	album: 'cover',
	multialbum: 'cover',
	extras: 'folder'
};

export const FolderTypesAlbum = [FolderType.album, FolderType.multialbum];

export enum DatabaseQuerySortType {
	ascending, descending
}

export enum AlbumType {
	unknown = 'unknown',
	album = 'album',
	mix = 'mix',
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
