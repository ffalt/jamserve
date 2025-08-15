export interface Request {
	path: string;
	query: Record<string, string | undefined | null>;
	retry: number;
	offset?: number;
	limit?: number;
}

export interface Options {
	host?: string;
	port?: number;
	basePath?: string;
	limit?: number;
	userAgent: string;
	retryOn?: boolean;
	retryDelay?: number;
	retryCount?: number;
}

export interface SearchQueryArtist {
	alias?: string; //   an alias attached to the artist
	area?: string; //   the artist's main associated area
	arid?: string; //   the artist's MBID
	artist?: string; //   the artist's name (without accented characters)
	artistaccent?: string; //   the artist's name (with accented characters)
	begin?: string; //   the artist's begin date
	beginarea?: string; //   the artist's begin area
	comment?: string; //   the artist's disambiguation comment
	country?: string; //   the 2-letter code (ISO 3166-1 alpha-2) for the artist's main associated country, or “unknown”
	end?: string; //   the artist's end date
	endarea?: string; //   the artist's end area
	ended?: string; //   a flag indicating whether or not the artist has ended
	gender?: string; //   the artist's gender (“male”, “female”, or “other”)
	ipi?: string; //   an IPI code associated with the artist
	sortname?: string; //   the artist's sort name
	tag?: string; //   a tag attached to the artist
	type?: string; //   the artist's type (“person”, “group”, ...)
}

export interface SearchQueryLabel {
	alias?: string; //    	the aliases/misspellings for this label
	area?: string; //    	label area
	begin?: string; //    	label founding date
	code?: string; //    	label code (only the figures part, i.e. without "LC")
	comment?: string; //    	label comment to differentiate similar labels
	country?: string; //    	The two letter country code of the label country
	end?: string; //    	label dissolution date
	ended?: string; //    	true if know ended even if do not know end date
	ipi?: string; //   	ipi
	label?: string; //   	label name
	labelaccent?: string; //   	name of the label with any accent characters retained
	laid?: string; //    	MBID of the label
	sortname?: string; //   	label sortname
	type?: string; //   	label type
	tag?: string; //   	folksonomy tag
}

export interface SearchQueryRecording {
	arid?: string; // 	artist id
	artist?: string; //  	artist name is name(s) as it appears on the recording
	artistname?: string; //  	an artist on the recording, each artist added as a separate field
	creditname?: string; //  	name credit on the recording, each artist added as a separate field
	comment?: string; //  		recording disambiguation comment
	country?: string; //  		recording release country
	date?: string; //  	recording release date
	dur?: string; //  	duration of track in milliseconds
	format?: string; //  	recording release format
	isrc?: string; //  		ISRC of recording
	number?: string; //  		free text track number
	position?: string; //  		the medium that the recording should be found on, first medium is position 1
	primarytype?: string; //  		primary type of the release group (album, single, ep, other)
	qdur?: string; //  	quantized duration (duration / 2000)
	recording?: string; //  		name of recording or a track associated with the recording
	recordingaccent?: string; //  		name of the recording with any accent characters retained
	reid?: string; //  	release id
	release?: string; //  		release name
	rgid?: string; //  	release group id
	rid?: string; //  	recording id
	secondarytype?: string; //  		secondary type of the release group (audiobook, compilation, interview, live, remix soundtrack, spokenword)
	status?: string; //  	Release status (official, promotion, Bootleg, Pseudo-Release)
	tid?: string; //  	track id
	tnum?: string; //  	track number on medium
	tracks?: string; //  	number of tracks in the medium on release
	tracksrelease?: string; //  		number of tracks on release as a whole
	tag?: string; //  		folksonomy tag
	type?: string; //  		type of the release group, old type mapping for when we did not have separate primary and secondary types or use standalone for standalone recordings
	video?: string; //  		true to only show video tracks
}

export interface SearchQueryRelease {
	arid?: string; //  	artist id
	artist?: string; //  complete artist name(s) as it appears on the release
	artistname?: string; //  	an artist on the release, each artist added as a separate field
	asin?: string; //  the Amazon ASIN for this release
	barcode?: string; //  	The barcode of this release
	catno?: string; //  	The catalog number for this release, can have multiples when major using an imprint
	comment?: string; //  	Disambiguation comment
	country?: string; //  	The two letter country code for the release country
	creditname?: string; //  	name credit on the release, each artist added as a separate field
	date?: string; //  	The release date (format: YYYY-MM-DD)
	discids?: string; //  	total number of cd ids over all mediums for the release
	discidsmedium?: string; //   	number of cd ids for the release on a medium in the release
	format?: string; //  	release format
	laid?: string; //  	The label id for this release, a release can have multiples when major using an imprint
	label?: string; //  	The name of the label for this release, can have multiples when major using an imprint
	lang?: string; //  	The language for this release. Use the three character ISO 639-3 codes to search for a specific language. (e.g. lang:eng)
	mediums?: string; //  	number of mediums in the release
	primarytype?: string; //  	primary type of the release group (album, single, ep, other)
	puid?: string; //  	The release contains recordings with these puids
	quality?: string; //  	The quality of the release (low, normal, high)
	reid?: string; //  	release id
	release?: string; //  	release name
	releaseaccent?: string; //  	name of the release with any accent characters retained
	rgid?: string; //  	release group id
	script?: string; //  	The 4 character script code (e.g. latn) used for this release
	secondarytype?: string; //  	secondary type of the release group (audiobook, compilation, interview, live, remix, soundtrack, spokenword)
	status?: string; //   	release status (e.g official)
	tag?: string; //  	a tag that appears on the release
	tracks?: string; //  	total number of tracks over all mediums on the release
	tracksmedium?: string; //  	number of tracks on a medium in the release
	type?: string; //  	type of the release group, old type mapping for when we did not have separate primary and secondary types
}

export interface SearchQueryReleaseGroup {
	arid?: string; //  	MBID of the release group’s artist
	artist?: string; //  	release group artist as it appears on the cover (Artist Credit)
	artistname?: string; //  	“real name” of any artist that is included in the release group’s artist credit
	comment?: string; //  	release group comment to differentiate similar release groups
	creditname?: string; //  name of any artist in multi-artist credits, as it appears on the cover.
	primarytype?: string; //  	primary type of the release group (album, single, ep, other)
	rgid?: string; //  	MBID of the release group
	releasegroup?: string; //  	name of the release group
	releasegroupaccent?: string; //  	name of the releasegroup with any accent characters retained
	releases?: string; //  	number of releases in this release group
	release?: string; //  	name of a release that appears in the release group
	reid?: string; //  MBID of a release that appears in the release group
	secondarytype?: string; //   	secondary type of the release group (audiobook, compilation, interview, live, remix soundtrack, spokenword)
	status?: string; //  	status of a release that appears within the release group
	tag?: string; //  	a tag that appears on the release group
	type?: string; //  	type of the release group, old type mapping for when we did not have separate primary and secondary types
}

export interface SearchQueryWork {
	alias?: string; //  	the aliases/misspellings for this work
	arid?: string; //  	artist id
	artist?: string; //  	artist name, an artist in the context of a work is an artist-work relation such as composer or lyricist
	comment?: string; //   	disambiguation comment
	iswc?: string; //  	ISWC of work
	lang?: string; //  	Lyrics language of work
	tag?: string; //  	folksonomy tag
	type?: string; //  	work type
	wid?: string; //  	work id
	work?: string; //  	name of work
	workaccent?: string; //   	name of the work with any accent characters retained
}

export interface SearchQueryArea {
	aid?: string; // 	the area's MBID
	alias?: string; // 	an alias attached to the area
	area?: string; // 	the area's name
	begin?: string; // 	the area's begin date
	comment?: string; // 	the area's disambiguation comment
	end?: string; // 	the area's end date
	ended?: string; // 	a flag indicating whether or not the area has ended
	iso?: string; // 	an ISO 3166-1/2/3 code attached to the area
	iso1?: string; // 	an ISO 3166-1 code attached to the area
	iso2?: string; // 	an ISO 3166-2 code attached to the area
	iso3?: string; // 	an ISO 3166-3 code attached to the area
	sortname?: string; // 	the area's sort name
	type?: string; // 	the area's type
}

export type SearchQuery = SearchQueryArtist | SearchQueryLabel | SearchQueryRecording | SearchQueryRelease | SearchQueryReleaseGroup | SearchQueryWork | SearchQueryArea;

export interface ParameterLuceneSearch {
	type: string;
	query: string;
	limit?: number;
	offset?: number;
}

export interface ParameterSearch {
	type: string;
	query: SearchQuery;
	limit?: number;
	offset?: number;
}

export interface ParameterLookup {
	type: string;
	id: string;
	inc?: string;
	limit?: number;
	offset?: number;
}

export interface ParameterBrowse {
	type: string;
	lookupIds: Record<string, string>;
	inc?: string;
	limit?: number;
	offset?: number;
}
