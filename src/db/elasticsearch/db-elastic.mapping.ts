// THIS FILE IS GENERATED, DO NOT EDIT MANUALLY

const typeBool = {type: 'boolean'};

const typeInt = {type: 'long'};

const typeString = {type: 'text', fields: {keyword: {type: 'keyword'}}};

const typeKey = {type: 'keyword'};

const typeRoot = {
	properties: {
		name: typeString,
		path: typeKey,
		created: typeInt,
		strategy: typeKey,
		id: typeKey,
		type: typeInt
	}
};

const typeUserRoles = {
	properties: {
		stream: typeBool,
		upload: typeBool,
		admin: typeBool,
		podcast: typeBool
	}
};

const typeUser = {
	properties: {
		name: typeString,
		salt: typeKey,
		hash: typeKey,
		email: typeKey,
		created: typeInt,
		scrobblingEnabled: typeBool,
		maxBitRate: typeInt,
		allowedFolder: typeKey,
		roles: typeUserRoles,
		id: typeKey,
		type: typeInt
	}
};

const typeArtworkImage = {
	properties: {
		width: typeInt,
		height: typeInt,
		format: typeKey
	}
};

const typeArtwork = {
	properties: {
		id: typeKey,
		name: typeString,
		types: typeKey,
		image: typeArtworkImage
	}
};

const typeFolderTag = {
	properties: {
		level: typeInt,
		trackCount: typeInt,
		folderCount: typeInt,
		type: typeKey,
		genre: typeKey,
		album: typeKey,
		artist: typeKey,
		artistSort: typeKey,
		albumType: typeKey,
		albumTrackCount: typeInt,
		title: typeString,
		year: typeInt,
		mbAlbumID: typeKey,
		mbReleaseGroupID: typeKey,
		mbAlbumType: typeKey,
		mbArtistID: typeKey,
		artworks: typeArtwork
	}
};

const typeFolder = {
	properties: {
		rootID: typeKey,
		path: typeKey,
		parentID: typeKey,
		tag: typeFolderTag,
		id: typeKey,
		type: typeInt
	}
};

const typePlayQueue = {
	properties: {
		userID: typeKey,
		trackIDs: typeKey,
		currentID: typeKey,
		position: typeInt,
		changed: typeInt,
		changedBy: typeKey,
		id: typeKey,
		type: typeInt
	}
};

const typeTrackTagChapter = {
	properties: {
		start: typeInt,
		end: typeInt,
		title: typeString
	}
};

const typeTrackTag = {
	properties: {
		format: typeKey,
		album: typeKey,
		albumSort: typeKey,
		albumArtist: typeKey,
		albumArtistSort: typeKey,
		artist: typeKey,
		artistSort: typeKey,
		genre: typeKey,
		disc: typeInt,
		discTotal: typeInt,
		title: typeString,
		titleSort: typeKey,
		track: typeInt,
		trackTotal: typeInt,
		year: typeInt,
		nrTagImages: typeInt,
		mbTrackID: typeKey,
		mbAlbumType: typeKey,
		mbAlbumArtistID: typeKey,
		mbArtistID: typeKey,
		mbAlbumID: typeKey,
		mbReleaseTrackID: typeKey,
		mbReleaseGroupID: typeKey,
		mbRecordingID: typeKey,
		mbAlbumStatus: typeKey,
		mbReleaseCountry: typeKey,
		chapters: typeTrackTagChapter
	}
};

const typeTrackMedia = {
	properties: {
		duration: typeInt,
		bitRate: typeInt,
		format: typeKey,
		sampleRate: typeInt,
		channels: typeInt,
		encoded: typeKey,
		mode: typeKey,
		version: typeKey
	}
};

const typeTrack = {
	properties: {
		rootID: typeKey,
		parentID: typeKey,
		name: typeString,
		path: typeKey,
		albumID: typeKey,
		artistID: typeKey,
		albumArtistID: typeKey,
		tag: typeTrackTag,
		media: typeTrackMedia,
		id: typeKey,
		type: typeInt
	}
};

const typeAlbum = {
	properties: {
		slug: typeKey,
		name: typeString,
		rootIDs: typeKey,
		trackIDs: typeKey,
		folderIDs: typeKey,
		albumType: typeKey,
		artistID: typeKey,
		artist: typeKey,
		genre: typeKey,
		year: typeInt,
		duration: typeInt,
		created: typeInt,
		mbArtistID: typeKey,
		mbAlbumID: typeKey,
		id: typeKey,
		type: typeInt
	}
};

const typeArtist = {
	properties: {
		slug: typeKey,
		name: typeString,
		nameSort: typeKey,
		rootIDs: typeKey,
		trackIDs: typeKey,
		folderIDs: typeKey,
		albumIDs: typeKey,
		albumTypes: typeKey,
		mbArtistID: typeKey,
		created: typeInt,
		id: typeKey,
		type: typeInt
	}
};

const typeRadio = {
	properties: {
		name: typeString,
		url: typeKey,
		homepage: typeKey,
		disabled: typeBool,
		created: typeInt,
		changed: typeInt,
		id: typeKey,
		type: typeInt
	}
};

const typeState = {
	properties: {
		userID: typeKey,
		destID: typeKey,
		destType: typeInt,
		played: typeInt,
		lastplayed: typeInt,
		faved: typeInt,
		rated: typeInt,
		id: typeKey,
		type: typeInt
	}
};

const typePlaylist = {
	properties: {
		name: typeString,
		userID: typeKey,
		comment: typeKey,
		coverArt: typeKey,
		changed: typeInt,
		created: typeInt,
		allowedUser: typeKey,
		isPublic: typeBool,
		duration: typeInt,
		trackIDs: typeKey,
		id: typeKey,
		type: typeInt
	}
};

const typePodcastTag = {
	properties: {
		title: typeString,
		link: typeKey,
		author: typeKey,
		description: typeKey,
		generator: typeKey,
		image: typeKey,
		categories: typeKey
	}
};

const typePodcast = {
	properties: {
		url: typeKey,
		created: typeInt,
		lastCheck: typeInt,
		status: typeKey,
		image: typeKey,
		errorMessage: typeKey,
		tag: typePodcastTag,
		id: typeKey,
		type: typeInt
	}
};

const typePodcastEpisodeChapter = {
	properties: {
		start: typeInt,
		title: typeString
	}
};

const typePodcastEpisodeEnclosure = {
	properties: {
		url: typeKey,
		type: typeKey,
		length: typeInt
	}
};

const typeEpisode = {
	properties: {
		podcastID: typeKey,
		podcast: typeKey,
		status: typeKey,
		error: typeKey,
		path: typeKey,
		link: typeKey,
		summary: typeKey,
		date: typeInt,
		duration: typeInt,
		name: typeString,
		guid: typeKey,
		author: typeKey,
		chapters: typePodcastEpisodeChapter,
		enclosures: typePodcastEpisodeEnclosure,
		tag: typeTrackTag,
		media: typeTrackMedia,
		id: typeKey,
		type: typeInt
	}
};

const typeBookmark = {
	properties: {
		destID: typeKey,
		userID: typeKey,
		comment: typeKey,
		created: typeInt,
		changed: typeInt,
		position: typeInt,
		id: typeKey,
		type: typeInt
	}
};

const typeMetaData = {
	properties: {
		date: typeInt,
		name: typeString,
		dataType: typeInt,
		id: typeKey,
		type: typeInt
	}
};

const typeSettings = {
	properties: {
		section: typeKey,
		version: typeKey,
		id: typeKey,
		type: typeInt
	}
};

const typeSession = {
	properties: {
		userID: typeKey,
		client: typeKey,
		agent: typeKey,
		expires: typeInt,
		mode: typeKey,
		sessionID: typeKey,
		cookie: typeKey,
		jwth: typeKey,
		subsonic: typeKey,
		id: typeKey,
		type: typeInt
	}
};

export const mapping: any = {
	root: typeRoot,
	user: typeUser,
	folder: typeFolder,
	playqueue: typePlayQueue,
	track: typeTrack,
	album: typeAlbum,
	artist: typeArtist,
	radio: typeRadio,
	state: typeState,
	playlist: typePlaylist,
	podcast: typePodcast,
	episode: typeEpisode,
	bookmark: typeBookmark,
	metadata: typeMetaData,
	settings: typeSettings,
	session: typeSession
};
