const type_bool = {type: 'boolean'};

const type_int = {type: 'long'};

const type_string = {type: 'text', fields: {keyword: {type: 'keyword'}}};

const type_key = {type: 'keyword'};

const type_Root = {
	properties: {
		name: type_string,
		path: type_key,
		created: type_int,
		strategy: type_key,
		id: type_key,
		type: type_int
	}
};

const type_UserRoles = {
	properties: {
		stream: type_bool,
		upload: type_bool,
		admin: type_bool,
		podcast: type_bool
	}
};

const type_User = {
	properties: {
		name: type_string,
		salt: type_key,
		hash: type_key,
		subsonic_pass: type_key,
		email: type_key,
		created: type_int,
		scrobblingEnabled: type_bool,
		avatarLastChanged: type_int,
		avatar: type_key,
		maxBitRate: type_int,
		allowedfolder: type_key,
		roles: type_UserRoles,
		id: type_key,
		type: type_int
	}
};

const type_Artwork = {
	properties: {
		id: type_key,
		name: type_string,
		types: type_key,
		stat: {
			properties: {
				created: type_int,
				modified: type_int,
				size: type_int
			}
		}
	}
};

const type_FolderTag = {
	properties: {
		level: type_int,
		trackCount: type_int,
		folderCount: type_int,
		type: type_key,
		genre: type_key,
		album: type_key,
		artist: type_key,
		artistSort: type_key,
		albumType: type_key,
		title: type_string,
		year: type_int,
		mbAlbumID: type_key,
		mbReleaseGroupID: type_key,
		mbAlbumType: type_key,
		mbArtistID: type_key,
		image: type_key,
		artworks: type_Artwork
	}
};

const type_Folder = {
	properties: {
		rootID: type_key,
		path: type_key,
		parentID: type_key,
		stat: {
			properties: {
				created: type_int,
				modified: type_int
			}
		},
		tag: type_FolderTag,
		id: type_key,
		type: type_int
	}
};

const type_PlayQueue = {
	properties: {
		userID: type_key,
		trackIDs: type_key,
		currentID: type_key,
		position: type_int,
		changed: type_int,
		changedBy: type_key,
		id: type_key,
		type: type_int
	}
};

const type_TrackTag = {
	properties: {
		format: type_key,
		album: type_key,
		albumSort: type_key,
		albumArtist: type_key,
		albumArtistSort: type_key,
		artist: type_key,
		artistSort: type_key,
		genre: type_key,
		disc: type_int,
		title: type_string,
		titleSort: type_key,
		track: type_int,
		year: type_int,
		mbTrackID: type_key,
		mbAlbumType: type_key,
		mbAlbumArtistID: type_key,
		mbArtistID: type_key,
		mbAlbumID: type_key,
		mbReleaseTrackID: type_key,
		mbReleaseGroupID: type_key,
		mbRecordingID: type_key,
		mbAlbumStatus: type_key,
		mbReleaseCountry: type_key
	}
};

const type_TrackMedia = {
	properties: {
		duration: type_int,
		bitRate: type_int,
		format: type_key,
		sampleRate: type_int,
		channels: type_int,
		encoded: type_key,
		mode: type_key,
		version: type_key
	}
};

const type_Track = {
	properties: {
		rootID: type_key,
		parentID: type_key,
		name: type_string,
		path: type_key,
		stat: {
			properties: {
				created: type_int,
				modified: type_int,
				size: type_int
			}
		},
		albumID: type_key,
		artistID: type_key,
		tag: type_TrackTag,
		media: type_TrackMedia,
		id: type_key,
		type: type_int
	}
};

const type_Album = {
	properties: {
		slug: type_key,
		name: type_string,
		rootIDs: type_key,
		trackIDs: type_key,
		albumType: type_key,
		artistID: type_key,
		artist: type_key,
		genre: type_key,
		year: type_int,
		duration: type_int,
		created: type_int,
		mbArtistID: type_key,
		mbAlbumID: type_key,
		id: type_key,
		type: type_int
	}
};

const type_Artist = {
	properties: {
		slug: type_key,
		name: type_string,
		nameSort: type_key,
		rootIDs: type_key,
		trackIDs: type_key,
		albumIDs: type_key,
		albumTypes: type_key,
		mbArtistID: type_key,
		created: type_int,
		id: type_key,
		type: type_int
	}
};

const type_Radio = {
	properties: {
		name: type_string,
		url: type_key,
		homepage: type_key,
		disabled: type_bool,
		created: type_int,
		changed: type_int,
		id: type_key,
		type: type_int
	}
};

const type_State = {
	properties: {
		userID: type_key,
		destID: type_key,
		destType: type_int,
		played: type_int,
		lastplayed: type_int,
		faved: type_int,
		rated: type_int,
		id: type_key,
		type: type_int
	}
};

const type_Playlist = {
	properties: {
		name: type_string,
		userID: type_key,
		comment: type_key,
		coverArt: type_key,
		changed: type_int,
		created: type_int,
		allowedUser: type_key,
		isPublic: type_bool,
		duration: type_int,
		trackIDs: type_key,
		id: type_key,
		type: type_int
	}
};

const type_PodcastTag = {
	properties: {
		title: type_string,
		link: type_key,
		author: type_key,
		description: type_key,
		generator: type_key,
		image: type_key,
		categories: type_key
	}
};

const type_Podcast = {
	properties: {
		url: type_key,
		created: type_int,
		lastCheck: type_int,
		status: type_key,
		errorMessage: type_key,
		tag: type_PodcastTag,
		id: type_key,
		type: type_int
	}
};

const type_PodcastEpisodeChapter = {
	properties: {
		start: type_int,
		title: type_string
	}
};

const type_PodcastEpisodeEnclosure = {
	properties: {
		url: type_key,
		type: type_key,
		length: type_int
	}
};

const type_Episode = {
	properties: {
		podcastID: type_key,
		status: type_key,
		error: type_key,
		path: type_key,
		link: type_key,
		summary: type_key,
		date: type_int,
		name: type_string,
		guid: type_key,
		author: type_key,
		chapters: type_PodcastEpisodeChapter,
		enclosures: type_PodcastEpisodeEnclosure,
		stat: {
			properties: {
				created: type_int,
				modified: type_int,
				size: type_int
			}
		},
		tag: type_TrackTag,
		media: type_TrackMedia,
		id: type_key,
		type: type_int
	}
};

const type_Bookmark = {
	properties: {
		destID: type_key,
		userID: type_key,
		comment: type_key,
		created: type_int,
		changed: type_int,
		position: type_int,
		id: type_key,
		type: type_int
	}
};

export const mapping: any = {
	root: type_Root,
	user: type_User,
	folder: type_Folder,
	playqueue: type_PlayQueue,
	track: type_Track,
	album: type_Album,
	artist: type_Artist,
	radio: type_Radio,
	state: type_State,
	playlist: type_Playlist,
	podcast: type_Podcast,
	episode: type_Episode,
	bookmark: type_Bookmark
};
