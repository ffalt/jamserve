const type_bool = {type: 'boolean'};

const type_int = {type: 'long'};

const type_string = {type: 'text', fields: {keyword: {type: 'keyword'}}};

const type_key = {type: 'keyword'};

const type_Root = {
	properties: {
		name: type_string,
		path: type_key,
		created: type_int,
		id: type_key,
		type: type_int
	}
};

const type_UserRoles = {
	properties: {
		streamRole: type_bool,
		uploadRole: type_bool,
		adminRole: type_bool,
		podcastRole: type_bool
	}
};

const type_User = {
	properties: {
		name: type_string,
		pass: type_key,
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

const type_FolderTag = {
	properties: {
		tracks: type_int,
		level: type_int,
		type: type_key,
		genre: type_key,
		album: type_key,
		artist: type_key,
		artistSort: type_key,
		albumType: type_key,
		title: type_string,
		image: type_key,
		year: type_int,
		mbAlbumID: type_key,
		mbArtistID: type_key
	}
};

const type_MusicBrainz_Rating = {
	properties: {
		votesCount: type_int,
		value: type_int
	}
};

const type_MusicBrainz_Alias = {
	properties: {
		name: type_string,
		sortName: type_key,
		locale: type_key,
		type: type_key,
		typeId: type_key,
		primary: type_key,
		beginDate: type_key,
		endDate: type_key,
		ended: type_bool
	}
};

const type_MusicBrainz_ArtistCredit = {
	properties: {
		name: type_string,
		joinphrase: type_key,
		artist: {
			properties: {
				id: type_key,
				name: type_string,
				sortName: type_key,
				disambiguation: type_key,
				aliases: type_MusicBrainz_Alias
			}
		}
	}
};

const type_MusicBrainz_RecordingBase = {
	properties: {
		id: type_key,
		title: type_string,
		disambiguation: type_key,
		length: type_int,
		video: type_bool,
		rating: type_MusicBrainz_Rating,
		aliases: type_MusicBrainz_Alias,
		artistCredit: type_MusicBrainz_ArtistCredit,
		isrcs: type_key
	}
};

const type_MusicBrainz_ReleaseTrack = {
	properties: {
		id: type_key,
		title: type_string,
		position: type_int,
		length: type_int,
		number: type_key,
		recording: type_MusicBrainz_RecordingBase,
		artistCredit: type_MusicBrainz_ArtistCredit
	}
};

const type_MusicBrainz_Disc = {
	properties: {
		id: type_key,
		sectors: type_int,
		offsetCount: type_int,
		offsets: type_int
	}
};

const type_MusicBrainz_ReleaseMedia = {
	properties: {
		format: type_key,
		formatId: type_key,
		title: type_string,
		discCount: type_int,
		trackCount: type_int,
		position: type_int,
		trackOffset: type_int,
		tracks: type_MusicBrainz_ReleaseTrack,
		discs: type_MusicBrainz_Disc
	}
};

const type_MusicBrainz_ReleaseGroupBase = {
	properties: {
		id: type_key,
		title: type_string,
		disambiguation: type_key,
		firstReleaseDate: type_key,
		primaryType: type_key,
		primaryTypeId: type_key,
		secondaryTypes: type_key,
		secondaryTypeIds: type_key,
		rating: type_MusicBrainz_Rating,
		artistCredit: type_MusicBrainz_ArtistCredit
	}
};

const type_MusicBrainz_Label = {
	properties: {
		catalogNumber: type_key,
		label: {
			properties: {
				id: type_key,
				name: type_string,
				disambiguation: type_key,
				labelCode: type_key,
				sortName: type_key
			}
		},
		aliases: {
			properties: {
				name: type_string,
				sortName: type_key,
				ended: type_bool
			}
		}
	}
};

const type_MusicBrainz_ReleaseEvent = {
	properties: {
		date: type_key,
		area: {
			properties: {
				id: type_key,
				name: type_string,
				sortName: type_key,
				disambiguation: type_key,
				iso31661Codes: type_key
			}
		}
	}
};

const type_MusicBrainz_Release = {
	properties: {
		media: type_MusicBrainz_ReleaseMedia,
		score: type_int,
		count: type_int,
		id: type_key,
		title: type_string,
		sortName: type_key,
		status: type_key,
		statusId: type_key,
		date: type_key,
		country: type_key,
		packaging: type_key,
		packagingId: type_key,
		disambiguation: type_key,
		annotation: type_key,
		quality: type_key,
		barcode: type_key,
		asin: type_key,
		textRepresentation: {
			properties: {
				language: type_key,
				script: type_key
			}
		},
		trackCount: type_int,
		artistCredit: type_MusicBrainz_ArtistCredit,
		releaseGroup: type_MusicBrainz_ReleaseGroupBase,
		labelInfo: type_MusicBrainz_Label,
		tags: {
			properties: {
				count: type_int,
				name: type_string
			}
		},
		releaseEvents: type_MusicBrainz_ReleaseEvent,
		coverArtArchive: {
			properties: {
				front: type_bool,
				back: type_bool,
				darkened: type_bool,
				artwork: type_bool,
				count: type_int
			}
		}
	}
};

const type_MetaInfoAlbum = {
	properties: {
		name: type_string,
		artist: type_key,
		mbid: type_key,
		url: type_key,
		image: {
			properties: {
				small: type_key,
				medium: type_key,
				large: type_key
			}
		},
		tags: {
			properties: {
				name: type_string,
				url: type_key
			}
		},
		description: type_key,
		releases: type_MusicBrainz_Release
	}
};

const type_MetaInfoImage = {
	properties: {
		small: type_key,
		medium: type_key,
		large: type_key
	}
};

const type_MetaInfoSimilarArtist = {
	properties: {
		name: type_string,
		url: type_key,
		mbid: type_key,
		image: type_MetaInfoImage
	}
};

const type_MetaInfoArtist = {
	properties: {
		name: type_string,
		mbid: type_key,
		url: type_key,
		image: type_MetaInfoImage,
		tags: {
			properties: {
				name: type_string,
				url: type_key
			}
		},
		description: type_key,
		similar: type_MetaInfoSimilarArtist
	}
};

const type_MetaInfoTopSong = {
	properties: {
		name: type_string,
		artist: {
			properties: {
				name: type_string,
				mbid: type_key,
				url: type_key
			}
		},
		mbid: type_key,
		url: type_key,
		rank: type_key,
		image: type_MetaInfoImage
	}
};

const type_MetaInfo = {
	properties: {
		album: type_MetaInfoAlbum,
		artist: type_MetaInfoArtist,
		topSongs: type_MetaInfoTopSong
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
		info: type_MetaInfo,
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

const type_MetaInfoTrackSimilarSong = {
	properties: {
		name: type_string,
		mbid: type_key,
		url: type_key,
		duration: type_int,
		artist: {
			properties: {
				name: type_string,
				mbid: type_key,
				url: type_key
			}
		},
		image: type_MetaInfoImage
	}
};

const type_MetaInfoTrack = {
	properties: {
		similar: type_MetaInfoTrackSimilarSong
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
		info: type_MetaInfoTrack,
		id: type_key,
		type: type_int
	}
};

const type_Album = {
	properties: {
		name: type_string,
		rootIDs: type_key,
		trackIDs: type_key,
		artistID: type_key,
		artist: type_key,
		genre: type_key,
		year: type_int,
		duration: type_int,
		created: type_int,
		mbArtistID: type_key,
		mbAlbumID: type_key,
		info: type_MetaInfo,
		id: type_key,
		type: type_int
	}
};

const type_Artist = {
	properties: {
		name: type_string,
		nameSort: type_key,
		rootIDs: type_key,
		trackIDs: type_key,
		albumIDs: type_key,
		mbArtistID: type_key,
		info: type_MetaInfo,
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
