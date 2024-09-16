import {CoverArtArchiveLookupType, LastFMLookupType, MusicBrainzLookupType, MusicBrainzSearchType} from '../../types/enums.js';
import {ObjField, ObjParamsType} from '../../modules/rest/index.js';
import {examples} from '../../modules/engine/rest/example.consts.js';

@ObjParamsType()
export class LastFMLookupArgs {
	@ObjField({description: 'MusicBrainz ID', example: examples.mbReleaseID})
	mbID!: string;
	@ObjField(() => LastFMLookupType, {description: 'lookup by lastfm type', example: LastFMLookupType.album})
	type!: LastFMLookupType;
}

@ObjParamsType()
export class LyricsOVHSearchArgs {
	@ObjField({description: 'Song Title', example: 'Jerry Was a Race Car Driver'})
	title!: string;
	@ObjField({description: 'Song Artist', example: 'Primus'})
	artist!: string;
}

@ObjParamsType()
export class AcoustidLookupArgs {
	@ObjField({description: 'Track ID', example: examples.mbTrackID})
	trackID!: string;
	@ObjField({nullable: true, description: 'Lookup Includes (comma-separated AcoustId includes)', defaultValue: 'recordings,releases,releasegroups,tracks,compress,usermeta,sources'})
	inc?: string; // TODO: typescript-type the acoustid lookup includes
}

@ObjParamsType()
export class MusicBrainzLookupArgs {
	@ObjField({description: 'MusicBrainz ID', example: examples.mbReleaseID})
	mbID!: string;
	@ObjField(() => MusicBrainzLookupType, {description: 'MusicBrainz Lookup Type', example: MusicBrainzLookupType.release})
	type!: MusicBrainzLookupType;
	@ObjField({nullable: true, description: 'Lookup Includes (comma-separated MusicBrainz includes https://musicbrainz.org/doc/Development/XML_Web_Service/Version_2#Lookups )'})
	inc?: string; // TODO: typescript-type the musicbrainz lookup includes
}

@ObjParamsType()
export class MusicBrainzSearchArgs {
	@ObjField(() => MusicBrainzSearchType, {description: 'MusicBrainz Search Type', example: MusicBrainzSearchType.artist})
	type!: MusicBrainzSearchType;
	@ObjField({nullable: true, description: 'Search by Recording Name'})
	recording?: string;
	@ObjField({nullable: true, description: 'Search by Releasegroup Name'})
	releasegroup?: string;
	@ObjField({nullable: true, description: 'Search by Release Name'})
	release?: string;
	@ObjField({nullable: true, description: 'Search by Artist Name'})
	artist?: string;
	@ObjField({nullable: true, description: 'Search by Number of Release Tracks', min: 0})
	tracks?: number;
}

@ObjParamsType()
export class AcousticBrainzLookupArgs {
	@ObjField({description: 'MusicBrainz ID', example: examples.mbReleaseID})
	mbID!: string;
	@ObjField({nullable: true, description: 'Page parameter if more than one acousticbrainz info is available', min: 0})
	nr?: number;
}

@ObjParamsType()
export class CoverArtArchiveLookupArgs {
	@ObjField({description: 'MusicBrainz ID', example: examples.mbReleaseID})
	mbID!: string;
	@ObjField(() => CoverArtArchiveLookupType, {description: 'Lookup by CoverArtArchive MusicBrainz Type', example: CoverArtArchiveLookupType.release})
	type!: CoverArtArchiveLookupType;
}

@ObjParamsType()
export class CoverArtArchiveImageArgs {
	@ObjField({description: 'Coverart URL'})
	url!: string;
}

@ObjParamsType()
export class WikipediaSummaryArgs {
	@ObjField({description: 'MusicBrainz ID', example: 'Primus'})
	title!: string;
	@ObjField({nullable: true, description: 'Wikipedia Language', example: 'en', defaultValue: 'en'})
	lang?: string;
}

@ObjParamsType()
export class WikidataSummaryArgs {
	@ObjField({description: 'WikiData ID'})
	wikiDataID!: string;
	@ObjField({nullable: true, description: 'Wikipedia Language', example: 'en', defaultValue: 'en'})
	lang?: string;
}

@ObjParamsType()
export class WikidataLookupArgs {
	@ObjField({description: 'WikiData ID'})
	wikiDataID!: string;
}
